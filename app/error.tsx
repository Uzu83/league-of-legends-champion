"use client";

import Link from "next/link";
import { useEffect } from "react";
import { clientLocale, dict } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = dict(clientLocale()).errorPage;
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-(--color-accent)">{t.heading}</h1>
      <p className="max-w-md text-sm text-(--color-text-muted)">{t.body}</p>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-(--color-accent)/40 px-3 py-1 hover:border-(--color-accent)"
        >
          {t.retry}
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
