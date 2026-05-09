"use client";

import { LOCALES, type Locale, LOCALE_COOKIE, T } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const setLocale = (next: Locale) => {
    if (next === current) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    // Full reload picks up server-rendered locale + metadata.
    window.location.reload();
  };
  return (
    <div className="flex items-center gap-1 text-xs" role="group" aria-label="Language">
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            aria-pressed={active}
            className={`rounded-full border px-2 py-0.5 transition-colors ${
              active
                ? "border-(--color-accent) text-(--color-accent)"
                : "border-white/15 text-(--color-text-muted) hover:border-white/40"
            }`}
          >
            {T[loc].locale[loc]}
          </button>
        );
      })}
    </div>
  );
}
