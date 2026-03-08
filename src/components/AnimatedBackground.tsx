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

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Mouse tracking
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 45;

    const createParticle = (x?: number, y?: number): Particle => ({
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      size: Math.random() * 2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.6 ? 280 + Math.random() * 60 : 180 + Math.random() * 40, // cyan or purple
      life: 0,
      maxLife: 200 + Math.random() * 400,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time++;
      // Fade trail
      ctx.fillStyle = "rgba(8, 10, 22, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;

        // Gentle float drift
        p.x += Math.sin(time * 0.005 + idx) * 0.15;
        p.y += Math.cos(time * 0.007 + idx) * 0.1;

        // Mouse interaction (magnetic pull + draw line)
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;

        if (distMouseSq < 22500) { // 150px radius squared
          // Magnetic pull
          p.x -= dxMouse * 0.015;
          p.y -= dyMouse * 0.015;

          // Draw line to mouse
          const mouseLineOpacity = (1 - distMouseSq / 22500) * 0.8 * fadeOpacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${mouseLineOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Lifecycle fade
        const lifeFraction = p.life / p.maxLife;
        const fadeOpacity = lifeFraction < 0.1
          ? (lifeFraction / 0.1) * p.opacity
          : lifeFraction > 0.85
            ? ((1 - lifeFraction) / 0.15) * p.opacity
            : p.opacity;

        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
          return;
        }

        // Draw glowing particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${fadeOpacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${fadeOpacity * 1.5})`;
        ctx.fill();

        // Draw highly optimized connection lines
        // Only loop forward to avoid double-drawing lines and cut checks in half 
        for (let j = idx + 1; j < PARTICLE_COUNT; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          // Squared distance check (skips expensive Math.sqrt) - 14400 is 120 squared
          const squaredDistance = dx * dx + dy * dy;

          if (squaredDistance < 14400) {
            // Further optimization: don't calculate exact distance for opacity unless needed
            const lineOpacity = (1 - squaredDistance / 14400) * 0.15 * fadeOpacity;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${lineOpacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.6 }}
    />
  );
}
