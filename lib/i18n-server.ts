import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, type Locale, resolveLocale } from "./i18n";

/** Server-only: resolves the active locale from cookie + Accept-Language. */
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const h = await headers();
  return resolveLocale({
    cookie: c.get(LOCALE_COOKIE)?.value,
    acceptLanguage: h.get("accept-language"),
  });
}
