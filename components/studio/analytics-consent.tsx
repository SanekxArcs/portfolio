'use client'

import {useSyncExternalStore} from 'react'
import {GoogleAnalytics} from '@next/third-parties/google'
import type {Dictionary} from '@/lib/i18n/dictionaries'

/**
 * GDPR-friendly analytics: nothing is requested from Google until the visitor allows it
 * (Consent Mode "basic"). The choice lives in localStorage and can be reopened from the footer.
 */
const KEY = 'studio-analytics-consent'
const CHANGE = 'studio:consent-change'
type Choice = 'granted' | 'denied' | 'unset'

const read = (): Choice => {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'granted' || value === 'denied' ? value : 'unset'
  } catch {
    return 'unset'
  }
}
const write = (value: Choice) => {
  try {
    if (value === 'unset') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, value)
  } catch {
    /* Private mode: the choice holds for this page view only. */
  }
  if (value !== 'granted') withdraw()
  window.dispatchEvent(new Event(CHANGE))
}
// Withdrawing consent after GA loaded: stop its storage and remove the cookies it set.
function withdraw() {
  const gtag = (window as Window & {gtag?: (...args: unknown[]) => void}).gtag
  gtag?.('consent', 'update', {analytics_storage: 'denied'})
  const domain = location.hostname.replace(/^www\./, '')
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (!name.startsWith('_ga')) continue
    for (const scope of ['', `;domain=.${domain}`, `;domain=${location.hostname}`])
      document.cookie = `${name}=;max-age=0;path=/${scope}`
  }
}
const subscribe = (notify: () => void) => {
  window.addEventListener(CHANGE, notify)
  window.addEventListener('storage', notify)
  return () => {
    window.removeEventListener(CHANGE, notify)
    window.removeEventListener('storage', notify)
  }
}
// The server renders nothing; the banner appears after hydration, so it never blocks first paint.
const useChoice = () => useSyncExternalStore(subscribe, read, () => null)

export function AnalyticsConsent({gaId, d}: {gaId: string; d: Dictionary}) {
  const choice = useChoice()
  if (choice === 'granted') return <GoogleAnalytics gaId={gaId} />
  if (choice !== 'unset') return null
  return (
    <section className="consent-banner" aria-label={d.consent.title}>
      <p>{d.consent.text}</p>
      <div className="consent-actions">
        <button type="button" className="studio-button primary" onClick={() => write('granted')}>
          {d.consent.accept}
        </button>
        <button type="button" className="studio-button secondary" onClick={() => write('denied')}>
          {d.consent.decline}
        </button>
      </div>
    </section>
  )
}

/** Footer control that clears the stored choice, so the banner asks again. */
export function ConsentSettingsButton({label}: {label: string}) {
  return (
    <button type="button" className="consent-settings" onClick={() => write('unset')}>
      {label}
    </button>
  )
}
