# Nihesh Rachakonda — Portfolio

Dual-experience portfolio built with **React 19 + Vite**.

[Live Site](https://niheshr.com) · [LinkedIn](https://www.linkedin.com/in/rachakonda-nihesh/) · [GitHub](https://github.com/rnihesh) · [Instagram](https://instagram.com/niheshr) · [Bluesky](https://bsky.app/profile/niheshr.com) · [X](https://x.com/niheshr03)

## Experiences

1. **Minimal** (`/minimal`) — clean, text-first, keyboard-friendly portfolio.
2. **Gooey** (`/gooey`) — interactive 3D experience with scroll-driven reveals.

## Stack

- **Core**: React 19, React Router 7, Vite 7
- **UI/Motion**: Tailwind CSS 4, Framer Motion, GSAP
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **Extras**: Rough Notation, Matter.js

## Quick start

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run format    # Prettier write
npm run deploy    # GitHub Pages deploy
npm run start     # Preview on 0.0.0.0:8080
npm run startCloud # Express server (server.js)
```

## SEO setup

- Route-level `<title>`, description, canonical URL, and keyword sets (`src/utils/seo.js`)
- Open Graph + Twitter card metadata in `index.html`
- Structured data (`WebSite` + `ProfilePage`/`Person`) with `sameAs` profile backlinks
- Crawl/index directives via `public/robots.txt`
- Discoverability via `public/sitemap.xml`

## Project structure

```text
src/
  components/
    sections/
    ui/
    layout/
  data/
  hooks/
  pages/
  utils/
public/
```

## License

Licensed under the **GNU Affero General Public License v3.0 or later**. See [`LICENSE`](./LICENSE).
