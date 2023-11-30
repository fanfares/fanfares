const plugin = require('tailwindcss/plugin');

const Rotate = plugin(function ({ addUtilities }) {
  addUtilities({
    '.my-rotate-y-180': {
      transform: 'rotateY(180deg)'
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d'
    },
    '.perspective': {
      perspective: '1000px'
    },
    '.backface-hidden': {
      backfaceVisibility: 'hidden'
    }
  });
});

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        objective: ['Objective', 'sans-serif'],
        heading: ['Catamaran', 'sans-serif'],
        standard: ['Yrsa', 'sans-serif']
      },
      textColor: {
        skin: {
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          inverted: withOpacity('--color-text-inverted')
        }
      },
      backgroundColor: {
        skin: {
          fill: withOpacity('--color-fill'),
          'button-accent': withOpacity('--color-button-accent'),
          'button-accent-hover': withOpacity('--color-button-accent-hover'),
          'button-muted': withOpacity('--color-button-muted'),
          'button-default': withOpacity('--color-button-default'),
          'button-disabled': withOpacity('--color-button-disabled'),
          'button-muted-hover': withOpacity('--color-button-muted-hover'),
          'button-active': withOpacity('--color-button-active'),
          'button-muted-active': withOpacity('--color-button-muted-active'),
          'button-muted-focus': withOpacity('--color-button-muted-focus'),
          'button-muted-disabled': withOpacity('--color-button-muted-disabled')
        }
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity('--color-fill')
        }
      },
      colors: {
        textBase: withOpacity('--color-text-base'),
        textMuted: withOpacity('--color-text-muted'),
        textInverted: withOpacity('--color-text-inverted'),
        bgFill: withOpacity('--color-fill'),
        buttonDefault: withOpacity('--color-button-default'),
        buttonDisabled: withOpacity('--color-button-disabled'),
        buttonAccent: withOpacity('--color-button-accent'),
        buttonAccentHover: withOpacity('--color-button-accent-hover'),
        buttonMuted: withOpacity('--color-button-muted'),
        buttonMutedHover: withOpacity('--color-button-muted-hover'),
        buttonActive: withOpacity('--color-button-active'),
        buttonMutedActive: withOpacity('--color-button-muted-active'),
        buttonMutedFocus: withOpacity('--color-button-muted-focus'),
        buttonMutedDisabled: withOpacity('--color-button-muted-disabled')
      },
      gridRow: {
        'span-12': 'span 12 / span 12'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/line-clamp'), require('autoprefixer'), Rotate]
};
