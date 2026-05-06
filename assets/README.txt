RUDRA SITE — IMAGE ASSETS
===========================

Drop these files into this `assets/` folder so the site can pick them up.
The site already works without them (uses Unicode zodiac glyphs as fallback),
but real images make it shine.

REQUIRED:
---------
  rvk-logo.png              The RVK pinwheel logo (the colorful one with "RVK" in the centre)
                            Recommended: PNG with transparent background, ~512×512px.

OPTIONAL (drop into assets/zodiacs/):
-------------------------------------
You can use the zodiac sticker images you already have. Save each
sticker as a PNG with this exact filename:

  zodiacs/aries.png
  zodiacs/taurus.png
  zodiacs/gemini.png
  zodiacs/cancer.png
  zodiacs/leo.png
  zodiacs/virgo.png
  zodiacs/libra.png
  zodiacs/scorpio.png
  zodiacs/sagittarius.png
  zodiacs/capricorn.png
  zodiacs/aquarius.png
  zodiacs/pisces.png

(If you'd like the cards to show the actual sticker images instead of
Unicode glyphs, let me know and I'll wire it up.)

PRODUCT PHOTOS (optional, for future product detail pages):
  bottle-12ml.jpg           Hero shot of the 12ml bottle
  packaging.jpg             Box / lifestyle shot

THINGS TO UPDATE BEFORE GOING LIVE
==================================
Open `index.html` and `script.js` and replace these placeholders:

  +91XXXXXXXXXX             → real WhatsApp number (digits only, e.g. 919876543210)
  https://instagram.com/    → real Instagram handle URL
  hello@rudra.example       → real contact email
