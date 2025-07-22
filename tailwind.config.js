module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          400: "#B42127",
        },
        gray: {
          700: "#292929",
          200: "#CACACA",
        },
      },
      fontFamily: {
        helvetica: ["Helvetica", "Arial", "sans-serif"],
        hakgyo: ["Hakgyo", "sans-serif"],
        wantedsans: ["WantedSans", "sans-serif"],
        ibm: ["IBM", "sans-serif"],
        hakgyoansim: ['"Hakgyoansim Bareondotum"', "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
