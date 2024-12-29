/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@orbitblu/common'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // Add any custom webpack configuration here
    return config;
  },
};

module.exports = nextConfig; 