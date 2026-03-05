/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: false,
    responseLimit: '10mb'
  },
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
};

module.exports = nextConfig;
