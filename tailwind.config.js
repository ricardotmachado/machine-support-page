/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b9ccff',
          300: '#85a5ff',
          400: '#4d74ff',
          500: '#1a44ff',
          600: '#0028f5',
          700: '#001de0',
          800: '#0019b5',
          900: '#00158e',
        },
      },
    },
  },
  plugins: [],
}

