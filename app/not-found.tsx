import Link from "next/link";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const t = dict(await getLocale()).notFound;
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-(--color-accent)">{t.heading}</h1>
      <p className="max-w-md text-sm text-(--color-text-muted)">{t.body}</p>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        <Link
          href="/"
          className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
        >
          {t.home}
        </Link>
        <Link
          href="/champions"
          className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
        >
          {t.champions}
        </Link>
        <Link
          href="/q/story"
          className="rounded-full border border-white/15 px-3 py-1 hover:border-white/40"
        >
          {t.quiz}
        </Link>
      </div>
    </div>
  );
}
