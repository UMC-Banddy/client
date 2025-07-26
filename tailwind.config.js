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
      animation: {
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
