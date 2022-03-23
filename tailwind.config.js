/* eslint-disable unicorn/prefer-module */

/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
var config = {
  content: [
    './pages/.vitepress/**/*.{js,ts,vue}',
    './pages/**/*.md',
    './components/**/*.vue',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

module.exports = config
