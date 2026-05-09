import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        fontSize: 96,
        fontWeight: 700,
        fontFamily: "serif",
      }}
    >
      LL
    </div>,
    size,
  );
}
