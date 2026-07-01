/* ===========================================================================
   ASCII campfire particles
   Adapted from the reactive ASCII-particle engine on mattglbrt.com, retuned
   into a cold campfire: glyphs rise like embers, flicker, drift on a gentle
   updraft, and scatter away from the pointer. Recoloured to violet / azure
   with the occasional magenta spark.

   Honours prefers-reduced-motion and Save-Data, throttles on low-power
   devices, and pauses while the tab is hidden.
=========================================================================== */

const LAYER_CLASS = 'ascii-particles';

const GLYPHS = ['.', '.', '·', '·', ':', "'", '*', '+', '°', '•'];

// Each ember picks a colour by lerping along this cold-flame ramp.
// The ramp now sweeps violet → azure → teal → pale green, with a rare
// magenta spark at the end. Lerp bias keeps the purple/blue section most
// common; teal and green appear naturally at the tail.
const EMBER_STOPS = [
  '#c4b5fd', // violet-300
  '#a78bfa', // violet-400
  '#8b5cf6', // violet-500
  '#7c9bff', // violet→azure blend
  '#60a5fa', // azure-400
  '#38bdf8', // sky-400 (azure→teal bridge)
  '#2dd4bf', // teal-400
  '#5eead4', // teal-300
  '#6ee7b7', // emerald-300 (teal→green)
  '#86efac', // pale green-300
  '#a7f3d0', // pale green-200 (wisp)
  '#e879f9', // magenta spark (rare)
];

const CONFIG = {
  driftX: [-0.22, 0.22] as [number, number],
  driftY: [-0.85, -0.32] as [number, number], // negative = rising
  speed: [0.03, 0.085] as [number, number], // flicker phase advance
  opacity: [0.32, 0.72] as [number, number],
  baseFrameMs: 42,
  pointerInfluenceRadius: 150,
  pointerScale: 1,
  mobileBreakpoint: 760,
  // density ~ one ember per N px² of viewport, clamped per device
  areaPerEmberDesktop: 14000,
  areaPerEmberMobile: 30000,
  maxDesktop: 180,
  maxMobile: 70,
};

type Particle = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  opacity: number;
  phase: number;
  speed: number;
};

type Pointer = { x: number; y: number; active: boolean };

export function installParticles(): void {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.querySelector(`.${LAYER_CLASS}`)
  ) {
    return;
  }

  const layer = document.createElement('div');
  layer.className = LAYER_CLASS;
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);

  const lowPower = isLowPower();
  const frameMs = CONFIG.baseFrameMs * (lowPower ? 1.2 : 1);
  const particles = createParticles(layer, particleCount(lowPower));
  const pointer: Pointer = { x: Number.NaN, y: Number.NaN, active: false };

  let rafId = 0;
  let lastTime = 0;
  let running = true;
  let scrolling = false;
  let scrollTimeout = 0;

  const frame = (time: number) => {
    rafId = 0;
    if (!running) return;
    if (!document.body.contains(layer)) {
      running = false;
      return;
    }

    if (!scrolling) {
      const elapsed = lastTime === 0 ? frameMs : Math.min(96, Math.max(1, time - lastTime));
      lastTime = time;
      animate(particles, pointer, time, elapsed / frameMs);
    } else {
      lastTime = 0;
    }
    rafId = window.requestAnimationFrame(frame);
  };

  const start = () => {
    if (rafId === 0) {
      running = true;
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    }
  };
  const stop = () => {
    running = false;
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    lastTime = 0;
  };

  start();

  const reset = () => { snapshotViewport(); particles.forEach((p) => resetParticle(p, true)); };
  window.addEventListener('resize', reset, { passive: true });
  window.addEventListener('orientationchange', reset, { passive: true });

  if (!isMobile() && !lowPower) {
    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      },
      { passive: true },
    );
    window.addEventListener(
      'pointerleave',
      () => {
        pointer.active = false;
      },
      { passive: true },
    );
  }

  // Pause DOM writes while the user is scrolling so the compositor can run
  // uncontested. Resumes 150 ms after the last scroll event.
  window.addEventListener(
    'scroll',
    () => {
      scrolling = true;
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        scrolling = false;
        lastTime = 0;
      }, 150);
    },
    { passive: true },
  );

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') start();
    else stop();
  });
  window.addEventListener('beforeunload', stop);
}

function createParticles(layer: HTMLElement, count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const el = document.createElement('span');
    el.textContent = sample(GLYPHS);
    el.style.setProperty('--ember-color', emberColor());
    layer.append(el);

    const p: Particle = {
      el,
      x: 0,
      y: 0,
      driftX: 0,
      driftY: 0,
      opacity: 0,
      phase: 0,
      speed: 0,
    };
    resetParticle(p, true);
    return p;
  });
}

// Viewport dimensions cached once per frame — read before any style writes to
// avoid forced reflow (reading layout geometry after style invalidation).
let vpW = window.innerWidth;
let vpH = window.innerHeight;

function snapshotViewport(): void {
  vpW = window.innerWidth;
  vpH = window.innerHeight;
}

function animate(particles: Particle[], pointer: Pointer, time: number, step: number): void {
  // Read viewport before the loop so no style write precedes this layout read.
  snapshotViewport();

  for (const p of particles) {
    p.x += p.driftX * step;
    p.y += p.driftY * step;
    applyPointer(p, pointer, step);
    p.phase += p.speed * step;

    const flicker = 0.7 + Math.sin(time * 0.0017 + p.phase) * 0.3;
    p.el.style.opacity = (p.opacity * flicker).toFixed(3);
    p.el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`;

    if (p.y < -24 || p.x < -32 || p.x > vpW + 32) {
      resetParticle(p, false);
    }
  }
}

// anywhere=true scatters across the screen (first paint / resize);
// otherwise the ember is reborn just below the fold and rises again.
function resetParticle(p: Particle, anywhere: boolean): void {
  const w = Math.max(1, vpW);
  const h = Math.max(1, vpH);

  p.x = randomBetween(0, w);
  p.y = anywhere ? randomBetween(0, h) : h + randomBetween(8, 64);
  p.driftX = randomBetween(...CONFIG.driftX);
  p.driftY = randomBetween(...CONFIG.driftY);
  p.opacity = randomBetween(...CONFIG.opacity);
  p.phase = randomBetween(0, Math.PI * 2);
  p.speed = randomBetween(...CONFIG.speed);
  p.el.textContent = sample(GLYPHS);
  p.el.style.setProperty('--ember-color', emberColor());
}

function applyPointer(p: Particle, pointer: Pointer, step: number): void {
  if (!pointer.active || !Number.isFinite(pointer.x)) return;

  const dx = p.x - pointer.x;
  const dy = p.y - pointer.y;
  const dist = Math.hypot(dx, dy);
  const radius = CONFIG.pointerInfluenceRadius;
  if (dist > radius) return;

  const force = (1 - dist / radius) ** 2;
  const unitX = dist > 0 ? dx / dist : Math.cos(p.phase);
  const unitY = dist > 0 ? dy / dist : Math.sin(p.phase);

  p.x += unitX * force * CONFIG.pointerScale * 1.9 * step;
  p.y += unitY * force * CONFIG.pointerScale * 1.3 * step;
  p.phase += force * CONFIG.pointerScale * 0.08 * step;
}

function particleCount(lowPower: boolean): number {
  const area = vpW * vpH;
  const mobile = isMobile();
  const per = mobile ? CONFIG.areaPerEmberMobile : CONFIG.areaPerEmberDesktop;
  const max = mobile ? CONFIG.maxMobile : CONFIG.maxDesktop;
  const base = Math.round(area / per);
  return Math.max(8, Math.min(max, Math.round(base * (lowPower ? 0.6 : 1))));
}

// Lerp along the ember ramp; weighted so the rare magenta spark stays rare.
function emberColor(): string {
  const t = Math.random() ** 1.4; // bias toward the violet/azure end
  const scaled = t * (EMBER_STOPS.length - 1);
  const i = Math.min(EMBER_STOPS.length - 2, Math.floor(scaled));
  return lerpHex(EMBER_STOPS[i]!, EMBER_STOPS[i + 1]!, scaled - i);
}

function lerpHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function isMobile(): boolean {
  return window.matchMedia(`(max-width: ${CONFIG.mobileBreakpoint}px), (pointer: coarse)`).matches;
}

function isLowPower(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData === true) return true;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 4;
}

function sample<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0]!;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
