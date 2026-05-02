import { describe, expect, it } from "vitest";
import { decodeAnswers, encodeAnswers } from "@/lib/encoding";
import { describeGame, describeStory } from "@/lib/persona";
import {
  type LikertAnswer,
  rankChampions,
  topMatches,
  userGameVector,
  userStoryVector,
} from "@/lib/scoring";

const allAgree: LikertAnswer[] = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const allNeutral: LikertAnswer[] = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
const allDisagree: LikertAnswer[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

describe("encoding", () => {
  it("round-trips story answers", () => {
    const ans: LikertAnswer[] = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1];
    const hash = encodeAnswers("story", ans);
    expect(hash).toBe("s1234554321");
    const decoded = decodeAnswers(hash);
    expect(decoded).toEqual({ type: "story", answers: ans });
  });

  it("rejects invalid hashes", () => {
    expect(decodeAnswers("")).toBeNull();
    expect(decodeAnswers("s12345")).toBeNull();
    expect(decodeAnswers("x1234554321")).toBeNull();
    expect(decodeAnswers("s1234554329")).toBeNull();
    expect(decodeAnswers("s12345543a1")).toBeNull();
    expect(decodeAnswers("s5555555555")).not.toBeNull();
  });
});

describe("user vectors", () => {
  it("neutral answers yield a zero story vector", () => {
    const v = userStoryVector(allNeutral);
    for (const val of Object.values(v)) {
      expect(val).toBeCloseTo(0);
    }
  });

  it("agreeing pushes story dims positive", () => {
    const v = userStoryVector(allAgree);
    expect(v.honor).toBeGreaterThan(0);
    expect(v.organization).toBeGreaterThan(0);
    expect(v.revenge).toBeGreaterThan(0);
  });

  it("disagreeing pushes game dims negative on relevant axes", () => {
    const v = userGameVector(allDisagree);
    expect(v.cc).toBeLessThan(0);
    expect(v.mobility).toBeLessThan(0);
  });

  it("agreeing all pushes difficulty positive (G8)", () => {
    const v = userGameVector(allAgree);
    expect(v.difficulty).toBeGreaterThan(0);
  });
});

describe("ranking", () => {
  it("returns champions sorted by ascending distance", () => {
    const ranked = rankChampions("story", allAgree);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i]!.distance).toBeGreaterThanOrEqual(ranked[i - 1]!.distance);
    }
  });

  it("topMatches returns the requested count", () => {
    const top = topMatches("game", allAgree, 5);
    expect(top).toHaveLength(5);
  });

  it("strong burst+mobility answers surface burst-style champions", () => {
    // G6 is the burst/assassination question (index 5). Strong agree there only.
    const ans = [3, 3, 3, 3, 3, 5, 3, 3, 3, 3] as LikertAnswer[];
    const top = topMatches("game", ans, 5);
    // The top picks should lean burst (damageStyle > 0.5) and have above-average mobility
    expect(top.every((m) => m.champion.gameVec.damageStyle >= 0.5)).toBe(true);
    expect(top.some((m) => m.champion.gameVec.mobility >= 0.6)).toBe(true);
  });

  it("strong CC + tanky answers surface tanky engagers", () => {
    // G7 (index 6) — engage / tank / CC
    const ans = [3, 3, 3, 3, 3, 3, 5, 3, 3, 3] as LikertAnswer[];
    const top = topMatches("game", ans, 5);
    expect(top.every((m) => m.champion.gameVec.durability >= 0.5)).toBe(true);
    expect(top.some((m) => m.champion.gameVec.cc >= 0.6)).toBe(true);
  });
});

describe("persona", () => {
  it("describeStory produces a non-empty label and paragraph", () => {
    const v = userStoryVector([5, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
    const p = describeStory(v);
    expect(p.label.length).toBeGreaterThan(0);
    expect(p.paragraphs.length).toBeGreaterThan(0);
  });

  it("describeGame returns 万能型 for neutral answers", () => {
    const v = userGameVector(allNeutral);
    const p = describeGame(v);
    expect(p.label).toBe("万能型");
  });
});
