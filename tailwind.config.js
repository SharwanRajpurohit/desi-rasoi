/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C45C26',
          dark: '#9A4520',
          light: '#E8A06A',
        },
        marigold: '#E8A317',
        royal: '#B91C1C',
        indigo: {
          DEFAULT: '#1E3A5F',
          light: '#2D5F8A',
        },
        sand: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E6D0',
        },
        warm: {
          gray: '#78716C',
        },
        charcoal: '#292524',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(196, 92, 38, 0.08)',
      },
    },
  },
  plugins: [],
}
