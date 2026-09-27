"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useBooted } from "@/hooks/useBooted";

type IntroState = { ready: boolean; finish: () => void };

const IntroContext = createContext<IntroState>({ ready: true, finish: () => undefined });

/** Coordinates the boot loader with the hero entrance: nothing animates in until `ready`. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const booted = useBooted();
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("ag-booted", "1");
    } catch {
      /* storage can be unavailable in private modes */
    }
    setFinished(true);
  }, []);

  return <IntroContext.Provider value={{ ready: booted || finished, finish }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
