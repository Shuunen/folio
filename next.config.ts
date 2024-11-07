/* eslint-disable jsdoc/require-jsdoc */

import type { NextConfig } from 'next'

const svgRegex = /\.svg$/iu
const urlRegex = /url/u

const nextConfig: NextConfig = {
  /* eslint-disable @typescript-eslint/require-await, @typescript-eslint/naming-convention */
  // biome-ignore lint/suspicious/useAwait: it's ok buddy ( ͡° ͜ʖ ͡°)
  async redirects() {
    return [
      // redirect url without language to default language
      {
        destination: '/en',
        permanent: true,
        source: '/',
      },
      // redirect url with non-handled language to default language
      {
        destination: '/en/:path*',
        permanent: true,
        source: '/:lang((?!en|fr).*)/:path*',
      },
    ]
  },
  /* eslint-enable @typescript-eslint/require-await, @typescript-eslint/naming-convention */
  webpack(config) {
    /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    // @ts-expect-error unknown type here
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        resourceQuery: urlRegex, // *.svg?url
        test: svgRegex,
      },
      // Convert all other *.svg imports to React components
      {
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, urlRegex] }, // exclude if *.svg?url
        test: svgRegex,
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = svgRegex

    return config
    /* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
  },
}

export default nextConfig
