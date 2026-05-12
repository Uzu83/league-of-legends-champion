"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { championPortrait } from "@/lib/champions";
import { archetypeLabel, championName, dict, type Locale, regionLabel } from "@/lib/i18n";
import { type Archetype, type Champion, REGIONS, type Region, ROLES, type Role } from "@/lib/types";

const ALL_ARCHETYPES: Archetype[] = [
  "Assassin",
  "Mage",
  "Marksman",
  "Tank",
  "Fighter",
  "Bruiser",
  "Support",
  "Specialist",
];

export default function ChampionsIndexClient({
  champions,
  locale,
}: {
  champions: Champion[];
  locale: Locale;
}) {
  const t = dict(locale).champions;
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return champions.filter((c) => {
      if (q) {
        const haystack = `${c.name} ${c.nameJa} ${c.id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (role && !c.roles.includes(role)) return false;
      if (region && c.region !== region) return false;
      if (archetype && !c.archetypes.includes(archetype)) return false;
      return true;
    });
  }, [champions, query, role, region, archetype]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">{t.heading}</h1>
        <p className="text-xs text-(--color-text-muted)">
          {t.counter(filtered.length, champions.length)}
        </p>
      </header>

      <section className="space-y-3 rounded-xl bg-white/5 p-4">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm focus:border-(--color-accent) focus:outline-none"
        />

        <FilterRow
          label={t.filterRole}
          allLabel={t.all}
          current={role}
          options={ROLES}
          onSelect={setRole}
        />
        <FilterRow
          label={t.filterRegion}
          allLabel={t.all}
          current={region}
          options={REGIONS}
          formatter={(v) => regionLabel(locale, v)}
          onSelect={setRegion}
        />
        <FilterRow
          label={t.filterArchetype}
          allLabel={t.all}
          current={archetype}
          options={ALL_ARCHETYPES}
          formatter={(v) => archetypeLabel(locale, v)}
          onSelect={setArchetype}
        />
      </section>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-(--color-text-muted)">{t.empty}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/champions/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2 transition-colors hover:border-white/30"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                  <Image
                    src={championPortrait(c.ddragonId)}
                    alt={championName(locale, c)}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{championName(locale, c)}</p>
                  <p className="truncate text-xs text-(--color-text-muted)">
                    {regionLabel(locale, c.region)} / {c.roles.join(", ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  allLabel,
  current,
  options,
  formatter,
  onSelect,
}: {
  label: string;
  allLabel: string;
  current: T | null;
  options: readonly T[];
  formatter?: (v: T) => string;
  onSelect: (v: T | null) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-(--color-text-muted)">{label}</p>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`rounded-full border px-2 py-0.5 text-xs ${
            current === null ? "border-(--color-accent) text-(--color-accent)" : "border-white/15"
          }`}
        >
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onSelect(o)}
            className={`rounded-full border px-2 py-0.5 text-xs ${
              current === o ? "border-(--color-accent) text-(--color-accent)" : "border-white/15"
            }`}
          >
            {formatter ? formatter(o) : o}
          </button>
        ))}
      </div>
    </div>
  );
}
