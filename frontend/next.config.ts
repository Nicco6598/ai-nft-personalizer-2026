import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    // Allow blob: URLs for local image previews
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gateway.pinata.cloud",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Required to bundle three.js correctly with App Router
  transpilePackages: ["three"],
  // Pin Turbopack workspace root to THIS directory to avoid picking up
  // stray pnpm-lock.yaml files from parent directories.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
