"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { GithubLogoIcon, LinkedinLogoIcon, ListIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIntro } from "./IntroProvider";
import { createTopDockController } from "@/threeui/animated-top-dock/topDockController";
import { profile } from "@/content/site";

// Glyphs from ThreeUI's sable dock (16px grid, 1.2 stroke), mapped onto the site's sections.
const LINKS: { id: string; label: string; icon: ReactNode }[] = [
  { id: "work", label: "WORK", icon: <><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M2 6h12M5 4.5h.01M7 4.5h.01" /></> },
  { id: "experience", label: "EXPERIENCE", icon: <><circle cx="3" cy="8" r="1.5" /><circle cx="12.5" cy="3.5" r="1.5" /><circle cx="12.5" cy="12.5" r="1.5" /><path d="M4.5 7.3 11 4.2M4.5 8.7l6.5 3.1" /></> },
  { id: "stack", label: "STACK", icon: <><rect x="2.25" y="2.25" width="4.5" height="4.5" rx=".8" /><rect x="9.25" y="2.25" width="4.5" height="4.5" rx=".8" /><rect x="2.25" y="9.25" width="4.5" height="4.5" rx=".8" /><rect x="9.25" y="9.25" width="4.5" height="4.5" rx=".8" /></> },
  { id: "contact", label: "CONTACT", icon: <><circle cx="5.2" cy="6.2" r="2.7" /><path d="m7.2 8.2 5.9 5.1M10.2 10.8l1.5-1.5M12 12.4l1.4-1.4" /></> },
];
const RESUME_ICON = <><path d="M4 2.25h5.4L12 4.85v8.9H4z" /><path d="M9.25 2.25V5h2.7M6 8h4M6 10.5h4" /></>;

// The sable variant's spring and growth values.
const DOCK_OPTIONS = { proximity: 122, spring: 0.19, damping: 0.7, widthGrowth: 17, heightGrowth: 16, drop: 3.5 };

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const targets = ["top", ...LINKS.map((link) => link.id)].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id === "top" ? "" : entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  return active;
}

const Glyph = ({ children }: { children: ReactNode }) => (
  <span className="sable-dock__icon" aria-hidden="true">
    <svg viewBox="0 0 16 16">{children}</svg>
  </span>
);

/** ThreeUI Community "Animated Top Dock", sable theme: proximity-spring items that grow toward the pointer. */
function SableDock({ active }: { active: string }) {
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    return createTopDockController(nav, () => DOCK_OPTIONS);
  }, []);
  return (
    <div data-dock-frame className="relative h-[38px]">
      <nav ref={navRef} aria-label="Primary" className="sable-dock" data-dock-state="idle">
        {LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} data-dock-item className="sable-dock__item sable-dock__link" aria-current={active === link.id ? "true" : undefined}>
            <Glyph>{link.icon}</Glyph>
            <span>{link.label}</span>
          </a>
        ))}
        <a href={profile.resume} target="_blank" rel="noreferrer" data-dock-item className="sable-dock__item sable-dock__link sable-dock__link--accent">
          <Glyph>{RESUME_ICON}</Glyph>
          <span>RÉSUMÉ</span>
        </a>
      </nav>
    </div>
  );
}

export function Nav() {
  const { ready } = useIntro();
  const reduce = useReducedMotion();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Hide on scroll down, reveal on scroll up. State only flips on direction change.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const next = latest > previous && latest > 240;
    if (next !== hidden) setHidden(next);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shown = ready && (!hidden || open);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 h-px origin-left bg-accent" style={{ scaleX: progress, zIndex: "var(--z-nav)" }} aria-hidden="true" />
      <motion.header
        className="fixed inset-x-0 top-4 flex justify-center px-4 md:top-6"
        style={{ zIndex: "var(--z-nav)" }}
        initial={false}
        animate={shown ? { y: 0, opacity: 1 } : { y: reduce ? 0 : -90, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
      >
        <div className="hidden md:block">
          <SableDock active={active} />
        </div>

        {/* Mobile: the same sable materials, collapsed to brand + menu. */}
        <div className="sable-bar flex w-full items-center justify-between md:hidden">
          <a href="#top" className="pl-2 font-mono text-[11px] tracking-[0.1em] text-[#ecece8]" aria-label="Arnav Gupta, back to top">
            ARNAV GUPTA
          </a>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-9 place-items-center rounded-[7px] border border-[#292929] bg-[#151514] text-[#ecece8]" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <XIcon size={16} /> : <ListIcon size={16} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 flex flex-col bg-bg/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            style={{ zIndex: "calc(var(--z-nav) - 1)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.ul className="flex flex-col gap-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}>
              {LINKS.map((link) => (
                <motion.li key={link.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.2, duration: 0.6 } } }}>
                  <a href={`#${link.id}`} onClick={() => setOpen(false)} className="flex items-center gap-4 py-2 text-5xl font-semibold tracking-[-0.04em] text-fg">
                    {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-auto flex flex-wrap gap-3">
              <a href={profile.resume} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-medium text-accent-ink">
                Résumé <ArrowUpRightIcon size={15} weight="bold" />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-12 place-items-center rounded-full border border-line-strong text-fg">
                <GithubLogoIcon size={20} />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid size-12 place-items-center rounded-full border border-line-strong text-fg">
                <LinkedinLogoIcon size={20} />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
