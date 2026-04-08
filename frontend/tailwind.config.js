/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        predator: "#ffffff",
        darkBg: "#312d2d",
      },
    },
  },
  plugins: [],
};
