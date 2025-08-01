// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }, // Move only half, because content is duplicated
        },
      },
      animation: {
        "slide-left": "slide-left 20s linear infinite",
      },
    },
  },
  plugins: [],
};
