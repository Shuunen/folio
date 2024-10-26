const svgRegex = /\.svg$/i
const urlRegex = /url/

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
  webpack(config) {
    // @ts-expect-error unknown type here
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: svgRegex,
        resourceQuery: urlRegex, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: svgRegex,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, urlRegex] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = svgRegex

    return config
  },
}

export default nextConfig
