import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/client";
import { AI_CONFIG_DATA, CV_PROFILE_DATA } from "@/sanity/queries/queries";

// Initialize the Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      sessionId,
      userEmail,
      userPhone,
      userName,
      companyName,
      chatHistory = [],
    } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Fetch AI configuration from Sanity
    const aiConfig = await sanityFetch({
      query: AI_CONFIG_DATA,
      tags: ["aiConfig"],
    });

    // Fetch CV profile data to provide context to AI
    const cvProfile = await sanityFetch({
      query: CV_PROFILE_DATA,
      tags: ["cvProfile"],
    });

    if (!aiConfig?.systemPrompt) {
      return NextResponse.json(
        { error: "AI configuration not found. Please set up AI config in Sanity Studio." },
        { status: 500 }
      );
    }

    // Build context for the AI
    const contextInfo = buildContextFromProfile(cvProfile);
    
    const fullSystemPrompt = `${aiConfig.systemPrompt}

${aiConfig.additionalInfo ? `Additional Information: ${aiConfig.additionalInfo}` : ""}

Context about the person you're representing:
${contextInfo}

Remember: Your goal is to sell this person as an employee or their services. Be professional, enthusiastic, and highlight their strengths.`;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build conversation history for context
    const conversationHistory = chatHistory.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Start a chat with history
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Send the message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiResponse = response.text();

    // Save chat history to Sanity
    const timestamp = new Date().toISOString();
    const userMessage = {
      role: "user",
      content: message,
      timestamp: timestamp,
    };
    const assistantMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    // Check if chat session exists
    const existingChat = await writeClient.fetch(
      `*[_type == "chatHistory" && sessionId == $sessionId][0]`,
      { sessionId }
    );

    if (existingChat) {
      // Update existing chat
      await writeClient
        .patch(existingChat._id)
        .set({
          messages: [...(existingChat.messages || []), userMessage, assistantMessage],
          updatedAt: new Date().toISOString(),
          ...(userEmail && { userEmail }),
          ...(userPhone && { userPhone }),
          ...(userName && { userName }),
          ...(companyName && { companyName }),
        })
        .commit();
    } else {
      // Create new chat session
      await writeClient.create({
        _type: "chatHistory",
        sessionId,
        userEmail: userEmail || "",
        userPhone: userPhone || "",
        userName: userName || "",
        companyName: companyName || "",
        messages: [userMessage, assistantMessage],
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: assistantMessage.timestamp,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat message" },
      { status: 500 }
    );
  }
}

function buildContextFromProfile(profile: any): string {
  if (!profile) return "";

  const sections = [];

  if (profile.name) sections.push(`Name: ${profile.name}`);
  if (profile.role) sections.push(`Role: ${profile.role}`);
  if (profile.about) sections.push(`About: ${profile.about}`);
  
  if (profile.contacts?.email) sections.push(`Email: ${profile.contacts.email}`);
  if (profile.contacts?.phoneNumber) sections.push(`Phone: ${profile.contacts.phoneNumber}`);
  if (profile.contacts?.location) sections.push(`Location: ${profile.contacts.location}`);
  
  if (profile.skillsFrontend?.length) {
    sections.push(`Frontend Skills: ${profile.skillsFrontend.join(", ")}`);
  }
  if (profile.skillsBackend?.length) {
    sections.push(`Backend Skills: ${profile.skillsBackend.join(", ")}`);
  }
  if (profile.skillsDevOps?.length) {
    sections.push(`DevOps Skills: ${profile.skillsDevOps.join(", ")}`);
  }
  
  if (profile.languages?.length) {
    sections.push(
      `Languages: ${profile.languages.map((l: any) => `${l.language} (${l.level})`).join(", ")}`
    );
  }
  
  if (profile.workExperience?.length) {
    const relevantExperience = profile.workExperience
      .filter((exp: any) => !exp.hideFromCV)
      .slice(0, 3);
    if (relevantExperience.length) {
      sections.push(
        `Recent Experience: ${relevantExperience.map((exp: any) => 
          `${exp.jobTitle} at ${exp.companyName}`
        ).join("; ")}`
      );
    }
  }
  
  if (profile.projects?.length) {
    const pinnedProjects = profile.projects.filter((p: any) => p.isPinned).slice(0, 3);
    if (pinnedProjects.length) {
      sections.push(
        `Key Projects: ${pinnedProjects.map((p: any) => p.title).join(", ")}`
      );
    }
  }

  return sections.join("\n");
}
