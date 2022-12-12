/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'pont-chaban': "url('/assets/fonts/pontchaban-delmas.jpg')",
    },
  },
  plugins: [],
}
