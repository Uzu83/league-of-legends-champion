import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Minimal SVG-rendered favicon: a gold rune-ish glyph on the LoL navy background.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#0a0e1a",
        color: "#c89b3c",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
        fontWeight: 700,
        fontFamily: "serif",
        border: "2px solid #c89b3c",
        borderRadius: 8,
      }}
    >
      LL
    </div>,
    size,
  );
}
