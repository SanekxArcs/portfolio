import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import sharp from 'sharp'
import {ImageResponse} from 'next/og'
import {getDictionary} from '@/lib/i18n/dictionaries'
import type {Locale} from '@/lib/i18n/locales'
import type {StudioProject} from '@/lib/studio-content'

export const projectImageSize = {width: 1200, height: 630}

/**
 * A 1200x630 PNG card per public project: its name, kind and stack beside its own screenshot.
 * Social crawlers do not all read WebP, and ImageResponse cannot decode it, so the capture is
 * converted to PNG here at build time.
 */
// Screenshots live in Convex storage (a URL) or, before migration, in /public.
async function screenshot(source: string) {
  if (!source.startsWith('http')) return readFile(join(process.cwd(), 'public', source))
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Could not load ${source}: ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

export async function projectSocialImage(locale: Locale, project: StudioProject) {
  const d = getDictionary(locale)
  const source = project.media?.desktop ?? project.imageUrls?.[0]
  const [font, logo, shot] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf')),
    readFile(join(process.cwd(), 'public/logo.svg'), 'utf8'),
    source
      ? sharp(await screenshot(source))
          .resize(760, 528, {fit: 'cover', position: 'top'})
          .png()
          .toBuffer()
      : null,
  ])
  const mark = `data:image/svg+xml;base64,${Buffer.from(
    logo.replace('fill:#000000', 'fill:#a7ecc5'),
  ).toString('base64')}`
  const kind = project.petProject ? d.work.independent : d.work.commercial
  const stack = project.technologies?.slice(0, 3).join(' / ')

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#0d1210',
        color: '#edf2eb',
        fontFamily: 'Noto Sans',
      }}
    >
      <div style={{position: 'absolute', display: 'flex', left: 64, top: 56, alignItems: 'center', gap: 14}}>
        {/* ImageResponse embeds this SVG directly; next/image is not applicable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} alt="" width={34} height={40} />
        <span style={{fontSize: 22, letterSpacing: 2}}>O.D. EMPOWER</span>
      </div>
      <div style={{position: 'absolute', display: 'flex', flexDirection: 'column', left: 64, top: 200, width: 430}}>
        <span style={{fontSize: 20, color: '#a7ecc5', marginBottom: 18}}>{kind}</span>
        <span style={{fontSize: project.title && project.title.length > 18 ? 52 : 64, lineHeight: 1.08, letterSpacing: -2}}>
          {project.title}
        </span>
        {stack && <span style={{fontSize: 20, color: '#9ba99f', marginTop: 26}}>{stack}</span>}
      </div>
      {shot && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            left: 520,
            top: 72,
            width: 760,
            height: 528,
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid #2a3b30',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${shot.toString('base64')}`} alt="" width={760} height={528} />
        </div>
      )}
      <span style={{position: 'absolute', left: 64, bottom: 52, fontSize: 20, color: '#9ba99f'}}>Oleksandr Dzisiak</span>
    </div>,
    {
      ...projectImageSize,
      fonts: [{name: 'Noto Sans', data: font, weight: 400, style: 'normal'}],
    },
  )
}
