import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@supabase/supabase-js'],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common');
    }
    return config;
  },
};

export default nextConfig;
