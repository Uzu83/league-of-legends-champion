import { ImageResponse } from "next/og";
import { championPortrait } from "@/lib/champions";
import { decodeAnswers } from "@/lib/encoding";
import { championName, championTitle, dict, isLocale, regionLabel } from "@/lib/i18n";
import { describeGame, describeStory } from "@/lib/persona";
import { topMatches, userGameVector, userStoryVector } from "@/lib/scoring";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash") ?? "";
  const langParam = searchParams.get("lang");
  const locale = isLocale(langParam) ? langParam : "ja";
  const decoded = decodeAnswers(hash);
  if (!decoded) {
    return new Response("invalid hash", { status: 400 });
  }
  const top = topMatches(decoded.type, decoded.answers, 1)[0];
  if (!top) return new Response("no match", { status: 404 });
  const t = dict(locale);
  const typeLabel =
    decoded.type === "story"
      ? locale === "ja"
        ? "ストーリー入り口"
        : "Story entry"
      : locale === "ja"
        ? "ゲーム性能入り口"
        : "Gameplay entry";
  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers), locale)
      : describeGame(userGameVector(decoded.answers), locale);

  const youAreCaption = locale === "ja" ? "あなたは" : "You are";
  const matchCaption = locale === "ja" ? "最もマッチするのは" : "Closest champion";
  const personaTitle = locale === "ja" ? `「${persona.label}」型` : `"${persona.label}"`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0e1a 0%, #1b2540 100%)",
        color: "#f0e6d2",
        padding: "60px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#a09b8c", marginBottom: 8 }}>
          {t.metadata.title} / {typeLabel}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#f0e6d2", marginBottom: 4 }}>
          {youAreCaption}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#c89b3c",
            lineHeight: 1.1,
            marginBottom: 4,
          }}
        >
          {personaTitle}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a09b8c",
            marginTop: 28,
            marginBottom: 4,
          }}
        >
          {matchCaption}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            color: "#f0e6d2",
            lineHeight: 1.1,
          }}
        >
          {championName(locale, top.champion)}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#5cd0ff", marginTop: 8 }}>
          {championTitle(locale, top.champion)} / {regionLabel(locale, top.champion.region)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: 360,
          height: 360,
          borderRadius: 360,
          overflow: "hidden",
          border: "6px solid #c89b3c",
          alignSelf: "center",
        }}
      >
        <img
          src={championPortrait(top.champion.ddragonId)}
          alt={championName(locale, top.champion)}
          width={360}
          height={360}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
