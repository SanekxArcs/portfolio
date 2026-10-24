import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // inlineCss: the stylesheet ships inside the HTML, so first paint waits on no CSS request.
  experimental: {viewTransition: true, inlineCss: true},
  turbopack: {root: __dirname},
  images: {
    formats: ['image/avif', 'image/webp'],
    // Screenshots uploaded through the admin are served from Convex storage.
    remotePatterns: [{protocol: 'https', hostname: '*.convex.cloud', pathname: '/api/storage/**'}],
  },
}

export default nextConfig
