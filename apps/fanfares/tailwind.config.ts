import type { Config } from "tailwindcss"

function withOpacity(
  variableName: string
): (options: { opacityValue?: string }) => string {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        objective: ["Objective", "sans-serif"],
        heading: ["Catamaran", "sans-serif"],
        standard: ["Yrsa", "sans-serif"],
      },
      textColor: {
        skin: {
          base: withOpacity("--color-base")({ opacityValue: undefined }),
          muted: withOpacity("--color-muted")({ opacityValue: undefined }),
          inverted: withOpacity("--color-inverted")({
            opacityValue: undefined,
          }),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill")({ opacityValue: undefined }),
          "button-accent": withOpacity("--button-accent")({
            opacityValue: undefined,
          }),

          "button-accent-hover": withOpacity("--button-accent-hover")({
            opacityValue: undefined,
          }),
          "button-muted": withOpacity("--button-butted")({
            opacityValue: undefined,
          }),
          "button-default": withOpacity("--button-default")({
            opacityValue: undefined,
          }),
          "button-disabled": withOpacity("--button-disabled")({
            opacityValue: undefined,
          }),
          "button-muted-hover": withOpacity("--button-butted-hover")({
            opacityValue: undefined,
          }),
          "button-active": withOpacity("--button-active")({
            opacityValue: undefined,
          }),
          "button-muted-active": withOpacity("--button-butted-active")({
            opacityValue: undefined,
          }),
          "button-muted-focus": withOpacity("--button-butted-focus")({
            opacityValue: undefined,
          }),
          "button-muted-disabled": withOpacity("--button-butted-disabled")({
            opacityValue: undefined,
          }),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill")({
            opacityValue: undefined,
          }),
        },
      },
      colors: {
        textBase: withOpacity("--color-base")({
          opacityValue: undefined,
        }),
        textMuted: withOpacity("--color-muted")({
          opacityValue: undefined,
        }),
        textInverted: withOpacity("--color-inverted")({
          opacityValue: undefined,
        }),
        bgFill: withOpacity("--color-fill")({
          opacityValue: undefined,
        }),
        buttonDefault: withOpacity("--button-default")({
          opacityValue: undefined,
        }),
        buttonDisabled: withOpacity("--button-disabled")({
          opacityValue: undefined,
        }),
        buttonAccent: withOpacity("--button-accent")({
          opacityValue: undefined,
        }),
        buttonAccentHover: withOpacity("--button-accent-hover")({
          opacityValue: undefined,
        }),
        buttonMuted: withOpacity("--button-butted")({
          opacityValue: undefined,
        }),
        buttonMutedHover: withOpacity("--button-butted-hover")({
          opacityValue: undefined,
        }),
        buttonActive: withOpacity("--button-active")({
          opacityValue: undefined,
        }),
        buttonMutedActive: withOpacity("--button-butted-active")({
          opacityValue: undefined,
        }),
        buttonMutedFocus: withOpacity("--button-butted-focus")({
          opacityValue: undefined,
        }),
        buttonMutedDisabled: withOpacity("--button-butted-disabled")({
          opacityValue: undefined,
        }),
      },
    },
  },
  plugins: [],
}
export default config
