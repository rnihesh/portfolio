# Copilot Instructions for rnihesh/portfolio

## Architecture Overview

Dual-experience React 19 + Vite portfolio with two routes:

- **`/minimal`** - Clean text-based portfolio with keyboard navigation
- **`/gooey`** - Interactive 3D experience with scroll-based section reveals

Routing in [src/App.jsx](src/App.jsx) → Page components in [src/pages/](src/pages/) → Section components in [src/components/sections/](src/components/sections/).

## Key Patterns

### Adding a New Gooey Section

1. Create section component in `src/components/sections/NewSection.jsx`:
   ```jsx
   function NewSection({ id, isVisible, animationProps }) {
     return (
       <Section id={id} isVisible={isVisible} animationProps={animationProps}>
         {/* content */}
       </Section>
     );
   }
   ```
2. In [src/pages/GooeyPage.jsx](src/pages/GooeyPage.jsx), add animation object and destructure visibility from `useVisibilityOnScroll`
3. Update [src/hooks/useVisibilityOnScroll.js](src/hooks/useVisibilityOnScroll.js) with new `showXScreen` state and scroll thresholds

### Data-Driven Content

All content lives in `src/data/` - sections auto-render from these arrays:

- `skills.js` - `{ name, image, category }` objects
- `projects.jsx` - Cards with `content()` render function for descriptions
- `photos.js`, `models.js`, `vibeProjects.js`, `experience.js`

**Adding content:** Update the data file → preloader auto-loads images/models → section renders automatically.

### Resource Preloading

[src/utils/resourcePreloader.js](src/utils/resourcePreloader.js) preloads all gooey assets before showing content:

- Uses `useGLTF.preload()` for 3D models
- Tracks global loading state to prevent duplicate loads
- Add new image paths to data files; models to `models.js` via `getAllModelUrls()`

## Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production build
npm run lint     # ESLint check
npm run format   # Prettier format
```

## Styling

- **Tailwind CSS 4** with `dark:` prefix for dark mode
- Fonts: Space Grotesk (primary), JetBrains Mono (code)
- Custom CSS only for complex components (e.g., `CommandToolbar.css`)

## Tech Stack

React 19, Framer Motion 12, Three.js with @react-three/fiber+drei, React Router 7, Tailwind CSS 4, Vite 7

## File Conventions

- Static assets in `public/` subfolders: `images/`, `3d_models/`, `projects/`, `photography/`
- Text animations: `src/TextAnimations/` (BlurText, FallingText, TextPressure, TextTrail)
- Reusable UI: `src/components/ui/` (ModelViewer, TypeWrite, Masonry, ExpandableCards)
- Global keyboard: 'R' opens resume, 'F' toggles fullscreen, 'H' shows help (gooey only)
