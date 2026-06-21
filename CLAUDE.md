# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (verifies TypeScript + static export)
npm run lint     # Run ESLint
```

## Project Status

Phase 1 is **built and working**. The Next.js 16 app is fully scaffolded with all Phase 1 pages and components. Run `npm run dev` to start.

Archive files (HTML prototypes) are kept for reference:
- `vmpvilla-website-blueprint.html` — product blueprint, tech stack decisions, 3-phase roadmap
- `vmpvilla-website-phase1.html` — original UI prototype (source of truth for design)

## Tech Stack (Active)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Styling | Tailwind CSS 4 (`@theme` in `globals.css`, no config file) |
| Language | TypeScript |
| Fonts | `next/font/google` — Playfair Display + DM Sans |
| Images | `next/image` with Unsplash remote pattern |

## Planned (Phase 2+)

| Layer | Choice |
|---|---|
| Database | Supabase (bookings, availability) |
| Payments | Razorpay (UPI, cards, net banking) |
| Push notifications | Firebase Cloud Messaging |
| Email automation | Brevo |
| WhatsApp API | AiSensy / Interakt |
| Hosting | Vercel + Hostinger DNS (vmpvilla.in) |
| Analytics | Google Analytics 4 + Microsoft Clarity |

## File Structure

```
app/
  layout.tsx          # Root layout: Nav, Footer, WhatsApp float, PushBanner
  globals.css         # Tailwind @theme tokens + CSS custom props + global utilities
  page.tsx            # Home page (composes all sections)
  rooms/page.tsx
  facilities/page.tsx
  location/page.tsx
  contact/page.tsx
  faq/page.tsx
  sitemap.ts

components/
  Nav.tsx             # Fixed nav, scroll-aware, mobile hamburger (client)
  Footer.tsx          # 4-column footer (server)
  WhatsAppFloat.tsx   # Fixed bottom-right WhatsApp button (client)
  PushBanner.tsx      # Push notification prompt, 8s delay (client)
  BookingBar.tsx      # Check-in/out/guests/room → WhatsApp URL (client)
  ScrollReveal.tsx    # IntersectionObserver fade-in wrapper (client)
  sections/           # One file per homepage section
    Hero.tsx
    RoomsSection.tsx
    FacilitiesSection.tsx
    EcoStory.tsx
    Gallery.tsx
    LocationSection.tsx
    ReviewsSection.tsx
    FaqSection.tsx      # (client - accordion state)
    ContactSection.tsx  # (client - enquiry form)

lib/
  constants.ts        # ALL business data: rooms, distances, reviews, FAQ, eco stats
  whatsapp.ts         # URL builder + message formatters
```

## Design System (Tailwind CSS 4)

All tokens are defined in `app/globals.css` under `@theme` and in `:root` for CSS usage.

**Tailwind class names** (use these in JSX):
- Colors: `bg-ink`, `text-saffron`, `bg-cream`, `text-muted`, `border-marble`, `bg-leaf`, `bg-leaf-l`, `text-stone`, etc.
- Custom utilities: `font-display` (Playfair Display), `animate-pulse-dot`, `animate-slide-up`
- CSS-only classes: `gallery-grid`, `gallery-img-1..5`, `faq-answer`, `nav-scrolled`, `booking-bar-wrap`

**Color tokens**:
```
--ink       #1a1714   primary text, dark backgrounds
--saffron   #e8762b   brand accent, CTAs
--saffron-d #c4601e   hover state
--cream     #faf6f0   page background
--marble    #ede8e1   section backgrounds, dividers
--stone     #bfb5aa   borders, labels
--muted     #7a6e65   secondary text
--leaf      #3a6b4a   eco/green accent
--leaf-l    #ebf5ee   light green backgrounds
```

## Booking Flow (Phase 1)

All CTAs build a WhatsApp URL via `lib/whatsapp.ts` and open it in a new tab — **no backend involved**. Do not add a backend booking flow until Supabase is wired (Phase 2).

```ts
// Update WHATSAPP_NUMBER in lib/constants.ts before launch
export const WHATSAPP_NUMBER = "919876543210"; // placeholder
```

## Business Data

All content lives in `lib/constants.ts`: ROOMS, DISTANCES, FACILITIES, REVIEWS, FAQ_ITEMS, ECO_STATS. Update there; components read from it.

**Room pricing**: Deluxe AC ₹2,500/night · Standard AC ₹1,800/night · Dormitory ₹1,500/bed  
**Address**: Tajganj, Agra, UP 282001 — 4.2 km from Taj Mahal  
**Contact**: hello@vmpvilla.in · @vmp_homestay_agra

## Phase Roadmap

**Phase 2 (next)**: Supabase availability calendar, Razorpay payments, Brevo email automation, SMS via MSG91, seasonal offers with countdown timers, Hindi/English toggle.  
**Phase 3**: PWA, AI chatbot, experience/add-on builder, loyalty programme, owner admin dashboard, Sanity blog.
