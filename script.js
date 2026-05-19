/* =========================================================
   RUDRA — Editorial multipage
   - Mobile nav toggle
   - Cart count (localStorage, persists across pages)
   - "Add to Cart" presentational handler + toast
   - Scroll reveal
   - Footer year
   ========================================================= */

(() => {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const STORAGE_KEY = 'rudra:cart-count';

  /* ---------- Mobile nav ---------- */
  const initNav = () => {
    const toggle = $('.nav-toggle');
    const links  = $('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  };

  /* ---------- Footer year ---------- */
  const initYear = () => {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  };

  /* ---------- Scroll reveal ---------- */
  const initReveal = () => {
    const targets = $$('section h1, section h2, .hero-meta, .featured-card, .collection-row, .ritual-step, .zodiac-essay-body, .composition-block, .order-block, .story-prose p, .pullquote, .contact-block');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  };

  /* ---------- Cart count (persisted) ---------- */
  let cartCount = 0;
  try { cartCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0; } catch (_) {}

  const renderCount = () => {
    $$('.cart-count').forEach(el => { el.textContent = cartCount; });
  };

  const bumpCart = () => {
    cartCount += 1;
    try { localStorage.setItem(STORAGE_KEY, String(cartCount)); } catch (_) {}
    $$('.cart-count').forEach(el => {
      el.textContent = cartCount;
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  const showToast = (msg) => {
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
  };

  /* ---------- Add to cart (zodiac pages + featured) ---------- */
  const initAddToCart = () => {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-cart]');
      if (!btn) return;
      e.preventDefault();
      const name = btn.dataset.name || 'Ittar';
      bumpCart();
      showToast(`✦ ${name} added to cart`);
      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1400);
    });
  };

  /* ---------- Cart icon — also shows toast for now ---------- */
  const initCartIcon = () => {
    $$('.cart-icon').forEach(btn => {
      btn.addEventListener('click', () => {
        if (cartCount === 0) {
          showToast('Cart is empty — pick a sign');
        } else {
          showToast(`${cartCount} item${cartCount === 1 ? '' : 's'} · checkout launching soon`);
        }
      });
    });
  };

  /* ---------- Live carousel (collection page) ---------- */
  const SIGNS = [
    { key:'aries',       num:'01', name:'Aries',       hindi:'मेष',     glyph:'♈', sanskrit:'Mesha',      meaning:'the Ram',          element:'Fire',  quality:'Cardinal', planet:'Mars',              tagline:'For the one who moves first.' },
    { key:'taurus',      num:'02', name:'Taurus',      hindi:'वृषभ',    glyph:'♉', sanskrit:'Vrishabha',  meaning:'the Bull',         element:'Earth', quality:'Fixed',    planet:'Venus',             tagline:'For the one who builds slowly, beautifully.' },
    { key:'gemini',      num:'03', name:'Gemini',      hindi:'मिथुन',   glyph:'♊', sanskrit:'Mithuna',    meaning:'the Twins',        element:'Air',   quality:'Mutable',  planet:'Mercury',           tagline:'For the one with a dozen ideas before breakfast.' },
    { key:'cancer',      num:'04', name:'Cancer',      hindi:'कर्क',    glyph:'♋', sanskrit:'Karka',      meaning:'the Crab',         element:'Water', quality:'Cardinal', planet:'the Moon',          tagline:'For the one who feels everything, deeply.' },
    { key:'leo',         num:'05', name:'Leo',         hindi:'सिंह',    glyph:'♌', sanskrit:'Simha',      meaning:'the Lion',         element:'Fire',  quality:'Fixed',    planet:'the Sun',           tagline:'For the one the room turns toward.' },
    { key:'virgo',       num:'06', name:'Virgo',       hindi:'कन्या',   glyph:'♍', sanskrit:'Kanya',      meaning:'the Maiden',       element:'Earth', quality:'Mutable',  planet:'Mercury',           tagline:'For the one who notices everything.' },
    { key:'libra',       num:'07', name:'Libra',       hindi:'तुला',    glyph:'♎', sanskrit:'Tula',       meaning:'the Scales',       element:'Air',   quality:'Cardinal', planet:'Venus',             tagline:'For the one who makes a room feel even.' },
    { key:'scorpio',     num:'08', name:'Scorpio',     hindi:'वृश्चिक', glyph:'♏', sanskrit:'Vrishchika', meaning:'the Scorpion',     element:'Water', quality:'Fixed',    planet:'Mars · Pluto',      tagline:'For the one who knows what lies beneath.' },
    { key:'sagittarius', num:'09', name:'Sagittarius', hindi:'धनु',     glyph:'♐', sanskrit:'Dhanu',      meaning:'the Archer',       element:'Fire',  quality:'Mutable',  planet:'Jupiter',           tagline:'For the one with a passport in their pocket.' },
    { key:'capricorn',   num:'10', name:'Capricorn',   hindi:'मकर',     glyph:'♑', sanskrit:'Makara',     meaning:'the Sea-Goat',     element:'Earth', quality:'Cardinal', planet:'Saturn',            tagline:'For the one who plays the long game.' },
    { key:'aquarius',    num:'11', name:'Aquarius',    hindi:'कुंभ',    glyph:'♒', sanskrit:'Kumbha',     meaning:'the Water-Bearer', element:'Air',   quality:'Fixed',    planet:'Saturn · Uranus',   tagline:'For the one who sees a different future.' },
    { key:'pisces',      num:'12', name:'Pisces',      hindi:'मीन',     glyph:'♓', sanskrit:'Meena',      meaning:'the Fish',         element:'Water', quality:'Mutable',  planet:'Jupiter · Neptune', tagline:'For the one who dreams in colour.' },
  ];

  const initCarousel = () => {
    const stage = $('[data-live-carousel]');
    if (!stage) return;

    // Path prefix: on /collection/, the zodiac pages live at ../zodiacs/<key>/
    const PREFIX = '../zodiacs/';

    // Build slides
    const slidesHtml = SIGNS.map((s, i) => `
      <article class="live-slide" data-i="${i}">
        <span class="glyph-bg" aria-hidden="true">${s.glyph}</span>
        <span class="num">№ ${s.num} · Janma Rashi</span>
        <span class="hindi" lang="hi">${s.hindi}</span>
        <h2><em>${s.name}.</em></h2>
        <span class="meta-row">${s.sanskrit} · ${s.meaning} · ${s.element} · ${s.quality} · ${s.planet}</span>
        <p class="notes-row">${s.tagline}</p>
        <div class="price-row">
          <span class="price">₹650</span>
          <span class="price-sub">12 ml · alcohol-free</span>
        </div>
        <div class="cta-row">
          <a href="${PREFIX}${s.key}/" class="btn btn-primary">Enter ${s.name} →</a>
          <button type="button" class="btn btn-ghost" data-add-cart data-name="${s.name}">Add to Cart</button>
        </div>
      </article>
    `).join('');

    // Insert before the controls so controls remain on top
    const controls = stage.querySelector('.live-carousel-controls');
    stage.insertAdjacentHTML('afterbegin', slidesHtml);

    const slides = $$('.live-slide', stage);
    const prevBtn = $('[data-prev]', stage);
    const nextBtn = $('[data-next]', stage);
    const indexEl = $('[data-live-index]');
    const progEl  = $('[data-progress]');
    const toggle  = $('[data-toggle]');
    const INTERVAL = 5200;

    let current = 0;
    let timerStart = 0;
    let timerId = null;
    let rafId = null;
    let userPaused = false;
    let hoverPaused = false;
    let offscreen = false;

    const setActive = (i) => {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === current));
      if (indexEl) indexEl.textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    };

    const tickProgress = (now) => {
      if (progEl) {
        if (timerId) {
          const pct = Math.min(1, (now - timerStart) / INTERVAL);
          progEl.style.width = (pct * 100) + '%';
        }
      }
      rafId = requestAnimationFrame(tickProgress);
    };

    const isStopped = () => userPaused || hoverPaused || offscreen;

    const restart = () => {
      stop();
      if (isStopped()) return;
      timerStart = performance.now();
      timerId = setInterval(() => {
        timerStart = performance.now();
        setActive(current + 1);
      }, INTERVAL);
    };
    const stop = () => {
      if (timerId) { clearInterval(timerId); timerId = null; }
      if (progEl) progEl.style.width = '0%';
    };
    const updateToggleLabel = () => {
      if (toggle) toggle.textContent = userPaused ? 'Play' : 'Pause';
    };

    prevBtn?.addEventListener('click', () => { setActive(current - 1); restart(); });
    nextBtn?.addEventListener('click', () => { setActive(current + 1); restart(); });
    toggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      updateToggleLabel();
      if (isStopped()) stop(); else restart();
    });

    stage.addEventListener('mouseenter', () => { hoverPaused = true; stop(); });
    stage.addEventListener('mouseleave', () => { hoverPaused = false; if (!isStopped()) restart(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft')  { setActive(current - 1); restart(); }
      if (e.key === 'ArrowRight') { setActive(current + 1); restart(); }
    });

    // Touch swipe (basic)
    let touchX = null;
    stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend',   (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) {
        setActive(current + (dx < 0 ? 1 : -1));
        restart();
      }
      touchX = null;
    }, { passive: true });

    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          offscreen = !e.isIntersecting;
          if (isStopped()) stop(); else restart();
        });
      }, { threshold: 0.2 });
      io.observe(stage);
    }

    // Respect reduced motion: don't auto-advance, but still show slide 1
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      userPaused = true;
      updateToggleLabel();
    }

    setActive(0);
    updateToggleLabel();
    if (!isStopped()) restart();
    rafId = requestAnimationFrame(tickProgress);
  };

  /* ---------- Init ---------- */
  const init = () => {
    initNav();
    initYear();
    initReveal();
    renderCount();
    initAddToCart();
    initCartIcon();
    initCarousel();
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
