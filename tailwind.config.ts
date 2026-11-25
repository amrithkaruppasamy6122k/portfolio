import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040405',
          900: '#08090B',
          850: '#0F1014',
          800: '#16181E',
          700: '#21242C',
        },
        smoke: {
          50: '#F5F3EF',
          100: '#E5E2DC',
          200: '#C5C2BC',
          300: '#9A9895',
          400: '#717176',
          500: '#4B4D54',
          600: '#2D3038',
        },
        ember: {
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA6C1F',
          600: '#C84E0F',
          700: '#8F3208',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        cinematic: '0 24px 64px -16px rgba(0, 0, 0, 0.85)',
        ember: '0 0 32px -8px rgba(234, 108, 31, 0.22)',
        subtle: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.35rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
