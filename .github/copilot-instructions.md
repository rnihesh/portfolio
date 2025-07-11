# Copilot Instructions for rnihesh/portfolio

## Project Overview

- This is a React + Vite portfolio web application with custom animations, interactive sections, and 3D model viewing.
- Major UI components are organized in `src/components/sections/`, each representing a distinct screen or feature (e.g., Intro, Skills, Projects, Vibe, Model, Connect).
- Custom text and 3D animations are implemented in `src/TextAnimations/` and `src/Animations/`.
- 3D models are loaded and rendered using `@react-three/fiber` and `@react-three/drei` in `src/components/ui/ModelViewer/`.
- Data for skills, projects, photos, and models is sourced from files in `src/data/`.

## Architecture & Patterns

- Each section is a React component with animation props and visibility controlled by scroll position (`useVisibilityOnScroll`).
- Animations use Framer Motion (`motion.div`, `AnimatePresence`) and custom animation objects per section.
- The main app flow is in `src/App.jsx`, which orchestrates loading, section visibility, and telemetry.
- Custom hooks (e.g., `useOutsideClick`, `useVisibilityOnScroll`) are in `src/hooks/`.
- Styling uses Tailwind CSS classes and some custom CSS files (e.g., CommandToolbar).
- 3D model viewer supports mouse/touch parallax, manual rotation, and zoom, with props controlling behavior.

## Developer Workflows

- **Build:** Use `npm run build` (Vite).
- **Dev:** Use `npm run dev` for local development with HMR.
- **Lint:** Use `npm run lint` (ESLint config in `eslint.config.js`).
- **Deploy:** Vercel config in `vercel.json`.
- **Telemetry:** On production, browser telemetry is sent to `https://tra-7e6267.onrender.com/tra`.

## Conventions & Patterns

- Animation objects (e.g., `firstScreenAnimation`) are defined per section and passed as props.
- Section components use a shared `Section` layout for consistent structure and animation.
- Data-driven rendering: skills, projects, and photos are mapped from arrays in `src/data/`.
- Fallback images for skills use `onError` handler to generate placeholder images.
- 3D model viewer logs manual rotation to console for debugging.
- Custom text effects (e.g., TypeWrite, BlurText, TextPressure) are implemented as reusable components.

## Integration Points

- External dependencies: `framer-motion`, `@react-three/fiber`, `@react-three/drei`, `three`, `tailwindcss`, `matter-js` (for physics-based text), and others.
- Images, SVGs, and 3D models are stored in `public/` subfolders.
- GitHub repo links are referenced in project and vibe sections for live demos and source code.

## Examples

- See `src/components/sections/ProjectsSection.jsx` for data-driven project cards and custom underline animation.
- See `src/components/ui/ModelViewer/ModelViewer.jsx` for advanced 3D model rendering and controls.
- See `src/TextAnimations/` for custom text animation implementations.

## Tips for AI Agents

- Always use the animation objects and visibility props when adding new sections.
- Follow the data-driven approach for new skills, projects, or photos.
- Use Tailwind CSS for styling unless a custom CSS file is required.
- Reference existing section/component patterns for consistency.
- For new integrations, add external assets to `public/` and update relevant data files in `src/data/`.
