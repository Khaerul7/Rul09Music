# RUL09 Music 🎵

Modern music player built with Next.js 15, Zustand, Framer Motion.

## Stack
- **Next.js 15** (App Router + Turbopack)
- **TypeScript** — strict mode
- **Tailwind CSS v4** — dark theme, Deep Zinc + Electric Blue
- **Zustand v5** — global audio state
- **Framer Motion** — lyrics transitions & card animations
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout (MusicPlayer + LyricsPanel mounted here)
│   ├── page.tsx          # Discover/Search page
│   └── globals.css
├── components/
│   ├── Navbar.tsx        # Variant B: Bebas Neue logo + pill nav
│   ├── MusicPlayer.tsx   # Floating bottom player bar
│   ├── LyricsPanel.tsx   # Full-screen synced lyrics overlay
│   ├── SongCard.tsx      # Grid card with hover glow
│   └── SearchBar.tsx
├── store/
│   └── usePlayerStore.ts # Zustand: currentTrack, isPlaying, lyrics, etc.
├── hooks/
│   └── useAudioEngine.ts # HTML5 Audio engine (Howler-ready)
├── data/
│   └── mockData.ts       # Mock tracks + synced lyrics
├── types/
│   └── music.ts
└── lib/
    └── utils.ts          # cn() helper
```

## Next Steps (Backend)
- [ ] `src/app/api/search/route.ts` — Deezer API proxy (avoid CORS)
- [ ] `src/app/api/lyrics/route.ts` — LRCLIB synced lyrics fetch
- [ ] Replace mock data with real API calls
- [ ] Add `howler.js` for robust audio engine
