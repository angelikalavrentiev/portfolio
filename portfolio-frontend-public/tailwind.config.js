/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      primary: {
          light: '#aba9bc',
          dark: '#777586',
        },
        background: {
          light: '#d4d2ff',
          dark: '#10183fff',
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        }
    },
  },
  plugins: [],
}

