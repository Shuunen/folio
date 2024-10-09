/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // biome-ignore lint/suspicious/useAwait: it's ok buddy ( ͡° ͜ʖ ͡°)
  async redirects() {
    return [
      // redirect url without language to default language
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
      // redirect url with non-handled language to default language
      {
        source: '/:lang((?!en|fr).*)/:path*',
        destination: '/en/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
