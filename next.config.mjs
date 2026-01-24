/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/my-pages',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
