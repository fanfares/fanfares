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
          base: withOpacity("--color-text-base")({ opacityValue: undefined }),
          muted: withOpacity("--color-text-muted")({ opacityValue: undefined }),
          inverted: withOpacity("--color-text-inverted")({
            opacityValue: undefined,
          }),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill")({ opacityValue: undefined }),
          "button-accent": withOpacity("--color-button-accent")({
            opacityValue: undefined,
          }),

          "button-accent-hover": withOpacity("--color-button-accent-hover")({
            opacityValue: undefined,
          }),
          "button-muted": withOpacity("--color-button-muted")({
            opacityValue: undefined,
          }),
          "button-default": withOpacity("--color-button-default")({
            opacityValue: undefined,
          }),
          "button-disabled": withOpacity("--color-button-disabled")({
            opacityValue: undefined,
          }),
          "button-muted-hover": withOpacity("--color-button-muted-hover")({
            opacityValue: undefined,
          }),
          "button-active": withOpacity("--color-button-active")({
            opacityValue: undefined,
          }),
          "button-muted-active": withOpacity("--color-button-muted-active")({
            opacityValue: undefined,
          }),
          "button-muted-focus": withOpacity("--color-button-muted-focus")({
            opacityValue: undefined,
          }),
          "button-muted-disabled": withOpacity("--color-button-muted-disabled")(
            {
              opacityValue: undefined,
            }
          ),
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
        textBase: withOpacity("--color-text-base")({
          opacityValue: undefined,
        }),
        textMuted: withOpacity("--color-text-muted")({
          opacityValue: undefined,
        }),
        textInverted: withOpacity("--color-text-inverted")({
          opacityValue: undefined,
        }),
        bgFill: withOpacity("--color-fill")({
          opacityValue: undefined,
        }),
        buttonDefault: withOpacity("--color-button-default")({
          opacityValue: undefined,
        }),
        buttonDisabled: withOpacity("--color-button-disabled")({
          opacityValue: undefined,
        }),
        buttonAccent: withOpacity("--color-button-accent")({
          opacityValue: undefined,
        }),
        buttonAccentHover: withOpacity("--color-button-accent-hover")({
          opacityValue: undefined,
        }),
        buttonMuted: withOpacity("--color-button-muted")({
          opacityValue: undefined,
        }),
        buttonMutedHover: withOpacity("--color-button-muted-hover")({
          opacityValue: undefined,
        }),
        buttonActive: withOpacity("--color-button-active")({
          opacityValue: undefined,
        }),
        buttonMutedActive: withOpacity("--color-button-muted-active")({
          opacityValue: undefined,
        }),
        buttonMutedFocus: withOpacity("--color-button-muted-focus")({
          opacityValue: undefined,
        }),
        buttonMutedDisabled: withOpacity("--color-button-muted-disabled")({
          opacityValue: undefined,
        }),
      },
    },
  },
  plugins: [],
}
export default config
