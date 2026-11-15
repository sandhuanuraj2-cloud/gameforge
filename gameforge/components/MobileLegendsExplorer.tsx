"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Shield, Sword, Sparkles, X } from "lucide-react";

type Build = {
  name: string;
  activity: string;
  difficulty: string;
  gear: string[];
  skills: string[];
  play: string[];
  warning: string;
};

type Props = { builds: Build[] };

const heroes = [
  {
    name: "Cyclops",
    role: "Mid lane · Mage",
    alias: "Durable burst mage",
    image: "https://oneesports.blob.core.windows.net/cdn-data/sites/2/2021/04/Cyclops-2.jpg",
    alt: "Cyclops hero artwork",
    summary: "Poke from safe range, keep moving and use the ultimate when teammates can follow.",
    tags: ["mage", "mid", "burst", "poke"],
  },
  {
    name: "Minotaur",
    role: "Roam · Tank / Support",
    alias: "Peel-first tank roamer",
    image: "https://mobilegame.dailytech.id/img/games/minotaur.webp",
    alt: "Minotaur tank hero artwork",
    summary: "Protect the carry, check vision with teammates and engage only when allies can follow.",
    tags: ["tank", "roam", "support", "heal", "crowd control"],
  },
  {
    name: "Lapu-Lapu",
    role: "EXP lane · Fighter",
    alias: "Anti-frontline EXP fighter",
    image: "https://media.hitekno.com/thumbs/2023/01/05/56758-hero-mobile-legends-lapu-lapu/730x480-img-56758-hero-mobile-legends-lapu-lapu.jpg",
    alt: "Lapu-Lapu fighter hero artwork",
    summary: "Trade around cooldowns, build for the enemy damage profile and choose engage or peel.",
    tags: ["fighter", "exp", "frontline", "sustain"],
  },
];

const equipmentIcons: Record<string, string> = {
  "boots": "🥾", "talisman": "📜", "energy": "🔮", "wand": "🪄",
  "shield": "🛡️", "armor": "🦾", "ice": "❄️", "immortality": "✨",
  "penetration": "💠", "dominance": "❄️", "antique": "🛡️",
};

function iconFor(item: string) {
  const key = Object.keys(equipmentIcons).find((word) => item.toLowerCase().includes(word));
  return key ? equipmentIcons[key] : "⚔️";
}

export default function MobileLegendsExplorer({ builds }: Props) {
  const [tab, setTab] = useState<"heroes" | "equipment">("heroes");
  const [query, setQuery] = useState("");
  const [brokenImages, setBrokenImages] = useState<string[]>([]);

  const equipment = useMemo(() => {
    const unique = new Map<string, string>();
    builds.forEach((build) => build.gear.forEach((item) => unique.set(item, build.name)));
    return [...unique.entries()].map(([name, build]) => ({ name, build }));
  }, [builds]);

  const filteredHeroes = heroes.filter((hero) =>
    [hero.name, hero.role, hero.alias, hero.summary, ...hero.tags].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  );
  const filteredEquipment = equipment.filter((item) =>
    [item.name, item.build].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="mt-10" id="mlbb-explorer">
      <div className="section-kicker">Mobile Legends · visual index</div>
      <h2 className="mt-2 text-2xl font-black">Hero & equipment explorer</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Search the heroes and gear used in the current GAMEFORGE reference builds.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setTab("heroes")} className={`rounded-full border px-4 py-2 text-xs font-bold ${tab === "heroes" ? "border-purple-400 bg-purple-500/20 text-white" : "border-white/10 text-slate-400"}`}>Heroes ({heroes.length})</button>
        <button onClick={() => setTab("equipment")} className={`rounded-full border px-4 py-2 text-xs font-bold ${tab === "equipment" ? "border-blue-400 bg-blue-500/20 text-white" : "border-white/10 text-slate-400"}`}>Equipment ({equipment.length})</button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-900/60 bg-slate-950/80 px-4 py-3 focus-within:border-blue-400">
        <Search size={18} className="shrink-0 text-blue-300" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "heroes" ? "Search hero, lane or role..." : "Search equipment or build..."} aria-label="Search Mobile Legends heroes and equipment" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
        {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="text-slate-400"><X size={17} /></button>}
      </div>

      {tab === "heroes" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHeroes.map((hero) => (
            <article key={hero.name} className="overflow-hidden rounded-2xl border border-purple-900/50 bg-black/25">
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-purple-950 to-blue-950">
                {!brokenImages.includes(hero.name) ? <Image src={hero.image} alt={hero.alt} fill unoptimized sizes="(max-width: 640px) 100vw, 33vw" className="object-cover object-top" onError={() => setBrokenImages((current) => [...current, hero.name])} /> : <div className="grid h-full place-items-center text-5xl">⚔️</div>}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                  <h3 className="text-xl font-black text-white">{hero.name}</h3>
                  <p className="text-xs font-semibold text-blue-200">{hero.role}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-6 text-slate-300">{hero.summary}</p>
                <p className="mt-3 text-xs text-purple-200">Related reference: {hero.alias}</p>
              </div>
            </article>
          ))}
          {filteredHeroes.length === 0 && <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400 sm:col-span-2 lg:col-span-3">No hero found. Try a lane or role such as Mage, EXP or Roam.</p>}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {filteredEquipment.map((item) => (
            <article key={item.name} className="flex items-center gap-4 rounded-xl border border-blue-900/40 bg-slate-950/70 p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-blue-900/50 bg-gradient-to-br from-blue-950 to-purple-950 text-2xl" aria-hidden="true">{iconFor(item.name)}</div>
              <div className="min-w-0">
                <h3 className="font-bold text-white">{item.name}</h3>
                <p className="mt-1 text-xs text-slate-400">Appears in: {item.build}</p>
              </div>
              <Sparkles size={16} className="ml-auto shrink-0 text-blue-300" />
            </article>
          ))}
          {filteredEquipment.length === 0 && <p className="rounded-xl border border-white/10 p-5 text-sm text-slate-400 sm:col-span-2">No equipment found. Try searching boots, shield, armor or penetration.</p>}
        </div>
      )}
      <p className="mt-3 text-xs leading-5 text-slate-500">This is an initial curated index, not the complete in-game roster or a live item database. Hero balance and equipment recommendations can change with patches.</p>
    </section>
  );
}
