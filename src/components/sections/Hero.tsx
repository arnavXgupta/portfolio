"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { TerminalWindowIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useIntro } from "@/components/IntroProvider";
import { MagneticLink } from "@/components/ui/Magnetic";
import { LiquidMetalButton } from "@/threeui/liquid-metal-button/LiquidMetalButton";
import { OrbitStack } from "@/components/visuals/OrbitStack";
import { startArticleHeadingDecode } from "@/threeui/article-headings/articleHeadingDecode";
import { hero, profile } from "@/content/site";


const EASE = [0.16, 1, 0.3, 1] as const;
const CHAR_STAGGER = 0.028;

/** Headline line split into characters that flip up into place; words never break mid-word. */
function KineticLine({ text, start, offset, animateIn, reduce, accent, inline }: { text: string; start: number; offset: number; animateIn: boolean; reduce: boolean; accent?: boolean; inline?: boolean }) {
  let charIndex = offset;
  return (
    <span className={`${inline ? "inline" : "block"} ${accent ? "text-accent" : ""}`}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {word.split("").map((char, index) => {
            const delay = start + charIndex++ * CHAR_STAGGER;
            return (
              <span key={index} className="inline-block overflow-hidden pb-[0.1em] align-bottom [perspective:600px]">
                <motion.span
                  className="inline-block origin-bottom"
                  initial={reduce ? false : { y: "105%", rotateX: -85, opacity: 0 }}
                  animate={animateIn ? { y: "0%", rotateX: 0, opacity: 1 } : undefined}
                  transition={{ duration: 0.9, delay, ease: EASE }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
          {wordIndex < text.split(" ").length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}

/** "I ship ___ end to end" with the blank cycling through what Arnav builds. */
function RotatingWord({ animateIn, reduce }: { animateIn: boolean; reduce: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!animateIn || reduce) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % hero.rotating.length), 2400);
    return () => window.clearInterval(timer);
  }, [animateIn, reduce]);
  return (
    <motion.span layout transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} className="relative inline-flex overflow-hidden whitespace-nowrap rounded-full border border-accent/30 bg-accent-soft px-2.5 align-middle text-fg">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={hero.rotating[index]}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="inline-block"
        >
          {hero.rotating[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

export function Hero() {
  const { ready } = useIntro();
  const reduce = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const animateIn = ready || reduce;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const orbitY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);
  // The ghost name drifts slower than the page, so it lingers as the hero scrolls away.
  const ghostY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "38%"]);

  // Soft glow that trails the pointer across the hero.
  const glowX = useSpring(useMotionValue(-600), { stiffness: 60, damping: 20 });
  const glowY = useSpring(useMotionValue(-600), { stiffness: 60, damping: 20 });
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    glowX.set(event.clientX - bounds.left - 300);
    glowY.set(event.clientY - bounds.top - 300);
  };

  const [first, second] = hero.headline;
  const firstLength = first.replace(/ /g, "").length;
  const revealEnd = 0.15 + (firstLength + second.replace(/ /g, "").length) * CHAR_STAGGER + 0.5;

  // Once the headline lands, the accent phrase decodes once (ThreeUI article-heading decode).
  useEffect(() => {
    if (!animateIn || reduce || !accentRef.current) return undefined;
    const element = accentRef.current;
    let stop: (() => void) | undefined;
    const timer = window.setTimeout(() => {
      stop = startArticleHeadingDecode(element, { duration: 700, stagger: 0, scrambleLength: 4, preserveChance: 0.1, tailChance: 0.3 });
    }, revealEnd * 1000);
    return () => {
      window.clearTimeout(timer);
      stop?.();
    };
  }, [animateIn, reduce, revealEnd]);

  return (
    <section id="top" ref={sectionRef} onPointerMove={onPointerMove} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Quiet backdrop, after ThreeUI's Sylva hero: pools of light and faint column guides
          instead of an animated shader, so the orbiting core and the headline carry the motion. */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_55%_at_76%_46%,rgb(62_224_164/0.13),transparent_70%),radial-gradient(64%_52%_at_24%_86%,rgb(236_236_239/0.06),transparent_72%)]" aria-hidden="true" />
      <motion.div className="pointer-events-none absolute left-0 top-0 -z-10 hidden size-[600px] rounded-full bg-[radial-gradient(circle,rgb(62_224_164/0.08),transparent_65%)] md:block" style={{ x: glowX, y: glowY }} aria-hidden="true" />
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 hidden md:block"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={animateIn ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, delay: 0.9 }}
      >
        {["25.3%", "46.75%", "68.2%"].map((left) => (
          <i key={left} className="absolute inset-y-0 w-px bg-[linear-gradient(180deg,transparent,rgb(255_255_255/0.055)_12%,rgb(255_255_255/0.055)_78%,transparent)]" style={{ left }} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />

      {/* Sylva-style ghost wordmark: one word, set at Sylva's scale and cropped by the bottom edge. */}
      <motion.p
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-4vw] left-[0.4vw] select-none whitespace-nowrap text-[19.4vw] font-normal leading-[0.78] tracking-[0.097em] text-white/[0.055]"
        style={{ y: ghostY }}
        initial={reduce ? false : { opacity: 0, filter: "blur(10px)" }}
        animate={animateIn ? { opacity: 1, filter: "blur(0px)" } : undefined}
        transition={{ duration: 1.6, delay: 1.1, ease: EASE }}
      >
        ARNAV
      </motion.p>

      <motion.div style={{ opacity: fade }} className="mx-auto grid min-h-[100dvh] max-w-[1400px] grid-cols-1 content-center items-center gap-2 px-5 pb-12 pt-20 md:grid-cols-12 md:gap-10 md:px-10 md:pb-16 md:pt-24">
        <motion.div style={{ y: copyY }} className="order-2 md:order-1 md:col-span-7">
          <motion.p
            className="inline-flex items-center gap-2 font-mono text-[13px] text-muted"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={animateIn ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <TerminalWindowIcon size={16} weight="bold" className="text-accent" />
            <span className="max-sm:hidden">{profile.name}, </span>
            {profile.role}
          </motion.p>

          <h1 id="hero-title" className="mt-5 text-[clamp(2.35rem,5vw,4.7rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-fg">
            <span className="sr-only">{`${hero.headline[0]} ${hero.headline[1]}`}</span>
            <span aria-hidden="true">
            <KineticLine text={first} start={0.15} offset={0} animateIn={animateIn} reduce={reduce} />
            <span className="block">
              <KineticLine inline text={second.replace(` ${hero.accent}`, "")} start={0.15} offset={firstLength} animateIn={animateIn} reduce={reduce} />{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span ref={accentRef} data-article-heading>
                  <KineticLine inline text={hero.accent} start={0.15} offset={firstLength + 6} animateIn={animateIn} reduce={reduce} accent />
                </span>
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-[0.06em] left-0 h-[0.16em] w-[96%] overflow-visible" aria-hidden="true">
                <motion.path
                  d="M2 14 C 60 4, 140 4, 298 10"
                  fill="none"
                  stroke="#3ee0a4"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={animateIn ? { pathLength: 1, opacity: 0.9 } : undefined}
                  transition={{ duration: 0.9, delay: revealEnd - 0.1, ease: EASE }}
                />
              </svg>
              </span>
            </span>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-[48ch] text-base leading-[1.9] text-muted md:text-lg md:leading-[1.9]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={animateIn ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          >
            I ship <RotatingWord animateIn={animateIn} reduce={reduce} /> {hero.subAfter}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={animateIn ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            <LiquidMetalButton href="#work">See the work</LiquidMetalButton>
            <MagneticLink href="#contact" variant="ghost" className="h-[52px]">
              Get in touch
            </MagneticLink>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: orbitY }}
          className="order-1 md:order-2 md:col-span-5"
          initial={reduce ? false : { opacity: 0, scale: 0.8, filter: "blur(14px)" }}
          animate={animateIn ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1.5, delay: 0.2, ease: EASE }}
        >
          <OrbitStack active={animateIn} />
        </motion.div>
      </motion.div>
    </section>
  );
}
