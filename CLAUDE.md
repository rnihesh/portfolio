# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern dual-experience portfolio website built with React 19, offering users two distinct viewing experiences:

- **Minimal Experience** (`/minimal`): Clean, text-based portfolio with keyboard navigation
- **Gooey Experience** (`/gooey`): Interactive 3D animations, custom motion effects, and immersive UI

## Commands

```bash
# Development
npm run dev              # Start Vite dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run start            # Start preview on 0.0.0.0:8080

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Deployment
npm run deploy           # Deploy to GitHub Pages
npm run startCloud       # Start production server via Express (server.js)
```

## Architecture

### Routing Structure

The app uses React Router with three main routes defined in `src/App.jsx`:

- `/` - Landing page (HomePage) with experience selection and telemetry
- `/minimal` - Minimal experience (MinimalPage)
- `/gooey` - Gooey experience (GooeyPage) with resource preloading

All three pages include:

- Global keyboard handler for resume (press 'R' to open `/resume/v1.pdf`)
- Theme toggle (fixed top-right)
- Fullscreen support (press 'F' via `useFullscreen` hook)
- Page title management via `usePageTitle` hook
- Telemetry payload sent to `https://traana.vercel.app/tra` in production

### Gooey Experience Architecture

The gooey experience (`src/pages/GooeyPage.jsx`) orchestrates multiple sections with scroll-based visibility:

1. **Resource Preloading System** (`src/utils/resourcePreloader.js`):
   - Preloads all skills images, photos, projects, and 3D models before showing content
   - Uses `useGLTF.preload()` for GLTF/GLB models
   - Tracks loading progress with global state to prevent duplicate loading
   - Shows `LoadingSection` until all resources are ready

2. **Scroll-Based Visibility**:
   - `useVisibilityOnScroll` hook controls which sections appear based on scroll position
   - Sections map to scroll positions: `showFirstScreen`, `showSecondScreen`, etc.
   - Each section receives `isVisible` and `animationProps` (Framer Motion config)

3. **Section Components** (`src/components/sections/`):
   - IntroSection, NameSection, WhatAmISection, SkillsSection, ModelSection, PhotoSection, ProjectsSection, VibeSection, ExperienceSection, ConnectSection
   - All sections use consistent animation patterns via Framer Motion
   - Animation objects defined in GooeyPage.jsx (e.g., `firstScreenAnimation`, `secondScreenAnimation`)

4. **Keyboard Shortcuts** (Gooey Page):
   - `H` - Toggle keyboard help (CommandToolbar)
   - `Ctrl+H`, `ESC`, `B` - Navigate back to home
   - Floating home button (bottom-left) also available

### Data-Driven Rendering

Content is centralized in `src/data/`:

- `skills.js` - Skill categories, items, and image URLs
- `projects.jsx` - Project cards with source, logo, title, description
- `photos.js` - Photo gallery items
- `models.js` - 3D model URLs and configurations (use `getAllModelUrls()`)
- `vibeProjects.js` - Vibe section projects
- `experience.js` - Academic/achievement data
- `shortcuts.js` - Keyboard shortcut definitions

Sections iterate over these data arrays to render UI. When adding new content:

1. Update the relevant data file
2. The section component will automatically render it
3. Images/models will be preloaded automatically (for gooey experience)

### Custom Components

**Text Animations** (`src/TextAnimations/`):

- BlurText, FallingText, TextPressure, TextTrail
- Reusable components for custom text effects

**UI Components** (`src/components/ui/`):

- `ModelViewer` - 3D model rendering with @react-three/fiber and @react-three/drei
  - Supports mouse/touch parallax, manual rotation, zoom
  - Logs manual rotation to console
- `TypeWrite` - Typewriter text effect
- `ExpandableCards` - Interactive card components
- `Masonry` - Masonry layout component

**Custom Hooks** (`src/hooks/`):

- `useVisibilityOnScroll` - Scroll position-based section visibility
- `usePageTitle` - Manages document title based on page/section
- `useFullscreen` - Fullscreen toggle with 'F' key
- `useOutsideClick` - Detect clicks outside element

### Animation Patterns

All sections in the gooey experience use Framer Motion (`motion.div`, `AnimatePresence`):

- Animation props passed from parent page (e.g., `initial`, `animate`, `exit`, `transition`)
- Each section defines its own animation timing in GooeyPage.jsx
- Consistent pattern: opacity + transform (y-axis or scale) for enter/exit

### Styling

- **Tailwind CSS 4** for utility classes
- **Dark mode** support via Tailwind's `dark:` prefix
- Custom CSS files for specific components (e.g., `ConnectSection.css`, `MinimalSection.css`)
- Typography: Space Grotesk (primary), JetBrains Mono (monospace)
- Responsive design with mobile-first approach

## ESLint Configuration

Uses flat config (`eslint.config.js`):

- Ignores `dist/` directory
- React Hooks and React Refresh rules enabled
- Custom rule: unused vars pattern `^[A-Z_]` allowed (for constants)

## Build Configuration

Vite (`vite.config.js`):

- React plugin with Fast Refresh
- Tailwind CSS via `@tailwindcss/vite`
- Bundle analyzer: `rollup-plugin-visualizer` generates `dist/report.html` with gzip/brotli sizes
- Base path: `./` for relative paths

## Deployment

Deployed on Vercel (`vercel.json` config).
GitHub Pages deployment also supported via `npm run deploy`.

## Important Patterns

1. **Adding a new section to gooey experience**:
   - Create section component in `src/components/sections/`
   - Define animation object in `GooeyPage.jsx`
   - Add visibility state in `useVisibilityOnScroll` return
   - Add section to GooeyPage render with `isVisible` and `animationProps`
   - If using new images/models, ensure they're added to data files (preloader will handle them)

2. **Adding new data**:
   - Update relevant file in `src/data/`
   - For images: use paths relative to `public/` (e.g., `skills/react.svg`)
   - For models: add to `models.js` and use `getAllModelUrls()` to retrieve

3. **Fallback handling**:
   - Skills use `onError` handler to generate placeholder images if loading fails
   - Resource preloader continues on error to prevent infinite loading states

4. **Telemetry**:
   - Only runs in production mode (`import.meta.env.MODE === "production"`)
   - Collects browser info, connection data, battery status, device memory
   - Sent on page load for HomePage and GooeyPage

## Tech Stack

- **React 19** with React Router DOM 7
- **Vite 7** for build tooling
- **Tailwind CSS 4** for styling
- **Framer Motion 12** for animations
- **Three.js** with @react-three/fiber and @react-three/drei for 3D
- **GSAP**, Rough Notation, Matter.js for specialized animations
- **Express 5** for production server (optional, via `startCloud` script)
