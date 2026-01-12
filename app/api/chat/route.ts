import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {randomUUID} from 'crypto'
import {writeClient} from '@/sanity/lib/client'
import {sanityFetch} from '@/sanity/lib/client'
import {AI_CONFIG_DATA, CV_PROFILE_DATA} from '@/sanity/queries/queries'
import {ChatHistory, CV_PROFILE_DATAResult} from '@/sanity.types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {message, sessionId, userEmail, userPhone, userName, companyName, chatHistory = []} = body

    if (!message || !sessionId) {
      return NextResponse.json({error: 'Message and sessionId are required'}, {status: 400})
    }

    const aiConfig = await sanityFetch({
      query: AI_CONFIG_DATA,
      tags: ['aiConfig'],
    })

    const cvProfile = await sanityFetch({
      query: CV_PROFILE_DATA,
      tags: ['cvProfile'],
    })

    const contextInfo = buildContextFromProfile(cvProfile)

    const systemPrompt =
      aiConfig?.systemPrompt ||
      'You are an AI assistant representing a talented professional. Answer questions about their skills, experience, and services in a professional and enthusiastic manner. Be friendly and try to showcase their strengths.'

    const additionalInfo = aiConfig?.additionalInfo || ''

    const fullSystemPrompt = `${systemPrompt}

${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}

Context about the person you're representing:
${contextInfo}

Remember: Your goal is to sell this person as an employee or their services. Be professional, enthusiastic, and highlight their strengths.`

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      systemInstruction: fullSystemPrompt,
    })

    interface ChatMessage {
      role: string
      content: string
    }

    const filteredHistory = (chatHistory as ChatMessage[]).filter((msg, index) => {
      if (index === 0 && msg.role === 'assistant') {
        return false
      }
      return true
    })

    const conversationHistory = filteredHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{text: msg.content}],
    }))

    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    })

    const result = await chat.sendMessage(message)
    const response = await result.response
    const aiResponse = response.text()

    const timestamp = new Date().toISOString()
    const userMessage = {
      _key: randomUUID(),
      role: 'user',
      content: message,
      timestamp: timestamp,
    }
    const assistantMessage = {
      _key: randomUUID(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    }

    const existingChat = (await writeClient.fetch(
      `*[_type == "chatHistory" && sessionId == $sessionId][0]`,
      {sessionId},
    )) as ChatHistory | null

    if (existingChat && existingChat._id) {
      const updatedMessages = [
        ...(existingChat.messages || []).map((msg) => ({
          ...msg,
          _key: msg._key || randomUUID(),
        })),
        userMessage,
        assistantMessage,
      ]

      await writeClient
        .patch(existingChat._id)
        .set({
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          ...(userEmail && {userEmail}),
          ...(userPhone && {userPhone}),
          ...(userName && {userName}),
          ...(companyName && {companyName}),
        })
        .commit()
    } else {
      await writeClient.create({
        _type: 'chatHistory',
        sessionId,
        userEmail: userEmail || '',
        userPhone: userPhone || '',
        userName: userName || '',
        companyName: companyName || '',
        messages: [userMessage, assistantMessage],
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: assistantMessage.timestamp,
    })
  } catch (error: unknown) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Failed to process chat message'},
      {status: 500},
    )
  }
}

function buildContextFromProfile(profile: CV_PROFILE_DATAResult): string {
  if (!profile) return ''

  const sections = []

  if (profile.name) sections.push(`Name: ${profile.name}`)
  if (profile.role) sections.push(`Role: ${profile.role}`)
  if (profile.about) sections.push(`About: ${profile.about}`)

  if (profile.contacts?.email) sections.push(`Email: ${profile.contacts.email}`)
  if (profile.contacts?.phoneNumber) sections.push(`Phone: ${profile.contacts.phoneNumber}`)
  if (profile.contacts?.location) sections.push(`Location: ${profile.contacts.location}`)

  const p = profile as any // Temporary cast to handle dynamic fields from query

  if (p.skillsFrontend?.length) {
    sections.push(`Frontend Skills: ${p.skillsFrontend.join(', ')}`)
  }
  if (p.skillsBackend?.length) {
    sections.push(`Backend Skills: ${p.skillsBackend.join(', ')}`)
  }
  if (p.skillsDevOps?.length) {
    sections.push(`DevOps Skills: ${p.skillsDevOps.join(', ')}`)
  }

  if (p.languages?.length) {
    sections.push(
      `Languages: ${p.languages.map((l: {language: string; level: string}) => `${l.language} (${l.level})`).join(', ')}`,
    )
  }

  if (p.workExperience?.length) {
    const relevantExperience = p.workExperience
      .filter((exp: {hideFromCV?: boolean}) => !exp.hideFromCV)
      .slice(0, 3)
    if (relevantExperience.length) {
      sections.push(
        `Recent Experience: ${relevantExperience
          .map(
            (exp: {jobTitle: string; companyName: string}) =>
              `${exp.jobTitle} at ${exp.companyName}`,
          )
          .join('; ')}`,
      )
    }
  }

  if (p.projects?.length) {
    const pinnedProjects = p.projects.filter((p: {isPinned?: boolean}) => p.isPinned).slice(0, 3)
    if (pinnedProjects.length) {
      sections.push(
        `Key Projects: ${pinnedProjects.map((p: {title: string}) => p.title).join(', ')}`,
      )
    }
  }

  return sections.join('\n')
}
