/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;

