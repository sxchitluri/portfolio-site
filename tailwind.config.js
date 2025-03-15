/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./css/**/*.css", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#0E0E0C",
        accent: "#262626",
        "primary-light": "#E8E8E3",
      },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"],
        display: ["Public Sans", "sans-serif"],
      },
      fontSize: {
        huge: [
          "clamp(2.5rem, 6vw, 4.5rem)",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          },
        ],
      },
      spacing: {
        section: "clamp(4rem, 10vw, 8rem)",
      },
    },
  },
  plugins: [],
};
