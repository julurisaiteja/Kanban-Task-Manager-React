/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kanban: {
          bg: "#101615",
          card: "#18211f",
          border: "#34423e",
          primary: "#d28a36",
          primarySoft: "#af6328",
          accent: "#39b8a7",
        },
      },
      boxShadow: {
        glow: "0 0 32px rgba(210, 138, 54, 0.24)",
      },
    },
  },
  plugins: [],
};