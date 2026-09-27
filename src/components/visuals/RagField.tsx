"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; phase: number; cluster: number };

const CLUSTERS = [
  [0.22, 0.3],
  [0.68, 0.26],
  [0.5, 0.64],
  [0.18, 0.74],
  [0.84, 0.68],
];
// What Cognivia actually ingests, so the clusters read as sources, not decoration.
const CLUSTER_LABELS = ["pdf chapters", "lecture transcripts", "notes", "slides", "papers"];
const K = 5;
const CYCLE = 2800;

function seeded(index: number, salt: number) {
  return Math.abs(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453) % 1;
}

/**
 * Cognivia's retrieval step as a picture: an embedding space of document chunks, a query
 * arrives, and its top-k nearest neighbours light up. In the spirit of ThreeUI's
 * ConnectivityGraph / InterfaceLines, drawn natively on canvas 2D.
 */
export function RagField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return undefined;

    const points: Point[] = Array.from({ length: 260 }, (_, index) => {
      const cluster = index % CLUSTERS.length;
      const [cx, cy] = CLUSTERS[cluster];
      const angle = seeded(index, 1) * Math.PI * 2;
      const radius = Math.pow(seeded(index, 2), 0.7) * 0.16;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius * 0.9, phase: seeded(index, 3) * Math.PI * 2, cluster };
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    let query = { x: 0.5, y: 0.5, neighbours: [] as number[] };
    let lastCycle = -1;
    const positions = new Float32Array(points.length * 2);
    // Static intra-cluster edges (two nearest neighbours each) give the space its texture.
    const edges: number[] = [];
    for (let index = 0; index < points.length; index += 1) {
      const nearest = points
        .map((other, otherIndex) => ({ otherIndex, d: other.cluster === points[index].cluster && otherIndex !== index ? (other.x - points[index].x) ** 2 + (other.y - points[index].y) ** 2 : Infinity }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const item of nearest) if (item.otherIndex > index) edges.push(index, item.otherIndex);
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(1200);
    };

    const pickQuery = (cycle: number) => {
      const cluster = CLUSTERS[cycle % CLUSTERS.length];
      const x = cluster[0] + (seeded(cycle, 7) - 0.5) * 0.12;
      const y = cluster[1] + (seeded(cycle, 8) - 0.5) * 0.12;
      const ranked = points.map((point, index) => ({ index, d: (point.x - x) ** 2 + (point.y - y) ** 2 })).sort((a, b) => a.d - b.d);
      query = { x, y, neighbours: ranked.slice(0, K).map((item) => item.index) };
    };

    const draw = (now: number) => {
      const cycle = Math.floor(now / CYCLE);
      if (cycle !== lastCycle) {
        lastCycle = cycle;
        pickQuery(cycle);
      }
      const local = (now % CYCLE) / CYCLE;
      const appear = Math.min(1, local / 0.18);
      const linkGrow = Math.min(1, Math.max(0, (local - 0.12) / 0.3));
      const fadeOut = local > 0.82 ? 1 - (local - 0.82) / 0.18 : 1;
      const t = now / 1000;

      context.clearRect(0, 0, width, height);
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        positions[index * 2] = (point.x + Math.sin(t * 0.4 + point.phase) * 0.006) * width;
        positions[index * 2 + 1] = (point.y + Math.cos(t * 0.35 + point.phase) * 0.006) * height;
      }
      const qx = query.x * width;
      const qy = query.y * height;

      context.lineWidth = 1;
      context.strokeStyle = "rgba(236,236,239,0.07)";
      context.beginPath();
      for (let edge = 0; edge < edges.length; edge += 2) {
        context.moveTo(positions[edges[edge] * 2], positions[edges[edge] * 2 + 1]);
        context.lineTo(positions[edges[edge + 1] * 2], positions[edges[edge + 1] * 2 + 1]);
      }
      context.stroke();

      context.font = "400 10px ui-monospace, monospace";
      context.fillStyle = "rgba(236,236,239,0.32)";
      for (let cluster = 0; cluster < CLUSTERS.length; cluster += 1) {
        context.fillText(CLUSTER_LABELS[cluster], CLUSTERS[cluster][0] * width - 30, (CLUSTERS[cluster][1] - 0.2) * height);
      }

      for (let n = 0; n < query.neighbours.length; n += 1) {
        const index = query.neighbours[n];
        const px = positions[index * 2];
        const py = positions[index * 2 + 1];
        const grow = Math.min(1, Math.max(0, linkGrow * K - n * 0.6));
        if (grow <= 0) continue;
        context.strokeStyle = `rgba(62,224,164,${0.55 * fadeOut})`;
        context.beginPath();
        context.moveTo(qx, qy);
        context.lineTo(qx + (px - qx) * grow, qy + (py - qy) * grow);
        context.stroke();
      }

      for (let index = 0; index < points.length; index += 1) {
        const hit = query.neighbours.includes(index) && linkGrow > 0.2;
        context.fillStyle = hit ? `rgba(62,224,164,${0.95 * fadeOut + 0.3})` : "rgba(236,236,239,0.34)";
        context.beginPath();
        context.arc(positions[index * 2], positions[index * 2 + 1], hit ? 3.4 : 1.8, 0, Math.PI * 2);
        context.fill();
      }

      const pulse = 8 + local * 26;
      context.strokeStyle = `rgba(62,224,164,${(1 - local) * 0.5 * appear})`;
      context.beginPath();
      context.arc(qx, qy, pulse, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = `rgba(236,236,239,${appear * fadeOut})`;
      context.beginPath();
      context.arc(qx, qy, 4.5, 0, Math.PI * 2);
      context.fill();
      context.font = "500 11px ui-monospace, monospace";
      context.fillStyle = `rgba(236,236,239,${0.75 * appear * fadeOut})`;
      context.fillText("query", qx + 10, qy - 10);
    };

    const render = (now: number) => {
      draw(now);
      frame = visible && !document.hidden ? requestAnimationFrame(render) : 0;
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (reduced) return;
      if (visible && !frame) frame = requestAnimationFrame(render);
    });
    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    if (!reduced) frame = requestAnimationFrame(render);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
