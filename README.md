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
│   └── layout/      # Layout components
├── data/            # Content data (skills, projects, photos)
├── hooks/           # Custom React hooks
├── pages/           # Route pages
└── utils/           # Utility functions
```

### Key Features

- Smart resource preloading (only for gooey experience)
- Responsive design for all screen sizes
- SEO optimized with structured data
- Performance optimized with lazy loading

## 📧 Contact

- **Email**: niheshr03+portfolio@gmail.com
- **LinkedIn**: [rachakonda-nihesh](https://www.linkedin.com/in/rachakonda-nihesh/)
- **GitHub**: [rnihesh](https://github.com/rnihesh)

## 📄 License

This project is open source and available under the MIT License.
