import { ImageResponse } from "next/og";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const alt = "LoL Character Type Quiz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social card for every page that doesn't supply its own
// (`/`, `/champions`, `/q/*`, `/compare`). Champion detail and result pages
// override this via their `generateMetadata().openGraph.images`.
export default async function OpengraphImage() {
  const locale = await getLocale();
  const t = dict(locale);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0e1a 0%, #1b2540 60%, #2a1d40 100%)",
        color: "#f0e6d2",
        padding: "72px",
        justifyContent: "space-between",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 16,
            border: "4px solid #c89b3c",
            color: "#c89b3c",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          LL
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a09b8c" }}>{t.unofficial}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "#c89b3c",
            lineHeight: 1.1,
          }}
        >
          {t.metadata.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#f0e6d2",
            lineHeight: 1.35,
            maxWidth: 980,
          }}
        >
          {t.metadata.ogDescription}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#5cd0ff" }}>
        🌍 + ⚔️ · 172 champions · ja / en / ko / zh / es / fr / de / pt / ru
      </div>
    </div>,
    size,
  );
}
