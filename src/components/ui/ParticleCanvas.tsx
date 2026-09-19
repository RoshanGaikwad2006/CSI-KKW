"use client";
import React, { useEffect, useRef } from "react";

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Dot = { x: number; y: number; size: number; vx: number; vy: number; ox: number; oy: number };
    let particles: Dot[] = [];
    let animId: number;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 16000);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          ox: x,
          oy: y,
          size: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Natural velocity movement
        p.x += p.vx;
        p.y += p.vy;

        // Screen wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Mouse hover interactive effect (repulsion + highlight)
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius && mouse.x > 0) {
          // Connect line from particle to cursor
          const alpha = 0.28 * (1 - mDist / mouse.radius);
          ctx.strokeStyle = `rgba(29, 110, 245, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Subtle gentle repulsion from cursor
          const force = (mouse.radius - mDist) / mouse.radius;
          p.x -= (mdx / mDist) * force * 1.2;
          p.y -= (mdy / mDist) * force * 1.2;

          // Slightly enlarge and brighten particle near cursor
          ctx.fillStyle = `rgba(29, 110, 245, ${0.35 + 0.35 * force})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + force * 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(29, 110, 245, 0.28)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Connect nearby particles with lines
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(29, 110, 245, ${0.09 - dist / 1000})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ background: "#f8faff" }}
      aria-hidden="true"
    >
      {/* Ambient blue glow blobs matching the home page */}
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-blue-100/70 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 -right-10 w-[450px] h-[450px] bg-blue-50/80 rounded-full blur-[110px]" />
      <div className="absolute bottom-10 left-1/3 w-[380px] h-[380px] bg-indigo-50/60 rounded-full blur-[80px]" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.55 }}
      />
    </div>
  );
};

export default ParticleCanvas;
