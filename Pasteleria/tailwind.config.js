/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#FFC0CB', 
        darkPink: '#FF1493',
      },
    },
  },
  plugins: [],
}