import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { MouseEvent, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    onClick,
    children,
  }: {
    href: string;
    className?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    children: ReactNode;
  }) => (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

import QuizClient from "@/app/q/[type]/quiz-client";
import RetakeLink from "@/app/result/[hash]/retake-link";
import type { LikertAnswer } from "@/lib/scoring";
import { useQuiz } from "@/lib/store";
import type { DiagnosisType } from "@/lib/types";

function emptyColumn(): (LikertAnswer | null)[] {
  return Array.from({ length: 10 }, () => null);
}

beforeEach(async () => {
  push.mockClear();
  sessionStorage.clear();
  useQuiz.setState({ answers: { story: emptyColumn(), game: emptyColumn() } });
  await useQuiz.persist.rehydrate();
});

afterEach(() => {
  cleanup();
});

describe("quiz next gate", () => {
  it.each([
    "story",
    "game",
  ] as DiagnosisType[])("keeps Next disabled on %s until the current question is answered", (type) => {
    render(<QuizClient type={type} locale="en" />);
    const next = screen.getByRole("button", { name: "Next →" });
    expect(next).toBeDisabled();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText("Q1 / 10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next →" })).toBeDisabled();

    fireEvent.click(screen.getByRole("radio", { name: "Strongly disagree" }));
    expect(screen.getByText("Q2 / 10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next →" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "← Previous" }));
    const nextOnAnswered = screen.getByRole("button", { name: "Next →" });
    expect(nextOnAnswered).toBeEnabled();
    fireEvent.click(nextOnAnswered);
    expect(screen.getByText("Q2 / 10")).toBeInTheDocument();
  });

  it("still opens the result when every answer is filled", () => {
    render(<QuizClient type="story" locale="en" />);

    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole("radio", { name: "Neither" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "See result" }));
    expect(push).toHaveBeenCalledWith("/result/s3333333333");
  });
});

describe("fresh entry", () => {
  it.each([
    "story",
    "game",
  ] as DiagnosisType[])("drops a stored %s answer so question 1 starts unselected", async (type) => {
    const story = emptyColumn();
    const game = emptyColumn();
    story[0] = 4;
    game[0] = 5;
    sessionStorage.setItem(
      "lol-character-type-quiz",
      JSON.stringify({ state: { answers: { story, game } }, version: 0 }),
    );
    await useQuiz.persist.rehydrate();

    render(<QuizClient type={type} locale="en" />);

    expect(screen.getByText("Q1 / 10")).toBeInTheDocument();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-checked", "false");
    }
    expect(useQuiz.getState().answers[type].every((answer) => answer == null)).toBe(true);
    const other = type === "story" ? "game" : "story";
    expect(useQuiz.getState().answers[other][0]).toBe(type === "story" ? 5 : 4);
  });
});

describe("retake", () => {
  it("clears only the retaken entry and shows question 1 with nothing selected", () => {
    useQuiz.getState().setAnswer("story", 0, 5);
    useQuiz.getState().setAnswer("game", 1, 4);

    render(<RetakeLink type="story">Retake</RetakeLink>);
    fireEvent.click(screen.getByRole("link", { name: "Retake" }));

    expect(useQuiz.getState().answers.story.every((answer) => answer == null)).toBe(true);
    expect(useQuiz.getState().answers.game[1]).toBe(4);
    const stored = sessionStorage.getItem("lol-character-type-quiz");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored ?? "") as {
      state: { answers: { story: (LikertAnswer | null)[] } };
    };
    expect(parsed.state.answers.story.every((answer) => answer == null)).toBe(true);

    cleanup();
    render(<QuizClient type="story" locale="en" />);
    expect(screen.getByText("Q1 / 10")).toBeInTheDocument();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-checked", "false");
    }
  });
});
