import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's1.ppllstatics.com',
        pathname: '/elcorreo/**',
      },
      {
        protocol: 'https',
        hostname: 's2.ppllstatics.com',
        pathname: '/elcorreo/**',
      },
      {
        protocol: 'https',
        hostname: 's3.ppllstatics.com',
        pathname: '/elcorreo/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https', // Para permitir imagenes de cualquier fuente en wikidata
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
