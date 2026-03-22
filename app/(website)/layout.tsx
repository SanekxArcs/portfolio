import type {Metadata, Viewport} from 'next'
import {Geist, Geist_Mono, Noto_Sans} from 'next/font/google'

import {GoogleAnalytics} from '@next/third-parties/google'
import {Toaster} from '@/components/ui/sonner'
import {SanityLive} from '@/sanity/lib/live'
import {ThemeProvider} from '@/components/theme-provider'
import {Footer} from '@/components/Footer/footer'
import Navbar from '@/components/Navbar/navbar'
import {ReducedMotionProvider} from '@/components/reduced-motion-provider'
import {WelcomeToast} from '@/components/welcome-toast'
import {VisualEffects} from '@/components/visual-effects'

import './globals.css'

const notoSans = Noto_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
  title: 'Oleksandr Dzisiak',
  description: 'Portfolio Website',
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
    title: 'Oleksandr Dzisiak',
    description: 'Portfolio Website',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-emerald-950/5`}
      >
        <ReducedMotionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <main className="relative min-h-screen">
              <VisualEffects />
              {children}
            </main>
            <Footer />
            <WelcomeToast />
            <Toaster />
            <SanityLive />
          </ThemeProvider>
        </ReducedMotionProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''} />
    </html>
  )
}
