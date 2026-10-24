import type {Metadata} from 'next'
import {ConvexAuthNextjsServerProvider} from '@convex-dev/auth/nextjs/server'
import {Toaster} from 'sonner'
import {ConvexClientProvider} from './providers'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin · O.D. EMPOWER',
  robots: {index: false, follow: false},
}

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className="dark">
        <body className="admin-root">
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster theme="dark" position="bottom-right" />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
