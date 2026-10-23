import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  // inlineCss: the stylesheet ships inside the HTML, so first paint waits on no CSS request.
  experimental: {viewTransition: true, inlineCss: true},
  turbopack: {root: __dirname},
  // Assets are bundled locally during the design phase.
  images: {formats: ['image/avif', 'image/webp']},
}

export default nextConfig
