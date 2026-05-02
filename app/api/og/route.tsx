import { ImageResponse } from "next/og";
import { championPortrait } from "@/lib/champions";
import { decodeAnswers } from "@/lib/encoding";
import { describeGame, describeStory } from "@/lib/persona";
import { topMatches, userGameVector, userStoryVector } from "@/lib/scoring";
import { REGION_LABEL_JA } from "@/lib/types";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash") ?? "";
  const decoded = decodeAnswers(hash);
  if (!decoded) {
    return new Response("invalid hash", { status: 400 });
  }
  const top = topMatches(decoded.type, decoded.answers, 1)[0];
  if (!top) return new Response("no match", { status: 404 });
  const typeLabel = decoded.type === "story" ? "ストーリー入り口" : "ゲーム性能入り口";
  const persona =
    decoded.type === "story"
      ? describeStory(userStoryVector(decoded.answers))
      : describeGame(userGameVector(decoded.answers));

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
          LOL キャラタイプ診断 / {typeLabel}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#f0e6d2", marginBottom: 4 }}>
          あなたは
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
          「{persona.label}」型
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
          最もマッチするのは
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
          {top.champion.nameJa}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#5cd0ff", marginTop: 8 }}>
          {top.champion.titleJa} / {REGION_LABEL_JA[top.champion.region]}
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
          alt={top.champion.nameJa}
          width={360}
          height={360}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
