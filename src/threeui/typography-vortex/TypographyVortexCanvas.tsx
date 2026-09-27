"use client";

// Adapted from ThreeUI Community "Typography Vortex Canvas" (MIT, see ../LICENSE).
// Changes: client directive, hint removed (the section renders its own), portfolio class names.
import { useEffect, useLayoutEffect, useRef } from "react";
import { createTypographyVortexRenderer } from "./typographyVortexRenderer";

export type TypographyVortexCanvasProps = {
  phrase: string;
  speed?: number;
  ringGrowth?: number;
  opacity?: number;
  dissolveRadius?: number;
  particleAmount?: number;
  suctionDuration?: number;
  className?: string;
};

const DEFAULTS = { mode: "dark" as const, speed: 1, ringGrowth: 1.21, opacity: 1, dissolveRadius: 1, particleAmount: 1, suctionDuration: 920 };

export function TypographyVortexCanvas({ className = "", ...props }: TypographyVortexCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ ...DEFAULTS, ...props });
  useLayoutEffect(() => {
    optionsRef.current = { ...DEFAULTS, ...props };
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    return createTypographyVortexRenderer(host, canvas, () => optionsRef.current);
  }, []);

  return (
    <div ref={hostRef} data-cursor="Click" className={`typography-vortex ${className}`}>
      <canvas ref={canvasRef} aria-label="Interactive ring of technologies Arnav works with. Move to dissolve the letters, tap to pull them in." role="img" />
    </div>
  );
}
