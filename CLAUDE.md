# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Observer.GG (watchergg) is a League of Legends analytics landing page built with Next.js 16. The site features a cinematic, horror-themed design with extensive scroll-driven animations, a custom cursor system, and frame-by-frame monster animation sequences.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.1.4 with App Router
- **React**: 19.2.3
- **Animation**: Motion (motion/react) for scroll-driven animations
- **Smooth Scrolling**: Lenis
- **Styling**: Tailwind CSS 4 with custom moss green color palette
- **Language**: TypeScript with strict mode

## Architecture

### App Structure
- Uses Next.js App Router (`src/app/`)
- Single-page design with vertical scroll sections
- Three Google Fonts: Instrument Sans (body), Syne (display), Playfair Display (serif/italic headings)

### Component Hierarchy
The main page (`src/app/page.tsx`) renders sections in order:
1. `LoadingScreen` - Initial loading animation
2. `CustomCursor` - Site-wide custom cursor with multiple modes
3. `NoiseBackground` - Persistent noise texture overlay
4. `Hero` - Landing section with video background and cycling text
5. `CinematicTransition` - Transition between Hero and Storytelling
6. `StorytellingSection` - Scroll-driven feature showcase with monster frame scrubbing
7. `DeepDiveSection` - Multi-screen scroll narrative with scary eyes CTA

### Key Patterns

**Scroll-Driven Animations**: Components use `useScroll` and `useTransform` from Motion to map scroll progress to visual properties. Example in `StorytellingSection.tsx`:
```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
});
const opacity = useTransform(scrollYProgress, [0, 0.02, 0.16, 0.18], [0, 1, 1, 0]);
```

**Cursor Context**: Global cursor state managed via `CursorContext` (`src/contexts/CursorContext.tsx`). Cursor modes: `normal`, `hidden`, `possessed`, `cta`. Components can change cursor appearance by calling `setMode()`.

**Frame Scrubbing**: `MonsterScrubbing` component pre-loads 192 frames from `/public/MonsterScrobbing/` and renders them to canvas based on scroll progress.

**Providers Pattern**: `Providers.tsx` wraps the app with Lenis smooth scrolling and CursorProvider.

### CSS/Styling
- Custom color palette defined in `globals.css` using CSS variables (`--moss-50` through `--moss-950`)
- Tailwind configured via `@theme inline` directive in globals.css
- Horror-themed CSS animations: flicker, subtle-shake, breathing-glow, fog-drift, text-glitch
- Custom scrollbar styling

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Static Assets

- `/public/backgroudnvideo.mp4` - Hero background video (note the typo in filename)
- `/public/MonsterScrobbing/` - 192 JPG frames for scroll animation
- `/public/favicon/` - Favicon and PWA manifest files
