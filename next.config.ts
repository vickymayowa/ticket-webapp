import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zuyzoxkdnyentxxydkvp.supabase.co",
        pathname: "/**",
      },
    ],
  },

  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
