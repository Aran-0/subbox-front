/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
    content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0ea5e9',
        'primary-dark': '#0284c7',
        'secondary': '#10b981',
        'accent': '#f97316',
        'success': '#22c55e',
        'danger': '#f43f5e',
        'dark': '#1e293b',
        'dark-light': '#334155',
      },

      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'noto': ['Noto Sans Arabic', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

