# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This repository is in the **pre-development / design phase**. There is no Next.js application yet — the repo currently contains:

- `vmpvilla-website-blueprint.html` — full product blueprint: current-site analysis, planned pages, feature priority list, tech stack decisions, and 3-phase roadmap
- `vmpvilla-website-phase1.html` — a complete, standalone HTML prototype of the Phase 1 website (the actual production UI design)

Open either file directly in a browser to view it — no build step required. The Next.js project has not been scaffolded yet.

## Planned Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Deploy to Vercel |
| Styling | Tailwind CSS | Mobile-first |
| Database | Supabase | Bookings, availability |
| CMS | Sanity | Blog / Agra Guide content |
| Payments | Razorpay | UPI, cards, net banking — Indian market |
| Push notifications | Firebase Cloud Messaging | Browser push opt-in |
| Email automation | Brevo (formerly Sendinblue) | Free tier: 300/day |
| WhatsApp API | AiSensy or Interakt | Broadcast + chatbot |
| SMS | Textlocal / MSG91 | Booking confirmations, OTPs |
| Analytics | Google Analytics 4 + Microsoft Clarity | Clarity for heatmaps |
| DNS | Hostinger | Domain: vmpvilla.in |

## Design System (from Phase 1 prototype)

**Fonts** (Google Fonts):
- Headings: `Playfair Display` (serif, weights 400/700/900 — including italic for emphasis)
- Body: `DM Sans` (weights 300/400/500/600)

**CSS Custom Properties** (replicate exactly in Tailwind config or globals):
```css
--ink:       #1A1714   /* near-black — primary text, dark backgrounds */
--saffron:   #E8762B   /* brand primary accent — CTAs, highlights */
--saffron-d: #C4601E   /* saffron hover/active state */
--cream:     #FAF6F0   /* page background */
--marble:    #EDE8E1   /* subtle section backgrounds, dividers */
--stone:     #BFB5AA   /* borders, muted labels */
--muted:     #7A6E65   /* secondary text */
--leaf:      #3A6B4A   /* eco/green accent */
--leaf-l:    #EBF5EE   /* light green section background */
--white:     #FFFFFF
--nav-h:     72px
```

**Key UI patterns from prototype** (preserve in Next.js implementation):
- Nav: fixed, transparent over hero, becomes `rgba(26,23,20,0.96)` with `backdrop-filter:blur(12px)` on scroll
- Mobile menu: full-screen overlay at z-index 99 with centered links at 22px
- Hero: `min-height: 100svh`, background image + gradient overlay, content anchored to bottom-left
- Booking bar: floats up `-40px` over the section below it; has "DIRECT BOOKING — NO COMMISSION" label via `::before` pseudo-element; pre-fills today+1 and today+3 as default dates
- Room cards: `aspect-ratio: 4/3` image, hover lifts `translateY(-4px)` with shadow
- Gallery grid: `grid-template-columns: 2fr 1fr 1fr` with first image spanning 2 rows
- Push notification prompt: appears bottom-left after 8-second delay; uses `localStorage.getItem('pushDismissed')` to suppress repeat
- Scroll animations: `IntersectionObserver` fades in `.room-card`, `.review-card`, `.eco-stat`, `.fac-item`, `.dist-item`
- FAQ accordion: only one item open at a time; `max-height` CSS transition for smooth expand
- Floating WhatsApp button: fixed bottom-right, hides text label on `max-width: 600px` (icon-only circle)

**Review source badge colours:**
```
Booking.com  → background #003580, white text   (.src-booking)
TripAdvisor  → background #34E0A1, black text   (.src-tripadvisor)
Google       → background #4285F4, white text   (.src-google)
MakeMyTrip   → background #D52B2B, white text   (.src-mmt)
```

## Business Context

**VMP Villa Home Stay** — family-run eco-homestay in Agra, Uttar Pradesh, India. Operated by Aneesh & Bhavna. Established 2015.

| Detail | Value |
|---|---|
| Address | Tajganj, Agra, UP 282001 |
| Distance to Taj Mahal | 4.2 km (12 min) |
| Distance to Agra Fort | 2.8 km (8 min) |
| Distance to Agra Cantt. station | 3.1 km (10 min) |
| Distance to Agra Airport | 7.0 km (20 min) |
| Instagram | @vmp_homestay_agra |
| Email | hello@vmpvilla.in |
| Guest score | 9.4 across 200+ reviews (Booking.com, TripAdvisor, Google, MakeMyTrip) |

**Room types and pricing:**
- Deluxe AC Room — ₹2,500/night (queen bed, en-suite bath, garden view)
- Standard AC Room — ₹1,800/night (twin/double, shared bath)
- Dormitory Bed — ₹1,500/bed (bunk, shared bath, personal locker)

**Eco credentials:** Rainwater harvesting, solar lighting, organic kitchen garden, 100% plastic-free rooms.

**Booking funnel:** All CTAs resolve to a WhatsApp message (`wa.me/91XXXXXXXXXX`) with pre-filled text — there is no booking engine yet (Phase 2). Do not change this pattern until Supabase + Razorpay are wired.

## Pages to Build (12 total)

| Page | Purpose |
|---|---|
| Home | Hero + booking widget + reviews strip |
| Rooms | Deluxe AC / Standard AC / Dormitory — gallery + rates |
| Book Now | Live availability calendar + payment (Phase 2) |
| Facilities | WiFi, breakfast, garden, parking, fireplace, terrace |
| Location | Google Maps embed, distances, transport tips |
| Our Story | Eco ethos, Aneesh & Bhavna's background |
| Reviews | Aggregated from Booking.com, TripAdvisor, MMT, Google |
| Offers | Seasonal deals, countdown timers |
| Agra Guide | SEO blog via Sanity CMS (Phase 3) |
| FAQ | Check-in/out, pets, kids, cancellations, food, transfers |
| Contact | WhatsApp, phone, email, enquiry form |
| Guest Portal | My booking, receipts, special requests (Phase 2) |

## Delivery Phases

**Phase 1 — Foundation (4–6 weeks):** Mobile-first Next.js + Tailwind site. All static pages. Photo gallery. WhatsApp float button. Google Maps embed. Firebase push opt-in. SEO meta + sitemap.

**Phase 2 — Booking Engine (4–6 weeks):** Supabase availability calendar. Razorpay deposit/full-pay. Booking confirmation emails (Brevo) + SMS (MSG91). Pre-arrival and post-checkout email sequences. Seasonal offers page with countdown. Hindi/English language toggle. Review aggregation.

**Phase 3 — Growth (months 4–6):** PWA (installable). AI chatbot for FAQ (Gemini or Claude). Add-on / experience builder (airport pickup, meals, tours). Loyalty programme for repeat guests. Owner admin dashboard. Sanity-powered blog. 360° virtual room tours. Eco impact counter.

## WhatsApp Integration Pattern

Booking bar and enquiry form both construct a pre-filled WhatsApp URL:

```js
const msg = `Hi! I'd like to check availability...\n\nCheck-in: ${checkin}\nCheck-out: ${checkout}`;
window.open('https://wa.me/91XXXXXXXXXX?text=' + encodeURIComponent(msg), '_blank');
```

Replace the placeholder number with the real WhatsApp Business number before launch.

## Localisation Notes

- Primary currency: Indian Rupee (₹)
- Date format: display as DD/MM/YYYY for Indian users; `<input type="date">` stores as ISO
- Language toggle (Phase 2): Hindi ↔ English; use `next-i18next` or `next-intl`
- Payment methods priority: UPI first, then debit/credit cards, then net banking (Razorpay handles all)
- WhatsApp is the primary customer communication channel — prioritise it over email in all CTAs
