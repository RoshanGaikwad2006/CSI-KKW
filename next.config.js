/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  async redirects() {
    return [
      {
        source: '/c2c-re',
        destination: '/c2c-register',
        permanent: true,
      },
      {
        source: '/c2c-reg',
        destination: '/c2c-register',
        permanent: true,
      },
      {
        source: '/c2c',
        destination: '/c2c-register',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig