import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['@disaster/types', '@disaster/validation', '@disaster/config'],
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
export default nextConfig;
