import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the multiple-lockfile warning for Turbopack
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
