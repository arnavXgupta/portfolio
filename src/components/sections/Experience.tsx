"use client";

import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CheckIcon, GraduationCapIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PipelineDiagram } from "@/components/visuals/PipelineDiagram";
import { education, experience, type Experience as Entry } from "@/content/site";

function Role({ entry, index, onActive }: { entry: Entry; index: number; onActive: (index: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const passed = useInView(ref, { margin: "0px 0px -55% 0px" });
  const inView = useInView(ref, { amount: 0.4 });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <motion.article
      ref={ref}
      className="relative pb-20 pl-10 last:pb-0 md:pl-14"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className={`absolute left-0 top-1.5 grid size-[15px] -translate-x-1/2 place-items-center rounded-full border transition-colors duration-500 ${passed ? "border-accent bg-accent" : "border-line-strong bg-bg"}`}
        aria-hidden="true"
      >
        <span className={`size-[5px] rounded-full ${passed ? "bg-accent-ink" : "bg-transparent"}`} />
      </span>
      <p className="font-mono text-[13px] text-faint">
        {entry.period} <span className="px-1.5 text-line-strong">/</span> {entry.kind}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-fg md:text-[2rem] md:leading-tight">
        {entry.role} <span className="text-muted">at {entry.company}</span>
      </h3>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-muted md:text-lg">{entry.summary}</p>
      {entry.pipeline ? (
        <div className="mt-8">
          <PipelineDiagram />
        </div>
      ) : null}
      <ul className="mt-7 grid gap-3">
        {entry.points.map((point) => (
          <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-fg/90 md:text-base">
            <CheckIcon size={18} weight="bold" className="mt-0.5 shrink-0 text-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
        {entry.stack.map((item) => (
          <li key={item} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/** Sticky index on the left, scroll-linked rail on the right: shows where you are in the story. */
export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 55%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="experience-title" title="Where I've shipped." sub="Production LLM systems and backends today. Frontend platforms and UI/UX design before that." />
            <ol className="mt-10 hidden gap-1 lg:grid" aria-label="Roles">
              {experience.map((entry, index) => (
                <li key={entry.company} className={`flex items-center gap-3 py-1.5 text-sm transition-colors duration-500 ${index === active ? "text-fg" : "text-faint"}`}>
                  <motion.span className="h-px bg-current" animate={{ width: index === active ? 28 : 12 }} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                  {entry.company}
                </li>
              ))}
            </ol>
            <div className="mt-10 flex items-start gap-4 rounded-[20px] border border-line bg-panel p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-accent">
                <GraduationCapIcon size={20} />
              </span>
              <div>
                <p className="text-[15px] font-medium text-fg">{education.degree}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {education.school}, {education.period}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={listRef} className="relative lg:col-span-8">
          <div className="absolute bottom-0 left-0 top-2 w-px bg-line" aria-hidden="true" />
          <motion.div className="absolute left-0 top-2 w-px origin-top bg-accent" style={{ scaleY: rail, bottom: 0 }} aria-hidden="true" />
          {experience.map((entry, index) => (
            <Role key={entry.company} entry={entry} index={index} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
