'use client'

import {useState, type ReactNode} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {ConvexError} from 'convex/values'
import {toast} from 'sonner'
import {ArrowDown, ArrowUp, ImagePlus, Plus, Trash2} from 'lucide-react'
import {api} from '@/convex/_generated/api'
import type {Id} from '@/convex/_generated/dataModel'
import {publishContent} from '@/app/(admin)/admin/actions'

export type Lang = 'en' | 'pl' | 'uk'
export const langs: Lang[] = ['en', 'pl', 'uk']
export type Text = {en: string; pl?: string; uk?: string}
export type Lines = {en: string[]; pl?: string[]; uk?: string[]}
export type Image = {storageId?: Id<'_storage'>; path?: string}

/** Strips Convex system fields so a loaded document can be saved back. */
export function body<T extends {_id?: unknown; _creationTime?: unknown}>(doc: T) {
  const {_id, _creationTime, ...rest} = doc
  void _id
  void _creationTime
  return rest
}

export const errorMessage = (error: unknown) =>
  error instanceof ConvexError ? String(error.data) : error instanceof Error ? error.message : 'Something went wrong.'

/** Runs a save, then expires the site's cache so the change goes live. */
export function useSave() {
  const [saving, setSaving] = useState(false)
  const run = async <T,>(save: () => Promise<T>, done = 'Saved and published') => {
    setSaving(true)
    try {
      const result = await save()
      await publishContent()
      toast.success(done)
      return result
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setSaving(false)
    }
  }
  return {saving, run}
}

const inputClass =
  'w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none transition placeholder:text-muted/60 focus:border-mint/70'

export function Field({label, hint, children}: {label: string; hint?: string; children: ReactNode}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted/70">{hint}</span>}
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <input className={inputClass} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      className={inputClass + ' resize-y leading-relaxed'}
      rows={rows}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

/** One item per line. Blank lines are dropped on save. */
export function LinesInput({
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  value: string[] | undefined
  onChange: (value: string[]) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <TextArea
      rows={rows}
      value={(value ?? []).join('\n')}
      placeholder={placeholder}
      onChange={(text) => onChange(text.split('\n'))}
    />
  )
}
export const tidy = (items: string[]) => items.map((item) => item.trim()).filter(Boolean)

export function Toggle({label, checked, onChange}: {label: string; checked: boolean; onChange: (value: boolean) => void}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm select-none">
      <input type="checkbox" className="size-4 accent-mint" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function LangSwitch({lang, onChange}: {lang: Lang; onChange: (lang: Lang) => void}) {
  return (
    <div className="inline-flex rounded-lg border border-line p-0.5" role="tablist" aria-label="Content language">
      {langs.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={lang === item}
          onClick={() => onChange(item)}
          className={
            'rounded-md px-3 py-1 text-xs font-semibold uppercase transition ' +
            (lang === item ? 'bg-mint text-ink' : 'text-muted hover:text-white')
          }
        >
          {item}
        </button>
      ))}
    </div>
  )
}

/** Edits the current language; other languages show English as a placeholder. */
export function LocalText({
  value,
  lang,
  onChange,
  multiline,
  rows,
}: {
  value: Text
  lang: Lang
  onChange: (value: Text) => void
  multiline?: boolean
  rows?: number
}) {
  const props = {
    value: value[lang],
    placeholder: lang === 'en' ? undefined : value.en,
    onChange: (text: string) => onChange({...value, [lang]: text}),
  }
  return multiline ? <TextArea {...props} rows={rows} /> : <TextInput {...props} />
}

export function LocalLines({
  value,
  lang,
  onChange,
  rows,
}: {
  value: Lines
  lang: Lang
  onChange: (value: Lines) => void
  rows?: number
}) {
  return (
    <LinesInput
      rows={rows}
      value={value[lang]}
      placeholder={lang === 'en' ? 'One per line' : value.en.join('\n')}
      onChange={(items) => onChange({...value, [lang]: items})}
    />
  )
}

/** Drops empty translations so the site falls back to English cleanly. */
export function cleanText(value: Text): Text {
  const out: Text = {en: value.en.trim()}
  for (const lang of ['pl', 'uk'] as const) if (value[lang]?.trim()) out[lang] = value[lang]!.trim()
  return out
}
export function cleanLines(value: Lines): Lines {
  const out: Lines = {en: tidy(value.en)}
  for (const lang of ['pl', 'uk'] as const) {
    const items = tidy(value[lang] ?? [])
    if (items.length) out[lang] = items
  }
  return out
}

export function Repeater<T>({
  items,
  onChange,
  create,
  render,
  addLabel,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => NoInfer<T>
  render: (item: T, update: (item: T) => void) => ReactNode
  addLabel: string
}) {
  const move = (from: number, to: number) => {
    const next = [...items]
    next.splice(to, 0, ...next.splice(from, 1))
    onChange(next)
  }
  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl border border-line bg-ink/60 p-4">
          <div className="flex justify-end gap-1">
            <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton label="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <Trash2 className="size-4" />
            </IconButton>
          </div>
          {render(item, (next) => onChange(items.map((old, i) => (i === index ? next : old))))}
        </div>
      ))}
      <Button variant="ghost" onClick={() => onChange([...items, create()])}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const style = {
    primary: 'bg-mint text-ink hover:bg-white',
    ghost: 'border border-line text-white hover:border-mint/60',
    danger: 'border border-red-400/40 text-red-300 hover:bg-red-400/10',
  }[variant]
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ' +
        style
      }
    >
      {children}
    </button>
  )
}

export function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string
  children: ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md p-1.5 text-muted transition hover:bg-line hover:text-white disabled:opacity-25"
    >
      {children}
    </button>
  )
}

export function Section({title, children, aside}: {title: string; children: ReactNode; aside?: ReactNode}) {
  return (
    <section className="grid gap-4 rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold tracking-wide text-mint uppercase">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

function useImageSrc(image: Image | undefined) {
  const url = useQuery(api.admin.fileUrl, image?.storageId ? {storageId: image.storageId} : 'skip')
  return image?.storageId ? (url ?? undefined) : image?.path
}

/** Uploads straight to Convex storage; the file is kept once the form is saved. */
export function ImageField({
  label,
  value,
  onChange,
  optional,
}: {
  label: string
  value: Image | undefined
  onChange: (value: Image | undefined) => void
  optional?: boolean
}) {
  const src = useImageSrc(value)
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl)
  const [uploading, setUploading] = useState(false)
  const upload = async (file: File) => {
    setUploading(true)
    try {
      const response = await fetch(await generateUploadUrl(), {
        method: 'POST',
        headers: {'Content-Type': file.type},
        body: file,
      })
      if (!response.ok) throw new Error('Upload failed.')
      const {storageId} = (await response.json()) as {storageId: Id<'_storage'>}
      onChange({storageId})
    } catch (error) {
      toast.error(errorMessage(error))
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      <div className="flex items-start gap-3">
        <div className="grid aspect-[16/10] w-48 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-ink">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary upload
            <img src={src} alt="" className="size-full object-cover object-top" />
          ) : (
            <ImagePlus className="size-6 text-muted/50" />
          )}
        </div>
        <div className="grid gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm hover:border-mint/60">
            {uploading ? 'Uploading…' : src ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void upload(file)
                e.target.value = ''
              }}
            />
          </label>
          {optional && value && (
            <button type="button" className="text-left text-xs text-red-300 hover:underline" onClick={() => onChange(undefined)}>
              Remove
            </button>
          )}
          {value && !value.storageId && <span className="text-xs text-muted/70">From /public</span>}
        </div>
      </div>
    </div>
  )
}
