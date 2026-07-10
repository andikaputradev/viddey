import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: process.env.MAX_UPLOAD_SIZE ?? '2gb',
    },
  },
  async headers() {
    return [
      {
        source: '/api/stream/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

export default nextConfig
