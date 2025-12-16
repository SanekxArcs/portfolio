import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

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
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-emerald-950/5`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={true}
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
          <SanityLive />
        </ThemeProvider>
      </body>
    </html>
  );
}
