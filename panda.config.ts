import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // The extension for the emitted JavaScript files
  outExtension: "js",
  // Where to look for your css declarations
  include: [
    "./app/routes/**/*.{ts,tsx,js,jsx}",
    "./app/components/**/*.{ts,tsx,js,jsx}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      colors: {
        primary: "tomato",
      },
    },
  },
  utilities: {
    extend: {
      spaceX: {
        className: "space-x",
        values: "spacing",
        transform(value: string) {
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              marginInlineStart: value,
            },
          };
        },
      },
      spaceY: {
        className: "space-y",
        values: "spacing",
        transform(value: string) {
          return {
            "& > :not([hidden]) ~ :not([hidden])": {
              marginBlockStart: value,
            },
          };
        },
      },
    },
  },
  patterns: {
    extend: {
      // Extend the default `container` pattern and change the max-width to 1150px
      container: {
        transform: (properties) => {
          return {
            ...properties,
            maxWidth: "1150px",
            marginX: "auto",
            paddingX: "4",
            w: "100%",
          };
        },
      },
    },
  },
  // The output directory for your css system
  outdir: "styled-system",
});
