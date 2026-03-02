/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff7043", // FirstCry Orange
        secondary: "#2c3e50", // FirstCry Dark Blue
      }
    },
  },
  plugins: [],
}