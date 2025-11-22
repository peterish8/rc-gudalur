import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rotary Emerald Glass Theme
        rotary: {
          primary: "#006341", // Rotary Emerald - Brand Core
          secondary: "#228B22", // Forest Accent - Depth
          accent: "#50C878", // Jewel Green - Luxury Tone
          soft: "#87A96B", // Sage Mist - Background & Glass
          dark: "#013220", // Deep Canopy - Contrast & Text
          neon: "#00FF7F", // Electric Emerald - Highlight/Glow
        },
        // Updated color mapping for easier access
        "rotary-green-primary": "#006341",
        "rotary-green-secondary": "#228B22",
        "rotary-green-accent": "#50C878",
        "rotary-green-soft": "#87A96B",
        "rotary-green-dark": "#013220",
        "rotary-green-neon": "#00FF7F",
        // Semantic color mapping
        brand: {
          DEFAULT: "#006341",
          hover: "#228B22",
          light: "#50C878",
          soft: "#87A96B",
          dark: "#013220",
          glow: "#00FF7F",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#006341",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#228B22",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#50C878",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      animation: {
        "scroll-up": "scroll-up 20s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "scroll-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00FF7F" },
          "100%": { boxShadow: "0 0 20px #00FF7F, 0 0 30px #00FF7F" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
