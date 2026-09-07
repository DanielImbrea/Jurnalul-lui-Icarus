import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0D0C",
        charcoal: "#191715",
        smoke: "#2A2724",
        ash: "#8C857C",
        mist: "#C9C2B8",
        bone: "#EFEAE1",
        paper: "#F6F3EC",
        wine: "#5A1E2A",
        "wine-light": "#7A3140",
        ember: "#A9875D"
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        wideish: "0.02em"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem"
      },
      maxWidth: {
        prose: "68ch"
      },
      backgroundImage: {
        "grain": "url('/grain.svg')"
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-2%,-1%,0)" }
        }
      },
      animation: {
        reveal: "reveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        drift: "drift 40s linear infinite alternate"
      }
    }
  },
  plugins: []
};

export default config;
