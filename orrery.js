/* =========================================================
   RUDRA — Background Orrery
   A faint, site-wide ring of the twelve zodiac glyphs.
   Sits as a fixed background behind every page; rotates as
   you scroll, with a gentle constant drift so it never feels
   frozen.

   - Auto-injects its own canvas as the first element of <body>.
   - Pointer-events: none (decorative).
   - prefers-reduced-motion: renders a static frame, no rotation.
   - WebGL failure: removes the canvas silently (paper bg stays).
   ========================================================= */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const SIGNS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

// Parchment-gold; softer than the foreground accent. The material
// has its own opacity layered on top of this colour.
const PARCHMENT_GOLD = '#A88940';

function makeGlyphTexture(glyph, color = PARCHMENT_GOLD) {
  const size = 320;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  ctx.font = '400 220px Georgia, "Times New Roman", serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(glyph, size / 2, size / 2 + 14);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

class BackgroundOrrery {
  constructor() {
    this.canvas = null;
    this.running = true;
    this.targetRotation = 0;
    this.rotation = 0;
    this.lastTime = 0;
    this.reduced = prefersReducedMotion();
  }

  injectCanvas() {
    const c = document.createElement('canvas');
    c.className = 'orrery-bg-canvas';
    c.setAttribute('aria-hidden', 'true');
    // Inline styles so the canvas works even if css hasn't loaded
    Object.assign(c.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '0',
      opacity: '0.55',
    });
    document.body.insertBefore(c, document.body.firstChild);
    this.canvas = c;
  }

  init() {
    this.injectCanvas();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch (err) {
      console.warn('Orrery: WebGL unavailable; removing background.', err);
      this.canvas.remove();
      this.canvas = null;
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    this.renderer = renderer;

    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    // Camera is slightly above the ring plane looking down + forward,
    // ring radius set large so it bleeds off the edges.
    this.camera.position.set(0, 1.6, 7.4);
    this.camera.lookAt(0, 0, 0);

    // The ring — billboarded glyph sprites in a horizontal circle
    this.ring = new THREE.Group();
    this.scene.add(this.ring);

    const isMobile = window.innerWidth < 720;
    const radius = isMobile ? 3.0 : 4.4;
    const glyphScale = isMobile ? 1.0 : 1.15;

    SIGNS.forEach((glyph, i) => {
      const angle = (i / SIGNS.length) * Math.PI * 2;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlyphTexture(glyph),
          transparent: true,
          depthWrite: false,
          opacity: 0.85,
        })
      );
      sprite.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      sprite.scale.set(glyphScale, glyphScale, 1);
      this.ring.add(sprite);
    });

    // A faint guide line — barely visible, just enough to suggest a wheel
    {
      const segments = 96;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0xA88940,
        transparent: true,
        opacity: 0.10,
      });
      this.ring.add(new THREE.Line(geom, mat));
    }

    // Events
    this._onResize = this.onResize.bind(this);
    this._onScroll = this.onScroll.bind(this);
    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('scroll', this._onScroll, { passive: true });

    // Initial state
    this.targetRotation = this.scrollRotation();

    if (this.reduced) {
      // Render one static frame and stop
      this.ring.rotation.y = this.targetRotation;
      this.renderer.render(this.scene, this.camera);
    } else {
      this.lastTime = performance.now();
      requestAnimationFrame(this.animate.bind(this));
    }
    return true;
  }

  scrollRotation() {
    // 1 full revolution per ~3600 px of scroll, in addition to a slow
    // base drift driven by elapsed time.
    return (window.scrollY || window.pageYOffset || 0) / 3600 * Math.PI * 2;
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  onScroll() {
    this.targetRotation = this.scrollRotation();
  }

  animate(now) {
    requestAnimationFrame(this.animate.bind(this));
    if (!this.renderer) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Slow base drift so the ring is never frozen even when not scrolling.
    this.targetRotation += dt * 0.012;

    // Ease current rotation toward target
    this.rotation += (this.targetRotation - this.rotation) * 0.08;
    this.ring.rotation.y = this.rotation;

    // Subtle vertical bob tied to scroll position — gives a hint of life
    const drift = (window.scrollY || 0) / 4000;
    this.ring.rotation.x = Math.sin(drift * Math.PI * 2) * 0.08;

    this.renderer.render(this.scene, this.camera);
  }
}

// ---- Boot ----
(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  function start() {
    try {
      const o = new BackgroundOrrery();
      o.init();
    } catch (err) {
      console.warn('Orrery: failed to start.', err);
    }
  }
})();
