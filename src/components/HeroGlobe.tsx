import { useEffect, useRef } from "react";

export default function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = canvas.width = 450;
    let height = canvas.height = 450;

    const sphereRadius = 155;
    const focalLength = 320;

    // Golden ratio sphere point distribution (Fibonacci sphere)
    const numPoints = 120;
    const points: Array<{ x: number; y: number; z: number }> = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push({ x, y, z });
    }

    // Precalculate connections once on mount to save performance
    const connections: Array<{ i: number; j: number; dist: number }> = [];
    for (let i = 0; i < numPoints; i++) {
      for (let j = i + 1; j < numPoints; j++) {
        const dx = (points[i].x - points[j].x) * sphereRadius;
        const dy = (points[i].y - points[j].y) * sphereRadius;
        const dz = (points[i].z - points[j].z) * sphereRadius;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 65) {
          connections.push({ i, j, dist });
        }
      }
    }

    let angleX = 0.3;
    let angleY = 0;
    let targetAngleX = 0.3;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (x / rect.width) * 0.8;
      targetAngleX = (y / rect.height) * -0.8;
    };

    const handleMouseLeave = () => {
      targetAngleX = 0.3;
      targetAngleY = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);



    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);

      ctx.clearRect(0, 0, width, height);

      // Smooth inertia rotation
      angleX += (targetAngleX - angleX) * 0.08;
      angleY += (targetAngleY - angleY) * 0.08;

      // Slowly rotate the sphere automatically
      const currentAngleY = angleY + performance.now() * 0.0002;
      const currentAngleX = angleX;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      const projected: Array<{ x: number; y: number; z: number; projX: number; projY: number; opacity: number; depth: number }> = [];

      for (let i = 0; i < numPoints; i++) {
        const p = points[i];

        // Scale up to sphere size
        const sx = p.x * sphereRadius;
        const sy = p.y * sphereRadius;
        const sz = p.z * sphereRadius;

        // Rotate Y
        const rx1 = sx * cosY - sz * sinY;
        const rz1 = sx * sinY + sz * cosY;

        // Rotate X
        const ry2 = sy * cosX - rz1 * sinX;
        const rz2 = sy * sinX + rz1 * cosX;

        // Perspective projection
        const depth = focalLength + rz2;
        const scale = focalLength / depth;
        const projX = width / 2 + rx1 * scale;
        const projY = height / 2 + ry2 * scale;

        // Calculate opacity based on depth (z coordinate in camera space)
        // Front points (rz2 < 0) are closer, back points (rz2 > 0) are further
        const opacity = (1 - (rz2 + sphereRadius) / (sphereRadius * 2)) * 0.6 + 0.15;

        projected.push({
          x: rx1,
          y: ry2,
          z: rz2,
          projX,
          projY,
          opacity,
          depth: rz2,
        });
      }

      // Draw lines between near neighbors using precalculated connections
      ctx.lineWidth = 0.8;
      for (let k = 0; k < connections.length; k++) {
        const { i, j, dist } = connections[k];
        const p1 = projected[i];
        const p2 = projected[j];

        const lineOpacity = Math.min(p1.opacity, p2.opacity) * 0.3 * (1 - dist / 65);
        ctx.beginPath();
        ctx.moveTo(p1.projX, p1.projY);
        ctx.lineTo(p2.projX, p2.projY);
        // Draw neon mint green links
        ctx.strokeStyle = `hsla(153, 100%, 50%, ${lineOpacity})`;
        ctx.stroke();
      }


      // Draw nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotSize = p.depth < 0 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(153, 100%, 75%, ${p.opacity * 0.9})`;
        ctx.fill();
      }
    };

    render();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || 450;
        height = canvas.height = entry.contentRect.height || 450;
      }
    });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center pointer-events-auto">
      {/* Background glow beneath globe */}
      <div 
        className="absolute w-[80%] h-[80%] rounded-full blur-[100px] pointer-events-none opacity-35"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 animate-fade-in"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
