"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "./IntroProvider";
import { useBooted } from "@/hooks/useBooted";
import { CRT_TOTAL_CHARS } from "@/threeui/crt/crtRenderer";

const CrtBackground = dynamic(() => import("@/threeui/crt/CrtBackground").then((m) => m.CrtBackground), { ssr: false });

const TYPE_SPEED = 1.35;
// The renderer types 4.4 chars per frame at typeSpeed 1. Assume 60fps, hold briefly on "answer:".
const typingMs = () => Math.min(3200, (CRT_TOTAL_CHARS() / (4.4 * TYPE_SPEED * 60)) * 1000);
const HOLD_MS = 650;

/**
 * First-visit boot sequence: a ThreeUI CRT terminal types the voice pipeline coming online,
 * then the tube collapses to a line and switches off, handing over to the hero.
 */
export function Loader() {
  const { ready, finish } = useIntro();
  const [phase, setPhase] = useState<"typing" | "off" | "gone">("typing");
  const skipped = useBooted();
  const done = useRef(false);

  useEffect(() => {
    if (skipped) return undefined;
    const timer = window.setTimeout(() => setPhase("off"), typingMs() + HOLD_MS);
    const skip = () => setPhase((current) => (current === "typing" ? "off" : current));
    window.addEventListener("keydown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
    };
  }, [skipped]);

  useEffect(() => {
    const root = document.documentElement;
    if (phase === "typing" && !skipped) root.style.overflow = "hidden";
    else root.style.overflow = "";
    return () => {
      root.style.overflow = "";
    };
  }, [phase, skipped]);

  const handOver = () => {
    if (done.current) return;
    done.current = true;
    finish();
    setPhase("gone");
  };

  if (skipped || (ready && phase === "gone")) return null;

  return (
    <motion.div
      className="boot-overlay fixed inset-0 flex items-center justify-center bg-[#020403]"
      style={{ zIndex: "var(--z-loader)" }}
      animate={phase === "typing" ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: phase === "typing" ? 0 : 0.5, duration: 0.4 }}
      role="status"
      aria-label="Loading portfolio"
    >
      <AnimatePresence onExitComplete={handOver}>
        {phase === "typing" ? (
          <motion.div
            key="crt"
            className="absolute inset-0 origin-center"
            exit={{
              scaleY: [1, 0.006, 0.006],
              scaleX: [1, 1, 0],
              filter: ["brightness(1)", "brightness(2.6)", "brightness(4)"],
              transition: { duration: 0.62, times: [0, 0.55, 1], ease: [0.7, 0, 0.84, 0] },
            }}
          >
            <CrtBackground variant="terminal" typeSpeed={TYPE_SPEED} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {phase === "typing" ? (
        <button
          type="button"
          onClick={() => setPhase("off")}
          className="absolute bottom-6 right-6 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs text-[#8df0b4] backdrop-blur transition-colors hover:border-white/30"
        >
          Skip intro
        </button>
      ) : null}
    </motion.div>
  );
}
