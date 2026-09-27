import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { Archive } from "@/components/sections/Archive";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        Skip to work
      </a>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <LogoMarquee />
        <Experience />
        <Work />
        <Archive />
        <Stack />
        <Contact />
      </main>
    </>
  );
}
