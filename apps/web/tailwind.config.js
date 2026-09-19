/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0F1115',
        panel: '#171A21',
        line: '#262B36',
        ink: '#E7E9EE',
        muted: '#8A93A3',
        positive: '#3FB68B',
        negative: '#E2604F',
        accent: '#5B8CFF',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
