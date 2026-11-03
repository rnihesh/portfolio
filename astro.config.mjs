// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

const fs = "./node_modules/@fontsource-variable";

export default defineConfig({
  site: "https://niheshr.com",
  output: "static",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "always" },
  image: { layout: "constrained", responsiveStyles: true },
  fonts: [
    {
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      provider: fontProviders.local(),
      fallbacks: ["Georgia", "serif"],
      display: "swap",
      options: {
        variants: [
          {
            weight: "200 800",
            style: "normal",
            src: [`${fs}/newsreader/files/newsreader-latin-wght-normal.woff2`],
          },
        ],
      },
    },
    {
      name: "Shantell Sans",
      cssVariable: "--font-shantell",
      provider: fontProviders.local(),
      fallbacks: ["Comic Sans MS", "cursive"],
      display: "swap",
      options: {
        variants: [
          {
            weight: "300 800",
            style: "normal",
            // Basic Latin subset (see README) to keep the handwriting face small.
            src: ["./src/assets/fonts/shantell-sans-basic-wght.woff2"],
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
