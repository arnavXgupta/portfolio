import {
  siDocker,
  siExpo,
  siFastapi,
  siFastify,
  siFlask,
  siGooglegemini,
  siLangchain,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOllama,
  siOpencv,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siSocketdotio,
  siSpringboot,
  siSupabase,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

const LOGOS: SimpleIcon[] = [
  siPython, siFastapi, siLangchain, siGooglegemini, siOllama, siNextdotjs, siReact, siTypescript, siPostgresql,
  siMongodb, siRedis, siDocker, siSocketdotio, siSpringboot, siExpo, siTailwindcss, siSupabase, siNodedotjs, siFastify, siFlask, siOpencv,
];

function Logo({ icon, hidden }: { icon: SimpleIcon; hidden?: boolean }) {
  return (
    <li className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      <svg role="img" aria-label={hidden ? undefined : icon.title} viewBox="0 0 24 24" className="size-7 fill-faint transition-colors duration-300 hover:fill-fg md:size-8">
        {hidden ? null : <title>{icon.title}</title>}
        <path d={icon.path} />
      </svg>
    </li>
  );
}

/** The one marquee on the page: tools used in shipped work. Logos only, names live in alt text. */
export function LogoMarquee() {
  return (
    <section aria-label="Tools I ship with" className="marquee mask-fade-x relative overflow-hidden border-y border-line py-9">
      <div className="marquee-track flex w-max">
        <ul className="flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20">
          {LOGOS.map((icon) => (
            <Logo key={icon.slug} icon={icon} />
          ))}
        </ul>
        <ul className="flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20" aria-hidden="true">
          {LOGOS.map((icon) => (
            <Logo key={icon.slug} icon={icon} hidden />
          ))}
        </ul>
      </div>
    </section>
  );
}
