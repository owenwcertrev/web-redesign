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
        primary: {
          DEFAULT: '#5B8DEF',
          hover: '#4F9CF9',
        },
        verification: {
          DEFAULT: '#A7C4BC',
          light: '#DBF0E4',
          dark: '#2F6050',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          secondary: '#F8F7F5',
        },
        charcoal: '#3A3A3A',
        accent: '#F4E4E6',
        alert: '#F59E0B',
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
