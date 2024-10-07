import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // 'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    // 'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    // require('flowbite/plugin'),
  ],
  safelist: [
    {
      pattern: /(accent|primary)-\d/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // http://vis4.net/palettes/#/21|d|000000,ff7c27,ffffff|ffffff,005fb4,000000|0|0
        accent: {
          100: '#ffe5d4',
          200: '#ffcba9',
          300: '#ffb07e',
          400: '#ff9652',
          500: '#ff7c27',
          600: '#cc631f',
          700: '#994a18',
          800: '#663210',
          900: '#331908',
        },
        primary: {
          100: '#ccdff0',
          200: '#99bfe1',
          300: '#669fd2',
          400: '#337fc3',
          500: '#005fb4',
          600: '#004c90',
          700: '#00396c',
          800: '#002648',
          900: '#001324',
        },
      },
    },
  },
}
export default config
