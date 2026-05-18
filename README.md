# RUDRA — Astrological Healing Ittar

By **RVK Ventures**. Twelve handcrafted ittars, one for every zodiac sign.

This repository contains two things:

1. **`theme/`** — the production **Shopify theme** (Liquid + JSON sections). This is what you upload to Shopify. See [`theme/SETUP.md`](theme/SETUP.md) for the full setup guide.
2. **Root files** (`index.html`, `styles.css`, `script.js`, `assets/`) — the original static landing page. Kept here as a design reference and a fallback that can be hosted on any plain web host.

## Quick start (Shopify theme)

```bash
cd theme
npm install -g @shopify/cli @shopify/theme
shopify theme dev --store=your-store.myshopify.com
```

See [`theme/SETUP.md`](theme/SETUP.md) for:
- Creating the Shopify store
- Adding the 12 zodiac products
- Setting up product metafields (Hindi name, ruling planet, fragrance notes, etc.)
- Payment gateway (Razorpay for India)
- Uploading the theme

## Tech

- Shopify (Liquid templating, online store 2.0 sections)
- Vanilla JS (no framework) for cart drawer + product page interactivity
- Hand-written CSS using design tokens (cream, gold, deep red palette)
- Cormorant Garamond + Inter + Tiro Devanagari Sanskrit (Google Fonts)
