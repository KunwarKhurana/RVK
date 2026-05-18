// =========================================================
// RUDRA — Astrological Healing Ittar
// Zodiac data + interactions
// NOTE: Content below is a draft to be replaced with the
// brand's final copy. Keep wellness/aspirational tone — no
// medical or therapeutic claims.
// =========================================================

const zodiacs = [
  {
    key: 'aries',
    name: 'Aries',
    hindi: 'मेष',
    glyph: '♈',
    dates: 'Mar 21 — Apr 19',
    element: 'Fire',
    planet: 'Mars',
    quality: 'Cardinal',
    tagline: 'For the one who moves first.',
    intro: 'A warm, fiery composition built for the trailblazer. Spice meets smoke meets a steady wood base — the scent of starting before you are ready, and finishing what you began.',
    notes: ['Saffron', 'Cinnamon', 'Oud', 'Cedarwood'],
    mood: 'Bold · Energising · Courageous',
    benefits: [
      'Ignites confidence before a high-stakes moment',
      'Sharpens focus and cuts through hesitation',
      'Channels Mars energy — drive, action, momentum',
      'Best worn at the start of a day or a new chapter',
    ],
  },
  {
    key: 'taurus',
    name: 'Taurus',
    hindi: 'वृषभ',
    glyph: '♉',
    dates: 'Apr 20 — May 20',
    element: 'Earth',
    planet: 'Venus',
    quality: 'Fixed',
    tagline: 'For the one who builds slowly, beautifully.',
    intro: 'Soft florals laid over rich, grounding wood. A scent that lingers — patient and unhurried, like the earth itself.',
    notes: ['Rose', 'Vanilla', 'Sandalwood', 'Vetiver'],
    mood: 'Grounded · Sensual · Calming',
    benefits: [
      'Restores a sense of stability when life feels rushed',
      'Soothes the senses; pairs with slow rituals — bath, tea, evening reading',
      'Channels Venus energy — beauty, comfort, abundance',
      'Best worn for unhurried evenings and quiet self-care',
    ],
  },
  {
    key: 'gemini',
    name: 'Gemini',
    hindi: 'मिथुन',
    glyph: '♊',
    dates: 'May 21 — Jun 20',
    element: 'Air',
    planet: 'Mercury',
    quality: 'Mutable',
    tagline: 'For the one with a dozen ideas before breakfast.',
    intro: 'Bright citrus, fresh herbs, and a whisper of jasmine. Light enough to keep up with a quick mind — layered enough to reward a closer breath.',
    notes: ['Bergamot', 'Lavender', 'Jasmine', 'White Musk'],
    mood: 'Light · Playful · Mentally Alert',
    benefits: [
      'Clears mental fog before a long day of conversation',
      'Sparks curiosity and creative connection-making',
      'Channels Mercury energy — wit, words, learning',
      'Best worn for meetings, writing, social mornings',
    ],
  },
  {
    key: 'cancer',
    name: 'Cancer',
    hindi: 'कर्क',
    glyph: '♋',
    dates: 'Jun 21 — Jul 22',
    element: 'Water',
    planet: 'Moon',
    quality: 'Cardinal',
    tagline: 'For the one who feels everything, deeply.',
    intro: 'Tender white florals over a soft wood base. A scent like a held hand — gentle, comforting, present.',
    notes: ['Lotus', 'White Musk', 'Mogra', 'Sandalwood'],
    mood: 'Soft · Nurturing · Emotionally Steady',
    benefits: [
      'Comforts the heart on tender days',
      'Eases anxious energy and restores emotional balance',
      'Channels Moon energy — intuition, care, home',
      'Best worn before sleep, or when you need to come back to yourself',
    ],
  },
  {
    key: 'leo',
    name: 'Leo',
    hindi: 'सिंह',
    glyph: '♌',
    dates: 'Jul 23 — Aug 22',
    element: 'Fire',
    planet: 'Sun',
    quality: 'Fixed',
    tagline: 'For the one the room turns toward.',
    intro: 'Golden amber, warm resin, and a rare touch of kewda. Regal without effort — a fragrance that arrives a moment before you do.',
    notes: ['Amber', 'Frankincense', 'Kewda', 'Gold Oud'],
    mood: 'Radiant · Regal · Magnetic',
    benefits: [
      'Strengthens self-worth and stage presence',
      'Magnetises attention without demanding it',
      'Channels Sun energy — vitality, leadership, warmth',
      'Best worn for celebrations, presentations, first impressions',
    ],
  },
  {
    key: 'virgo',
    name: 'Virgo',
    hindi: 'कन्या',
    glyph: '♍',
    dates: 'Aug 23 — Sep 22',
    element: 'Earth',
    planet: 'Mercury',
    quality: 'Mutable',
    tagline: 'For the one who notices everything.',
    intro: 'Crisp green, cool mint, smoothed by sandalwood. A clean, considered scent — built like a well-organised desk.',
    notes: ['Vetiver', 'Green Tea', 'Mint', 'Sandalwood'],
    mood: 'Crisp · Clarifying · Refined',
    benefits: [
      'Promotes mental clarity and focused work',
      'Calms the overthinking mind without dulling it',
      'Channels Mercury energy — precision, craft, service',
      'Best worn for deep-work mornings and detail-heavy days',
    ],
  },
  {
    key: 'libra',
    name: 'Libra',
    hindi: 'तुला',
    glyph: '♎',
    dates: 'Sep 23 — Oct 22',
    element: 'Air',
    planet: 'Venus',
    quality: 'Cardinal',
    tagline: 'For the one who makes a room feel even.',
    intro: 'Powdery florals balanced with a clean musk. The scent of fairness — soft, considered, and quietly elegant.',
    notes: ['Rose', 'Peony', 'White Musk', 'Iris'],
    mood: 'Balanced · Harmonious · Romantic',
    benefits: [
      'Restores equilibrium when relationships feel uneven',
      'Softens tension; encourages graceful conversation',
      'Channels Venus energy — beauty, fairness, partnership',
      'Best worn for dates, gatherings, difficult conversations',
    ],
  },
  {
    key: 'scorpio',
    name: 'Scorpio',
    hindi: 'वृश्चिक',
    glyph: '♏',
    dates: 'Oct 23 — Nov 21',
    element: 'Water',
    planet: 'Mars · Pluto',
    quality: 'Fixed',
    tagline: 'For the one who knows what lies beneath.',
    intro: 'Deep oud, dark amber, a hint of leather. Intense, magnetic, unforgettable — the kind of scent that asks to be remembered.',
    notes: ['Oud', 'Black Agar', 'Leather', 'Dark Amber'],
    mood: 'Intense · Magnetic · Mysterious',
    benefits: [
      'Awakens passion and personal power',
      'Supports inner transformation — endings and beginnings',
      'Channels Mars-Pluto energy — depth, intuition, magnetism',
      'Best worn for evenings, intimate moments, threshold days',
    ],
  },
  {
    key: 'sagittarius',
    name: 'Sagittarius',
    hindi: 'धनु',
    glyph: '♐',
    dates: 'Nov 22 — Dec 21',
    element: 'Fire',
    planet: 'Jupiter',
    quality: 'Mutable',
    tagline: 'For the one with a passport in their pocket.',
    intro: 'Bright citrus, warm ginger, and a wide-open cedar. A scent of horizons — restless in the best way.',
    notes: ['Citrus', 'Ginger', 'Frankincense', 'Cedar'],
    mood: 'Adventurous · Optimistic · Expansive',
    benefits: [
      'Fuels wanderlust and the appetite for the new',
      'Lifts heaviness; broadens perspective on stuck problems',
      'Channels Jupiter energy — luck, expansion, learning',
      'Best worn for travel, study, big decisions',
    ],
  },
  {
    key: 'capricorn',
    name: 'Capricorn',
    hindi: 'मकर',
    glyph: '♑',
    dates: 'Dec 22 — Jan 19',
    element: 'Earth',
    planet: 'Saturn',
    quality: 'Cardinal',
    tagline: 'For the one who plays the long game.',
    intro: 'Smoked vetiver, dry cypress, and a low note of oud. A scent built like a well-cut suit — disciplined, classic, with weight.',
    notes: ['Vetiver', 'Cypress', 'Oud', 'Leather'],
    mood: 'Grounded · Ambitious · Disciplined',
    benefits: [
      'Strengthens resolve through long projects',
      'Anchors restless energy into steady action',
      'Channels Saturn energy — structure, mastery, time',
      'Best worn for negotiations, work weeks, marathon goals',
    ],
  },
  {
    key: 'aquarius',
    name: 'Aquarius',
    hindi: 'कुंभ',
    glyph: '♒',
    dates: 'Jan 20 — Feb 18',
    element: 'Air',
    planet: 'Saturn · Uranus',
    quality: 'Fixed',
    tagline: 'For the one who sees a different future.',
    intro: 'Cool iris, blue lotus, a brush of juniper. A clear, unusual scent — slightly off the beaten path, the way you like it.',
    notes: ['Iris', 'Blue Lotus', 'Juniper', 'White Musk'],
    mood: 'Cool · Visionary · Free-Spirited',
    benefits: [
      'Sparks original thinking and unconventional ideas',
      'Calms restlessness without dulling the spark',
      'Channels Uranus energy — innovation, individuality, change',
      'Best worn for creative work, breakthroughs, solo time',
    ],
  },
  {
    key: 'pisces',
    name: 'Pisces',
    hindi: 'मीन',
    glyph: '♓',
    dates: 'Feb 19 — Mar 20',
    element: 'Water',
    planet: 'Jupiter · Neptune',
    quality: 'Mutable',
    tagline: 'For the one who dreams in colour.',
    intro: 'Soft sea air, white lily, and warm sandalwood. A dreamy, watercolour fragrance — gentle, intuitive, quietly creative.',
    notes: ['Sea Breeze', 'Lily', 'Sandalwood', 'Ambergris'],
    mood: 'Dreamy · Intuitive · Compassionate',
    benefits: [
      'Opens creative flow and imaginative work',
      'Nurtures empathy without losing your centre',
      'Channels Neptune energy — dreams, art, devotion',
      'Best worn for writing, painting, contemplative evenings',
    ],
  },
];

// ---------- Render zodiac grid ----------
const grid = document.getElementById('zodiacGrid');

function cardHTML(z) {
  return `
    <article class="zodiac-card" data-key="${z.key}" tabindex="0" role="button" aria-label="View ${z.name} ittar details">
      <div class="zodiac-glyph">${z.glyph}</div>
      <div class="zodiac-hindi" lang="hi">${z.hindi}</div>
      <div class="zodiac-name">${z.name}</div>
      <div class="zodiac-dates">${z.dates}</div>
      <div class="zodiac-mood">${z.mood}</div>
      <div class="zodiac-price">₹650 <span>· 12 ml</span></div>
      <span class="more">View Details →</span>
    </article>
  `;
}

grid.innerHTML = zodiacs.map(cardHTML).join('');

// ---------- Modal ----------
const modal = document.getElementById('zodiacModal');
const modalBody = document.getElementById('modalBody');

function modalHTML(z) {
  return `
    <div class="modal-header">
      <div class="modal-glyph">${z.glyph}</div>
      <p class="modal-hindi" lang="hi">${z.hindi}</p>
      <h3 class="modal-name">${z.name}</h3>
      <p class="modal-dates">${z.dates} &middot; ${z.element} &middot; ${z.quality}</p>
    </div>
    <div class="modal-body">
      <p class="lead" style="text-align:center;font-style:italic;color:var(--ink-soft);max-width:none;">${z.tagline}</p>
      <p>${z.intro}</p>

      <dl class="modal-meta">
        <div><dt>Element</dt><dd>${z.element}</dd></div>
        <div><dt>Planet</dt><dd>${z.planet}</dd></div>
        <div><dt>Quality</dt><dd>${z.quality}</dd></div>
      </dl>

      <div class="modal-section">
        <h4>Fragrance Notes</h4>
        <div class="notes-list">
          ${z.notes.map(n => `<span>${n}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4>Mood</h4>
        <p style="margin:0;font-style:italic;color:var(--ink-soft);">${z.mood}</p>
      </div>

      <div class="modal-section">
        <h4>Healing Intent</h4>
        <ul class="benefits-list">
          ${z.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-price-row">
        <span class="modal-price">₹650</span>
        <span class="modal-price-sub">12 ml &middot; alcohol-free</span>
      </div>

      <div class="modal-cta">
        <button type="button" class="btn btn-primary btn-lg" data-add-cart data-name="${z.name}">Add to Cart</button>
        <button class="btn btn-ghost btn-lg" data-close>Close</button>
      </div>
      <p style="text-align:center;margin-top:14px;font-size:0.82rem;color:var(--ink-soft);">Pan-India shipping &middot; Dispatched in 2–3 days</p>
    </div>
  `;
}

// ---------- Cart count (presentational) ----------
let cartCount = 0;
const cartCountEl = document.getElementById('cartCount');
function bumpCart() {
  cartCount += 1;
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.remove('bump');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
  }
}

// Toast on add
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function openModal(key) {
  const z = zodiacs.find(x => x.key === key);
  if (!z) return;
  modalBody.innerHTML = modalHTML(z);
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // focus close button for accessibility
  setTimeout(() => modal.querySelector('.modal-close')?.focus(), 50);
}

function closeModal() {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

grid.addEventListener('click', (e) => {
  const card = e.target.closest('.zodiac-card');
  if (card) openModal(card.dataset.key);
});
grid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.zodiac-card');
    if (card) { e.preventDefault(); openModal(card.dataset.key); }
  }
});

modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) closeModal();
  if (e.target.matches('[data-add-cart]')) {
    bumpCart();
    const name = e.target.dataset.name || 'ittar';
    showToast(`✦ ${name} added to cart`);
    e.target.textContent = 'Added ✓';
    e.target.disabled = true;
    setTimeout(() => { e.target.textContent = 'Add to Cart'; e.target.disabled = false; }, 1400);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('section h2, .zodiac-card, .how-grid article, .about > .container > div').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
