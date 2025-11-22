/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfill Node.js modules for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: false,
        crypto: false,
        stream: false,
        util: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

export default nextConfig
