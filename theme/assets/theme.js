/* =========================================================
   RUDRA — Shopify theme JS
   - Mobile nav, scroll reveal, footer year
   - Cart drawer (fetch /cart.js, /cart/add.js, /cart/change.js)
   - Product page: variant picker + qty
   ========================================================= */

(() => {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const money = (cents) => {
    const rupees = (cents / 100).toFixed(2).replace(/\.00$/, '');
    return '₹' + rupees;
  };

  /* ---------- Mobile nav ---------- */
  const initNav = () => {
    const toggle = $('.nav-toggle');
    const links = $('.nav-links');
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
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$('section h2, .zodiac-card, .how-grid article, .about > .container > div, .product-info, .product-media')
      .forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  };

  /* ---------- Cart state ---------- */
  const cartState = {
    cart: null,
    listeners: new Set(),
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
    emit() { this.listeners.forEach(fn => fn(this.cart)); }
  };

  async function fetchCart() {
    const res = await fetch('/cart.js', { headers: { 'Accept': 'application/json' } });
    cartState.cart = await res.json();
    cartState.emit();
    return cartState.cart;
  }

  async function addToCart(formData) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.description || err.message || 'Could not add to cart');
    }
    await fetchCart();
    return cartState.cart;
  }

  async function updateLine(line, quantity) {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ line, quantity })
    });
    cartState.cart = await res.json();
    cartState.emit();
    return cartState.cart;
  }

  /* ---------- Cart drawer ---------- */
  const initDrawer = () => {
    const drawer = $('#CartDrawer');
    if (!drawer) return;

    const backdrop = $('.drawer-backdrop');
    const body = $('.drawer-body', drawer);
    const subtotalEl = $('[data-drawer-subtotal]', drawer);
    const checkoutBtn = $('[data-drawer-checkout]', drawer);

    const open = () => { document.body.classList.add('drawer-open'); drawer.setAttribute('aria-hidden', 'false'); };
    const close = () => { document.body.classList.remove('drawer-open'); drawer.setAttribute('aria-hidden', 'true'); };

    $$('[data-drawer-open]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    $$('[data-drawer-close]', drawer).forEach(btn => btn.addEventListener('click', close));
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const renderLine = (item, index) => {
      const img = item.image
        ? `<img src="${item.image}" alt="${item.product_title}" loading="lazy">`
        : '';
      const variantLine = (item.variant_title && item.variant_title !== 'Default Title')
        ? `<p class="drawer-line-variant">${item.variant_title}</p>` : '';
      return `
        <div class="drawer-line" data-line="${index + 1}">
          <a href="${item.url}" class="drawer-line-image">${img}</a>
          <div>
            <p class="drawer-line-title"><a href="${item.url}">${item.product_title}</a></p>
            ${variantLine}
            <p class="drawer-line-price">${money(item.final_line_price)}</p>
          </div>
          <div class="drawer-line-actions">
            <div class="qty">
              <button type="button" data-qty-dec aria-label="Decrease">−</button>
              <input type="number" min="0" value="${item.quantity}" data-qty-input aria-label="Quantity">
              <button type="button" data-qty-inc aria-label="Increase">+</button>
            </div>
            <button type="button" class="drawer-line-remove" data-line-remove>Remove</button>
          </div>
        </div>
      `;
    };

    const render = (cart) => {
      if (!cart) return;
      $$('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
        if (cart.item_count > 0) el.removeAttribute('data-empty');
        else el.setAttribute('data-empty', '');
      });
      if (!body) return;
      if (cart.item_count === 0) {
        body.innerHTML = `<div class="drawer-empty"><p>Your cart is empty.</p><a href="/collections/all" class="btn btn-ghost btn-sm" data-drawer-close>Browse zodiacs</a></div>`;
        if (subtotalEl) subtotalEl.textContent = money(0);
        if (checkoutBtn) checkoutBtn.setAttribute('disabled', '');
      } else {
        body.innerHTML = cart.items.map(renderLine).join('');
        if (subtotalEl) subtotalEl.textContent = money(cart.total_price);
        if (checkoutBtn) checkoutBtn.removeAttribute('disabled');
      }
      // bind line actions
      $$('.drawer-line', body).forEach(line => {
        const index = parseInt(line.dataset.line, 10);
        const input = $('[data-qty-input]', line);
        $('[data-qty-dec]', line)?.addEventListener('click', () => updateLine(index, Math.max(0, parseInt(input.value, 10) - 1)));
        $('[data-qty-inc]', line)?.addEventListener('click', () => updateLine(index, parseInt(input.value, 10) + 1));
        input?.addEventListener('change', () => updateLine(index, parseInt(input.value, 10) || 0));
        $('[data-line-remove]', line)?.addEventListener('click', () => updateLine(index, 0));
      });
      // re-bind close inside re-rendered body
      $$('[data-drawer-close]', drawer).forEach(btn => btn.addEventListener('click', close));
    };

    cartState.subscribe(render);
    fetchCart();

    document.addEventListener('cart:add', () => open());
  };

  /* ---------- Add-to-cart form intercept ---------- */
  const initAddToCart = () => {
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (!form.matches('form[data-product-form]')) return;
      e.preventDefault();
      const submit = form.querySelector('[type="submit"]');
      const original = submit?.textContent;
      if (submit) { submit.disabled = true; submit.textContent = 'Adding…'; }
      try {
        await addToCart(new FormData(form));
        if (submit) submit.textContent = 'Added ✓';
        document.dispatchEvent(new CustomEvent('cart:add'));
        setTimeout(() => { if (submit) { submit.textContent = original; submit.disabled = false; } }, 1400);
      } catch (err) {
        console.error(err);
        if (submit) { submit.textContent = original; submit.disabled = false; }
        alert(err.message);
      }
    });
  };

  /* ---------- Product page: variant picker + qty ---------- */
  const initProduct = () => {
    const root = $('[data-product]');
    if (!root) return;

    const variants = JSON.parse(root.dataset.variants || '[]');
    const form = $('form[data-product-form]', root);
    const variantIdInput = $('input[name="id"]', form);
    const priceEl = $('[data-product-price]', root);
    const compareEl = $('[data-product-compare]', root);
    const submitBtn = form?.querySelector('[type="submit"]');
    const mainImg = $('.product-media-main img', root);
    const fallback = $('.product-media-fallback', root);

    const findVariant = () => {
      const selected = $$('.option-pill input:checked', form).map(i => i.value);
      if (!selected.length) return variants[0];
      return variants.find(v => v.options.every((o, i) => o === selected[i]));
    };

    const updateForVariant = (v) => {
      if (!v) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Unavailable'; }
        return;
      }
      variantIdInput.value = v.id;
      if (priceEl) priceEl.textContent = money(v.price);
      if (compareEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          compareEl.textContent = money(v.compare_at_price);
          compareEl.hidden = false;
        } else {
          compareEl.hidden = true;
        }
      }
      if (v.featured_image && mainImg) {
        mainImg.src = v.featured_image.src;
        if (fallback) fallback.hidden = true;
      }
      if (submitBtn) {
        if (v.available) { submitBtn.disabled = false; submitBtn.textContent = 'Add to cart'; }
        else { submitBtn.disabled = true; submitBtn.textContent = 'Sold out'; }
      }
      const url = new URL(window.location);
      url.searchParams.set('variant', v.id);
      window.history.replaceState({}, '', url);
    };

    $$('.option-pill input', form).forEach(input => {
      input.addEventListener('change', () => updateForVariant(findVariant()));
    });

    // qty
    const qty = $('.qty', form);
    if (qty) {
      const input = $('input', qty);
      $('[data-qty-dec]', qty)?.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value, 10) - 1);
      });
      $('[data-qty-inc]', qty)?.addEventListener('click', () => {
        input.value = parseInt(input.value, 10) + 1;
      });
    }

    // product gallery thumb switcher
    $$('.product-media-thumb', root).forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.full;
        if (mainImg && src) {
          mainImg.src = src;
          if (fallback) fallback.hidden = true;
        }
        $$('.product-media-thumb', root).forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });

    updateForVariant(findVariant());
  };

  /* ---------- Init ---------- */
  const init = () => {
    initNav();
    initYear();
    initReveal();
    initDrawer();
    initAddToCart();
    initProduct();
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
