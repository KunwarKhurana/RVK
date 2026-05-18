# RUDRA Shopify Theme — Setup Guide

This is the Shopify theme for **RUDRA — Astrological Healing Ittar by RVK Ventures**.
Files in this folder follow Shopify's standard theme structure (layout, sections, snippets, templates, assets, config, locales).

The theme reads zodiac-specific content (Hindi name, ruling planet, fragrance notes, etc.) from **product metafields**, so once your products are set up in Shopify admin with the right metafields, the homepage grid and product pages populate automatically.

---

## 1. Prerequisites

You need:

- A **Shopify store** (Basic plan or higher). Sign up at https://www.shopify.com.
- **Node.js** installed locally (https://nodejs.org).
- **Shopify CLI** installed:
  ```bash
  npm install -g @shopify/cli @shopify/theme
  ```
- A **collaborator login or dev store** to push the theme to.

---

## 2. Shopify admin setup

Do these steps in your Shopify admin **before** uploading the theme — otherwise the homepage grid will show placeholders.

### 2a. Create the collection

1. Go to **Products → Collections → Create collection**.
2. Title: `Zodiac Ittars`
3. Handle (lowercase, auto-filled): `zodiac-ittars`
4. Collection type: **Manual**
5. Save.

The homepage section is wired to read from a collection with handle `zodiac-ittars` (configurable in the theme editor under **Sections → Zodiac collection**).

### 2b. Define product metafields

Go to **Settings → Custom data → Products → Add definition** and add each of these:

| Name | Namespace and key | Type |
|------|-------------------|------|
| Hindi name | `custom.hindi_name` | Single line text |
| Zodiac glyph | `custom.zodiac_glyph` | Single line text |
| Date range | `custom.date_range` | Single line text |
| Element | `custom.element` | Single line text |
| Ruling planet | `custom.ruling_planet` | Single line text |
| Quality | `custom.quality` | Single line text |
| Tagline | `custom.tagline` | Single line text |
| Intro paragraph | `custom.intro` | Multi-line text |
| Fragrance notes | `custom.fragrance_notes` | List of single line text |
| Mood | `custom.mood` | Single line text |
| Healing intent | `custom.healing_intent` | List of single line text |

> The theme renders these conditionally — if you leave one blank, the section just doesn't appear on the product page. So you can launch with partial data and fill in over time.

### 2c. Add the 12 zodiac products

For each zodiac sign, create a product (**Products → Add product**):

| Title | Vendor | Price |
|-------|--------|-------|
| Aries Ittar | RUDRA | 650 |
| Taurus Ittar | RUDRA | 650 |
| Gemini Ittar | RUDRA | 650 |
| Cancer Ittar | RUDRA | 650 |
| Leo Ittar | RUDRA | 650 |
| Virgo Ittar | RUDRA | 650 |
| Libra Ittar | RUDRA | 650 |
| Scorpio Ittar | RUDRA | 650 |
| Sagittarius Ittar | RUDRA | 650 |
| Capricorn Ittar | RUDRA | 650 |
| Aquarius Ittar | RUDRA | 650 |
| Pisces Ittar | RUDRA | 650 |

For each product:

1. Upload at least one image (the bottle photo).
2. Description: leave blank if you'll use the `custom.intro` metafield, or write a short version.
3. Add the product to the `Zodiac Ittars` collection.
4. Fill in the metafields. The content from the old [script.js](../script.js) lines 9-250 is your source for the zodiac data — copy values from there into each product's metafields.

> **Reference data for the 12 zodiacs** is preserved verbatim in the previous static site at the repo root (`script.js`). When filling out metafields, copy from there.

### 2d. Set up navigation

Go to **Online Store → Navigation**:

1. Edit the **Main menu**. Suggested links: Zodiacs → `/collections/all`, About → `/pages/about`, FAQ → `/pages/faq`, Contact → `/pages/contact`.
2. Edit the **Footer menu** with similar links.

(Create the `about`, `faq`, `contact` pages under **Online Store → Pages**.)

### 2e. Payments (India)

Shopify Payments is not universally available in India. Most Indian merchants use:

- **Razorpay** — most popular. Settings → Payments → search "Razorpay" → connect. KYC takes 1–3 days.
- **Cashfree** — alternative.

You won't be able to accept real payments until your gateway KYC is approved.

### 2f. Legal pages

Go to **Settings → Policies** and use Shopify's free generators for:

- Refund policy
- Privacy policy
- Terms of service
- Shipping policy

Without these, payment gateways won't activate.

### 2g. Shipping

Go to **Settings → Shipping and delivery**. Create a shipping zone for **India** with a flat rate (e.g., ₹80 standard, free over ₹2000).

---

## 3. Upload the theme

### Option A — Shopify CLI (recommended, supports live preview)

From the **`theme/`** directory of this repo:

```bash
cd theme
shopify theme dev --store=your-store.myshopify.com
```

This boots a local preview that hot-reloads. Make a change to a `.liquid` or `.css` file and the browser refreshes.

To push the theme as an unpublished theme:

```bash
shopify theme push --store=your-store.myshopify.com --unpublished
```

To publish it as the live theme:

```bash
shopify theme push --store=your-store.myshopify.com --live
```

### Option B — Upload as a ZIP via admin

1. From the `theme/` folder, create a ZIP of everything **inside** it (so the ZIP's root contains `assets/`, `config/`, `layout/`, etc. — not a `theme/` folder).
2. In Shopify admin: **Online Store → Themes → Add theme → Upload zip file**.
3. Once uploaded, click **Customize** to preview, then **Publish** to go live.

---

## 4. Customize from the theme editor

After the theme is uploaded, go to **Online Store → Themes → Customize**. You can:

- Re-order, hide, or add homepage sections (Hero, Value strip, Zodiac collection, About, How to use, FAQ, Contact CTA)
- Edit copy in every section without touching code
- Change colors and the brand logo under **Theme settings**
- Edit footer menu blocks
- Switch zodiac cards between **product image** mode and **Unicode glyph** mode (use product image once you've uploaded bottle photos)

---

## 5. Test checklist before going live

- [ ] Homepage loads and shows all 12 zodiac cards (not placeholders)
- [ ] Clicking a zodiac card opens a product page with the right metafields rendered
- [ ] "Add to cart" works and the cart drawer slides in showing the item
- [ ] The cart count badge in the header updates
- [ ] Cart page (`/cart`) shows the right items + subtotal
- [ ] Checkout opens (you'll need payment KYC done to take real payments — test mode works for now)
- [ ] Footer fine print, links, and copyright year are correct
- [ ] On mobile: nav hamburger toggles, hero stacks, grid drops to 1–2 columns
- [ ] 404 page renders cleanly at `/something-fake`

---

## 6. File map

```
theme/
├── assets/
│   ├── theme.css           # All styles (colors come from config/settings_data.json)
│   └── theme.js            # Cart drawer + mobile nav + product page + scroll reveal
├── config/
│   ├── settings_schema.json  # Theme editor settings definition
│   └── settings_data.json    # Default values for theme settings
├── layout/
│   └── theme.liquid          # Master HTML shell
├── locales/
│   └── en.default.json       # UI translation strings
├── sections/
│   ├── header.liquid
│   ├── header-group.json     # Section-group config for header
│   ├── footer.liquid
│   ├── footer-group.json     # Section-group config for footer
│   ├── hero.liquid
│   ├── value-strip.liquid
│   ├── zodiac-collection.liquid
│   ├── about.liquid
│   ├── how-to-use.liquid
│   ├── faq.liquid
│   ├── contact-cta.liquid
│   ├── main-product.liquid   # The product page
│   └── related-products.liquid
├── snippets/
│   ├── theme-tokens.liquid   # CSS variables from settings
│   ├── cart-drawer.liquid
│   ├── zodiac-card.liquid    # Reusable product card
│   ├── icon-cart.liquid
│   └── icon-close.liquid
└── templates/
    ├── index.json            # Homepage composition
    ├── product.json          # Product page composition
    ├── collection.liquid     # Browse a collection
    ├── list-collections.liquid
    ├── cart.liquid           # Full cart page
    ├── page.liquid           # Generic page (legal etc.)
    ├── search.liquid
    └── 404.liquid
```

---

## 7. Where the design lives

- **Colors** — `config/settings_data.json` (also editable in theme editor under **Colors**)
- **Typography** — Google Fonts (`Cormorant Garamond`, `Inter`, `Tiro Devanagari Sanskrit`) loaded in `layout/theme.liquid`; sizes/weights in `assets/theme.css`
- **Layout / components** — `assets/theme.css`
- **Section content** — each section's `{% schema %}` block (editable in theme editor) and `templates/index.json` (defaults)

---

## 8. Known TODOs

- **Hero image carousel** — currently the hero uses the zodiac wheel; once you have bottle photos for all 12, the hero could swap to a slow-advancing carousel. Worth ~half a day's work once images are in.
- **Customer accounts** — the theme uses Shopify's defaults. If you want a branded customer login/account screen, that's a separate set of templates (`templates/customers/`).
- **Newsletter** — not wired in. Easy to add via a section that posts to `/contact#contact_form` with `form_type=customer`.
- **Blog** — not built. If you want ritual/wellness content, we'd add `templates/blog.liquid` and `templates/article.liquid`.

---

## 9. Help

If something looks wrong in the theme:

- For homepage layout: edit `templates/index.json` or use the theme editor
- For product page: edit `sections/main-product.liquid`
- For colors: edit `config/settings_data.json` or the theme editor
- For copy: edit the relevant section's schema defaults or use the theme editor

For Shopify-specific questions (payments, taxes, shipping), the official help center is at https://help.shopify.com.
