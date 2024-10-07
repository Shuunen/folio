/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
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
