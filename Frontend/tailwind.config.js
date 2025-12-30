/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        player: {
          DEFAULT: '#f6c85f'
        },
        bot: {
          DEFAULT: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
