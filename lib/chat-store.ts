import {randomUUID} from 'node:crypto'
import type {SanityClient, SanityDocument} from 'next-sanity'
import {ChatError, digest, EXTENDED_LIMIT, HOUR, LEASE_MS, MESSAGE_LIMIT, type ChatInput} from './chat-policy'

export type StoredMessage = {
  _key: string; role: 'user' | 'assistant'; content: string; timestamp: string;
  requestId?: string; messageHash?: string;
}
type Conversation = SanityDocument & {
  messages?: StoredMessage[]; messageCount?: number; userEmail?: string;
  leaseUntil?: number; pendingRequest?: string;
}
type Guard = SanityDocument & {window: number; count: number; visitors: Record<string, number>}
export type Reservation = {id: string; requestId: string; lease: string; count: number; limit: number; history: StoredMessage[]; cached?: StoredMessage}

// Subpath IDs are private to authenticated Sanity clients, even in a public dataset.
// One bounded guard with an hourly window avoids a separate service or per-visitor background jobs.
export async function reserveChat(client: SanityClient, input: ChatInput, session: string, ip: string, secret: string, now = Date.now()): Promise<Reservation> {
  const id = `private.chat.${digest(session, secret)}`
  const guardId = 'private.chatBudget.global'
  const window = Math.floor(now / HOUR)
  const lease = randomUUID()
  const visitor = `v${digest(`${Math.floor(now / HOUR)}:${ip}`, secret)}`
  for (let attempt = 0; attempt < 5; attempt++) {
    const docs = await client.fetch<(Conversation | Guard)[]>('*[_id in $ids]', {ids: [id, guardId]}, {cache: 'no-store'})
    const chat = docs.find(doc => doc._id === id) as Conversation | undefined
    const guard = docs.find(doc => doc._id === guardId) as Guard | undefined
    const currentGuard = guard?.window === window ? guard : undefined
    const history = chat?.messages || []
    const limit = input.userEmail || chat?.userEmail ? EXTENDED_LIMIT : MESSAGE_LIMIT
    const count = chat?.messageCount || 0
    const cached = history.find(message => message.role === 'assistant' && message.requestId === input.requestId)
    if (cached) {
      if (cached.messageHash !== digest(input.message, secret)) throw new ChatError('Request ID was already used for another message.', 409)
      return {id, requestId: input.requestId, lease, count, limit, history, cached}
    }
    if ((chat?.leaseUntil || 0) > now) throw new ChatError('A reply is already being prepared. Please try again shortly.', 409)
    if (count >= limit) throw new ChatError(limit === MESSAGE_LIMIT ? 'Please provide your email to continue chatting.' : 'This conversation has reached its message limit. Please contact Oleksandr directly.', 429, limit === MESSAGE_LIMIT)
    if ((currentGuard?.count || 0) >= 120 || (currentGuard?.visitors?.[visitor] || 0) >= 30) throw new ChatError('Chat usage limit reached. Please try again later.', 429)
    const state = {messageCount: count + 1, leaseUntil: now + LEASE_MS, pendingRequest: input.requestId, leaseToken: lease, updatedAt: new Date(now).toISOString()}
    const budget = {window, count: (currentGuard?.count || 0) + 1, visitors: {...currentGuard?.visitors, [visitor]: (currentGuard?.visitors?.[visitor] || 0) + 1}}
    const tx = client.transaction()
    if (chat) tx.patch(id, patch => patch.ifRevisionId(chat._rev).set(state))
    else tx.create({_id: id, _type: 'chatHistory', sessionId: session, messages: [], createdAt: state.updatedAt, ...state})
    if (guard) tx.patch(guardId, patch => patch.ifRevisionId(guard._rev).set(budget))
    else tx.create({_id: guardId, _type: 'chatBudget', ...budget})
    try {
      await tx.commit({visibility: 'sync'})
      return {id, requestId: input.requestId, lease, count: count + 1, limit, history}
    } catch (error) {
      if ((error as {statusCode?: number}).statusCode !== 409) throw error
    }
  }
  throw new ChatError('Chat is busy. Please try again shortly.', 429)
}

export async function completeChat(client: SanityClient, reservation: Reservation, input: ChatInput, response: string, secret: string) {
  const timestamp = new Date().toISOString()
  const messages: StoredMessage[] = [
    {_key: `${input.requestId}-user`, role: 'user', content: input.message, timestamp},
    {_key: `${input.requestId}-assistant`, role: 'assistant', content: response, timestamp, requestId: input.requestId, messageHash: digest(input.message, secret)},
  ]
  // Conditional mutation prevents a timed-out worker from touching a newer request's lease.
  await client.patch({query: '*[_id == $id && pendingRequest == $requestId && leaseToken == $lease]', params: {id: reservation.id, requestId: reservation.requestId, lease: reservation.lease}})
    .setIfMissing({messages: []}).append('messages', messages)
    .set({updatedAt: timestamp, ...(input.userEmail && {userEmail: input.userEmail}), ...(input.userPhone && {userPhone: input.userPhone}), ...(input.userName && {userName: input.userName}), ...(input.companyName && {companyName: input.companyName})})
    .unset(['leaseUntil', 'pendingRequest', 'leaseToken']).commit({visibility: 'sync'})
  return timestamp
}

export async function releaseChat(client: SanityClient, reservation: Reservation) {
  // Failed attempts still consume budget: provider failures must not become unlimited retries.
  await client.patch({query: '*[_id == $id && pendingRequest == $requestId && leaseToken == $lease]', params: {id: reservation.id, requestId: reservation.requestId, lease: reservation.lease}})
    .unset(['leaseUntil', 'pendingRequest', 'leaseToken']).commit()
}
