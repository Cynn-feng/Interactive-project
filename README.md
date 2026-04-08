# Circle Lab

Circle Lab is an interactive learning platform for GCSE-level circle geometry, built as a course project for **EBU5315** at Queen Mary University of London (QMUL).

> Contact: cxf17711867369@outlook.com

---

## Features

### Homepage (Vue 3 + Vite)
- **Hero section** — animated introduction
- **Theorem Carousel** — browse all 7 key circle theorems
- **Feature Cards** — quick entry to Game and Quiz
- **Circle Lab AI Terminal** — smart chatbot covering 30+ GCSE geometry topics, with real-time calculation (area, circumference, arc length, sector area)
- **Theme toggle** — Dark "Neon Geometry" / Light "Blueprint" mode
- **Language toggle** — English / Chinese (lightweight i18n)
- **Footer** — project info and contact

### Game Page (Vanilla JS)
- Interactive circle geometry game
- Multi-tab layout (Learn / Play / Leaderboard)
- Shared navbar, theme and i18n modules

### Quiz Page (Vanilla JS)
- Image-based multiple-choice quiz
- Score tracking with pass/fail feedback
- Shared navbar, theme and i18n modules

### Shared Modules (`public/shared/`)
| File | Purpose |
|------|---------|
| `theme.css` | CSS variables, global base styles |
| `navbar.css` | Navigation bar styles |
| `theme.js` | Dark/light mode logic |
| `navbar.js` | Dynamic navbar renderer |
| `i18n.js` | Language switching (loads `lang/*.json`) |
| `accessibility.js` | Font size control, keyboard nav, reduced motion |
| `privacy.js` | Privacy policy modal |

---

## Project Structure

```text
Interactive-project/
├── index.html               # Vue app entry point
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/              # Vue Router (Hash mode)
│   ├── views/
│   │   └── HomePage.vue     # Homepage composition root
│   └── components/
│       ├── Navbar.vue       # Homepage navbar (Vue)
│       ├── Hero.vue
│       ├── TheoremCarousel.vue
│       ├── FeatureCards.vue
│       ├── AdsBanner.vue
│       ├── Chatbot.vue      # Circle Lab AI Terminal
│       └── Footer.vue
├── public/
│   ├── game/
│   │   ├── index.html       # Game page entry
│   │   ├── game.js
│   │   └── game.css
│   ├── quiz/
│   │   ├── index.html       # Quiz page entry
│   │   ├── quiz.js
│   │   ├── quiz.css
│   │   └── images/          # Quiz question images
│   ├── shared/              # Shared JS/CSS modules
│   └── lang/                # i18n translation files (EN / ZH)
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install & Run

```bash
npm install
npm run dev
```

Local URLs:

| Page | URL |
|------|-----|
| Homepage | `http://localhost:5173/` |
| Game | `http://localhost:5173/game/index.html` |
| Quiz | `http://localhost:5173/quiz/index.html` |

### Build & Preview

```bash
npm run build
npm run preview
```

Output is in `dist/`.

---

## Shared Module Integration (for static pages)

If you are writing a plain HTML page and want to reuse the shared modules:

```html
<head>
  <link rel="stylesheet" href="../shared/theme.css" />
  <link rel="stylesheet" href="../shared/navbar.css" />
</head>
<body>
  <div id="navbar-container"></div>

  <!-- page content -->

  <script src="../shared/theme.js"></script>
  <script src="../shared/navbar.js"></script>
  <script src="../shared/i18n.js"></script>
  <script src="../shared/accessibility.js"></script>
  <script src="../shared/privacy.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      window.CircleLab.theme.init()
      window.CircleLab.navbar.init({ activePage: 'game' }) // 'home' | 'game' | 'quiz'
      window.CircleLab.i18n.init('game')                   // page name for lang file
      window.CircleLab.accessibility.init()
      window.CircleLab.privacy.init()
    })
  </script>
</body>
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Homepage | Vue 3, Vite, Vue Router |
| Game / Quiz | Vanilla HTML / CSS / JS |
| Styling | CSS Custom Properties (variables) |
| i18n | Custom lightweight module |
| Build | Vite |

---

## Notes

- Homepage routing uses `createWebHashHistory()` — works well for static hosting
- Fonts are loaded from Google Fonts; fallback to system fonts when offline
- Game and Quiz pages are served as static files under `public/`, accessed via their exact file paths (`/game/index.html`, `/quiz/index.html`) to avoid Vite's SPA fallback
