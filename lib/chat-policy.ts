import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto'

export const SESSION_COOKIE = 'portfolio-chat'
export const SESSION_TTL = 86400
export const MESSAGE_LIMIT = 15
export const EXTENDED_LIMIT = 20
export const MAX_BODY_BYTES = 16384
export const MAX_MESSAGE_LENGTH = 4000
export const HOUR = 3600000
export const LEASE_MS = 90000

export class ChatError extends Error {
  constructor(message: string, public status = 400, public needsEmail = false) { super(message) }
}

export function isSameOrigin(headers: Headers) {
  try {
    const origin = new URL(headers.get('origin') || '')
    // Next can normalize the internal URL to localhost behind a proxy; Host is the public authority.
    return ['http:', 'https:'].includes(origin.protocol) && origin.host === headers.get('host') && headers.get('sec-fetch-site') !== 'cross-site'
  } catch { return false }
}

export type ChatInput = {
  message: string; requestId: string; userEmail?: string; userPhone?: string;
  userName?: string; companyName?: string;
}

export function parseChatInput(body: unknown): ChatInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ChatError('Invalid request.')
  const value = body as Record<string, unknown>
  const allowed = new Set(['message', 'requestId', 'userEmail', 'userPhone', 'userName', 'companyName'])
  if (Object.keys(value).some(key => !allowed.has(key))) throw new ChatError('Unsupported request fields.')
  if (typeof value.message !== 'string' || !value.message.trim() || value.message.length > MAX_MESSAGE_LENGTH) {
    throw new ChatError(`Please send a message between 1 and ${MAX_MESSAGE_LENGTH} characters.`)
  }
  if (typeof value.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(value.requestId)) throw new ChatError('Invalid request ID.')
  for (const field of ['userEmail', 'userPhone', 'userName', 'companyName'] as const) {
    if (value[field] !== undefined && (typeof value[field] !== 'string' || value[field].length > 254)) {
      throw new ChatError('Invalid contact information.')
    }
  }
  if (value.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.userEmail as string)) throw new ChatError('Please enter a valid email address.')
  return {...value, message: value.message.trim()} as ChatInput
}

export async function readChatBody(request: Request): Promise<ChatInput> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new ChatError('JSON is required.', 415)
  const reader = request.body?.getReader()
  if (!reader) throw new ChatError('Request body is required.')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const {done, value} = await reader.read()
      if (done) break
      size += value.length
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new ChatError('Request is too large.', 413) }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  let body: unknown
  try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { throw new ChatError('Invalid JSON.') }
  return parseChatInput(body)
}

export function digest(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex')
}

export function issueSession(secret: string, now = Date.now()) {
  const value = `${randomUUID()}:${now + SESSION_TTL * 1000}`
  return `${value}:${digest(value, secret)}`
}

export function readSession(cookie: string | undefined, secret: string, now = Date.now()) {
  if (!cookie || cookie.length > 180) return null
  const [id, expires, signature, extra] = cookie.split(':')
  if (extra || !/^[a-f0-9-]{36}$/.test(id || '') || !/^\d+$/.test(expires || '') || !/^[a-f0-9]{64}$/.test(signature || '')) return null
  if (+expires <= now || +expires > now + SESSION_TTL * 1000) return null
  const expected = digest(`${id}:${expires}`, secret)
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature)) ? id : null
}
