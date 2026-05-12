import { describe, expect, it } from "vitest";
import { CHAMPIONS } from "@/lib/champions";
import {
  championBlurb,
  championName,
  championTitle,
  DEFAULT_LOCALE,
  isLocale,
  localeFromAcceptLanguage,
  resolveLocale,
} from "@/lib/i18n";
import { describeGame, describeStory } from "@/lib/persona";
import { type LikertAnswer, userGameVector, userStoryVector } from "@/lib/scoring";

describe("locale detection", () => {
  it("isLocale narrows known values only", () => {
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("xx")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("Accept-Language picks first matching primary tag", () => {
    expect(localeFromAcceptLanguage("en-US,en;q=0.9,ja;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("ja-JP,ja;q=0.9")).toBe("ja");
    expect(localeFromAcceptLanguage("ko-KR")).toBe("ko");
    expect(localeFromAcceptLanguage("zh-CN,zh;q=0.9")).toBe("zh");
    expect(localeFromAcceptLanguage("pt-BR")).toBe("pt");
    expect(localeFromAcceptLanguage("xx-XX")).toBe(DEFAULT_LOCALE);
    expect(localeFromAcceptLanguage(null)).toBe(DEFAULT_LOCALE);
  });

  it("resolveLocale prefers cookie over header", () => {
    expect(resolveLocale({ cookie: "en", acceptLanguage: "ja-JP" })).toBe("en");
    expect(resolveLocale({ cookie: "junk", acceptLanguage: "ja-JP,ja;q=0.9" })).toBe("ja");
    expect(resolveLocale({ cookie: undefined, acceptLanguage: "en-US" })).toBe("en");
  });
});

describe("champion accessors", () => {
  const c = CHAMPIONS[0]!;

  it("championName respects locale", () => {
    expect(championName("ja", c)).toBe(c.nameJa);
    expect(championName("en", c)).toBe(c.name);
  });

  it("championTitle respects locale", () => {
    expect(championTitle("ja", c)).toBe(c.titleJa);
    expect(championTitle("en", c)).toBe(c.title);
  });

  it("EN blurb is non-empty and synthesized from structured fields", () => {
    const blurb = championBlurb("en", c);
    expect(blurb.length).toBeGreaterThan(0);
    expect(blurb).toContain(c.name);
  });
});

describe("persona localization", () => {
  const allAgree: LikertAnswer[] = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

  it("describeStory returns EN strings when locale=en", () => {
    const v = userStoryVector(allAgree);
    const en = describeStory(v, "en");
    const ja = describeStory(v, "ja");
    expect(en.label.length).toBeGreaterThan(0);
    expect(ja.label.length).toBeGreaterThan(0);
    expect(en.label).not.toBe(ja.label);
  });

  it("describeGame returns EN All-rounder for neutral answers", () => {
    const neutral = Array(10).fill(3) as LikertAnswer[];
    const v = userGameVector(neutral);
    expect(describeGame(v, "en").label).toBe("All-rounder");
    expect(describeGame(v, "ja").label).toBe("万能型");
  });
});
