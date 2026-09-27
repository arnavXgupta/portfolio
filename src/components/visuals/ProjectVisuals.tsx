"use client";

import dynamic from "next/dynamic";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowsClockwiseIcon, FileTextIcon } from "@phosphor-icons/react";
import { siInstagram, siX, siYoutube, type SimpleIcon } from "simple-icons";
import { useEffect, useId, useRef } from "react";
import type { Project } from "@/content/site";
import { LazyMount } from "@/components/ui/LazyMount";

const RagField = dynamic(() => import("./RagField").then((m) => m.RagField), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

/* DocuPrism: a document is split into semantic chunks, each one becomes a vector. */
function ChunkDoc() {
  const reduce = useReducedMotion();
  const lines = [92, 78, 86, 60, 94, 70, 88, 52, 84, 76, 66, 90];
  const chunkTop = [0, 3, 6, 9];
  const loop = reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.22, 0.25, 0.47, 0.5, 0.72, 0.75, 0.97, 1] };
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 p-6" aria-hidden="true">
      <div className="relative w-[46%] max-w-[170px] rounded-xl border border-line bg-raised p-4">
        <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <FileTextIcon size={12} /> policy.pdf
        </div>
        <div className="relative grid gap-[7px]">
          {lines.map((width, index) => (
            <span key={index} className="block h-[5px] rounded-full bg-white/[0.14]" style={{ width: `${width}%` }} />
          ))}
          <motion.span
            className="absolute -inset-x-1.5 top-[-4px] h-[44px] rounded-md border border-accent/70 bg-accent/10"
            animate={reduce ? { y: 0 } : { y: [0, 0, 36, 36, 72, 72, 108, 108, 0] }}
            transition={loop}
          />
        </div>
      </div>
      <div className="grid w-[40%] max-w-[150px] gap-2">
        {chunkTop.map((_, index) => (
          <motion.div
            key={index}
            className="flex h-7 items-center gap-[3px] rounded-lg border border-line bg-raised px-2"
            initial={false}
            animate={reduce ? { opacity: 1, x: 0 } : { opacity: [0.25, 1, 1, 0.25], x: [8, 0, 0, 8] }}
            transition={reduce ? { duration: 0 } : { duration: 6, repeat: Infinity, delay: index * 1.5, times: [0, 0.08, 0.9, 1] }}
          >
            {Array.from({ length: 9 }, (_, cell) => (
              <span key={cell} className="h-3 flex-1 rounded-[2px] bg-accent" style={{ opacity: 0.15 + (((index + 1) * (cell + 3) * 37) % 10) / 12 }} />
            ))}
          </motion.div>
        ))}
        <p className="mt-1 text-center font-mono text-[10px] text-faint">embeddings</p>
      </div>
    </div>
  );
}

/* Arula-Connect: roles talk through one real-time hub; presence is tracked per user. */
function RoleNetwork() {
  const reduce = useReducedMotion();
  const roles = [
    { label: "Parent", x: 64, y: 46 },
    { label: "Therapist", x: 256, y: 46 },
    { label: "Group leader", x: 64, y: 174 },
    { label: "Admin", x: 256, y: 174 },
  ];
  const hub = { x: 160, y: 110 };
  const routes = [
    [0, 1],
    [1, 2],
    [3, 0],
    [2, 1],
  ];
  return (
    <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full p-4" aria-hidden="true">
      {roles.map((role) => (
        <line key={role.label} x1={role.x} y1={role.y} x2={hub.x} y2={hub.y} stroke="rgb(255 255 255 / 0.12)" strokeWidth={1} />
      ))}
      {!reduce
        ? routes.map(([from, to], index) => (
            <circle key={index} r={3.5} fill="#3ee0a4">
              <animateMotion dur="2.4s" begin={`${index * 0.6}s`} repeatCount="indefinite" path={`M${roles[from].x} ${roles[from].y} L${hub.x} ${hub.y} L${roles[to].x} ${roles[to].y}`} />
            </circle>
          ))
        : null}
      <circle cx={hub.x} cy={hub.y} r={30} fill="#141418" stroke="rgb(62 224 164 / 0.5)" />
      {!reduce ? (
        <circle cx={hub.x} cy={hub.y} r={30} fill="none" stroke="#3ee0a4" strokeOpacity={0.4}>
          <animate attributeName="r" values="30;46" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.4;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
      ) : null}
      <text x={hub.x} y={hub.y + 4} textAnchor="middle" fill="#ececef" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
        socket
      </text>
      {roles.map((role, index) => (
        <g key={role.label}>
          <rect x={role.x - 54} y={role.y - 14} width={108} height={28} rx={14} fill="#141418" stroke="rgb(255 255 255 / 0.14)" />
          <circle cx={role.x - 40} cy={role.y} r={3} fill={index === 2 ? "#7c7c85" : "#3ee0a4"} />
          <text x={role.x + 6} y={role.y + 4} textAnchor="middle" fill="#ececef" style={{ font: "500 11px var(--font-geist-sans), sans-serif" }}>
            {role.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function BrandGlyph({ icon, x, y }: { icon: SimpleIcon; x: number; y: number }) {
  return (
    <g transform={`translate(${x - 11} ${y - 11}) scale(0.92)`}>
      <path d={icon.path} fill="#ececef" />
    </g>
  );
}

/* Social automation: one script in, an evaluated post per platform out. */
function FanOut() {
  const reduce = useReducedMotion();
  const outs = [
    { icon: siYoutube, y: 48 },
    { icon: siInstagram, y: 110 },
    { icon: siX, y: 172 },
  ];
  const input = "M70 110 H140";
  return (
    <svg viewBox="0 0 320 220" className="absolute inset-0 h-full w-full p-4" aria-hidden="true">
      <path d={input} stroke="rgb(255 255 255 / 0.16)" fill="none" />
      {outs.map((out) => (
        <path key={out.y} d={`M196 110 C230 110 226 ${out.y} 262 ${out.y}`} stroke="rgb(255 255 255 / 0.16)" fill="none" />
      ))}
      {!reduce ? (
        <>
          <circle r={3.5} fill="#3ee0a4">
            <animateMotion dur="1.2s" repeatCount="indefinite" path={input} />
          </circle>
          {outs.map((out, index) => (
            <circle key={out.y} r={3.5} fill="#3ee0a4">
              <animateMotion dur="1.2s" begin={`${0.6 + index * 0.15}s`} repeatCount="indefinite" path={`M196 110 C230 110 226 ${out.y} 262 ${out.y}`} />
            </circle>
          ))}
        </>
      ) : null}
      <rect x={20} y={88} width={50} height={44} rx={12} fill="#141418" stroke="rgb(255 255 255 / 0.14)" />
      <text x={45} y={114} textAnchor="middle" fill="#ececef" style={{ font: "500 10px var(--font-geist-mono), monospace" }}>
        script
      </text>
      <circle cx={168} cy={110} r={28} fill="#141418" stroke="rgb(62 224 164 / 0.5)" />
      <g transform="translate(156 98)">
        <motion.g animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "12px", originY: "12px" }}>
          <ArrowsClockwiseIcon size={24} color="#3ee0a4" />
        </motion.g>
      </g>
      {outs.map((out) => (
        <g key={out.y}>
          <circle cx={284} cy={out.y} r={22} fill="#141418" stroke="rgb(255 255 255 / 0.14)" />
          <BrandGlyph icon={out.icon} x={284} y={out.y} />
        </g>
      ))}
    </svg>
  );
}

/* IntelliMatch: a sample ATS score with matched and missing skills. */
function MatchScore() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const score = useMotionValue(reduce ? 82 : 0);
  const shown = useTransform(() => Math.round(score.get()));
  const dash = useTransform(() => `${(score.get() / 100) * 264} 264`);
  const gradientId = `score-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  useEffect(() => {
    if (!inView || reduce) return undefined;
    const controls = animate(score, 82, { duration: 1.8, ease: EASE, delay: 0.2 });
    return () => controls.stop();
  }, [inView, reduce, score]);
  const matched = ["FastAPI", "Docker", "PostgreSQL", "React"];
  const missing = ["Kubernetes", "GraphQL"];
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center gap-6 p-6" aria-hidden="true">
      <div className="relative size-[112px] shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3ee0a4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3ee0a4" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="7" />
          <motion.circle cx="50" cy="50" r="42" fill="none" stroke={`url(#${gradientId})`} strokeWidth="7" strokeLinecap="round" style={{ strokeDasharray: dash }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <motion.p className="font-mono text-3xl font-medium tracking-[-0.04em] text-fg">{shown}</motion.p>
            <p className="font-mono text-[10px] text-faint">sample</p>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex flex-wrap gap-1.5">
          {matched.map((skill) => (
            <span key={skill} className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10px] text-accent">
              {skill}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {missing.map((skill) => (
            <span key={skill} className="rounded-full border border-dashed border-line-strong px-2.5 py-1 font-mono text-[10px] text-faint">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: Project["visual"] }) {
  switch (kind) {
    case "rag":
      return (
        <LazyMount className="absolute inset-0">
          <RagField />
        </LazyMount>
      );
    case "chunks":
      return <ChunkDoc />;
    case "roles":
      return <RoleNetwork />;
    case "fanout":
      return <FanOut />;
    case "match":
      return <MatchScore />;
  }
}
