import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#0f6abf",
          700: "#0b4d8a",
          900: "#072946"
        }
      }
    }
  },
  plugins: []
};

export default config;
