import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
function load(file, mocks = {}) {
  const js = ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText
  const exports = {}
  vm.runInNewContext(js, {exports, require: name => mocks[name] || require(name), Buffer, Date, URL, console})
  return exports
}
const policy = load('../lib/chat-policy.ts')
const store = load('../lib/chat-store.ts', {'./chat-policy': policy})
const secret = 'test-secret-never-used-in-production'
const input = (message = 'What are your React skills?') => ({message, requestId: crypto.randomUUID()})

function database() {
  const documents = new Map()
  let revision = 0
  function patchBuilder() {
    return {_rev: undefined, values: {}, removed: [], additions: [],
      ifRevisionId(rev) { this._rev = rev; return this },
      set(values) { Object.assign(this.values, values); return this },
      setIfMissing() { return this },
      append(_field, messages) { this.additions = messages; return this },
      unset(keys) { this.removed.push(...keys); return this },
    }
  }
  function applyPatch(doc, patch) {
    const result = {...doc, ...patch.values, _rev: String(++revision)}
    if (patch.additions.length) result.messages = [...(doc.messages || []), ...patch.additions]
    for (const field of patch.removed) delete result[field]
    return result
  }
  return {documents,
    async fetch(_query, {ids}) { return ids.map(id => documents.get(id)).filter(Boolean).map(doc => structuredClone(doc)) },
    transaction() {
      const actions = []
      return {
        patch(id, callback) { actions.push({id, patch: callback(patchBuilder())}); return this },
        create(doc) { actions.push({id: doc._id, create: doc}); return this },
        async commit() {
          for (const action of actions) {
            const doc = documents.get(action.id)
            if ((action.create && doc) || (action.patch && doc?._rev !== action.patch._rev)) throw Object.assign(new Error('Conflict'), {statusCode: 409})
          }
          for (const action of actions) documents.set(action.id, action.create ? {...action.create, _rev: String(++revision)} : applyPatch(documents.get(action.id), action.patch))
        },
      }
    },
    patch({params: {id, requestId, lease}}) {
      const patch = patchBuilder()
      patch.commit = async () => {
        const doc = documents.get(id)
        if (doc?.pendingRequest === requestId && doc.leaseToken === lease) documents.set(id, applyPatch(doc, patch))
      }
      return patch
    },
  }
}

test('signed sessions reject forgery, expiry and client-chosen IDs', () => {
  const cookie = policy.issueSession(secret, 1000)
  assert.ok(policy.readSession(cookie, secret, 1001))
  assert.equal(policy.readSession(cookie, 'wrong-secret', 1001), null)
  assert.equal(policy.readSession(cookie, secret, 1000 + policy.SESSION_TTL * 1000), null)
  assert.equal(policy.readSession('session_123', secret), null)
})

test('origin validation supports reverse proxies and rejects cross-site requests', () => {
  for (const origin of ['http://127.0.0.1:3100', 'https://www.o-d.dev']) {
    assert.equal(policy.isSameOrigin(new Headers({origin, host: new URL(origin).host})), true)
  }
  assert.equal(policy.isSameOrigin(new Headers({origin: 'https://attacker.test', host: 'www.o-d.dev'})), false)
  assert.equal(policy.isSameOrigin(new Headers({host: 'www.o-d.dev'})), false)
})

test('validate types, contacts, history injection and message length', () => {
  for (const value of [null, [], {...input(), message: 42}, {...input(), chatHistory: []}, {...input(), sessionId: 'fake'}, {...input(), userEmail: 'invalid'}, input('x'.repeat(4001))]) {
    assert.throws(() => policy.parseChatInput(value), error => error.status === 400)
  }
  assert.equal(policy.parseChatInput(input('  Hello  ')).message, 'Hello')
})

test('streaming body limit cannot be bypassed by omitting content-length', async () => {
  const request = new Request('https://example.com', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(input('x'.repeat(20000)))})
  await assert.rejects(policy.readChatBody(request), error => error.status === 413)
  await assert.rejects(policy.readChatBody(new Request('https://example.com', {method: 'POST', headers: {'content-type': 'application/json'}, body: '{'})), error => error.status === 400)
})

test('25 concurrent requests for one session admit exactly one worker', async () => {
  const db = database()
  const results = await Promise.allSettled(Array.from({length: 25}, () => store.reserveChat(db, input(), 'one-session', 'one-ip', secret)))
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1)
  assert.equal(db.documents.get('private.chatBudget.global').count, 1)
  assert.ok([...db.documents.keys()].every(id => id.startsWith('private.')))
})

test('completion appends history, replay is free and IDs cannot change meaning', async () => {
  const db = database(), message = input()
  const reservation = await store.reserveChat(db, message, 'session', 'ip', secret)
  await store.completeChat(db, reservation, message, 'Answer one', secret)
  const replay = await store.reserveChat(db, message, 'session', 'ip', secret)
  assert.equal(replay.cached.content, 'Answer one')
  assert.equal(db.documents.get('private.chatBudget.global').count, 1)
  await assert.rejects(store.reserveChat(db, {...message, message: 'Different'}, 'session', 'ip', secret), error => error.status === 409)
  const next = input('Another question')
  await store.completeChat(db, await store.reserveChat(db, next, 'session', 'ip', secret), next, 'Answer two', secret)
  assert.equal(db.documents.get(reservation.id).messages.length, 4)
})

test('new sessions cannot bypass per-IP budget and hourly reset reuses one guard', async () => {
  const db = database(), now = 10 * policy.HOUR
  for (let i = 0; i < 30; i++) await store.reserveChat(db, input(), `session-${i}`, 'same-ip', secret, now)
  await assert.rejects(store.reserveChat(db, input(), 'new-session', 'same-ip', secret, now), error => error.status === 429)
  await store.reserveChat(db, input(), 'next-hour', 'same-ip', secret, now + policy.HOUR)
  assert.equal(db.documents.get('private.chatBudget.global').count, 1)
  assert.equal([...db.documents.keys()].filter(key => key.includes('chatBudget')).length, 1)
})

test('global budget applies across different IPs', async () => {
  const db = database()
  for (let i = 0; i < 120; i++) await store.reserveChat(db, input(), `session-${i}`, `ip-${i}`, secret)
  await assert.rejects(store.reserveChat(db, input(), 'new-session', 'new-ip', secret), error => error.status === 429)
})

test('stale workers cannot append to or unlock a newer request', async () => {
  const db = database(), message = input(), now = 20 * policy.HOUR
  const stale = await store.reserveChat(db, message, 'session', 'ip', secret, now)
  const current = await store.reserveChat(db, message, 'session', 'ip', secret, now + policy.LEASE_MS + 1)
  await store.completeChat(db, stale, message, 'Stale', secret)
  await store.releaseChat(db, stale)
  assert.equal(db.documents.get(current.id).leaseToken, current.lease)
  assert.equal(db.documents.get(current.id).messages.length, 0)
  await store.completeChat(db, current, message, 'Current', secret)
  assert.equal(db.documents.get(current.id).messages.length, 2)
})

test('session limits and contact extension are persisted, failures consume quota', async () => {
  const db = database()
  for (let i = 0; i < 15; i++) await store.releaseChat(db, await store.reserveChat(db, input(), 'session', 'ip', secret))
  await assert.rejects(store.reserveChat(db, input(), 'session', 'ip', secret), error => error.status === 429 && error.needsEmail)
  for (let i = 0; i < 5; i++) await store.releaseChat(db, await store.reserveChat(db, {...input(), userEmail: 'test@example.com'}, 'session', 'ip', secret))
  await assert.rejects(store.reserveChat(db, {...input(), userEmail: 'test@example.com'}, 'session', 'ip', secret), error => error.status === 429 && !error.needsEmail)
})
