# Syntaxia Web Landing Page

High-performance Astro landing page for Syntaxia - the AI-powered technical interview practice platform.

## 🚀 Tech Stack

- **Astro** - Static site generation with React islands
- **React** - Interactive components (ThemeToggle, WaitlistForm)
- **Tailwind CSS** - Terminal-inspired styling with dark/light themes
- **TypeScript** - Type safety throughout

## 📁 Project Structure

```text
src/
├── components/
│   ├── ThemeToggle.tsx    # Dark/light/system theme switcher
│   └── WaitlistForm.tsx   # Email capture with terminal UX
├── pages/
│   └── index.astro        # Landing page with features grid
└── styles/
    └── global.css         # Terminal color scheme & typography
```

## ⚡ Performance Features

- **Zero JS by default** - Only hydrates interactive components
- **Optimized font loading** - JetBrains Mono with `display=swap`
- **Lazy hydration** - Components load when needed (`client:idle`, `client:visible`)
- **Dark mode first** - No white flash, instant theme switching
- **Minimal bundle** - ~40KB total assets

## 🎨 Design System

- **Terminal aesthetic** - Sharp corners, monospace fonts
- **Color palette** - Terminal green, amber accents, dark backgrounds
- **Responsive** - Mobile-first approach with breakpoints
- **Accessible** - Proper contrast ratios and semantic markup

## 🧞 Commands

| Command       | Action                                    |
| :------------ | :---------------------------------------- |
| `bun dev`     | Start dev server at `localhost:4321`     |
| `bun build`   | Build production site to `./dist/`       |
| `bun preview` | Preview build locally before deployment  |

## 🔧 Configuration

- **Theme switching** - Inline script prevents flash, CSS defaults to dark
- **Hydration strategy** - ThemeToggle (`client:idle`), WaitlistForm (`client:visible`)
- **Font optimization** - Only loads needed JetBrains Mono weights
