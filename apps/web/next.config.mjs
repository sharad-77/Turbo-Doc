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
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://turbodoc.api.sharad.fun"}/api/v1/:path*`,
      },
      {
        source: "/api/dashboard/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://turbodoc.api.sharad.fun"}/api/dashboard/:path*`,
      },
      {
        source: "/api/jobs/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://turbodoc.api.sharad.fun"}/api/jobs/:path*`,
      },
    ];
  },
};

export default nextConfig;
