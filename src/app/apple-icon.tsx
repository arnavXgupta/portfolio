import { ImageResponse } from "next/og";

// iOS ignores SVG icons for the home screen, so this renders the mark as a 180px PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", color: "#ececef", fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 150, height: 150, borderRadius: 999, border: "5px solid #3ee0a4" }}>AG</div>
      </div>
    ),
    size,
  );
}
