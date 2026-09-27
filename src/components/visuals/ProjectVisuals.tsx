"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowsClockwiseIcon, BedIcon, FileTextIcon, HouseLineIcon, MapPinIcon, StorefrontIcon } from "@phosphor-icons/react";
import { siInstagram, siX, siYoutube, type SimpleIcon } from "simple-icons";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/site";
import { LazyMount } from "@/components/ui/LazyMount";

const RagField = dynamic(() => import("./RagField").then((m) => m.RagField), { ssr: false });


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

/* Urban Realities: filters narrowing a rentals feed. Sample listings, cycling PG, residential, commercial. */
type Listing = { title: string; area: string; price: number; kind: "PG" | "Residential" | "Commercial" };
const LISTINGS: Listing[] = [
  { title: "PG, twin sharing", area: "Model Town", price: 4800, kind: "PG" },
  { title: "PG, triple sharing", area: "Bibiwala Road", price: 5500, kind: "PG" },
  { title: "PG, single room", area: "Ajit Road", price: 6500, kind: "PG" },
  { title: "Girls PG", area: "Civil Lines", price: 7200, kind: "PG" },
  { title: "PG with meals", area: "100 Feet Road", price: 7800, kind: "PG" },
  { title: "1 BHK flat", area: "Power House Road", price: 9000, kind: "Residential" },
  { title: "1 BHK, furnished", area: "Ajit Road", price: 11500, kind: "Residential" },
  { title: "2 BHK flat", area: "100 Feet Road", price: 14000, kind: "Residential" },
  { title: "2 BHK, furnished", area: "Civil Lines", price: 18000, kind: "Residential" },
  { title: "3 BHK house", area: "Model Town", price: 22000, kind: "Residential" },
  { title: "Office, first floor", area: "Power House Road", price: 16000, kind: "Commercial" },
  { title: "Office space", area: "Bibiwala Road", price: 18000, kind: "Commercial" },
  { title: "Shop, ground floor", area: "Mall Road", price: 25000, kind: "Commercial" },
  { title: "Warehouse", area: "Goniana Road", price: 32000, kind: "Commercial" },
  { title: "Showroom", area: "Ajit Road", price: 40000, kind: "Commercial" },
];
const FILTERS = [
  { kind: "PG", min: 4000, max: 8000 },
  { kind: "Residential", min: 8000, max: 25000 },
  { kind: "Commercial", min: 15000, max: 45000 },
] as const;
const RANGE_MAX = 50000;
const KIND_ICON = { PG: BedIcon, Residential: HouseLineIcon, Commercial: StorefrontIcon };
const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function ListingsFilter() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduce || !inView) return undefined;
    const timer = window.setInterval(() => setStep((value) => (value + 1) % FILTERS.length), 2800);
    return () => window.clearInterval(timer);
  }, [reduce, inView]);
  const filter = FILTERS[step];
  const results = LISTINGS.filter((item) => item.kind === filter.kind && item.price >= filter.min && item.price <= filter.max).slice(0, 6);
  const low = (filter.min / RANGE_MAX) * 100;
  const high = (filter.max / RANGE_MAX) * 100;
  const spring = { type: "spring" as const, bounce: 0.18, duration: 0.7 };

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col gap-3 overflow-hidden p-4 sm:p-5 lg:gap-4 lg:p-7" aria-hidden="true">
      <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-raised px-4 py-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <MapPinIcon size={12} /> Bathinda
        </span>
        <div className="flex gap-1.5">
          {FILTERS.map((option) => (
            <span key={option.kind} className="relative rounded-full px-3 py-1 text-[11px]">
              {option.kind === filter.kind ? <motion.span layoutId="listing-chip" className="absolute inset-0 rounded-full bg-accent" transition={spring} /> : <span className="absolute inset-0 rounded-full border border-line" />}
              <span className={`relative transition-colors duration-300 ${option.kind === filter.kind ? "text-accent-ink" : "text-muted"}`}>{option.kind}</span>
            </span>
          ))}
        </div>
        <div className="min-w-[150px] flex-1">
          <div className="flex justify-between font-mono text-[10px] text-muted">
            <span>{rupees(filter.min)}</span>
            <span>{rupees(filter.max)}</span>
          </div>
          <div className="relative mt-2 h-1 rounded-full bg-white/[0.08]">
            <motion.span className="absolute inset-y-0 rounded-full bg-accent" initial={false} animate={{ left: `${low}%`, right: `${100 - high}%` }} transition={spring} />
            {[low, high].map((value, index) => (
              <motion.span key={index} className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-bg" initial={false} animate={{ left: `${value}%` }} transition={spring} />
            ))}
          </div>
        </div>
        <span className="hidden font-mono text-[10px] text-faint lg:inline">
          <span className="text-fg">{results.length}</span> listings, sample data
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-2.5 sm:grid-cols-3 lg:grid-rows-2 lg:content-stretch lg:gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((item, index) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <motion.div
                key={item.title + item.area}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ ...spring, delay: index * 0.04 }}
                className={`flex flex-col rounded-xl border border-line bg-raised p-2.5 lg:p-3 ${index > 1 ? "max-sm:hidden" : ""}`}
              >
                <div className="grid h-11 place-items-center rounded-lg bg-[linear-gradient(135deg,rgb(62_224_164/0.18),rgb(255_255_255/0.03))] text-accent lg:h-auto lg:min-h-[4.5rem] lg:flex-1">
                  <Icon size={20} />
                </div>
                <p className="mt-2 truncate text-[12px] font-medium text-fg">{item.title}</p>
                <p className="truncate text-[10px] text-faint">{item.area}</p>
                <p className="mt-1 font-mono text-[11px] text-accent">{rupees(item.price)}/mo</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
    case "listings":
      return <ListingsFilter />;
  }
}
