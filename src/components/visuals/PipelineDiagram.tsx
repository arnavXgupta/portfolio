"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

type Node = { x: number; y: number; w: number; label: string };

const CYCLE = 3.2;

function PipelineSvg({ viewBox, nodes, forward, back, backLabel, tools }: { viewBox: string; nodes: Node[]; forward: string; back: string; backLabel: { x: number; y: number }; tools?: { node: Node; link: string } }) {
  const reduce = useReducedMotion();
  const glowId = `glow-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const draw = reduce ? {} : { initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true, amount: 0.5 } };
  return (
    <svg viewBox={viewBox} className="h-auto w-full" role="img" aria-label="Simplified call flow: caller, telephony, speech to text, LLM with booking tools, text to speech, and audio back to the caller.">
      <defs>
        <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.path d={forward} fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth={1.5} {...draw} transition={{ duration: 1.4, ease: "easeInOut" }} />
      <motion.path d={back} fill="none" stroke="rgb(62 224 164 / 0.35)" strokeWidth={1.5} strokeDasharray="4 6" {...draw} transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }} />
      {tools ? <motion.path d={tools.link} fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth={1.5} strokeDasharray="3 5" {...draw} transition={{ duration: 0.6, delay: 1 }} /> : null}

      {!reduce
        ? [0, 1, 2].map((index) => (
            <circle key={`f${index}`} r={4} fill="#3ee0a4" filter={`url(#${glowId})`}>
              <animateMotion dur={`${CYCLE}s`} repeatCount="indefinite" begin={`${(index * CYCLE) / 3}s`} path={forward} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
          ))
        : null}
      {!reduce
        ? [0, 1].map((index) => (
            <circle key={`b${index}`} r={3} fill="#ececef" opacity={0.8}>
              <animateMotion dur={`${CYCLE * 1.4}s`} repeatCount="indefinite" begin={`${index * CYCLE * 0.7}s`} path={back} />
            </circle>
          ))
        : null}

      {[...nodes, ...(tools ? [tools.node] : [])].map((node, index) => (
        <g key={node.label}>
          <rect x={node.x - node.w / 2} y={node.y - 22} width={node.w} height={44} rx={22} fill="#141418" stroke="rgb(255 255 255 / 0.14)" strokeWidth={1}>
            {!reduce && index < nodes.length ? (
              <animate attributeName="stroke" values="rgba(255,255,255,0.14);#3ee0a4;rgba(255,255,255,0.14)" keyTimes="0;0.15;1" dur={`${CYCLE / 3}s`} begin={`${(index / nodes.length) * (CYCLE / 3)}s`} repeatCount="indefinite" />
            ) : null}
          </rect>
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#ececef" style={{ font: "500 14px var(--font-geist-sans), sans-serif" }}>
            {node.label}
          </text>
        </g>
      ))}
      <text x={backLabel.x} y={backLabel.y} textAnchor="middle" fill="#7c7c85" style={{ font: "400 12px var(--font-geist-mono), monospace" }}>
        spoken reply streams back
      </text>
    </svg>
  );
}

/** How a call moves through the voice agent. Simplified on purpose: the shape of the system, not its internals. */
export function PipelineDiagram() {
  const horizontal: Node[] = [
    { x: 70, y: 140, w: 112, label: "Caller" },
    { x: 222, y: 140, w: 122, label: "Telephony" },
    { x: 394, y: 140, w: 150, label: "Speech to text" },
    { x: 566, y: 140, w: 124, label: "LLM" },
    { x: 730, y: 140, w: 140, label: "Text to speech" },
  ];
  const vertical: Node[] = [
    { x: 170, y: 34, w: 150, label: "Caller" },
    { x: 170, y: 114, w: 150, label: "Telephony" },
    { x: 170, y: 194, w: 170, label: "Speech to text" },
    { x: 170, y: 274, w: 150, label: "LLM" },
    { x: 170, y: 354, w: 170, label: "Text to speech" },
  ];
  return (
    <div className="rounded-[20px] border border-line bg-panel p-5 md:p-7">
      <div className="hidden md:block">
        <PipelineSvg
          viewBox="0 0 800 250"
          nodes={horizontal}
          forward="M126 140 H660"
          back="M730 162 C730 236 70 236 70 162"
          backLabel={{ x: 400, y: 244 }}
          tools={{ node: { x: 566, y: 40, w: 150, label: "Booking tools" }, link: "M566 62 V118" }}
        />
      </div>
      <div className="mx-auto max-w-[340px] md:hidden">
        <PipelineSvg
          viewBox="0 0 340 420"
          nodes={vertical}
          forward="M170 56 V332"
          back="M85 354 C18 354 18 34 95 34"
          backLabel={{ x: 170, y: 408 }}
          tools={{ node: { x: 298, y: 274, w: 80, label: "Tools" }, link: "M245 274 H258" }}
        />
      </div>
    </div>
  );
}
