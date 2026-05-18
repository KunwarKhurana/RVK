/* =========================================================
   RUDRA — The Orrery
   A slow 3D ring of the twelve zodiac glyphs.
   Each glyph orbits in real 3D space, gentle gold particles
   drift behind, the whole scene tilts toward the cursor.
   Click a glyph to enter that zodiac's page.

   Falls back to a CSS-only static ring if Three.js fails,
   reduced-motion is set, or WebGL is unavailable.
   ========================================================= */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const SIGNS = [
  { key: 'aries',       glyph: '♈', name: 'Aries' },
  { key: 'taurus',      glyph: '♉', name: 'Taurus' },
  { key: 'gemini',      glyph: '♊', name: 'Gemini' },
  { key: 'cancer',      glyph: '♋', name: 'Cancer' },
  { key: 'leo',         glyph: '♌', name: 'Leo' },
  { key: 'virgo',       glyph: '♍', name: 'Virgo' },
  { key: 'libra',       glyph: '♎', name: 'Libra' },
  { key: 'scorpio',     glyph: '♏', name: 'Scorpio' },
  { key: 'sagittarius', glyph: '♐', name: 'Sagittarius' },
  { key: 'capricorn',   glyph: '♑', name: 'Capricorn' },
  { key: 'aquarius',    glyph: '♒', name: 'Aquarius' },
  { key: 'pisces',      glyph: '♓', name: 'Pisces' },
];

const GOLD = 0xB58A2E;
const GOLD_SOFT = 0xD7C079;
const INK = 0x1B1810;

function makeGlyphTexture(glyph, color = '#B58A2E') {
  const size = 384;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // soft glow
  const grad = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(215, 192, 121, 0.30)');
  grad.addColorStop(0.5, 'rgba(215, 192, 121, 0.06)');
  grad.addColorStop(1, 'rgba(215, 192, 121, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // glyph
  ctx.font = '600 220px Georgia, "Times New Roman", serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(181, 138, 46, 0.45)';
  ctx.shadowBlur = 28;
  ctx.fillText(glyph, size / 2, size / 2 + 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function detectMobile() {
  return window.matchMedia('(max-width: 720px)').matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

class Orrery {
  constructor(container, canvas) {
    this.container = container;
    this.canvas = canvas;
    this.mobile = detectMobile();
    this.targetTilt = { x: 0, y: 0 };
    this.tilt = { x: 0, y: 0 };
    this.running = false;
    this.spriteData = [];
  }

  init() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    this.camera.position.set(0, 1.8, 7.4);
    this.camera.lookAt(0, 0, 0);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('Orrery: WebGL unavailable', err);
      return false;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);

    // ---- The ring ----
    this.ringGroup = new THREE.Group();
    this.scene.add(this.ringGroup);

    const radius = this.mobile ? 2.4 : 3.1;
    SIGNS.forEach((sign, i) => {
      const angle = (i / SIGNS.length) * Math.PI * 2;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeGlyphTexture(sign.glyph),
          transparent: true,
          depthWrite: false,
          opacity: 0.95,
        })
      );
      sprite.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      sprite.scale.set(0.95, 0.95, 1);
      sprite.userData = sign;
      this.ringGroup.add(sprite);
      this.spriteData.push({ sprite, baseScale: 0.95 });
    });

    // ---- A faint inner ring line (decorative) ----
    {
      const segments = 96;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.18,
      });
      const line = new THREE.Line(geom, mat);
      this.ringGroup.add(line);
    }

    // ---- Gold particle field ----
    const particleCount = this.mobile ? 60 : 140;
    const pGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      speeds[i] = 0.0005 + Math.random() * 0.0015;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: GOLD_SOFT,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(pGeom, pMat);
    this.particleSpeeds = speeds;
    this.scene.add(this.particles);

    // ---- Lighting (sprites are unlit, but keep ambient for future meshes) ----
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // ---- Raycaster for hover/click ----
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-10, -10);

    // ---- Events ----
    this._onResize    = this.onResize.bind(this);
    this._onPointer   = this.onPointer.bind(this);
    this._onClick     = this.onClick.bind(this);
    this._onLeave     = this.onLeave.bind(this);
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('pointermove', this._onPointer);
    this.canvas.addEventListener('pointerleave', this._onLeave);
    this.canvas.addEventListener('click', this._onClick);

    // Pause when off-screen
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { this.running = e.isIntersecting; });
      }, { threshold: 0.05 });
      io.observe(this.container);
    } else {
      this.running = true;
    }
    this.running = true;

    if (prefersReducedMotion()) {
      // Render one static frame and stop
      this.renderer.render(this.scene, this.camera);
      this.running = false;
    } else {
      this.lastTime = performance.now();
      requestAnimationFrame(this.animate.bind(this));
    }

    return true;
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.mobile = detectMobile();
  }

  onPointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    const y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
    this.pointer.set(x, -y);
    this.targetTilt.x = -y * 0.18;
    this.targetTilt.y =  x * 0.22;
  }

  onLeave() {
    this.pointer.set(-10, -10);
    this.targetTilt.x = 0;
    this.targetTilt.y = 0;
  }

  onClick() {
    if (!this.hovered) return;
    const sign = this.hovered.userData;
    if (sign && sign.key) {
      window.location.href = `zodiacs/${sign.key}/`;
    }
  }

  animate(now) {
    if (!this.renderer) return;
    requestAnimationFrame(this.animate.bind(this));
    if (!this.running) return;

    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Slow ring rotation
    this.ringGroup.rotation.y += dt * 0.18;

    // Camera tilt eases toward target
    this.tilt.x += (this.targetTilt.x - this.tilt.x) * 0.05;
    this.tilt.y += (this.targetTilt.y - this.tilt.y) * 0.05;
    this.camera.position.x =  Math.sin(this.tilt.y) * 7.4;
    this.camera.position.y = 1.8 + this.tilt.x * 1.6;
    this.camera.position.z =  Math.cos(this.tilt.y) * 7.4;
    this.camera.lookAt(0, 0, 0);

    // Particle drift
    const pos = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < this.particleSpeeds.length; i++) {
      pos[i * 3 + 1] += this.particleSpeeds[i];
      if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -3;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // Hover scale
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.spriteData.map(d => d.sprite),
      false
    );
    const newHover = intersects[0]?.object || null;
    if (newHover !== this.hovered) {
      this.hovered = newHover;
      this.canvas.style.cursor = newHover ? 'pointer' : '';
    }
    this.spriteData.forEach(({ sprite, baseScale }) => {
      const target = (sprite === this.hovered) ? baseScale * 1.4 : baseScale;
      sprite.scale.x += (target - sprite.scale.x) * 0.12;
      sprite.scale.y = sprite.scale.x;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

// ---- Boot ----
(() => {
  const container = document.querySelector('[data-orrery]');
  if (!container) return;
  const canvas = container.querySelector('canvas');
  if (!canvas) return;

  // Bail to fallback on prefers-reduced-motion if user has set it AND mobile
  // (we still allow the static-frame render on desktop reduced-motion above)
  try {
    const orrery = new Orrery(container, canvas);
    const ok = orrery.init();
    if (ok) {
      container.classList.add('orrery--3d-ready');
    }
  } catch (err) {
    console.warn('Orrery init failed; falling back to static ring.', err);
  }
})();
