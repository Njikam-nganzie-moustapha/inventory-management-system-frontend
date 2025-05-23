/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Indigo color from the original site
        background: "#f9fafb",
        secondary: "#6366f1",
        accent: "#ef4444",
      },
    },
  },
  plugins: [],
}
