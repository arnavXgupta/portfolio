"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "stick" | "label" | "lens";
const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";
const LENS = "h1, h2";
const TRAIL = 22;
const PAD = 6;

type Spark = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * Signal cursor, for fine pointers only (touch keeps the system behaviour):
 * - a glowing emerald head with a comet tail drawn on one fixed canvas,
 * - over links and buttons the ring wraps the element's own shape and leans toward the pointer,
 * - over headings it becomes an inverting lens,
 * - elements with data-cursor="Label" turn it into a labelled pill,
 * - every click throws a small burst of sparks.
 * Positions live in motion values and the canvas loop sleeps when nothing is moving,
 * so the cursor never re-renders React per frame. Reduced motion drops the trail and sparks.
 */
export function CustomCursor() {
  const reduce = Boolean(useReducedMotion());
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stuckRef = useRef<HTMLElement | null>(null);

  // Ring geometry: centre, size and radius all spring toward their targets.
  const springCfg = reduce ? { stiffness: 2000, damping: 120, mass: 0.1 } : { stiffness: 380, damping: 30, mass: 0.6 };
  const cx = useSpring(useMotionValue(-100), springCfg);
  const cy = useSpring(useMotionValue(-100), springCfg);
  const w = useSpring(useMotionValue(30), springCfg);
  const h = useSpring(useMotionValue(30), springCfg);
  const radius = useSpring(useMotionValue(15), springCfg);
  const left = useTransform(() => cx.get() - w.get() / 2);
  const top = useTransform(() => cy.get() - h.get() / 2);
  const headX = useMotionValue(-100);
  const headY = useMotionValue(-100);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!enabled || !canvas || !context) {
      root.classList.remove("has-custom-cursor");
      return undefined;
    }
    root.classList.add("has-custom-cursor");

    const pointer = { x: -100, y: -100 };
    const trail = Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 }));
    const sparks: Spark[] = [];
    let dpr = 1;
    let frame = 0;
    let idleFrames = 0;
    let currentMode: Mode = "default";

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Ring targets for the current mode.
    const aimRing = () => {
      const stuck = stuckRef.current;
      if (currentMode === "stick" && stuck) {
        const rect = stuck.getBoundingClientRect();
        const style = getComputedStyle(stuck);
        const r = Math.min(parseFloat(style.borderTopLeftRadius) || 12, (rect.height + PAD * 2) / 2);
        // Lean a little toward the pointer, like a magnet.
        const lean = 0.14;
        cx.set(rect.left + rect.width / 2 + (pointer.x - (rect.left + rect.width / 2)) * lean);
        cy.set(rect.top + rect.height / 2 + (pointer.y - (rect.top + rect.height / 2)) * lean);
        w.set(rect.width + PAD * 2);
        h.set(rect.height + PAD * 2);
        radius.set(r + PAD);
        return;
      }
      cx.set(pointer.x);
      cy.set(pointer.y);
      const size = currentMode === "lens" ? 120 : currentMode === "label" ? 36 : 30;
      w.set(currentMode === "label" ? 92 : size);
      h.set(size);
      radius.set(size / 2);
    };

    const draw = () => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let moving = false;
      if (!reduce) {
        // Each point chases the one ahead of it, which gives the tail its easing.
        trail[0].x = pointer.x;
        trail[0].y = pointer.y;
        for (let index = 1; index < TRAIL; index += 1) {
          const ahead = trail[index - 1];
          const point = trail[index];
          const dx = ahead.x - point.x;
          const dy = ahead.y - point.y;
          point.x += dx * 0.42;
          point.y += dy * 0.42;
          if (Math.abs(dx) + Math.abs(dy) > 0.3) moving = true;
        }
        if (currentMode !== "lens") {
          context.lineCap = "round";
          context.lineJoin = "round";
          for (let pass = 0; pass < 2; pass += 1) {
            for (let index = 1; index < TRAIL; index += 1) {
              const t = 1 - index / TRAIL;
              const a = trail[index - 1];
              const b = trail[index];
              context.strokeStyle = pass === 0 ? `rgba(62,224,164,${(0.16 * t).toFixed(3)})` : `rgba(160,255,214,${(0.85 * t * t).toFixed(3)})`;
              context.lineWidth = pass === 0 ? 14 * t + 2 : 4.5 * t + 0.5;
              context.beginPath();
              context.moveTo(a.x, a.y);
              context.lineTo(b.x, b.y);
              context.stroke();
            }
          }
        }
        for (let index = sparks.length - 1; index >= 0; index -= 1) {
          const spark = sparks[index];
          spark.life -= 1 / 36;
          if (spark.life <= 0) {
            sparks.splice(index, 1);
            continue;
          }
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= 0.9;
          spark.vy = spark.vy * 0.9 + 0.08;
          context.fillStyle = `rgba(160,255,214,${spark.life.toFixed(3)})`;
          context.beginPath();
          context.arc(spark.x, spark.y, 2.2 * spark.life + 0.4, 0, Math.PI * 2);
          context.fill();
        }
      }
      if (moving || sparks.length) idleFrames = 0;
      else idleFrames += 1;
      if (idleFrames < 4) frame = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      headX.set(event.clientX);
      headY.set(event.clientY);
      setVisible(true);
      aimRing();
      wake();
    };
    const onOver = (event: PointerEvent) => {
      const element = event.target as Element | null;
      const target = element?.closest<HTMLElement>(INTERACTIVE) ?? null;
      const text = target?.dataset.cursor;
      let next: Mode = "default";
      if (text) {
        next = "label";
        setLabel(text);
      } else if (target) {
        next = "stick";
      } else if (element?.closest(LENS)) {
        next = "lens";
      }
      stuckRef.current = next === "stick" ? target : null;
      currentMode = next;
      setMode(next);
      aimRing();
    };
    const onDown = (event: PointerEvent) => {
      setPressed(true);
      if (reduce) return;
      for (let index = 0; index < 14; index += 1) {
        const angle = (index / 14) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 2.2 + Math.random() * 3.2;
        sparks.push({ x: event.clientX, y: event.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
      }
      wake();
    };
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onScroll = () => aimRing();

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, reduce, cx, cy, w, h, radius, headX, headY]);

  if (!enabled) return null;

  const ringStyle: Record<Mode, { backgroundColor: string; borderColor: string; boxShadow: string }> = {
    default: { backgroundColor: "rgba(62,224,164,0)", borderColor: "rgba(62,224,164,0.45)", boxShadow: "0 0 0px rgba(62,224,164,0)" },
    stick: { backgroundColor: "rgba(62,224,164,0.08)", borderColor: "rgba(62,224,164,0.9)", boxShadow: "0 0 24px rgba(62,224,164,0.35)" },
    label: { backgroundColor: "rgba(62,224,164,1)", borderColor: "rgba(62,224,164,1)", boxShadow: "0 8px 30px rgba(62,224,164,0.45)" },
    lens: { backgroundColor: "rgba(236,236,239,1)", borderColor: "rgba(236,236,239,1)", boxShadow: "0 0 0px rgba(0,0,0,0)" },
  };

  return (
    // Siblings rather than one wrapper: a z-indexed wrapper would isolate the lens's blend mode
    // from the page, so each layer is fixed on its own.
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: "var(--z-cursor)" }} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 grid place-items-center border"
        style={{ x: left, y: top, width: w, height: h, borderRadius: radius, zIndex: "var(--z-cursor)", mixBlendMode: mode === "lens" ? "difference" : "normal" }}
        initial={false}
        animate={{ ...ringStyle[mode], opacity: visible ? 1 : 0, scale: pressed ? 0.9 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <AnimatePresence>
          {mode === "label" ? (
            <motion.span
              key={label}
              className="whitespace-nowrap font-mono text-[11px] font-semibold tracking-[0.12em] text-accent-ink"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label.toUpperCase()} ↗
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0" style={{ x: headX, y: headY, zIndex: "var(--z-cursor)" }}>
        <motion.div
          className="size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b4ffdc] shadow-[0_0_12px_4px_rgba(62,224,164,0.75)]"
          initial={false}
          animate={{ scale: mode === "default" ? 1 : mode === "stick" ? 0.6 : 0, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
