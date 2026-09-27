"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { startArticleHeadingDecode } from "@/threeui/article-headings/articleHeadingDecode";

type SectionHeadingProps = { id?: string; title: string; sub?: string; className?: string };

/**
 * Section title that decodes from scrambled glyphs the first time it scrolls into view
 * (ThreeUI Community "Article Headings" decode). Reduced motion shows it immediately.
 */
export function SectionHeading({ id, title, sub, className = "" }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || !ref.current) return undefined;
    return startArticleHeadingDecode(ref.current, { duration: 900, stagger: 120, scrambleLength: 6, preserveChance: 0.12, tailChance: 0.35 });
  }, [inView]);

  return (
    <div ref={ref} className={`max-w-3xl ${className}`}>
      <h2 id={id} data-article-heading className="text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-fg">
        {title}
      </h2>
      {sub ? <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted md:text-lg">{sub}</p> : null}
    </div>
  );
}
