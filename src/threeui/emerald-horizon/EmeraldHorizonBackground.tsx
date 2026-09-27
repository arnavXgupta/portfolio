"use client";

// Adapted from ThreeUI Community "Emerald Horizon Background" (MIT, see ../LICENSE).
// Changes: ported from three.js (ShaderMaterial on a plane) to a raw WebGL full-screen
// triangle so the portfolio ships without Three.js; same fragment shader and uniforms.
import { useEffect, useLayoutEffect, useRef } from "react";
import { LUMINA_FRAGMENT_SHADER } from "./emeraldHorizonShaders";

export type EmeraldHorizonBackgroundProps = {
  speed?: number;
  waveScale?: number;
  variation?: number;
  glow?: number;
  vignette?: number;
  className?: string;
};

const VERTEX = "attribute vec2 position;varying vec2 vUv;void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}";

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

export function EmeraldHorizonBackground({ speed = 1, waveScale = 1, variation = 1, glow = 1, vignette = 1, className = "" }: EmeraldHorizonBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ speed, waveScale, variation, glow, vignette });
  useLayoutEffect(() => {
    optionsRef.current = { speed, waveScale, variation, glow, vignette };
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return undefined;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, `precision highp float;\n${LUMINA_FRAGMENT_SHADER}`);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return undefined;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = { time: u("u_time"), resolution: u("u_resolution"), waveScale: u("u_wave_scale"), variation: u("u_variation"), glow: u("u_glow"), vignette: u("u_vignette") };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    let visible = true;

    const draw = (now: number) => {
      const options = optionsRef.current;
      gl.uniform1f(uniforms.time, (now - start) * 0.001 * options.speed);
      gl.uniform1f(uniforms.waveScale, options.waveScale);
      gl.uniform1f(uniforms.variation, options.variation);
      gl.uniform1f(uniforms.glow, options.glow);
      gl.uniform1f(uniforms.vignette, options.vignette);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      if (reduced) draw(start + 6000);
    };
    const render = (now: number) => {
      draw(now);
      frame = visible && !document.hidden ? requestAnimationFrame(render) : 0;
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (reduced) return;
      if (visible && !frame) frame = requestAnimationFrame(render);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    if (!reduced) frame = requestAnimationFrame(render);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className={`threeui-canvas-host ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
