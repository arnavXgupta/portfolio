"use client";

import { Component, useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

/** Keeps a failing WebGL/canvas visual from taking the page down with it. */
class CanvasBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Visual failed to start", error);
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}

/**
 * Mounts heavy visuals only once they come near the viewport, and isolates failures.
 * The children stay mounted afterwards; each vendored renderer pauses itself off-screen.
 */
export function LazyMount({ children, className = "", margin = "300px", fallback }: { children: ReactNode; className?: string; margin?: string; fallback?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });
  return (
    <div ref={ref} className={className}>
      {inView ? <CanvasBoundary fallback={fallback}>{children}</CanvasBoundary> : fallback}
    </div>
  );
}
