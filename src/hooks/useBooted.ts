"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => undefined;

/**
 * True when the inline boot script in layout.tsx marked this visit as "already booted"
 * (returning visitor this session, or reduced motion). Read without an effect so there
 * is no setState cascade on mount. False on the server and during hydration.
 */
export function useBooted() {
  return useSyncExternalStore(noopSubscribe, () => Boolean(document.documentElement.dataset.booted), () => false);
}
