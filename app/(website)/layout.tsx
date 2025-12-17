import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import LightRays from "@/components/bg";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import { WelcomeToast } from "@/components/welcome-toast";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "dark",
  themeColor: "black",
};

export const metadata: Metadata = {
  title: "Oleksandr Dzisiak",
  description: "Portfolio Website",
  applicationName: "O-D.DEV",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "O-D.DEV",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ["portfolio", "developer", "web development"],
  authors: [{ name: "Oleksandr Dzisiak" }],
  openGraph: {
    title: "Oleksandr Dzisiak",
    description: "Portfolio Website",
    type: "website",
  },
  icons: {
    icon: "/web-app-manifest-192x192.png",
    apple: "/web-app-manifest-192x192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-emerald-950/5`}
      >
        <ReducedMotionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={true}
          >
            <Navbar />
            <main className="min-h-screen relative">
              <div className="absolute h-screen top-0 -z-10 inset-x-0 overflow-hidden pointer-events-none mask-to-bottom">
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
              </div>
              {children}
            </main>
            <Footer />
            <WelcomeToast />
            <Toaster />
            <SanityLive />
          </ThemeProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
