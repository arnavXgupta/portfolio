"use client";

// Adapted from ThreeUI Community "Liquid Metal Button" (MIT, see ../LICENSE).
// Changes: rendered natively instead of in a sandboxed iframe, so it can be a real link or
// button with focus, keyboard and click behaviour; the bloom stage never takes pointer
// events, so it cannot block neighbouring controls. Geometry follows the original's
// 1407 x 516 reference units, scaled from one button height.
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Common = { children: ReactNode; icon?: ReactNode; height?: number; className?: string; ariaLabel?: string };
type LinkProps = Common & { href: string; target?: string; rel?: string; onClick?: never };
type ButtonProps = Common & { onClick: () => void; href?: never; target?: never; rel?: never };

const ArrowIcon = (
  <svg viewBox="0 0 115 115" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 57.5h86M64 22l36 35.5L64 93" />
    </g>
  </svg>
);

export function LiquidMetalButton(props: LinkProps | ButtonProps) {
  const { children, icon = ArrowIcon, height = 52, className = "", ariaLabel } = props;
  const hostRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);
  const plateRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  // Label length drives the pill width, exactly as the original component does.
  const label = typeof children === "string" ? children : "";
  const units = Math.min(3000, Math.max(1407, 820 + label.length * 94));
  const style = { "--h": `${height}px`, "--bw": `calc(${units} * var(--h) / 516)` } as CSSProperties;

  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    const plate = plateRef.current;
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!host || !stage || !plate || !canvas || !button) return undefined;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("./liquidMetal.js")
      .then(({ createLiquidMetal }) => {
        if (cancelled) return;
        try {
          dispose = createLiquidMetal({ host, stage, plate, canvas, button });
        } catch (error) {
          console.warn("Liquid metal button failed to start", error);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  const content = (
    <>
      <span className="lm-lbl">{children}</span>
      <span className="lm-ico">{icon}</span>
    </>
  );

  return (
    <span ref={hostRef} className={`lm-host ${className}`} style={style}>
      <span ref={stageRef} className="lm-stage" aria-hidden="true">
        <span ref={plateRef} className="lm-plate" />
        <canvas ref={canvasRef} className="lm-fx" />
      </span>
      {"href" in props && props.href ? (
        <a ref={buttonRef} className="lm-btn" href={props.href} target={props.target} rel={props.rel} aria-label={ariaLabel}>
          {content}
        </a>
      ) : (
        <button ref={buttonRef} type="button" className="lm-btn" onClick={(props as ButtonProps).onClick} aria-label={ariaLabel}>
          {content}
        </button>
      )}
    </span>
  );
}
