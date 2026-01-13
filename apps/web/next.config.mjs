/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],

  experimental: {
    reactCompiler: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://turbodoc.api.sharad.fun"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
