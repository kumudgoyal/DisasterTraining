import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['@disaster/types', '@disaster/validation', '@disaster/config'],
  output: 'standalone',
};
export default nextConfig;
