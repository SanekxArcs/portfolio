import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    loader: 'custom',
    loaderFile: './sanity/lib/image-loader.ts',
    formats: ['image/avif', 'image/webp'],
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
