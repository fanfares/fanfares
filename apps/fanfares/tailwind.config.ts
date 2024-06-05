import type { Config } from "tailwindcss"

// function withOpacity(
//   variableName: string
// ): (options: { opacityValue?: string }) => string {
//   return ({ opacityValue }) => {
//     if (opacityValue !== undefined) {
//       return `rgba(var(${variableName}), ${opacityValue})`
//     }
//     return `rgb(var(${variableName}))`
//   }
// }

function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: number }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

//Headlines, Buttons, Fanfares Logo text (Gloock)

// regular texts we should use different fonts.

// create a native like top bar (allow to return home)

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
        // heading: ["Catamaran", "sans-serif"],
        // standard: ["Yrsa", "sans-serif"],
        gloock: ["Gloock", "sans-serif"], // Adding Gloock
      },
      textColor: {
        skin: {
          base: withOpacity("--color-base")({ opacityValue: 100 }),
          muted: withOpacity("--color-muted")({ opacityValue: 100 }),
          inverted: withOpacity("--color-inverted")({
            opacityValue: 100,
          }),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill")({ opacityValue: 100 }),
          "button-accent": withOpacity("--button-accent")({
            opacityValue: 100,
          }),

          "button-accent-hover": withOpacity("--button-accent-hover")({
            opacityValue: 100,
          }),
          "button-muted": withOpacity("--button-butted")({
            opacityValue: 100,
          }),
          "button-default": withOpacity("--button-default")({
            opacityValue: 100,
          }),
          "button-disabled": withOpacity("--button-disabled")({
            opacityValue: 100,
          }),
          "button-muted-hover": withOpacity("--button-butted-hover")({
            opacityValue: 100,
          }),
          "button-active": withOpacity("--button-active")({
            opacityValue: 100,
          }),
          "button-muted-active": withOpacity("--button-butted-active")({
            opacityValue: 100,
          }),
          "button-muted-focus": withOpacity("--button-butted-focus")({
            opacityValue: 100,
          }),
          "button-muted-disabled": withOpacity("--button-butted-disabled")({
            opacityValue: 100,
          }),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill")({
            opacityValue: 100,
          }),
        },
      },
      colors: {
        textBase: withOpacity("--color-base")({
          opacityValue: 100,
        }),
        textMuted: withOpacity("--color-muted")({
          opacityValue: 100,
        }),
        textInverted: withOpacity("--color-inverted")({
          opacityValue: 100,
        }),
        bgFill: withOpacity("--color-fill")({
          opacityValue: 100,
        }),
        buttonDefault: withOpacity("--button-default")({
          opacityValue: 100,
        }),
        buttonDisabled: withOpacity("--button-disabled")({
          opacityValue: 100,
        }),
        buttonAccent: withOpacity("--button-accent")({
          opacityValue: 100,
        }),
        buttonAccentHover: withOpacity("--button-accent-hover")({
          opacityValue: 100,
        }),
        buttonMuted: withOpacity("--button-butted")({
          opacityValue: 100,
        }),
        buttonMutedHover: withOpacity("--button-butted-hover")({
          opacityValue: 100,
        }),
        buttonActive: withOpacity("--button-active")({
          opacityValue: 100,
        }),
        buttonMutedActive: withOpacity("--button-butted-active")({
          opacityValue: 100,
        }),
        buttonMutedFocus: withOpacity("--button-butted-focus")({
          opacityValue: 100,
        }),
        buttonMutedDisabled: withOpacity("--button-butted-disabled")({
          opacityValue: 100,
        }),
      },
      maxWidth: {
        "modal-mobile": "27rem",
        "modal-tablet": "48rem",
        "modal-desktop": "",
      },
    },
  },
  plugins: [],
}
export default config
