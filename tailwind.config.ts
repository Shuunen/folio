import flowbite from 'flowbite-react/tailwind'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  plugins: [flowbite.plugin()],
  safelist: [
    {
      pattern: /(?:accent|primary)-\d/u,
    },
  ],
  theme: {
    extend: {
      animation: {
        'slide-down': 'slide-down 0.3s ease-in-out',
        'spin-zoom': 'spin-zoom 114s linear infinite alternate',
      },
      colors: {
        // http://vis4.net/palettes/#/21|d|000000,ff7c27,ffffff|ffffff,005fb4,000000|0|0
        accent: {
          50: '#fff2e9',
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
        auchan: '#D6170D',
        'collectif-energie': '#0147BC',
        enedis: '#93C223',
        lyf: '#FF606A',
        'ouest-france': '#DD2629',
        primary: {
          50: '#f0f5f9',
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
        'we-save': '#3CECA3',
      },
      height: {
        100: '28rem',
        110: '32rem',
        120: '36rem',
        130: '40rem',
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'spin-zoom': {
          '0%': { transform: 'rotate(0deg) scale(2)' },
          '100%': { transform: 'rotate(360deg) scale(3)' },
        },
      },
      width: {
        100: '28rem',
        110: '32rem',
        120: '36rem',
        130: '40rem',
      },
    },
  },
}
export default config
