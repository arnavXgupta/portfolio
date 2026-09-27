"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex h-12 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 active:scale-[0.98]";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-[#5cf0b8]",
  ghost: "border border-line-strong bg-white/[0.03] text-fg hover:border-white/30 hover:bg-white/[0.06]",
};

/** Pulls gently toward the pointer: feedback that the button is live. Motion values only, no React state. */
function useMagnet(strength: number) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };
  return { style: { x: sx, y: sy }, onPointerMove, onPointerLeave };
}

type MagneticLinkProps = Omit<ComponentProps<typeof motion.a>, "children"> & { variant?: Variant; children: ReactNode; strength?: number };

export function MagneticLink({ variant = "primary", strength = 0.28, className = "", children, ...rest }: MagneticLinkProps) {
  const magnet = useMagnet(strength);
  return (
    <motion.a {...rest} {...magnet} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </motion.a>
  );
}

type MagneticButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & { variant?: Variant; children: ReactNode; strength?: number };

export function MagneticButton({ variant = "primary", strength = 0.28, className = "", children, ...rest }: MagneticButtonProps) {
  const magnet = useMagnet(strength);
  return (
    <motion.button type="button" {...rest} {...magnet} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </motion.button>
  );
}
