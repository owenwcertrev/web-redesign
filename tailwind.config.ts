import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Consumer Brand
        navy: {
          DEFAULT: '#0A1B3F',
          primary: '#0A1B3F',
        },
        lime: {
          DEFAULT: '#D4E157',
          highlight: '#D4E157',
        },
        coral: {
          DEFAULT: '#E8603C',
          action: '#E8603C',
          hover: '#D14E2A',
        },
        // Neutrals
        beige: {
          DEFAULT: '#E8E4DB',
          warm: '#E8E4DB',
        },
        gray: {
          light: '#F5F5F5',
        },
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        script: ['Allura', 'cursive'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '12': '12px',
        '14': '14px',
        '16': '16px',
      },
      boxShadow: {
        base: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}

export default config
