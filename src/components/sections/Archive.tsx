"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRightIcon, GlobeIcon } from "@phosphor-icons/react";
import { useState, type PointerEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { archive, frontendBuilds } from "@/content/site";

const ogImage = (repo: string) => `https://opengraph.githubassets.com/1/arnavXgupta/${repo}`;

/** Index rows with a cursor-following preview of each repo's real GitHub card (fine pointers only). */
export function Archive() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovered, setHovered] = useState<string | null>(null);
  const preview = archive.find((item) => item.name === hovered)?.repo;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  const onMove = (event: PointerEvent) => {
    x.set(event.clientX + 24);
    y.set(event.clientY - 90);
  };

  return (
    <section aria-labelledby="archive-title" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-28">
      <SectionHeading id="archive-title" title="More builds." sub="Agents, content automation, web and desktop builds alongside the main projects." />
      <ul className="mt-12 divide-y divide-line border-t border-line md:mt-16" onPointerMove={finePointer ? onMove : undefined} onPointerLeave={() => setHovered(null)}>
        {archive.map((item, index) => (
          <motion.li
            key={item.name}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            onPointerEnter={() => setHovered(item.name)}
          >
            {/* The whole row is one link; the optional live-site link sits beside it, not inside it. */}
            <div className="relative">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="View"
                className={`group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 outline-none focus-visible:bg-white/[0.03] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)_3.5rem_2.25rem] md:py-7 ${item.live ? "md:pr-12" : ""}`}
              >
                <span className="text-xl font-semibold tracking-[-0.03em] text-fg transition-transform duration-500 group-hover:translate-x-1.5 md:text-2xl">{item.name}</span>
                <span className="col-start-2 row-start-1 font-mono text-xs text-faint md:col-start-4">{item.year}</span>
                <span className="col-span-2 text-[15px] leading-relaxed text-muted md:col-span-1 md:col-start-2 md:row-start-1">{item.note}</span>
                <span className="col-span-2 font-mono text-xs text-faint md:col-span-1 md:col-start-3 md:row-start-1">{item.stack}</span>
                <span className="hidden size-9 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent md:col-start-5 md:row-start-1 md:grid" aria-hidden="true">
                  <ArrowUpRightIcon size={15} />
                </span>
              </a>
              {item.live ? (
                <a
                  href={item.live}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.liveLabel ?? `${item.name} live site`}
                  className="absolute right-12 top-1/2 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent md:grid"
                >
                  <GlobeIcon size={15} />
                </a>
              ) : null}
            </div>
          </motion.li>
        ))}
        {/* Frontend-only sites, grouped on a single line. */}
        <motion.li
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: archive.length * 0.05, ease: [0.16, 1, 0.3, 1] }}
          onPointerEnter={() => setHovered(null)}
          className="grid gap-4 py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,4fr)] md:items-center md:gap-x-6 md:py-7"
        >
          <span className="text-xl font-semibold tracking-[-0.03em] text-fg md:text-2xl">Frontend builds</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {frontendBuilds.map((site) => (
              <a
                key={site.href}
                href={site.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="Visit"
                className="group flex items-center justify-between gap-3 rounded-[16px] border border-line bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-accent/60 hover:bg-accent-soft"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-medium text-fg">{site.name}</span>
                  <span className="block truncate text-[13px] text-muted">{site.note}</span>
                  <span className="mt-1 block truncate font-mono text-[11px] text-faint">{site.domain}</span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent" aria-hidden="true">
                  <ArrowUpRightIcon size={14} />
                </span>
              </a>
            ))}
          </div>
        </motion.li>
      </ul>

      {finePointer ? (
        <motion.div className="pointer-events-none fixed left-0 top-0 hidden md:block" style={{ x: sx, y: sy, zIndex: "var(--z-toast)" }} aria-hidden="true">
          <AnimatePresence>
            {preview ? (
              <motion.div
                key="preview"
                className="w-[320px] overflow-hidden rounded-[20px] border border-line-strong bg-panel shadow-[0_30px_80px_rgb(0_0_0/0.55)]"
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote GitHub card, sized by CSS */}
                <img src={ogImage(preview)} alt="" width={1200} height={600} className="block aspect-[2/1] w-full object-cover" loading="lazy" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </section>
  );
}
