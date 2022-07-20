/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
const config = {
  darkMode: 'class',
  content: [
    './pages/.vitepress/**/*.{js,ts,vue}',
    './pages/**/*.md',
    './components/**/*.vue',
  ],
  safelist: [
    {
      pattern: /(primary|accent)-\d/,
    },
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      colors: { // http://vis4.net/palettes/#/21|d|000000,ff7c27,ffffff|ffffff,005fb4,000000|0|0
        accent: {
          900: '#331908',
          800: '#663210',
          700: '#994a18',
          600: '#cc631f',
          500: '#ff7c27',
          400: '#ff9652',
          300: '#ffb07e',
          200: '#ffcba9',
          100: '#ffe5d4',
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

module.exports = config
