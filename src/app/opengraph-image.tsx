import { ImageResponse } from "next/og";

export const alt = "Arnav Gupta, AI and full-stack engineer. Full-stack engineer with an AI edge.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#09090b", color: "#ececef", padding: 80, position: "relative" }}>
        <div style={{ position: "absolute", right: -120, top: 60, width: 560, height: 560, borderRadius: 999, background: "radial-gradient(circle, rgba(62,224,164,0.55), rgba(62,224,164,0.08) 55%, transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, color: "#a1a1aa" }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "#ececef", color: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>AG</div>
          Arnav Gupta, AI and Full-Stack Engineer
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.04 }}>
          <span>Full-stack engineer</span>
          <span style={{ display: "flex", gap: 20 }}>
            with an <span style={{ color: "#3ee0a4" }}>AI edge.</span>
          </span>
        </div>
      </div>
    ),
    size,
  );
}
