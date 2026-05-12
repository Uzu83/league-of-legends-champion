"use client";

import { LOCALE_COOKIE, LOCALES, type Locale, T } from "@/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const setLocale = (next: string) => {
    if (next === current || !(LOCALES as readonly string[]).includes(next)) return;
    // biome-ignore lint/suspicious/noDocumentCookie: intentional cookie write to switch locale.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    // Full reload picks up server-rendered locale + metadata.
    window.location.reload();
  };
  return (
    <label className="flex items-center gap-1 text-xs text-(--color-text-muted)">
      <span className="sr-only">Language</span>
      <span aria-hidden>🌐</span>
      <select
        value={current}
        onChange={(e) => setLocale(e.target.value)}
        className="rounded-md border border-white/15 bg-black/20 px-1.5 py-1 text-xs text-(--color-text) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {T[loc].locale[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
