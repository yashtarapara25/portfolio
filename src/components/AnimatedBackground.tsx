import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  opacity: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Completely disable on mobile to prevent scrolling lag and battery drain
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const nodeCount = isMobile ? 25 : 60;
    const maxDistance3D = isMobile ? 130 : 170;

    const nodes: Node3D[] = [];
    const sizeRange = isMobile ? 150 : 250; // spread range for nodes in 3D space

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * sizeRange * 2.5,
        y: (Math.random() - 0.5) * sizeRange * 2.5,
        z: (Math.random() - 0.5) * sizeRange * 2,
        baseSize: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    // Precalculate connections once on mount to save performance during renders
    const connections: Array<{ i: number; j: number; dist: number }> = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDistance3D) {
          connections.push({ i, j, dist });
        }
      }
    }

    // Angle tracking
    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Mouse influence on rotation angles
      targetAngleY = ((e.clientX / window.innerWidth) - 0.5) * 0.4;
      targetAngleX = ((e.clientY / window.innerHeight) - 0.5) * -0.4;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let raf = 0;
    const focalLength = 400;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const render = () => {
      raf = requestAnimationFrame(render);
      if (document.visibilityState === "hidden") return;

      // Clear canvas every frame
      ctx.clearRect(0, 0, width, height);

      // Inertia: smooth actual angles toward target angles
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      // Constant slow base rotation so it doesn't stand still
      const currentAngleY = angleY + performance.now() * 0.0001;
      const currentAngleX = angleX + performance.now() * 0.00005;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Project nodes and draw
      const projected: Array<{ x: number; y: number; size: number; opacity: number; depth: number } | null> = [];

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];

        // Rotate around Y axis
        const x1 = node.x * cosY - node.z * sinY;
        const z1 = node.x * sinY + node.z * cosY;

        // Rotate around X axis
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        // Depth perspective mapping
        const depth = focalLength + z2;
        if (depth <= 0) {
          projected.push(null);
          continue;
        }

        const scale = focalLength / depth;
        const projX = width / 2 + x1 * scale;
        const projY = height / 2 + y2 * scale;

        // Fade out nodes that are too close or too far
        const opacity = node.opacity * scale * (1 - Math.abs(z2) / (sizeRange * 1.5));
        const size = node.baseSize * scale;

        projected.push({
          x: projX,
          y: projY,
          size: Math.max(0.1, size),
          opacity: Math.max(0, Math.min(0.6, opacity)),
          depth: z2,
        });
      }

      // Draw connection lines in 3D using precalculated connections list
      for (let k = 0; k < connections.length; k++) {
        const { i, j, dist } = connections[k];
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) continue; // Skip if either node is out of viewport/behind screen

        const lineOpacity = (1 - dist / maxDistance3D) * 0.12 * Math.min(p1.opacity, p2.opacity);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `hsla(153, 100%, 50%, ${lineOpacity})`;
        ctx.lineWidth = 0.4 * (p1.size + p2.size) / 2;
        ctx.stroke();
      }

      // Draw node particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (!p) continue;
        
        // Glow layer for front-most nodes
        if (p.depth < 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(153, 100%, 50%, ${p.opacity * 0.2})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(153, 100%, 75%, ${p.opacity})`;
        ctx.fill();
      }

      // If mouse is active, draw a subtle follow spotlight
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-background">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full hidden md:block"
        style={{ opacity: 0.35 }}
        aria-hidden="true"
      />
    </div>
  );
}
