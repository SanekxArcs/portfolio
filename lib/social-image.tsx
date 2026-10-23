import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {ImageResponse} from 'next/og'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale, languageLabels} from '@/lib/i18n/locales'
import {siteUrl} from '@/lib/site'

export const size = {width: 1200, height: 630}
export const contentType = 'image/png'
export const alt = 'O.D. EMPOWER — Oleksandr Dzisiak'

type Props = {params: Promise<{locale: string}>}

export default async function Image({params}: Props) {
  const {locale: requestedLocale} = await params
  const locale = isLocale(requestedLocale) ? requestedLocale : 'en'
  const d = getDictionary(locale)
  // Bundle the real brand mark and a Cyrillic-capable font. No remote requests
  // are needed when a social crawler asks for this image.
  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'public/logo.svg'), 'utf8'),
    readFile(join(process.cwd(), 'public/fonts/NotoSans-Regular.ttf')),
  ])
  const mark = `data:image/svg+xml;base64,${Buffer.from(
    logo.replace('fill:#000000', 'fill:#a7ecc5'),
  ).toString('base64')}`
  const name = locale === 'uk' ? 'Олександр Дзісяк' : 'Oleksandr Dzisiak'
  const remoteLabel = {en: 'Working remotely', pl: 'Pracuję zdalnie', uk: 'Працюю віддалено'}[locale]
  const domain = new URL(siteUrl).hostname.replace(/^www\./, '')

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
      <div style={{position: 'absolute', display: 'flex', right: -120, top: -100, width: 700, height: 800, background: 'radial-gradient(ellipse at center, #164934 0%, #0d1210 68%)'}} />
      {[440, 580, 720].map((diameter) => (
        <div key={diameter} style={{position: 'absolute', display: 'flex', left: 968 - diameter / 2, top: 290 - diameter / 2, width: diameter, height: diameter, border: '1px solid #244336', borderRadius: '50%'}} />
      ))}
      <div style={{position: 'absolute', display: 'flex', left: 64, top: 52, alignItems: 'center', gap: 14}}>
        <div style={{display: 'flex', width: 9, height: 9, background: '#a7ecc5', borderRadius: '50%'}} />
        <span style={{fontSize: 23, letterSpacing: 3}}>O.D. EMPOWER</span>
      </div>
      <div style={{position: 'absolute', display: 'flex', right: 64, top: 48, padding: '8px 15px', border: '1px solid #3b5949', borderRadius: 24, fontSize: 16, color: '#a7ecc5', letterSpacing: 2}}>
        {languageLabels[locale]}
      </div>
      <div style={{position: 'absolute', display: 'flex', left: 64, top: 183, width: 710, flexDirection: 'column'}}>
        <span style={{fontSize: 20, color: '#9ba99f', marginBottom: 23}}>{name}</span>
        <div style={{display: 'flex', flexDirection: 'column', fontSize: 58, lineHeight: 1.16, letterSpacing: -2.5}}>
          <span>{d.hero.line1}</span>
          <span style={{color: '#a7ecc5'}}>{d.hero.line2}</span>
        </div>
        <span style={{fontSize: 20, color: '#9ba99f', marginTop: 28}}>{d.hero.specialty}</span>
      </div>
      {/* A subtle offset gives the original vector mark sculptural depth. */}
      {[{x: 851, y: 167, opacity: 0.12}, {x: 845, y: 161, opacity: 0.25}, {x: 839, y: 155, opacity: 1}].map(({x, y, opacity}) => (
        // ImageResponse embeds this SVG directly; next/image is not applicable.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={x} src={mark} alt="" width={270} height={314} style={{position: 'absolute', left: x, top: y, opacity}} />
      ))}
      <div style={{position: 'absolute', display: 'flex', left: 64, right: 64, bottom: 48, borderTop: '1px solid #2a3b30', paddingTop: 23, alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontSize: 18, color: '#9ba99f'}}>{remoteLabel}</span>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, color: '#a7ecc5'}}><span>{domain}/{locale}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="#a7ecc5" strokeWidth="2" /></svg></div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{name: 'Noto Sans', data: font, weight: 400, style: 'normal'}],
    },
  )
}


