import type { MetadataRoute } from "next";
import { CHAMPIONS } from "@/lib/champions";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lol-character-type.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/q/story`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/q/game`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${BASE_URL}/champions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const championEntries: MetadataRoute.Sitemap = CHAMPIONS.map((c) => ({
    url: `${BASE_URL}/champions/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticEntries, ...championEntries];
}
