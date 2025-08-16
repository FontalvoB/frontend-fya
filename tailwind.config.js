export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d8f1ff",
          200: "#b7e7ff",
          300: "#86d8ff",
          400: "#4ec1ff",
          500: "#1aa7ff",
          600: "#0086e6",
          700: "#0069b4",
          800: "#044f86",
          900: "#083f69"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
};
