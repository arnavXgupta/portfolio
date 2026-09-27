"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRightIcon, GlobeIcon } from "@phosphor-icons/react";
import { useState, type PointerEvent } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { archive, profile } from "@/content/site";

const ogImage = (repo: string) => `https://opengraph.githubassets.com/1/arnavXgupta/${repo}`;

/** Index rows with a cursor-following preview of each repo's real GitHub card (fine pointers only). */
export function Archive() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovered, setHovered] = useState<string | null>(null);
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
      <SectionHeading id="archive-title" title="More builds." sub="Computer vision, desktop software and the open-source work around the main projects." />
      <ul className="mt-12 divide-y divide-line border-t border-line md:mt-16" onPointerMove={finePointer ? onMove : undefined} onPointerLeave={() => setHovered(null)}>
        {archive.map((item, index) => (
          <motion.li
            key={item.repo}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            onPointerEnter={() => setHovered(item.repo)}
          >
            <div className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)_3.5rem_5.25rem] md:py-7">
              <a href={`${profile.github}/${item.repo}`} target="_blank" rel="noreferrer" data-cursor="View" className="text-xl font-semibold tracking-[-0.03em] text-fg transition-transform duration-500 after:absolute after:inset-0 group-hover:translate-x-1.5 md:text-2xl">
                {item.name}
              </a>
              <span className="col-start-2 row-start-1 font-mono text-xs text-faint md:col-start-4">{item.year}</span>
              <p className="col-span-2 text-[15px] leading-relaxed text-muted md:col-span-1 md:col-start-2 md:row-start-1">{item.note}</p>
              <p className="col-span-2 font-mono text-xs text-faint md:col-span-1 md:col-start-3 md:row-start-1">{item.stack}</p>
              <span className="relative z-10 hidden items-center justify-end gap-2 md:col-start-5 md:row-start-1 md:flex">
                {item.live ? (
                  <a href={item.live} target="_blank" rel="noreferrer" aria-label={`${item.name} live site`} className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
                    <GlobeIcon size={15} />
                  </a>
                ) : null}
                <span className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent" aria-hidden="true">
                  <ArrowUpRightIcon size={15} />
                </span>
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      {finePointer ? (
        <motion.div className="pointer-events-none fixed left-0 top-0 hidden md:block" style={{ x: sx, y: sy, zIndex: "var(--z-toast)" }} aria-hidden="true">
          <AnimatePresence>
            {hovered ? (
              <motion.div
                key="preview"
                className="w-[320px] overflow-hidden rounded-[20px] border border-line-strong bg-panel shadow-[0_30px_80px_rgb(0_0_0/0.55)]"
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- remote GitHub card, sized by CSS */}
                <img src={ogImage(hovered)} alt="" width={1200} height={600} className="block aspect-[2/1] w-full object-cover" loading="lazy" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </section>
  );
}
