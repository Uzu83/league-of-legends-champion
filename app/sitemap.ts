import type { MetadataRoute } from "next";
import { CHAMPIONS } from "@/lib/champions";
import { hreflangAlternates } from "@/lib/i18n";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://league-of-legends-champion.vercel.app";

// Stable per-release timestamp so the sitemap doesn't claim every URL changed on
// every deploy. Bump when content meaningfully changes (e.g. a new DDragon patch).
const LAST_MODIFIED = new Date("2026-05-12T00:00:00Z");

const entry = (
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
) => ({
  url: `${BASE_URL}${path}`,
  lastModified: LAST_MODIFIED,
  changeFrequency,
  priority,
  alternates: { languages: hreflangAlternates(`${BASE_URL}${path}`) },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", "monthly", 1.0),
    entry("/q/story", "monthly", 0.9),
    entry("/q/game", "monthly", 0.9),
    entry("/champions", "weekly", 0.7),
    entry("/compare", "monthly", 0.5),
  ];
  const championEntries: MetadataRoute.Sitemap = CHAMPIONS.map((c) =>
    entry(`/champions/${c.id}`, "monthly", 0.5),
  );
  return [...staticEntries, ...championEntries];
}
