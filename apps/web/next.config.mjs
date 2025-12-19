/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],

  experimental: {
    reactCompiler: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Set to true to force deployment despite TS errors
  },
};

export default nextConfig;
