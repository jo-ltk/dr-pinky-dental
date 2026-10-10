import type { Config } from "tailwindcss";

// Coordinated luxury purple and gold palette for Dr. Pinky Varghese
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#26082F",               // Deep plum background
        "bg-2": "#3B1048",           // Primary purple main surfaces
        surface: "#3B1048",          // Primary purple
        royal: "#51145F",            // Royal purple for gradients / secondary
        deep: "#26082F",             // Deep plum
        gold: "#D4AF6A",             // Metallic gold for buttons, borders, highlights
        "gold-champagne": "#F5DDA5", // Champagne gold for lighting & text accents
        "gold-dark": "#9C6B32",      // Dark gold for depth & shadows
        cream: "#FFF5E6",            // Cream white for readable text
        muted: "rgba(255, 245, 230, 0.72)",
        line: "rgba(212, 175, 106, 0.18)",
        "line-strong": "rgba(212, 175, 106, 0.36)",
      },
      fontFamily: {
        sans: ['"Outfit Variable"', "Outfit", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        hero: "-0.035em",
        tight2: "-0.02em",
        label: "0.18em",
      },
      maxWidth: {
        page: "1360px",
      },
      boxShadow: {
        gold: "0 10px 30px -10px rgba(212, 175, 106, 0.45)",
        "gold-lg": "0 20px 50px -15px rgba(212, 175, 106, 0.55)",
        royal: "0 20px 60px -20px rgba(81, 20, 95, 0.75)",
      },
    },
  },
  plugins: [],
};
export default config;
