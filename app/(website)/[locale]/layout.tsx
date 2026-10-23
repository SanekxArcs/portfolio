import {StudioTransitions, ViewRegion} from '@/components/studio/transitions'
import type {Metadata, Viewport} from 'next'
import {Noto_Sans, Geist_Mono} from 'next/font/google'
import {notFound} from 'next/navigation'
import {GoogleAnalytics} from '@next/third-parties/google'
import {ThemeProvider} from '@/components/theme-provider'
import {ReducedMotionProvider} from '@/components/reduced-motion-provider'
import {StudioHeader} from '@/components/studio/header'
import {StudioFooter} from '@/components/studio/footer'
import {PageMotion} from '@/components/studio/page-motion'
import {BrandCursor} from '@/components/studio/brand-cursor'
import {StudioBackgroundScene} from '@/components/studio/background-scene'
import {TerrainField} from '@/components/studio/terrain-field'
import {getDictionary} from '@/lib/i18n/dictionaries'
import {isLocale, locales} from '@/lib/i18n/locales'
import {getLocalizedProfile} from '@/lib/studio-content'
import {studioMetadata} from '@/lib/studio-metadata'
import {siteUrl} from '@/lib/site'
import '../globals.css'
import '@/components/studio/studio.css'

const sans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
})
const mono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark light',
  // Matches the page ground in each theme.
  themeColor: [
    {media: '(prefers-color-scheme: dark)', color: '#0d1210'},
    {media: '(prefers-color-scheme: light)', color: '#f7f8f4'},
  ],
}
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({locale}))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  if (!isLocale(locale)) return {}
  return {
    ...studioMetadata(locale),
    metadataBase: new URL(siteUrl),
    applicationName: 'O.D. EMPOWER',
    authors: [{name: 'Oleksandr Dzisiak'}],
    manifest: '/manifest.json',
    formatDetection: {telephone: false},
  }
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale),
    profile = getLocalizedProfile(locale)
  return (
    <html lang={locale} className={sans.variable} suppressHydrationWarning>
      <body className={mono.variable + ' studio-site antialiased'} id="top">
        <ReducedMotionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <TerrainField />
            <StudioTransitions
              locale={locale}
              chrome={
                <>
                  <a className="studio-skip" href="#main-content">
                    {d.nav.skip}
                  </a>
                  <ViewRegion name="studio-header" kind="chrome">
                    <StudioHeader
                      locale={locale}
                      d={d}
                      contactLabels={locales.map(
                        (language) => getDictionary(language).nav.contact,
                      )}
                      logo={profile.logoUrl}
                    />
                  </ViewRegion>
                </>
              }
            >
              <ViewRegion name="studio-page">
                <main id="main-content" className="studio-main">
                  {children}
                </main>
              </ViewRegion>
              <ViewRegion name="studio-footer" kind="chrome">
                <StudioFooter locale={locale} d={d} profile={profile} />
              </ViewRegion>
              <PageMotion />
              <StudioBackgroundScene />
            </StudioTransitions>
            <BrandCursor />
          </ThemeProvider>
        </ReducedMotionProvider>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  )
}
