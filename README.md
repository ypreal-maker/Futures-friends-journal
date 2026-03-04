# Cinematic Journal

A **Private Cinematic Photo Journal** built with Next.js 14, Framer Motion, and Lenis — inspired by the high-end UI aesthetics of Jeton.com.

## Features

- **Cinematic Zoom** — Framer Motion `layoutId` shared layout transitions for fluid photo zoom
- **Smooth Scroll** — Lenis-powered ultra-smooth scrolling
- **Floating Navigation** — Animated pill indicator with category filtering
- **Bento Grid** — Masonry-style responsive photo grid
- **5 Categories** — Moments, Narratives, Archives, Treasures, Daily Log
- **Film Grain Overlay** — Authentic cinematic texture
- **Dark Mode** — Pure `#000000` background with gold accent system
- **Mobile Responsive** — Fully adaptive across all screen sizes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Animation | Framer Motion (layoutId transitions) |
| Scroll | @studio-freight/lenis |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Language | TypeScript |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles + film grain + Lenis
│   ├── layout.tsx         # Root layout with SmoothScroll wrapper
│   └── page.tsx           # Main page with category state
├── components/
│   ├── SmoothScroll.tsx   # Lenis smooth scroll provider
│   ├── FloatingNav.tsx    # Animated floating navigation
│   ├── HeroSection.tsx    # Parallax hero with serif typography
│   ├── CinematicGrid.tsx  # Bento grid with layoutId transitions
│   ├── DetailView.tsx     # Full-screen modal with shared animation
│   └── CategorySection.tsx # Section header component
├── data/
│   └── photos.ts          # Photo data with narratives
└── lib/
    └── utils.ts           # cn() utility
```

## Design System

- **Background**: `#000000` pure black
- **Gold Accent**: `#c9a96e` — navigation pills, borders, highlights
- **Typography**: Playfair Display (serif) + Inter (sans)
- **Glass Effect**: `backdrop-filter: blur(20px)` with subtle borders

---

*A private archive of instants. Each frame a sentence; each collection a chapter.*