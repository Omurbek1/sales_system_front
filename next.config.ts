import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // включает строгий режим React
  swcMinify: true, // быстрее сборка
  experimental: {
    serverActions: {
        
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // отключает ошибки ESLint при сборке
  },
};

export default nextConfig;
