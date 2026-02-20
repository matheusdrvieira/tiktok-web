import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/studio",
    "@remotion/studio-shared",
    "esbuild",
    "@esbuild/linux-x64",
  ],
};

export default nextConfig;
