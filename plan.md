# Trimhaus Barbing Salon — implementation plan

## Scope
Build a polished, mobile-first one-page website for a barbing salon in Bratislava with service discovery, booking/contact details, an appointment form, and a payment-ready deposit flow. Use the owner's real contact details: goldnaldo9@gmail.com, Budatínska 23, Bratislava, and +421 915 189 681. Because no salon brand name was supplied, use the working brand name Trimhaus and keep the content easy to edit. Payment is provided through the managed Stripe sandbox; the UI must clearly distinguish test/setup state from live payments.

## Design direction
Three possible directions:
- **Editorial Atelier** (0.06): warm paper, brass, charcoal, and oversized serif headlines with a boutique magazine rhythm.
- **Midnight Club** (0.08): near-black surfaces, electric lime, condensed type, and a nightlife barbershop energy.
- **Quiet Craft** (0.04): bone white, olive, and ink with calm, gallery-like spacing and craft-led copy.

Chosen: **Editorial Atelier**.

- **Design Movement:** contemporary editorial hospitality with barbershop craft cues.
- **Core Principles:** tactile warmth, confident restraint, visible craft, and frictionless booking.
- **Color Philosophy:** espresso charcoal grounds the page in confidence; warm cream keeps it approachable; brass amber is the signature accent that feels like light on a vintage mirror.
- **Layout Paradigm:** asymmetrical magazine layout with a full-bleed hero image, overlapping information cards, and horizontal service rails rather than a centered dashboard grid.
- **Signature Elements:** a thin brass rule with numbered section labels; oversized serif display type; small “station note” cards that feel like handwritten shop details.
- **Interaction Philosophy:** CTAs are decisive and friendly; forms stay lightweight; payment is a clear next step rather than a surprise.
- **Animation:** subtle upward reveal on sections, slow hero image drift, and quick button sheen on hover; avoid noisy motion.
- **Typography System:** DM Serif Display for headlines, Manrope for navigation, labels, body, and prices; wide tracking for utility labels.
- **Brand Essence:** a precise, welcoming Bratislava barbershop for people who want a sharp cut and an easy booking experience. Personality: precise, warm, assured.
- **Brand Voice:** concise, personable, quietly confident. Example lines: “A better cut starts with a better chair.” and “Choose your station. We’ll handle the rest.”
- **Wordmark & Logo:** a compact TH monogram built from two parallel brass strokes, paired with a small uppercase wordmark.
- **Signature Brand Color:** polished brass amber `#D4A24C`.

## Implementation
- React + Tailwind CSS in the initialized web-db-user project.
- Single `/` route plus `/404`; static `public/manus-routes.json` declares both.
- `Home.tsx` owns the marketing page and interactive booking modal.
- `index.css` defines the editorial palette, typography, responsive layout, and motion.
- Add a generated hero image at `client/public/trimhaus-hero.png`.
- Add a server `POST /api/checkout` route that creates a Stripe Checkout Session for a €10 booking deposit, with service/date/name/email metadata, and a raw-body `/api/stripe/webhook` route that verifies signatures and acknowledges subscribed events. For now, the UI falls back to a clear “payment setup” message if Stripe is not available in a local preview.
- Keep application data minimal: no card data is stored; bookings are represented in Checkout metadata and the UI gives the customer the booking details before redirecting.

## Delivery constraints
Use only the supplied contact details; do not invent a personal email or phone. Keep the site production-ready but do not claim live payments until the owner connects/claims the Stripe account and configures live keys. Run typecheck and build, start Preview on port 3000, validate `/manus-routes.json`, and save the finished files to the managed Git checkpoint.
