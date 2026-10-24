'use client'

import {useState} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {toast} from 'sonner'
import {Download, FileText, RotateCcw, Upload} from 'lucide-react'
import {api} from '@/convex/_generated/api'
import type {Id} from '@/convex/_generated/dataModel'
import {Button, Section, errorMessage, useSave} from './fields'

type Slot = 'cv' | 'photo'
type Version = {name: string; size?: number; uploadedAt: number; url: string | null}

const slots: {slot: Slot; title: string; accept: string; hint: string}[] = [
  {slot: 'cv', title: 'CV file', accept: 'application/pdf', hint: 'PDF. Visitors download it from the experience page.'},
  {slot: 'photo', title: 'Profile photo', accept: 'image/*', hint: 'Square works best. Shown on the home and experience pages.'},
]

const formatSize = (bytes?: number) =>
  bytes === undefined ? '' : bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1e3)} KB`
const formatDate = (time: number) =>
  new Date(time).toLocaleString('en-GB', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})

/** Fetches the file so it saves under its own name; a cross-origin link would just open it. */
async function download(version: Version) {
  if (!version.url) return
  try {
    const response = await fetch(version.url)
    if (!response.ok) throw new Error('Download failed.')
    const href = URL.createObjectURL(await response.blob())
    const link = Object.assign(document.createElement('a'), {href, download: version.name})
    link.click()
    URL.revokeObjectURL(href)
  } catch (error) {
    toast.error(errorMessage(error))
  }
}

export function FileSlots() {
  const files = useQuery(api.admin.files)
  return (
    <Section title="Files">
      <p className="text-sm text-muted">
        Uploading replaces the live file. The last two versions are kept, so you can download them or put one back in a
        click.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {slots.map((item) => (
          <SlotCard key={item.slot} {...item} value={files?.[item.slot]} loading={files === undefined} />
        ))}
      </div>
    </Section>
  )
}

function SlotCard({
  slot,
  title,
  accept,
  hint,
  value,
  loading,
}: (typeof slots)[number] & {
  value: {current: Version; previous: Version[]} | null | undefined
  loading: boolean
}) {
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl)
  const replaceFile = useMutation(api.admin.replaceFile)
  const restoreFile = useMutation(api.admin.restoreFile)
  const {saving, run} = useSave()
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    setUploading(true)
    await run(async () => {
      const response = await fetch(await generateUploadUrl(), {
        method: 'POST',
        headers: {'Content-Type': file.type},
        body: file,
      })
      if (!response.ok) throw new Error('Upload failed.')
      const {storageId} = (await response.json()) as {storageId: Id<'_storage'>}
      await replaceFile({slot, storageId, name: file.name, contentType: file.type || undefined, size: file.size})
    }, `${title} replaced`)
    setUploading(false)
  }

  return (
    <div className="grid content-start gap-4 rounded-xl border border-line bg-ink/60 p-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-muted">{hint}</p>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : value ? (
        <div className="flex items-center gap-3">
          <Preview slot={slot} version={value.current} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-medium">
              <span className="truncate">{value.current.name}</span>
              <span className="shrink-0 rounded bg-mint/15 px-1.5 py-0.5 text-[10px] font-semibold text-mint uppercase">Live</span>
            </p>
            <p className="text-xs text-muted">
              {[formatSize(value.current.size), formatDate(value.current.uploadedAt)].filter(Boolean).join(' · ')}
            </p>
          </div>
          <Button variant="ghost" onClick={() => void download(value.current)} disabled={!value.current.url}>
            <Download className="size-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">No file yet.</p>
      )}

      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40">
        <Upload className="size-4" />
        {uploading ? 'Uploading…' : 'Upload new version'}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading || saving}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
            e.target.value = ''
          }}
        />
      </label>

      {!!value?.previous.length && (
        <div className="grid gap-2 border-t border-line pt-3">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Previous versions</p>
          {value.previous.map((version, index) => (
            <div key={`${version.uploadedAt}-${index}`} className="flex items-center gap-3">
              <Preview slot={slot} version={version} small />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{version.name}</p>
                <p className="text-xs text-muted">
                  {[formatSize(version.size), formatDate(version.uploadedAt)].filter(Boolean).join(' · ')}
                </p>
              </div>
              <button
                type="button"
                title="Download"
                aria-label={`Download ${version.name}`}
                className="rounded-md p-1.5 text-muted hover:bg-line hover:text-white"
                onClick={() => void download(version)}
              >
                <Download className="size-4" />
              </button>
              <button
                type="button"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs hover:border-mint/60 disabled:opacity-40"
                onClick={() => void run(() => restoreFile({slot, index}), `${title} restored`)}
              >
                <RotateCcw className="size-3.5" /> Use this
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Preview({slot, version, small}: {slot: Slot; version: Version; small?: boolean}) {
  const size = small ? 'size-9' : 'size-14'
  if (slot === 'photo' && version.url)
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file
      <img src={version.url} alt="" className={`${size} shrink-0 rounded-lg border border-line object-cover`} />
    )
  return (
    <div className={`${size} grid shrink-0 place-items-center rounded-lg border border-line bg-panel`}>
      <FileText className={small ? 'size-4 text-muted' : 'size-6 text-mint'} />
    </div>
  )
}
