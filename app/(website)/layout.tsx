import type {Metadata, Viewport} from 'next'
import {Geist_Mono, Noto_Sans} from 'next/font/google'

import {GoogleAnalytics} from '@next/third-parties/google'
import {Toaster} from '@/components/ui/sonner'
import {siteUrl, siteTitle, siteDescription} from '@/lib/site'
import {ThemeProvider} from '@/components/theme-provider'
import {Footer} from '@/components/Footer/footer'
import Navbar from '@/components/Navbar/navbar'
import LightRays from '@/components/light-rays-lazy'
import {ReducedMotionProvider} from '@/components/reduced-motion-provider'
import {WelcomeToast} from '@/components/welcome-toast'
import {SnowfallEffect} from '@/components/snowfall'
import {AiChatWidget} from '@/components/ai-chat-widget'

import './globals.css'

const notoSans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
  themeColor: 'black',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {canonical: '/'},
  title: siteTitle,
  description: siteDescription,
  applicationName: 'O-D.DEV',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'O-D.DEV',
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ['portfolio', 'developer', 'web development'],
  authors: [{name: 'Oleksandr Dzisiak'}],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    type: 'website',
  },
  icons: {
    icon: '/web-app-manifest-192x192.png',
    apple: '/web-app-manifest-192x192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased dark:bg-emerald-950/5`}>
        <ReducedMotionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <Navbar />
            <main className="relative min-h-screen">
              <div className="mask-to-bottom pointer-events-none absolute inset-x-0 top-0 -z-10 h-screen overflow-hidden">
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#00ffff"
                  raysSpeed={1.5}
                  lightSpread={0.8}
                  rayLength={1.2}
                  followMouse={true}
                  mouseInfluence={0.1}
                  noiseAmount={0.1}
                  distortion={0.05}
                  className="custom-rays"
                />
                <SnowfallEffect />
              </div>
              {children}
            </main>
            <Footer />
            <WelcomeToast />
            <AiChatWidget />
            <Toaster />
          </ThemeProvider>
        </ReducedMotionProvider>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />}
    </html>
  )
}
