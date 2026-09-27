"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { CursorClickIcon } from "@phosphor-icons/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyMount } from "@/components/ui/LazyMount";
import { skillGroups, vortexPhrase } from "@/content/site";

const TypographyVortexCanvas = dynamic(() => import("@/threeui/typography-vortex/TypographyVortexCanvas").then((m) => m.TypographyVortexCanvas), { ssr: false });

export function Stack() {
  const reduce = useReducedMotion();
  return (
    <section id="stack" aria-labelledby="stack-title" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading id="stack-title" title="The stack behind it." />
      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
        <div className="relative h-[380px] overflow-hidden rounded-[20px] border border-line bg-[#0d0d10] sm:h-[460px] lg:col-span-7 lg:h-[600px]">
          <LazyMount className="absolute inset-0">
            <TypographyVortexCanvas phrase={vortexPhrase} speed={0.9} />
          </LazyMount>
          <p className="pointer-events-none absolute bottom-4 left-5 inline-flex items-center gap-2 font-mono text-xs text-faint">
            <CursorClickIcon size={14} />
            Move to dissolve, click to pull it in
          </p>
        </div>
        <div className="grid content-start gap-9 lg:col-span-5">
          {skillGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-[15px] font-medium text-fg">{group.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-sm text-muted transition-colors duration-300 hover:border-accent/60 hover:text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
