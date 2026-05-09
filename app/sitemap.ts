import type { MetadataRoute } from "next";
import { CHAMPIONS } from "@/lib/champions";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

const withAlternates = (path: string) => ({
  url: `${BASE_URL}${path}`,
  alternates: {
    languages: {
      ja: `${BASE_URL}${path}`,
      en: `${BASE_URL}${path}`,
      "x-default": `${BASE_URL}${path}`,
    },
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { ...withAlternates("/"), lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    {
      ...withAlternates("/q/story"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      ...withAlternates("/q/game"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      ...withAlternates("/champions"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      ...withAlternates("/compare"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
  const championEntries: MetadataRoute.Sitemap = CHAMPIONS.map((c) => ({
    ...withAlternates(`/champions/${c.id}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticEntries, ...championEntries];
}
