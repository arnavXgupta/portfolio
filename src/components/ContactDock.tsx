"use client";

import { motion, useReducedMotion } from "motion/react";
import { PhoneCallIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useIntro } from "./IntroProvider";
import { profile } from "@/content/site";
import { trackContactClick, type ContactMethod } from "@/lib/analytics";

function DockButton({ href, label, detail, method, primary, children, delay }: { href: string; label: string; detail: string; method: ContactMethod; primary?: boolean; children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  const { ready } = useIntro();
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      onClick={() => trackContactClick(method, "contact_dock")}
      aria-label={`${label}: ${detail}`}
      className="group relative flex items-center justify-end"
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.8 }}
      animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay }}
    >
      {/* Label slides out on hover (fine pointers); touch users get the icon only. */}
      <span className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 whitespace-nowrap rounded-full border border-line-strong bg-[#0e0e11]/90 px-3.5 py-2 text-[13px] text-fg opacity-0 shadow-[0_10px_30px_rgb(0_0_0/0.45)] backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
        <span className="text-muted">{label}</span> <span className="font-mono">{detail}</span>
      </span>
      <span
        className={`grid size-12 place-items-center rounded-full shadow-[0_12px_32px_rgb(0_0_0/0.5)] transition-transform duration-300 group-hover:-translate-y-0.5 group-active:scale-95 md:size-[52px] ${
          primary ? "bg-accent text-accent-ink" : "border border-line-strong bg-[#0e0e11]/85 text-fg backdrop-blur-md"
        }`}
      >
        {children}
      </span>
    </motion.a>
  );
}

/** Always-on contact: WhatsApp with a ready-made message, and a direct call link. */
export function ContactDock() {
  return (
    <nav aria-label="Quick contact" className="fixed bottom-4 right-4 flex flex-col items-end gap-3 md:bottom-6 md:right-6" style={{ zIndex: "var(--z-nav)" }}>
      <DockButton href={profile.whatsapp} label="WhatsApp" detail={profile.phone} method="whatsapp" primary delay={0.9}>
        <WhatsappLogoIcon size={24} weight="fill" />
      </DockButton>
      <DockButton href={profile.phoneHref} label="Call" detail={profile.phone} method="call" delay={1}>
        <PhoneCallIcon size={21} />
      </DockButton>
    </nav>
  );
}
