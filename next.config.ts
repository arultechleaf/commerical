import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Let a phone on the same Wi-Fi open the laptop's dev server (http://192.168.x.x:3000).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
    // Phone photos are several MB; the default Server Action limit is only 1 MB.
    serverActions: { bodySizeLimit: "10mb" },
  },
  async redirects() {
    return [{ source: "/policies/terms-of-service", destination: "/policies/terms-and-conditions", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
