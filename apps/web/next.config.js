/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/auth', '@repo/database'],
  // images: {
  //   remotePatterns: [new URL(process.env.AWS_CLOUDFRONT_URL)],
  // },
};

export default nextConfig;
