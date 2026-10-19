import {ImageResponse} from 'next/og'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale} from '@/lib/i18n/locales'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'
export const alt = 'O.D. EMPOWER — Oleksandr Dzisiak'
export default async function Image({
  params,
}: {
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  const d = getDictionary(isLocale(locale) ? locale : 'en')
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#0d1210',
        color: '#edf2eb',
        padding: 70,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{display: 'flex', fontSize: 30, color: '#a7ecc5'}}>
        O.D. EMPOWER / Oleksandr Dzisiak
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 68,
          letterSpacing: -3,
        }}
      >
        <span>{d.hero.line1}</span>
        <span style={{color: '#a7ecc5'}}>{d.hero.line2}</span>
      </div>
      <div style={{display: 'flex', fontSize: 22, color: '#9ba99f'}}>
        {d.hero.eyebrow}
      </div>
    </div>,
    size,
  )
}
