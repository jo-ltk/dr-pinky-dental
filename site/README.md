# Dental clinic landing page — mobile-first, WhatsApp booking

Static Next.js 15 (App Router) + TypeScript + Tailwind + Framer Motion + React Three Fiber.
No backend, database, login or payments. Every appointment action opens WhatsApp click-to-chat.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out  (upload ./out to any static host)
```

## Make it yours — edit ONE file: `src/lib/clinic.config.ts`

| Field | What |
|---|---|
| `whatsappNumber` | Country code + number, digits only, no `+` (e.g. `919876543210`) |
| `name`, `phoneDisplay`, `email`, `address`, `hours` | Clinic details — currently `[PLACEHOLDERS]` |
| `treatments` | The six services (names flow into every WhatsApp message) |
| `team` | Dentist names, roles, qualifications, bios, `photo` (put files in `public/team/`) |
| `siteUrl` | Used for SEO metadata / canonical URL |

Also replace `public/icon.svg` and the mark in `src/components/Logo.tsx` with the clinic logo, and add `public/og.jpg` (1200×630) for link previews.

## WhatsApp booking

- `src/lib/whatsapp.ts` — `whatsappUrl()`, `enquiryMessage()`, `bookingMessage()`, `openWhatsApp()`; all text goes through `encodeURIComponent()`.
- `src/components/booking.tsx` — `<BookButton treatment="…">` is a real `wa.me` link (works without JS); with JS it opens the booking drawer with the treatment preselected.
- The drawer asks for **treatment, date (tap a day or pick any date), time (tap a slot or pick any time)**; name, phone and a note are optional. It validates, builds a readable message and opens WhatsApp. It never claims a booking is confirmed.
- Entry points: header, mobile menu, hero, each service card, treatment-plan explorer, specialists, steps, final CTA, footer, desktop floating button, mobile sticky bar.

## 3D

- `src/components/three/` — procedural porcelain crown + titanium threaded implant (no model downloads), studio lighting built from in-scene light formers (no HDR fetch).
- Loads after first paint; a pre-rendered image shows first and stays when WebGL is unavailable, on data-saver, on very low-memory devices, or if the device can't hold ~20fps. Pauses when off-screen. `prefers-reduced-motion` stops float, rotation and parallax.
- `tools/render-page.tsx` + `tools/capture.mjs` regenerate the WebP renders in `public/renders/` (copy the page into `src/app/render/page.tsx`, run `npm run dev`, then `node tools/capture.mjs`; delete the route afterwards).

## Mobile-first details

Outfit variable font (self-hosted via @fontsource), 16px inputs (no iOS zoom), ≥ 44px tap targets, bottom-sheet booking drawer with sticky submit, safe-area padding, no horizontal overflow from 360px up, scroll reveals that never hide content if JS fails.
