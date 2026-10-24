'use client'

import {useState} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {ArrowDown, ArrowLeft, ArrowUp, Plus} from 'lucide-react'
import {api} from '@/convex/_generated/api'
import type {Doc, Id} from '@/convex/_generated/dataModel'
import {
  Button,
  Field,
  IconButton,
  LangSwitch,
  LocalLines,
  LocalText,
  Section,
  TextInput,
  Toggle,
  body,
  cleanLines,
  cleanText,
  useSave,
  type Lang,
} from './fields'

type Job = ReturnType<typeof body<Doc<'experience'>>>

const blank = (): Job => ({
  order: 0,
  isRelated: true,
  hideFromCV: false,
  jobTitle: {en: ''},
  duration: {en: ''},
  location: {en: ''},
  type: {en: ''},
  description: {en: []},
})

export function ExperienceView() {
  const jobs = useQuery(api.admin.experience)
  const [editing, setEditing] = useState<Id<'experience'> | 'new' | null>(null)
  const reorder = useMutation(api.admin.reorder)
  const {run} = useSave()
  if (!jobs) return <p className="text-muted">Loading…</p>
  if (editing) {
    const doc = editing === 'new' ? undefined : jobs.find((item) => item._id === editing)
    return <JobEditor key={editing} doc={doc} onClose={() => setEditing(null)} onCreated={setEditing} />
  }
  const move = (from: number, to: number) => {
    const ids = jobs.map((item) => item._id)
    ids.splice(to, 0, ...ids.splice(from, 1))
    void run(() => reorder({ids: {table: 'experience', ids}}), 'Order saved')
  }
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Experience</h1>
          <p className="text-sm text-muted">Newest first. “Related” roles show in the main timeline, the rest under earlier work.</p>
        </div>
        <Button onClick={() => setEditing('new')}>
          <Plus className="size-4" /> New role
        </Button>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
        {jobs.map((job, index) => (
          <li key={job._id} className="flex items-center gap-3 px-4 py-3">
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setEditing(job._id)}>
              <span className="block truncate font-medium hover:text-mint">{job.jobTitle.en || 'Untitled role'}</span>
              <span className="block truncate text-xs text-muted">
                {[job.companyName, job.duration.en, job.isRelated ? null : 'Earlier work'].filter(Boolean).join(' · ')}
              </span>
            </button>
            <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Move down" disabled={index === jobs.length - 1} onClick={() => move(index, index + 1)}>
              <ArrowDown className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  )
}

function JobEditor({
  doc,
  onClose,
  onCreated,
}: {
  doc: Doc<'experience'> | undefined
  onClose: () => void
  onCreated: (id: Id<'experience'>) => void
}) {
  const [draft, setDraft] = useState<Job>(() => (doc ? body(doc) : blank()))
  const [lang, setLang] = useState<Lang>('en')
  const save = useMutation(api.admin.saveExperience)
  const remove = useMutation(api.admin.deleteExperience)
  const {saving, run} = useSave()
  const set = (patch: Partial<Job>) => setDraft((old) => ({...old, ...patch}))

  const submit = async () => {
    const job: Job = {
      ...draft,
      companyName: draft.companyName?.trim() || undefined,
      website: draft.website?.trim() || undefined,
      websiteName: draft.websiteName?.trim() || undefined,
      jobTitle: cleanText(draft.jobTitle),
      jobTitle2: draft.jobTitle2?.en.trim() ? cleanText(draft.jobTitle2) : undefined,
      duration: cleanText(draft.duration),
      location: cleanText(draft.location),
      type: cleanText(draft.type),
      description: cleanLines(draft.description),
    }
    const id = await run(() => save({id: doc?._id, job}))
    if (id && !doc) onCreated(id)
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <IconButton label="Back to experience" onClick={onClose}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <h1 className="mr-auto text-2xl font-semibold">{doc ? draft.jobTitle.en || 'Untitled role' : 'New role'}</h1>
        <LangSwitch lang={lang} onChange={setLang} />
        <Button onClick={submit} disabled={saving || !draft.jobTitle.en.trim()}>
          {saving ? 'Saving…' : 'Save & publish'}
        </Button>
      </div>

      <Section title="Company">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Company">
            <TextInput value={draft.companyName} onChange={(companyName) => set({companyName})} />
          </Field>
          <Field label="Website">
            <TextInput value={draft.website} onChange={(website) => set({website})} placeholder="https://" />
          </Field>
          <Field label="Website label">
            <TextInput value={draft.websiteName} onChange={(websiteName) => set({websiteName})} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Toggle label="Related to development" checked={draft.isRelated} onChange={(isRelated) => set({isRelated})} />
          <Toggle label="Hide from CV" checked={draft.hideFromCV} onChange={(hideFromCV) => set({hideFromCV})} />
        </div>
      </Section>

      <Section title={`Role · ${lang.toUpperCase()}`} aside={lang !== 'en' && <span className="text-xs text-muted">Empty fields show English</span>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job title">
            <LocalText value={draft.jobTitle} lang={lang} onChange={(jobTitle) => set({jobTitle})} />
          </Field>
          <Field label="Second title (optional)">
            <LocalText value={draft.jobTitle2 ?? {en: ''}} lang={lang} onChange={(jobTitle2) => set({jobTitle2})} />
          </Field>
          <Field label="Duration">
            <LocalText value={draft.duration} lang={lang} onChange={(duration) => set({duration})} />
          </Field>
          <Field label="Location">
            <LocalText value={draft.location} lang={lang} onChange={(location) => set({location})} />
          </Field>
          <Field label="Type">
            <LocalText value={draft.type} lang={lang} onChange={(type) => set({type})} />
          </Field>
        </div>
        <Field label="What I did" hint="One point per line">
          <LocalLines rows={6} value={draft.description} lang={lang} onChange={(description) => set({description})} />
        </Field>
      </Section>

      {doc && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            onClick={async () => {
              if (!window.confirm(`Delete “${doc.jobTitle.en}”?`)) return
              await run(() => remove({id: doc._id}), 'Role deleted')
              onClose()
            }}
          >
            Delete role
          </Button>
        </div>
      )}
    </div>
  )
}
