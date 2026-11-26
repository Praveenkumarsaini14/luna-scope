/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#090d16',
          850: '#0f172a',
          800: '#131e33',
          700: '#1e293b',
          600: '#334155',
        },
        nasa: {
          blue: '#0B3D91',
          red: '#FC3D21',
          cyan: '#38bdf8',
          gold: '#f59e0b',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

