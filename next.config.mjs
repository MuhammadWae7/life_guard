/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Ensure ESLint errors are not ignored during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ensure TypeScript errors are not ignored during builds
    ignoreBuildErrors: false,
  },
  images: {
    // Enable Next.js image optimization
    domains: ['example.com'], // Replace with your image domains
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; object-src 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
