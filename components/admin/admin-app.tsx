'use client'

import {useState} from 'react'
import {useAuthActions} from '@convex-dev/auth/react'
import {useQuery} from 'convex/react'
import {ExternalLink, LogOut} from 'lucide-react'
import {api} from '@/convex/_generated/api'
import {BrandMark} from '@/components/brand-mark'
import {Button, Field, TextInput, errorMessage} from './fields'
import {ProjectsView} from './projects'
import {ExperienceView} from './experience'
import {ProfileView} from './profile'
import {ClientsView} from './clients'

const tabs = [
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['profile', 'Profile'],
  ['clients', 'Clients'],
] as const
type Tab = (typeof tabs)[number][0]

export function AdminApp() {
  const me = useQuery(api.admin.me)
  if (me === undefined) return <Centered>Loading…</Centered>
  if (!me) return <SignIn />
  if (!me.admin)
    return (
      <Centered>
        <p className="text-muted">This account has no admin access.</p>
        <SignOutButton />
      </Centered>
    )
  return <Shell email={me.email} />
}

function Centered({children}: {children: React.ReactNode}) {
  return <main className="grid min-h-dvh place-items-center p-6 text-center">{<div className="grid gap-4">{children}</div>}</main>
}

function SignIn() {
  const {signIn} = useAuthActions()
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <form
        className="grid w-full max-w-sm gap-5 rounded-2xl border border-line bg-panel p-7"
        onSubmit={async (event) => {
          event.preventDefault()
          setBusy(true)
          setError('')
          try {
            await signIn('password', {email, password, flow})
          } catch (caught) {
            setError(
              flow === 'signIn'
                ? 'Wrong email or password.'
                : errorMessage(caught).includes('cannot sign in')
                  ? 'This email is not allowed.'
                  : 'Could not create the account. Use at least 8 characters.',
            )
          } finally {
            setBusy(false)
          }
        }}
      >
        <div className="flex items-center gap-3">
          <BrandMark className="h-8 w-7 text-mint" />
          <div>
            <h1 className="font-semibold">O.D. EMPOWER</h1>
            <p className="text-xs text-muted">Content admin</p>
          </div>
        </div>
        <Field label="Email">
          <TextInput value={email} onChange={setEmail} />
        </Field>
        <Field label="Password" hint={flow === 'signUp' ? 'At least 8 characters.' : undefined}>
          <input
            type="password"
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-mint/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit" disabled={busy || !email || !password}>
          {busy ? 'Please wait…' : flow === 'signIn' ? 'Sign in' : 'Create admin account'}
        </Button>
        <button
          type="button"
          className="text-xs text-muted hover:text-white"
          onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
        >
          {flow === 'signIn' ? 'First time? Create the admin account' : 'Back to sign in'}
        </button>
      </form>
    </main>
  )
}

function SignOutButton() {
  const {signOut} = useAuthActions()
  return (
    <Button variant="ghost" onClick={() => void signOut()}>
      <LogOut className="size-4" /> Sign out
    </Button>
  )
}

function Shell({email}: {email: string}) {
  const [tab, setTab] = useState<Tab>('projects')
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-6 w-5 text-mint" />
            <span className="text-sm font-semibold">Admin</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={
                  'rounded-lg px-3 py-1.5 text-sm transition ' +
                  (tab === id ? 'bg-line text-white' : 'text-muted hover:text-white')
                }
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <a href="/en" target="_blank" className="hidden items-center gap-1.5 text-sm text-muted hover:text-white sm:flex">
              View site <ExternalLink className="size-3.5" />
            </a>
            <span className="hidden text-xs text-muted md:inline">{email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === 'projects' && <ProjectsView />}
        {tab === 'experience' && <ExperienceView />}
        {tab === 'profile' && <ProfileView />}
        {tab === 'clients' && <ClientsView />}
      </main>
    </div>
  )
}
