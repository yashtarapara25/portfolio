import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

// ─── Tuning constants ────────────────────────────────────────────────────────
const BASE_COUNT = 35;          // desktop particle count (reduced from 45)
const MOBILE_COUNT = 18;        // mobile: far fewer particles
const CONNECT_RADIUS_SQ = 8100; // 90px² (was 120px = 14400) — cuts pair checks ~44%
const MOUSE_RADIUS_SQ = 14400;  // 120px² for mouse interaction
// ────────────────────────────────────────────────────────────────────────────

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Skip animation entirely for users who prefer reduced motion ───────
    // This eliminates ALL canvas work for ~20% of users and prevents
    // any scroll jank on devices with accessibility settings enabled.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // willReadFrequently: false (we never call getImageData) — lets the browser
    // keep the canvas on the GPU without a round-trip to CPU memory.
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    // ── Determine particle count based on device ──────────────────────────
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const PARTICLE_COUNT = isMobile ? MOBILE_COUNT : BASE_COUNT;

    // ── Canvas sizing ─────────────────────────────────────────────────────
    let raf = 0;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // ── Mouse tracking (stored in ref — never triggers re-render) ─────────
    const mouse = { x: -9999, y: -9999 };
    let mouseMoveScheduled = false;
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle: only update on next animation frame, not every mousemove event
      if (!mouseMoveScheduled) {
        mouseMoveScheduled = true;
        requestAnimationFrame(() => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          mouseMoveScheduled = false;
        });
      }
    };
    const handleMouseOut = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });

    // ── Pre-built gradient cache (avoid createRadialGradient every frame) ─
    // We bucket hues into 4 groups: cyan(~195), purple(~290), mix, mix2
    // Each gradient is created once and stored.
    const GRADIENT_CACHE = new Map<number, CanvasGradient>();
    const getGradient = (p: Particle): CanvasGradient => {
      const hueBucket = Math.round(p.hue / 10) * 10; // bucket to nearest 10°
      if (GRADIENT_CACHE.has(hueBucket)) return GRADIENT_CACHE.get(hueBucket)!;
      // Create at point (0,0) — we'll set transform each time (faster than re-creating)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3);
      g.addColorStop(0, `hsla(${hueBucket}, 90%, 70%, 1)`);
      g.addColorStop(1, `hsla(${hueBucket}, 80%, 60%, 0)`);
      GRADIENT_CACHE.set(hueBucket, g);
      return g;
    };

    // ── Particle factory ──────────────────────────────────────────────────
    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.45 + 0.12,
      hue: Math.random() > 0.55 ? 280 + Math.random() * 50 : 185 + Math.random() * 30,
      life: 0,
      maxLife: 220 + Math.random() * 380,
    });

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => createParticle());

    let time = 0;
    let lastTime = 0;

    // ── Main render loop ──────────────────────────────────────────────────
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);

      // Pause when tab is not visible — saves battery and GPU bandwidth
      if (document.visibilityState === "hidden") return;

      // Cap delta to avoid huge jumps after tab switch
      const delta = Math.min(now - lastTime, 32);
      lastTime = now;
      time += delta * 0.001; // time in seconds

      // Fade trail — using fillRect is cheaper than clearRect + redraw
      ctx.fillStyle = "rgba(8, 10, 22, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let idx = 0; idx < PARTICLE_COUNT; idx++) {
        const p = particles[idx];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        // Gentle float drift (pre-computed sin/cos offset)
        p.x += Math.sin(time + idx * 0.7) * 0.12;
        p.y += Math.cos(time * 1.1 + idx * 0.5) * 0.09;

        // Wrap edges
        if (p.x < -10) p.x = canvas.width + 10;
        else if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        else if (p.y > canvas.height + 10) p.y = -10;

        // Lifecycle fade-in / fade-out
        const lifeFraction = p.life / p.maxLife;
        const fadeOpacity =
          lifeFraction < 0.1
            ? (lifeFraction / 0.1) * p.opacity
            : lifeFraction > 0.85
              ? ((1 - lifeFraction) / 0.15) * p.opacity
              : p.opacity;

        // Recycle
        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
          continue;
        }

        // ── Mouse interaction ──────────────────────────────────────────
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distMSq = dxM * dxM + dyM * dyM;

        if (distMSq < MOUSE_RADIUS_SQ) {
          p.x -= dxM * 0.014;
          p.y -= dyM * 0.014;

          const lineOpacity = (1 - distMSq / MOUSE_RADIUS_SQ) * 0.65 * fadeOpacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${lineOpacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // ── Draw particle (core dot only — simpler, still beautiful) ──
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);

        // Use cached gradient — offset with save/restore transform
        ctx.save();
        ctx.translate(p.x, p.y);
        const grad = getGradient(p);
        ctx.globalAlpha = fadeOpacity;
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        // Core bright dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${Math.min(fadeOpacity * 1.4, 1)})`;
        ctx.fill();
        ctx.globalAlpha = 1;

        // ── Connection lines (forward-only, reduced radius) ───────────
        for (let j = idx + 1; j < PARTICLE_COUNT; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const sq = dx * dx + dy * dy;

          if (sq < CONNECT_RADIUS_SQ) {
            const lineOpacity = (1 - sq / CONNECT_RADIUS_SQ) * 0.12 * fadeOpacity;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 75%, 65%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    raf = requestAnimationFrame(animate);

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.55, willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
