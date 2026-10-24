'use client'

import {useState} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {ArrowDown, ArrowLeft, ArrowUp, Plus, Star} from 'lucide-react'
import {toast} from 'sonner'
import {api} from '@/convex/_generated/api'
import type {Doc, Id} from '@/convex/_generated/dataModel'
import {
  Button,
  Field,
  IconButton,
  ImageField,
  LangSwitch,
  LinesInput,
  LocalLines,
  LocalText,
  Repeater,
  Section,
  TextInput,
  Toggle,
  body,
  cleanLines,
  cleanText,
  tidy,
  useSave,
  type Lang,
} from './fields'

type Project = ReturnType<typeof body<Doc<'projects'>>>

const blank = (): Project => ({
  slug: '',
  order: 0,
  featured: false,
  title: '',
  description: {en: ''},
  features: {en: []},
  technologies: [],
  petProject: false,
  isPinned: false,
  nda: false,
  gallery: [],
})

export function ProjectsView() {
  const projects = useQuery(api.admin.projects)
  const [editing, setEditing] = useState<Id<'projects'> | 'new' | null>(null)
  const reorder = useMutation(api.admin.reorder)
  const save = useMutation(api.admin.saveProject)
  const {run} = useSave()
  if (!projects) return <p className="text-muted">Loading…</p>
  if (editing) {
    const doc = editing === 'new' ? undefined : projects.find((item) => item._id === editing)
    return <ProjectEditor key={editing} doc={doc} onClose={() => setEditing(null)} onCreated={setEditing} />
  }
  const move = (from: number, to: number) => {
    const ids = projects.map((item) => item._id)
    ids.splice(to, 0, ...ids.splice(from, 1))
    void run(() => reorder({ids: {table: 'projects', ids}}), 'Order saved')
  }
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted">The order here is the order on the site. Starred projects show on the home page.</p>
        </div>
        <Button onClick={() => setEditing('new')}>
          <Plus className="size-4" /> New project
        </Button>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
        {projects.map((project, index) => (
          <li key={project._id} className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              aria-label={project.featured ? 'Remove from home page' : 'Show on home page'}
              title={project.featured ? 'On the home page' : 'Not on the home page'}
              onClick={() =>
                void run(
                  () => save({id: project._id, project: {...body(project), featured: !project.featured}}),
                  project.featured ? 'Removed from home page' : 'Added to home page',
                )
              }
            >
              <Star className={'size-4 ' + (project.featured ? 'fill-mint text-mint' : 'text-muted/50')} />
            </button>
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setEditing(project._id)}>
              <span className="block truncate font-medium hover:text-mint">{project.title || 'Untitled'}</span>
              <span className="block truncate text-xs text-muted">
                /work/{project.slug}
                {project.nda && ' · NDA'}
                {project.petProject ? ' · Independent' : ' · Commercial'}
              </span>
            </button>
            <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Move down" disabled={index === projects.length - 1} onClick={() => move(index, index + 1)}>
              <ArrowDown className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProjectEditor({
  doc,
  onClose,
  onCreated,
}: {
  doc: Doc<'projects'> | undefined
  onClose: () => void
  onCreated: (id: Id<'projects'>) => void
}) {
  const [draft, setDraft] = useState<Project>(() => (doc ? body(doc) : blank()))
  const [lang, setLang] = useState<Lang>('en')
  const save = useMutation(api.admin.saveProject)
  const remove = useMutation(api.admin.deleteProject)
  const {saving, run} = useSave()
  const set = (patch: Partial<Project>) => setDraft((old) => ({...old, ...patch}))
  const media = draft.media

  const submit = async () => {
    if (media && !media.desktop.storageId && !media.desktop.path) {
      toast.error('Captured media needs a desktop screenshot.')
      return
    }
    const project: Project = {
      ...draft,
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      description: cleanText(draft.description),
      features: cleanLines(draft.features),
      technologies: tidy(draft.technologies),
      url: draft.url?.trim() || undefined,
      urlToCode: draft.urlToCode?.trim() || undefined,
    }
    const id = await run(() => save({id: doc?._id, project}))
    if (id && !doc) onCreated(id)
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <IconButton label="Back to projects" onClick={onClose}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <h1 className="mr-auto text-2xl font-semibold">{doc ? draft.title || 'Untitled' : 'New project'}</h1>
        <LangSwitch lang={lang} onChange={setLang} />
        <Button onClick={submit} disabled={saving || !draft.title.trim() || !draft.slug.trim()}>
          {saving ? 'Saving…' : 'Save & publish'}
        </Button>
      </div>

      <Section title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={draft.title} onChange={(title) => set({title})} />
          </Field>
          <Field label="Slug" hint="The page address: /work/your-slug">
            <TextInput value={draft.slug} onChange={(slug) => set({slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} />
          </Field>
          <Field label="Live URL">
            <TextInput value={draft.url} onChange={(url) => set({url})} placeholder="https://" />
          </Field>
          <Field label="Code URL">
            <TextInput value={draft.urlToCode} onChange={(urlToCode) => set({urlToCode})} placeholder="https://github.com/…" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Toggle label="On the home page" checked={draft.featured} onChange={(featured) => set({featured})} />
          <Toggle label="Independent project" checked={draft.petProject} onChange={(petProject) => set({petProject})} />
          <Toggle label="Under NDA (hides name and images)" checked={draft.nda} onChange={(nda) => set({nda})} />
          <Toggle label="Pinned" checked={draft.isPinned} onChange={(isPinned) => set({isPinned})} />
        </div>
      </Section>

      <Section title={`Text · ${lang.toUpperCase()}`} aside={lang !== 'en' && <span className="text-xs text-muted">Empty fields show English</span>}>
        <Field label="Description">
          <LocalText multiline rows={5} value={draft.description} lang={lang} onChange={(description) => set({description})} />
        </Field>
        <Field label="Features" hint="One per line">
          <LocalLines value={draft.features} lang={lang} onChange={(features) => set({features})} />
        </Field>
        <Field label="Technologies" hint="One per line. Same in every language.">
          <LinesInput rows={4} value={draft.technologies} onChange={(technologies) => set({technologies})} />
        </Field>
      </Section>

      <Section
        title="Screenshots"
        aside={
          <Toggle
            label="Captured media"
            checked={!!media}
            onChange={(on) =>
              set({
                media: on
                  ? {desktop: {}, capturedOn: new Date().toISOString().slice(0, 10), sourceUrl: draft.url ?? ''}
                  : undefined,
              })
            }
          />
        }
      >
        {media ? (
          <>
            <p className="text-sm text-muted">Desktop, mobile and detail captures, used for the card, preview and case page.</p>
            <div className="grid gap-5 lg:grid-cols-3">
              <ImageField label="Desktop" value={media.desktop} onChange={(desktop) => set({media: {...media, desktop: desktop ?? {}}})} />
              <ImageField label="Mobile" optional value={media.mobile} onChange={(mobile) => set({media: {...media, mobile}})} />
              <ImageField label="Detail" optional value={media.detail} onChange={(detail) => set({media: {...media, detail}})} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Captured from">
                <TextInput value={media.sourceUrl} onChange={(sourceUrl) => set({media: {...media, sourceUrl}})} />
              </Field>
              <Field label="Captured on">
                <TextInput value={media.capturedOn} onChange={(capturedOn) => set({media: {...media, capturedOn}})} />
              </Field>
              <Field label="Video (path in /public)">
                <TextInput value={media.video} onChange={(video) => set({media: {...media, video: video || undefined}})} />
              </Field>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">Gallery images. The first one is the cover.</p>
            <Repeater
              items={draft.gallery}
              onChange={(gallery) => set({gallery})}
              create={() => ({})}
              addLabel="Add image"
              render={(image, update) => <ImageField label="Image" value={image} onChange={(next) => update(next ?? {})} />}
            />
          </>
        )}
      </Section>

      {doc && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            onClick={async () => {
              if (!window.confirm(`Delete “${doc.title}”? Its uploaded images are deleted too.`)) return
              await run(() => remove({id: doc._id}), 'Project deleted')
              onClose()
            }}
          >
            Delete project
          </Button>
        </div>
      )}
    </div>
  )
}
