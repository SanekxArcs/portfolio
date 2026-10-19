import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  experimental: {viewTransition: true},
  compiler: {styledComponents: true},
  turbopack: {root: __dirname},
  // Assets are bundled locally during the design phase.
  images: {formats: ['image/avif', 'image/webp']},
}

export default nextConfig
