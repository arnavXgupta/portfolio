"use client";

import { useEffect, useRef } from "react";

type Particle = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; accent: boolean; size: number };

/**
 * Sign-off wordmark that assembles from particles and scatters away from the pointer.
 * A native rebuild of ThreeUI Community's ParticleWordmark (which is a fixed-text iframe),
 * so the text can be Arnav's name and it can pause off-screen.
 */
export function ParticleWordmark({ text }: { text: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let visible = false;
    let assembled = false;
    let disposed = false;

    const build = () => {
      const bounds = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sample = document.createElement("canvas");
      sample.width = Math.round(width);
      sample.height = Math.round(height);
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-sans").trim() || "sans-serif";
      let fontSize = height * 0.9;
      sampleContext.font = `700 ${fontSize}px ${family}`;
      const measured = sampleContext.measureText(text).width;
      if (measured > width * 0.96) fontSize *= (width * 0.96) / measured;
      sampleContext.font = `700 ${fontSize}px ${family}`;
      sampleContext.textAlign = "center";
      sampleContext.textBaseline = "middle";
      sampleContext.fillStyle = "#fff";
      sampleContext.fillText(text, width / 2, height / 2 + fontSize * 0.04);

      const gap = width < 640 ? 3 : width < 1100 ? 4 : 5;
      const data = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      const next: Particle[] = [];
      for (let y = 0; y < sample.height; y += gap) {
        for (let x = 0; x < sample.width; x += gap) {
          if (data[(y * sample.width + x) * 4 + 3] < 128) continue;
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const random = seed - Math.floor(seed);
          next.push({
            hx: x,
            hy: y,
            x: reduced || assembled ? x : x + (random - 0.5) * width * 0.6,
            y: reduced || assembled ? y : y + (random - 0.5) * height * 3,
            vx: 0,
            vy: 0,
            accent: random > 0.9,
            size: gap * 0.62,
          });
        }
      }
      particles = next;
      if (reduced) draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        context.fillStyle = particle.accent ? "rgba(62,224,164,0.95)" : "rgba(236,236,239,0.82)";
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
    };

    const step = () => {
      const radius = Math.max(60, width * 0.07);
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius && distance > 0.01) {
          const force = (1 - distance / radius) * 2.4;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
        particle.vx += (particle.hx - particle.x) * 0.045;
        particle.vy += (particle.hy - particle.y) * 0.045;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
      }
      draw();
      frame = visible && !document.hidden ? requestAnimationFrame(step) : 0;
    };

    const onMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!disposed) build();
    });
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) assembled = true;
        if (reduced) return;
        if (visible && !frame) frame = requestAnimationFrame(step);
      },
      { threshold: 0.2 },
    );

    document.fonts.ready.then(() => {
      if (disposed) return;
      build();
      resizeObserver.observe(host);
      intersection.observe(host);
    });
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div ref={hostRef} className="relative h-[clamp(90px,17vw,250px)] w-full">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" role="img" aria-label={text} />
    </div>
  );
}
