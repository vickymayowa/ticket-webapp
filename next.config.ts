import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vazmuhmzypgvmcxlkqfu.supabase.co",
        pathname: "/**",
      },
    ],
  },

  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
