// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Let the build succeed even if there are ESLint errors
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Let the build succeed even if there are TS type errors
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
