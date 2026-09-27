"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpIcon, CheckIcon, CopyIcon, FilePdfIcon, GithubLogoIcon, LinkedinLogoIcon, PhoneCallIcon, WhatsappLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { LazyMount } from "@/components/ui/LazyMount";
import { LiquidMetalButton } from "@/threeui/liquid-metal-button/LiquidMetalButton";
import { Reveal } from "@/components/ui/Reveal";
import { ParticleWordmark } from "@/components/visuals/ParticleWordmark";
import { profile } from "@/content/site";

const EmeraldHorizonBackground = dynamic(() => import("@/threeui/emerald-horizon/EmeraldHorizonBackground").then((m) => m.EmeraldHorizonBackground), { ssr: false });

const SOCIALS = [
  { label: "GitHub", href: profile.github, Icon: GithubLogoIcon },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinLogoIcon },
  { label: "X", href: profile.x, Icon: XLogoIcon },
  { label: "WhatsApp", href: profile.whatsapp, Icon: WhatsappLogoIcon },
  { label: "Résumé (PDF)", href: profile.resume, Icon: FilePdfIcon },
];

function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex h-12 items-center gap-3 rounded-full border border-line-strong bg-bg/40 pl-5 pr-2 font-mono text-sm text-fg backdrop-blur transition-colors hover:border-white/30"
      aria-label={`Copy email address ${profile.email}`}
    >
      {profile.email}
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-white/[0.08]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={state} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}>
            {state === "copied" ? <CheckIcon size={15} weight="bold" className="text-accent" /> : <CopyIcon size={15} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email copied" : state === "failed" ? "Copy failed, the address is shown on the button" : ""}
      </span>
    </button>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden">
      <LazyMount className="absolute inset-0 -z-20">
        <EmeraldHorizonBackground speed={0.7} glow={0.62} variation={0.9} />
      </LazyMount>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-bg to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <p className="font-mono text-[13px] text-accent">Contact</p>
          <h2 id="contact-title" className="mt-5 max-w-[20ch] text-[clamp(2.4rem,5.2vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-fg">
            Have something to build? I&apos;d like to hear about it.
          </h2>
          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-muted md:text-lg">
            Open to AI/LLM, full-stack and backend engineering roles, and to conversations about what you are building.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-4">
          <LiquidMetalButton href={`mailto:${profile.email}`}>Get in touch</LiquidMetalButton>
          <CopyEmail />
          <div className="flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="grid size-12 place-items-center rounded-full border border-line-strong bg-bg/40 text-fg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <a href={profile.phoneHref} className="inline-flex items-center gap-2 font-mono text-fg transition-colors hover:text-accent">
            <PhoneCallIcon size={16} className="text-accent" />
            {profile.phone}
          </a>
          <span className="text-faint">{profile.location}</span>
        </div>

        <div className="mt-24 md:mt-32">
          <ParticleWordmark text="ARNAV GUPTA" />
        </div>

        <footer className="glass mt-8 flex flex-col gap-4 rounded-[20px] border border-white/10 bg-bg/75 px-5 py-4 text-sm text-fg/80 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-6">
          <p>© 2026 {profile.name}</p>
          <a href="#top" className="inline-flex items-center gap-2 text-fg/80 transition-colors hover:text-fg">
            Back to top <ArrowUpIcon size={14} />
          </a>
        </footer>
      </div>
    </section>
  );
}
