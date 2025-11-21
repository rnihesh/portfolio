# Nihesh Rachakonda | Portfolio

A modern, dual-experience portfolio website built with React, offering users the choice between two distinct viewing experiences.

## 🌟 Features

### Dual Experience Architecture

- **Minimal Experience** (`/minimal`): Clean, text-based portfolio with keyboard navigation
- **Gooey Experience** (`/gooey`): Interactive 3D animations, custom motion effects, and immersive UI

### Tech Stack

- **Frontend**: React 19, Framer Motion, Tailwind CSS
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Routing**: React Router DOM
- **Animation**: GSAP, Rough Notation, Matter.js
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Routes

- `/` - Landing page with experience selection
- `/minimal` - Clean, minimal portfolio experience
- `/gooey` - Interactive 3D portfolio experience

## 🎨 Experiences

### Minimal Experience

- Keyboard shortcuts (1-5 for sections, H for help, B/ESC for back)
- Clean typography with Space Grotesk and JetBrains Mono
- Scrollable single-page layout
- Dark/light mode support
- Accessible and fast loading

### Gooey Experience

- 3D model viewer with interactive controls
- Custom text animations and motion effects
- Scroll-based section reveals
- Photo gallery with advanced interactions
- Command toolbar with keyboard shortcuts
- Optimized resource preloading

## 🛠 Development

### Project Structure

```
src/
├── components/
│   ├── sections/     # Page sections (Intro, Skills, Projects, etc.)
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   ├── Theme/       # Theme toggle component
│   └── ErrorBoundary.jsx  # Error boundary for error handling
├── data/            # Content data (skills, projects, photos)
├── hooks/           # Custom React hooks
├── pages/           # Route pages (lazy loaded for code splitting)
├── utils/           # Utility functions (telemetry, resource preloader)
├── TextAnimations/  # Custom text animation components
├── Animations/      # Custom animation components
└── Backgrounds/     # Background components (e.g., DotGrid)
```

### Key Features

- **Code Splitting**: Pages are lazy loaded for optimal performance
- **Smart Resource Preloading**: Only for gooey experience to load 3D models
- **Responsive Design**: Works seamlessly across all screen sizes
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Error Handling**: Error boundary for graceful error recovery
- **Dark Mode**: System preference detection with manual toggle
- **Telemetry**: Anonymous analytics in production (privacy-friendly)

### Performance

Bundle sizes after code splitting:
- HomePage: ~3 KB (landing page)
- MinimalPage: ~13 KB (lightweight experience)
- GooeyPage: ~1.2 MB (includes Three.js for 3D)
- Initial load: ~230 KB (core React + routing)

## 🔧 Code Quality

The project follows best practices:
- ESLint for code linting
- React Hooks exhaustive deps
- Consistent code formatting
- Component-based architecture
- Separation of concerns

## 🚀 Recent Improvements

- **Code Splitting**: Implemented lazy loading to reduce initial bundle size by 85%
- **Error Boundary**: Added graceful error handling
- **Accessibility**: Enhanced with ARIA labels and semantic HTML
- **SEO**: Comprehensive meta tags and structured data
- **Performance**: Optimized with lazy loading and resource preloading
- **Code Quality**: Refactored to remove 2400+ lines of unused code

## 📧 Contact

- **Email**: niheshr03+portfolio@gmail.com
- **LinkedIn**: [rachakonda-nihesh](https://www.linkedin.com/in/rachakonda-nihesh/)
- **GitHub**: [rnihesh](https://github.com/rnihesh)

## 📄 License

This project is open source and available under the MIT License.
