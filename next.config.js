/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
module.exports = {
    images: {
      // domains: ['images.unsplash.com', 'cdn.pixabay.com', 'fotorgasm-public-data.s3.ap-southeast-1.amazonaws.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fotorgasm-public-data.s3.ap-southeast-1.amazonaws.com',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'cdn.pixabay.com',
          pathname: '**',
        },
      ]
    },
  }