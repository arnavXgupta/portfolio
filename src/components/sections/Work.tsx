"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon, CornersOutIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectVisual } from "@/components/visuals/ProjectVisuals";
import { projects, type Project } from "@/content/site";
import { trackProjectOpen } from "@/lib/analytics";

const SPANS: Record<string, { cell: string; visual: string }> = {
  "urban-realities": { cell: "md:col-span-2 lg:col-span-4 lg:row-span-2", visual: "min-h-[300px] md:min-h-[340px] lg:min-h-[420px]" },
  docuprism: { cell: "lg:col-span-2", visual: "min-h-[220px]" },
  "arula-connect": { cell: "lg:col-span-2", visual: "min-h-[220px]" },
  "social-automation": { cell: "lg:col-span-3", visual: "min-h-[220px]" },
  cognivia: { cell: "lg:col-span-3", visual: "min-h-[220px]" },
};

// Each tile gets its own atmosphere so the grid never reads as identical cards.
const TINTS: Record<string, string> = {
  "urban-realities": "bg-[radial-gradient(90%_70%_at_70%_20%,rgb(62_224_164/0.10),transparent_60%)]",
  docuprism: "bg-[linear-gradient(160deg,rgb(255_255_255/0.035),transparent_55%)]",
  "arula-connect": "bg-[radial-gradient(70%_60%_at_50%_45%,rgb(62_224_164/0.08),transparent_70%)]",
  "social-automation": "bg-[linear-gradient(90deg,transparent,rgb(62_224_164/0.06))]",
  cognivia: "bg-[radial-gradient(60%_80%_at_20%_50%,rgb(62_224_164/0.07),transparent_70%)]",
};

const onSpotlight = (event: PointerEvent<HTMLElement>) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
};

function Tile({ project, onOpen, index, returning }: { project: Project; onOpen: () => void; index: number; returning: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      layoutId={`project-${project.slug}`}
      data-slug={project.slug}
      data-cursor="Open"
      role="button"
      tabIndex={0}
      aria-label={`${project.name}: open details`}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      onPointerMove={onSpotlight}
      style={{ borderRadius: 20 }}
      initial={reduce || returning ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={returning ? { type: "spring", bounce: 0.12, duration: 0.6 } : { duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="spotlight group relative flex h-full cursor-pointer flex-col overflow-hidden border border-line bg-panel outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className={`relative flex-1 ${SPANS[project.slug].visual} ${TINTS[project.slug]}`}>
        <ProjectVisual kind={project.visual} />
      </div>
      <div className="relative flex items-end justify-between gap-4 border-t border-line p-6 md:p-7">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-fg md:text-2xl">{project.name}</h3>
          <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-muted">{project.tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {project.stack.slice(0, 4).map((item) => (
              <li key={item} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-faint">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-all duration-500 group-hover:rotate-90 group-hover:border-accent group-hover:text-accent" aria-hidden="true">
          <CornersOutIcon size={16} />
        </span>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-end justify-center p-3 md:items-center md:p-8" style={{ zIndex: "var(--z-modal)" }}>
      <motion.button type="button" aria-label="Close project details" onClick={onClose} className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        layoutId={`project-${project.slug}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dialog-${project.slug}`}
        style={{ borderRadius: 20 }}
        className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden border border-line-strong bg-panel"
        transition={{ type: "spring", bounce: 0.12, duration: 0.6 }}
      >
        <div className={`relative h-[220px] shrink-0 md:h-[280px] ${TINTS[project.slug]}`}>
          <ProjectVisual kind={project.visual} />
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line-strong bg-bg/70 text-fg backdrop-blur transition-colors hover:border-white/30">
            <XIcon size={16} />
          </button>
        </div>
        <motion.div className="overflow-y-auto border-t border-line p-6 md:p-9" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
          <p className="font-mono text-[13px] text-faint">{project.year}</p>
          <h3 id={`dialog-${project.slug}`} className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-fg md:text-4xl">
            {project.name}
          </h3>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted md:text-lg">{project.problem}</p>
          <h4 className="mt-8 text-sm font-medium text-fg">What I built</h4>
          <ul className="mt-3 grid gap-3">
            {project.built.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-fg/90">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Stack">
            {project.stack.map((item) => (
              <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
                {item}
              </li>
            ))}
          </ul>
          {project.links.length === 0 && project.status ? <p className="mt-8 text-sm text-faint">{project.status}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-colors hover:bg-[#5cf0b8]">
                {link.label}
                <ArrowUpRightIcon size={14} weight="bold" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Work() {
  const [selected, setSelected] = useState<string | null>(null);
  const lastOpened = useRef<string | null>(null);
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const project = projects.find((item) => item.slug === selected) ?? null;

  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading id="work-title" title="Selected work." sub="Five things I built and shipped. Open any of them for the details." />
      <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-6">
        {projects.map((item, index) => (
          <div key={item.slug} className={`min-h-[360px] ${SPANS[item.slug].cell}`}>
            {selected === item.slug ? null : (
              <Tile
                project={item}
                index={index}
                returning={opened.has(item.slug)}
                onOpen={() => {
                  lastOpened.current = item.slug;
                  setOpened((previous) => new Set(previous).add(item.slug));
                  setSelected(item.slug);
                  trackProjectOpen(item.slug, item.name);
                }}
              />
            )}
          </div>
        ))}
      </div>
      <AnimatePresence
        onExitComplete={() => {
          const slug = lastOpened.current;
          if (slug) document.querySelector<HTMLElement>(`[data-slug="${slug}"]`)?.focus({ preventScroll: true });
        }}
      >
        {project ? <ProjectModal key={project.slug} project={project} onClose={close} /> : null}
      </AnimatePresence>
    </section>
  );
}
