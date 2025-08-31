import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Dynamic subdomain configuration for barbershops
  async rewrites() {
    return [
      // Handle direct access to /public/[slug] (current structure)
      {
        source: '/public/:businessSlug',
        destination: '/public/[businessSlug]',
      },
      // Handle clean URLs like /[businessSlug] (for future use)
      {
        source: '/:businessSlug',
        destination: '/public/:businessSlug',
      },
    ];
  },
};

export default nextConfig;
