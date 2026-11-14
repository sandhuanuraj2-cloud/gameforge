"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

type Build = { name: string; activity: string; difficulty: string; gear: string[]; skills: string[]; play: string[]; warning: string };
type Strategy = { name: string; scenario: string; setup: string; execution: string[]; winCondition: string; adaptation: string };
type Props = { game: string; builds: Build[]; strategies: Strategy[] };

const visualByGame: Record<string, { emoji: string; label: string; accent: string; image: string; alt: string }> = {
  "mobile-legends": { emoji: "⚔️", label: "Hero loadout", accent: "from-fuchsia-950 to-indigo-950", image: "https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2021/10/13/mlbb.jpg", alt: "Mobile Legends hero artwork" },
  "pubg-battlegrounds": { emoji: "🎯", label: "Weapons & gear", accent: "from-amber-950 to-stone-950", image: "https://wstatic-prod.pubg.com/web/live/static/game-info/weapons/images/viewer/img-weapons-m416.png", alt: "PUBG M416 assault rifle render" },
  valorant: { emoji: "🔫", label: "Agent equipment", accent: "from-rose-950 to-slate-950", image: "https://cdn.mos.cms.futurecdn.net/6bXqNkceszqHxfYck3S3Rn.jpg", alt: "Valorant agent character artwork" },
  "clash-royale": { emoji: "🛡️", label: "Deck cards", accent: "from-orange-950 to-purple-950", image: "https://clashroyale.inbox.supercell.com/9jtsgmsiuthj/k_YHCzHVW18wcI4601sk91QptsRVXjrx2xAJlj8qJ14/f8a6330427caa1cd370040a0b58ad3dc/24741016_1648052731.png", alt: "Clash Royale Archers card artwork" },
  minecraft: { emoji: "⛏️", label: "Tools & resources", accent: "from-emerald-950 to-stone-950", image: "https://images.gutefrage.net/media/fragen/bilder/was-findet-ihr-besser-587/0_full.jpg?v=1692317210000", alt: "Minecraft diamond armour and tools" },
  "genshin-impact": { emoji: "✨", label: "Character & weapon", accent: "from-cyan-950 to-violet-950", image: "https://assets.st-note.com/img/1691390903749-HvOerzUX22.png?width=1200", alt: "Genshin Impact forgeable weapon lineup" },
  "albion-online": { emoji: "🪓", label: "Weapons & armour", accent: "from-yellow-950 to-stone-950", image: "https://bendermoney.com/storage/filemanager/file/2/1fmUEUG9lMDqacCKaylIeTNQZEMgZpTg3r6lkw8L.png", alt: "Albion Online armour equipment icons" },
};

export default function StrategyLibrary({ game, builds, strategies }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "build" | "strategy">("all");
  const visual = visualByGame[game] || { emoji: "🎮", label: "Game setup", accent: "from-purple-950 to-slate-950", image: "", alt: "Game setup artwork" };
  const items = useMemo(() => [
    ...builds.map((item) => ({ ...item, type: "build" as const, searchable: [item.name, item.activity, item.difficulty, ...item.gear, ...item.skills, ...item.play].join(" ") })),
    ...strategies.map((item) => ({ ...item, type: "strategy" as const, searchable: [item.name, item.scenario, item.setup, ...item.execution, item.winCondition, item.adaptation].join(" ") })),
  ].filter((item) => (kind === "all" || item.type === kind) && (!query.trim() || item.searchable.toLowerCase().includes(query.trim().toLowerCase()))), [builds, strategies, query, kind]);

  return <section className="mt-10" id="strategy-library">
    <div className="section-kicker">Find your setup</div>
    <h2 className="mt-2 text-2xl font-black">Search builds and strategies</h2>
    <p className="mt-2 text-sm leading-6 text-slate-400">Search by hero, weapon, role, item, map, situation or strategy name.</p>
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-900/60 bg-slate-950/80 px-4 py-3 focus-within:border-blue-400">
      <Search size={19} className="shrink-0 text-blue-300"/>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search heroes, weapons, builds, tactics..." aria-label="Search builds and strategies" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"/>
      {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="text-slate-400 hover:text-white"><X size={18}/></button>}
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {(["all", "build", "strategy"] as const).map((value) => <button key={value} onClick={() => setKind(value)} className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${kind === value ? "border-blue-400 bg-blue-500/15 text-blue-200" : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/30"}`}>{value === "all" ? "Everything" : value === "build" ? "Builds & loadouts" : "Custom strategies"}</button>)}
    </div>
    <p className="mt-4 text-xs text-slate-500">{items.length} result{items.length === 1 ? "" : "s"}</p>
    {items.length === 0 ? <div className="mt-3 rounded-xl border border-white/10 p-6 text-center text-sm text-slate-400">No matching build or strategy. Try another hero, item or keyword.</div> :
      <div className="mt-3 grid gap-4">
        {items.map((item) => <article key={item.type + item.name} className="overflow-hidden rounded-2xl border border-purple-900/50 bg-black/25">
          <div className={`relative flex min-h-32 items-center gap-4 overflow-hidden bg-gradient-to-br ${visual.accent} p-4 sm:min-h-36 sm:px-6`}>
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/25 shadow-xl sm:h-28 sm:w-28">{visual.image ? <img src={visual.image} alt={visual.alt} loading="lazy" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }}/> : null}<span className="absolute text-4xl drop-shadow-lg" aria-hidden="true">{visual.emoji}</span></div>
            <div className="relative z-10 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200/80">{visual.label} · {item.type === "build" ? "Build" : "Custom tactic"}</p>
              <h3 className="mt-2 text-lg font-extrabold text-white sm:text-xl">{item.name}</h3>
              <p className="mt-1 text-xs text-slate-300">{item.type === "build" ? item.activity : item.scenario}</p>
            </div>
            <div className="pointer-events-none absolute -right-5 -top-8 h-36 w-36 rounded-full border border-white/10"/>
            <div className="pointer-events-none absolute -bottom-14 right-16 h-36 w-36 rounded-full border border-white/10"/>
          </div>
          <div className="p-4 sm:p-5">
            {item.type === "build" ? <>
              <div className="flex flex-wrap gap-2"><span className="rounded-full border border-blue-900/60 px-3 py-1 text-xs text-blue-200">{item.difficulty}</span></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Core setup</p><ul className="mt-2 space-y-1">{item.gear.map((entry) => <li key={entry} className="text-sm leading-6 text-slate-300">• {entry}</li>)}</ul></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Key mechanics</p><ul className="mt-2 space-y-1">{item.skills.map((entry) => <li key={entry} className="text-sm leading-6 text-slate-300">• {entry}</li>)}</ul></div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4"><p className="text-xs font-bold uppercase tracking-wider text-purple-300">How to play</p><ol className="mt-2 list-decimal space-y-1 pl-5">{item.play.map((entry) => <li key={entry} className="text-sm leading-6 text-slate-300">{entry}</li>)}</ol></div>
              <p className="mt-4 rounded-lg border border-amber-900/40 bg-amber-950/10 p-3 text-xs leading-5 text-amber-100/80"><strong>Note:</strong> {item.warning}</p>
            </> : <>
              <p className="text-sm leading-6 text-slate-300"><strong className="text-slate-100">Setup:</strong> {item.setup}</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">{item.execution.map((entry) => <li key={entry} className="text-sm leading-6 text-slate-300">{entry}</li>)}</ol>
              <p className="mt-3 text-sm leading-6 text-emerald-200/90"><strong>Win condition:</strong> {item.winCondition}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400"><strong className="text-slate-300">If it fails:</strong> {item.adaptation}</p>
            </>}
          </div>
        </article>)}
      </div>}
  </section>;
}
