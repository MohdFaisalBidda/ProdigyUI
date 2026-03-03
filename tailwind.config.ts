import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "firePulse": {
          "0%, 100%": {
            "transform": "translate(-50%, -50%) scaleY(1)",
            opacity: 0.5
          },

          "25%": {
            "transform": "translate(-50%, -50%) scaleY(1.2)",
            opacity: 0.4
          },

          "50%": {
            "transform": "translate(-50%, -50%) scaleY(0.9)",
            opacity: 0.35
          },

          "75%": {
            "transform": "translate(-50%, -50%) scaleY(1.1)",
            opacity: 0.5
          }
        }
      },
      animation: {
        "firePulse": "firePulse 2s ease-in-out infinite"
      },
    },
  },
};

export default config;