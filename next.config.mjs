/** @type {import('next').NextConfig} */
const nextConfig = {
    // Let the build succeed even if there are ESLint or TS errors.
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
