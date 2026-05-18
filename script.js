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

  /* ---------- Init ---------- */
  const init = () => {
    initNav();
    initYear();
    initReveal();
    renderCount();
    initAddToCart();
    initCartIcon();
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
