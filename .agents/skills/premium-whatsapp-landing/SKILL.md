---
name: premium-whatsapp-landing
description: High-end single-page landing site for clinics, salons, studios, or local businesses with WhatsApp booking, procedural 3D hero, and mobile-first design.
---

# Premium WhatsApp-booking landing page

Use this when someone wants a high-end single-page site for a clinic, salon, studio or other local business, often from reference screenshots, where every call to action opens WhatsApp. The output is a static Next.js site (zip), a published live preview, and optionally a Design System artifact.

## 0. Clarify (only what changes the build)

Ask in one AskUserQuestion round, and skip anything the brief already answers:
- Fonts: name them, or use a free Google family that matches the references.
- Logo: upload a file, set the name in plain type, or use an original placeholder mark. Never trace or recreate a real company's logo.
- Real business details (WhatsApp number, name, address, hours, team) or placeholders.
- If the brief and a later message conflict (font, palette, required fields), follow the latest message and say so in the final reply.

## 1. Honesty rules (non-negotiable)

- Never invent awards, ratings, patient or customer counts, credentials, doctors, prices, addresses or hours. Use `[BRACKETED]` placeholders kept in one config file.
- Booking copy must say the appointment is confirmed only after the business replies. The form never claims to book anything.
- Diagrams or "treatment plan" demos get an "Illustration only. Not a diagnosis." line.
- Team portraits: if no photos are supplied, use a labelled placeholder silhouette. Never use AI or stock faces as if they were real staff.
- WhatsApp branding: use a generic chat-bubble icon on a small green tile. Do not draw the WhatsApp logo, and keep the green out of large fills.

## 2. Stack and structure

Next.js App Router + TypeScript + Tailwind 3 + Framer Motion (modal and menu only) + three / @react-three/fiber / @react-three/drei + lucide-react. Self-host the font with `@fontsource-variable/<font>`, because next/font may not reach Google from the sandbox. In `next.config.mjs` set `output: "export"`, `images.unoptimized`, `trailingSlash: true`.

Files:
- `src/lib/clinic.config.ts`: the ONE editable file. It holds `whatsappNumber` (digits with country code, placeholder like `91XXXXXXXXXX`), the name, address, hours, `treatments[]` (id, name, description) and `team[]` (photo `""` means placeholder).
- `src/lib/whatsapp.ts`: `whatsappUrl(msg)` builds `https://wa.me/<n>?text=${encodeURIComponent(msg)}`. Strip only spaces, `+`, `-` and brackets so an unconfigured placeholder stays visible, and warn in the console if the number is invalid. Also `enquiryMessage(treatment?)`, `bookingMessage(details)` (omit name and phone lines when they're empty; format the date as "Mon 12 October, 2026" and the time as "4:00 PM"), and `openWhatsApp()` (`window.open`, falling back to the same tab).
- `src/components/booking.tsx`: a `BookingProvider` context plus `<BookButton treatment>`. BookButton is a real `<a href=wa.me…>`, so it works without JavaScript. With JavaScript, `preventDefault` opens the drawer with the treatment preselected; `direct` skips the drawer.
- Sections, in order: Header (transparent, then glass once scrolled; mobile menu), Hero with 3D, trust strip, Services grid, Interactive diagram (an SVG inside a phone mock-up), Why us, Team, How booking works (3 steps), Final CTA, Footer, then FloatingCta (desktop) and the sticky bar (mobile).
- SEO: `metadata` and `viewport`, plus JSON-LD (`Dentist` or `LocalBusiness`) built ONLY from config fields.
- Add a simple `/privacy/` placeholder page.

## 3. Mobile-first rules (most traffic is on phones)

- Design at 360–390px first. The primary CTA must be visible on the first screen: hero visual at ~36svh (min 260px, max 420px), then label, headline (clamp from 46px), a short lead, and a full-width 56px white button.
- Tap targets are at least 44px; mobile booking buttons are 56px. Footer links get vertical padding. The logo link gets `min-h-[44px]`.
- Inputs use 16px text (prevents iOS zoom) and are at least 48px tall.
- The booking drawer is a bottom sheet on mobile and a right-hand drawer at 640px and up (pick the direction from `matchMedia` when opening). Inside it:
  - a treatment `<select>` (required);
  - a swipeable row of 14 day chips (Today, Tmrw, …) plus an "Another date" native input (`min-w-0 flex-1` so it doesn't overflow);
  - a 4×2 grid of time-slot chips plus an "Other time" input;
  - optional name, phone and note inside `<details>`;
  - a sticky submit button with `env(safe-area-inset-bottom)` padding;
  - a "Skip the form, just open WhatsApp" link.
- Drawer behaviour: focus the dialog itself (not an input, so the keyboard doesn't pop up), trap Tab, close on Esc and restore focus, lock scroll, use `overscroll-contain`. Validation marks fields `aria-invalid`, links errors with `aria-describedby`, and scrolls to and focuses the first error.
- The sticky mobile bar appears after 320px of scroll; give the footer `pb-28` so the bar never covers content.

## 4. The 3D hero (procedural, no downloads)

- Geometry in `three/geometry.ts`:
  - Crown: a CatmullRom radius/height profile swept around a parametric grid, a superellipse plan, and four Gaussian cusps minus a fissure on top.
  - Implant: a parametric surface `r = core(t) + depth * tri(fract(y/pitch + u/2π))^0.6`. That gives real helical threads.
  - Collar and roots: `LatheGeometry` (bend the roots' X by t²).
- Materials: porcelain is `MeshPhysicalMaterial` with clearcoat 1, roughness ~0.2 and sheen in the accent tint. Titanium is metalness 1, roughness ~0.26. A thin emissive torus at the crown–collar seam, plus a small point light there, gives the glow.
- Lighting: drei `<Environment>` with only `<Lightformer>`s (white key, accent-colour rims, top strip) so no HDR is fetched. Add `ContactShadows`. Camera fov 30, z ≈ 10.
- Motion: slow Y rotation (0.18 rad/s), a sine float, and pointer parallax with lerp. With reduced motion: no animation and no pointer tracking.
- Loading: `next/dynamic` with `ssr:false`, started in `requestIdleCallback`. A WebP poster render shows first. Skip live 3D on `saveData` or `deviceMemory < 2`. Pause with `frameloop="never"` when off-screen (IntersectionObserver). Use dpr [1, 1.5] on mobile.
- PerfGuard: sample 60 frame deltas; if the median is above 0.05s, call `onSlow` and fall back to the poster.
- Posters: a temporary `/render?v=variant` page with `preserveDrawingBuffer`. A Playwright script calls `canvas.toDataURL()` for each variant (implant, tooth, crown, aligner, screw); then crop to the bounding box and save as WebP q88 with PIL. Reuse the renders on the service cards and the final CTA. Move the render page to `tools/` before the production build.
- Match the poster's size and position to the live canvas so the crossfade doesn't show two models: compare screenshots of the poster and the live render.

## 5. Styling gotchas (learned the hard way)

- Define Tailwind colours as **hex literals**, not `var(--x)`. Otherwise opacity modifiers like `bg-primary/20` silently don't generate. Keep CSS variables in `:root` as well.
- Keyframe animations must use the individual `translate:` and `scale:` properties, not `transform:`. Otherwise they override Tailwind's `-translate-x-1/2` centring and elements jump.
- Scroll reveal: an inline script adds `.js` to `<html>`. Then `.js [data-reveal]{opacity:0}` plus an IntersectionObserver adds `.in`. Content stays visible without JavaScript and with reduced motion. Put `data-reveal` on a card's inner element, not on a grid cell whose background shows the gap colour.
- Round computed SVG coordinates (`Math.round(x*100)/100`) to avoid hydration mismatches.
- Don't use `content-visibility:auto` on grid cards.
- Look: square corners, 1px low-alpha hairlines, glows instead of shadows, oversized light headlines (weight 300, tracking about −0.035em, leading 0.94), the highlighted phrase in the accent colour, uppercase 11px labels with 0.18em tracking, and a 6% grain overlay on the hero and final CTA. Don't use AI tropes (blue-purple gradients, emoji, left-border cards).

## 6. Verify (Playwright with `executablePath: '/opt/pw-browsers/chromium'`; install `playwright` with `--no-save`)

Serve `out/` with `python3 -m http.server`, then script these checks:
- List every `<a>`. All booking links start with `https://wa.me/`, and the decoded messages contain the right treatment names. No `href="#"` dead buttons.
- Mock `window.open`. Submitting empty shows the required errors and focuses the first. After filling it in (tap a day chip and a time chip, open `<details>`), the decoded message has the correct date and time. Esc closes the drawer and focus returns.
- `scrollWidth - innerWidth === 0` at 360, 390, 768, 1024, 1280 and 1920.
- A tap-target audit on a mobile context (`isMobile`, `hasTouch`) finds no visible interactive element under 40px.
- Screenshots: mobile first screen, drawer, errors; laptop and tablet hero. Headless software WebGL is slow and starves IntersectionObserver, so wait about 1s per scroll step, or test with `--disable-webgl`, before deciding reveals are broken.

## 7. Deliver

- Write a project README covering quick start, the config table, the WhatsApp utilities, the 3D fallbacks and how to regenerate the posters. Zip the project without `node_modules`, `.next` or `out`, write the zip to `/mnt/user-data/outputs/`, and send it with SendUserFile.
- **Live preview artifact:** copy `out/` and remove 404 pages and `*.txt`. Then:
  - Rename `_next` to `assets-next` (the artifact service reserves paths starting with `_`).
  - Rewrite `"/_next/` to `"./assets-next/`, plus `/renders/`, `/icon.svg` and `/privacy/`, in the HTML and JS. In the CSS, point font URLs at `../media/`. In nested pages such as `privacy/index.html`, use `../`.
  - Replace any literal U+FFFD in JS with ``.
  - Drop `_buildManifest`, `_app`, `_error` and `_not-found` chunks.
  - Test the copy under a subpath, then publish it with `root` set to the copy and a `files` map. The page's `<title>` becomes the artifact name.
- **Design System artifact** (if one is open or requested): read the type instructions. Then upload the logos and renders as assets, and write `tokens.json` (lists, not DTCG maps; rgba allowed; usage notes naming grounds and contrast), a README brand book (content fundamentals and honesty rules, visual foundations, iconography, logo, mobile-first rules), `components/bundle.css`, plain-HTML previews with a marker on line 1 and a Google Fonts link, a README per component (Button, WhatsAppCta, Chip, ServiceCard, FormField, PlanStep, the signature diagram), asset group READMEs and the cover. The index goes last; re-read it right before publishing.
- Final reply: one or two sentences on what shipped, what was checked, and the placeholders the person must fill in before going live (WhatsApp number first).
