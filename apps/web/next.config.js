/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@personal-website/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suyash-personal-website-dev.s3.us-east-2.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
