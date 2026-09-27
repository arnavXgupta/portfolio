"use client";

import dynamic from "next/dynamic";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import {
  siDocker,
  siFastapi,
  siGooglegemini,
  siLangchain,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOllama,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { useEffect, useRef } from "react";
import { LazyMount } from "@/components/ui/LazyMount";

const EnergyOrb = dynamic(() => import("@/threeui/energy-orb/EnergyOrb").then((m) => m.EnergyOrb), { ssr: false });

type Ring = { rx: number; ry: number; tilt: number; speed: number; icons: SimpleIcon[] };

// Radii are fractions of the stage width. Inner ring is the AI layer, then backend, then product.
const RINGS: Ring[] = [
  { rx: 0.27, ry: 0.15, tilt: -24, speed: 0.34, icons: [siLangchain, siGooglegemini, siOllama, siPython] },
  { rx: 0.36, ry: 0.21, tilt: 18, speed: -0.24, icons: [siFastapi, siNodedotjs, siSpringboot, siPostgresql, siRedis] },
  { rx: 0.45, ry: 0.27, tilt: -8, speed: 0.17, icons: [siNextdotjs, siReact, siTypescript, siDocker, siMongodb, siTailwindcss] },
];

type Item = { ring: number; icon: SimpleIcon; phase: number };
const ITEMS: Item[] = RINGS.flatMap((ring, ringIndex) => ring.icons.map((icon, index) => ({ ring: ringIndex, icon, phase: (index / ring.icons.length) * Math.PI * 2 + ringIndex * 0.7 })));
const PACKETS = 4;

function place(item: Item, t: number, size: number) {
  const ring = RINGS[item.ring];
  const angle = item.phase + t * ring.speed;
  const lx = Math.cos(angle) * ring.rx * size;
  const ly = Math.sin(angle) * ring.ry * size;
  const tilt = (ring.tilt * Math.PI) / 180;
  return { x: lx * Math.cos(tilt) - ly * Math.sin(tilt), y: lx * Math.sin(tilt) + ly * Math.cos(tilt), depth: Math.sin(angle) };
}

/**
 * Hero asset: ThreeUI's EnergyOrb as the AI core, with the full stack orbiting it on three
 * tilted rings (AI, backend, product). Items pass in front of and behind the core, and data
 * packets travel from the stack into the core, which brightens as each one lands.
 */
export function OrbitStack({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const packetRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const size = useRef(560);
  const visible = useRef(true);
  const level = useMotionValue(0);
  const packets = useRef(Array.from({ length: PACKETS }, (_, index) => ({ item: index * 3, start: index * 0.9 })));

  // Pointer parallax: the whole system tilts toward the cursor (desktop pointers only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 80, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [8, -8]), { stiffness: 80, damping: 18 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const resize = new ResizeObserver(([entry]) => {
      size.current = entry?.contentRect.width ?? size.current;
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry?.isIntersecting ?? true;
    });
    resize.observe(stage);
    observer.observe(stage);
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduce) return;
      px.set((event.clientX / window.innerWidth) * 2 - 1);
      py.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [px, py, reduce]);

  useAnimationFrame((time) => {
    if (!visible.current) return;
    const t = reduce || !active ? 1.2 : time / 1000;
    const stageSize = size.current;
    const items = itemRefs.current;
    for (let index = 0; index < ITEMS.length; index += 1) {
      const element = items[index];
      if (!element) continue;
      const { x, y, depth } = place(ITEMS[index], t, stageSize);
      const scale = 0.72 + ((depth + 1) / 2) * 0.38;
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      element.style.opacity = (0.35 + ((depth + 1) / 2) * 0.65).toFixed(3);
      element.style.zIndex = depth > 0 ? "3" : "1";
    }
    if (reduce || !active) return;

    // Packets: travel from an orbiting item into the core over 1.1s, then pick a new source.
    let pulse = level.get() * 0.93;
    for (let index = 0; index < PACKETS; index += 1) {
      const packet = packets.current[index];
      const element = packetRefs.current[index];
      if (!element) continue;
      const progress = (t - packet.start) / 1.1;
      if (progress >= 1) {
        pulse = Math.min(1, pulse + 0.55);
        packet.start = t + 0.4 + ((index * 7 + Math.floor(t)) % 5) * 0.35;
        packet.item = (packet.item + 5 + index) % ITEMS.length;
        element.style.opacity = "0";
        continue;
      }
      if (progress < 0) {
        element.style.opacity = "0";
        continue;
      }
      const from = place(ITEMS[packet.item], packet.start, stageSize);
      const eased = progress * progress * (3 - 2 * progress);
      element.style.transform = `translate3d(${(from.x * (1 - eased)).toFixed(1)}px, ${(from.y * (1 - eased)).toFixed(1)}px, 0)`;
      element.style.opacity = (Math.sin(progress * Math.PI) * 0.95).toFixed(3);
    }
    level.set(pulse);
  });

  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[400px] md:max-w-[600px]" style={{ perspective: 1200 }}>
      <motion.div ref={stageRef} className="relative aspect-square w-full" style={{ rotateX, rotateY }}>
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {RINGS.map((ring, index) => (
            <g key={index} transform={`rotate(${ring.tilt} 50 50)`}>
              <ellipse cx="50" cy="50" rx={ring.rx * 100} ry={ring.ry * 100} fill="none" stroke="rgb(255 255 255 / 0.09)" strokeWidth="0.25" />
              <ellipse cx="50" cy="50" rx={ring.rx * 100} ry={ring.ry * 100} fill="none" stroke="#3ee0a4" strokeOpacity="0.55" strokeWidth="0.35" strokeLinecap="round" pathLength={100} strokeDasharray="6 94">
                {!reduce ? <animate attributeName="stroke-dashoffset" values={ring.speed > 0 ? "100;0" : "0;100"} dur={`${Math.abs(18 / (ring.speed * 10))}s`} repeatCount="indefinite" /> : null}
              </ellipse>
            </g>
          ))}
        </svg>

        <LazyMount className="absolute inset-[19%] z-[2]" margin="0px">
          <EnergyOrb hue={-96} saturation={0.95} glow={1} starDensity={0} speed={0.8} level={level} />
        </LazyMount>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[4]" aria-hidden="true">
          {Array.from({ length: PACKETS }, (_, index) => (
            <span
              key={index}
              ref={(element) => {
                packetRefs.current[index] = element;
              }}
              className="absolute -ml-[3px] -mt-[3px] size-[6px] rounded-full bg-accent opacity-0 shadow-[0_0_12px_3px_rgb(62_224_164/0.7)]"
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-1/2" aria-hidden="true">
          {ITEMS.map((item, index) => (
            <div
              key={item.icon.slug}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              title={item.icon.title}
              className="absolute -ml-[22px] -mt-[22px] grid size-11 place-items-center rounded-full border border-white/12 bg-[#101014]/85 shadow-[0_8px_24px_rgb(0_0_0/0.45)] backdrop-blur-sm max-sm:-ml-[17px] max-sm:-mt-[17px] max-sm:size-[34px]"
              style={{ transform: "translate3d(0,0,0)", opacity: 0 }}
            >
              <svg viewBox="0 0 24 24" className="size-[45%] fill-fg">
                <path d={item.icon.path} />
              </svg>
            </div>
          ))}
        </div>
      </motion.div>
      <p className="sr-only">Technologies Arnav works with: {ITEMS.map((item) => item.icon.title).join(", ")}.</p>
    </div>
  );
}
