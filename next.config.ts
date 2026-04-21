import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'e-cdns-images.dzcdn.net', // Deezer cover art
      },
      {
        protocol: 'https',
        hostname: 'api.deezer.com',
      },
    ],
  },
}

export default nextConfig
