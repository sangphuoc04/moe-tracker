/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        income: "#22C55E",
        expense: "#EF4444",
        surface: "#1E1E2E",
        card: "#2A2A3E",
      },
    },
  },
  plugins: [],
};