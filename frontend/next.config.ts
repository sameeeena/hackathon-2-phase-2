import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set the root directory to resolve workspace warnings about multiple lockfiles
  turbopack: {
    root: process.cwd(), // Use absolute path to resolve workspace warnings
  },
};

export default nextConfig;
