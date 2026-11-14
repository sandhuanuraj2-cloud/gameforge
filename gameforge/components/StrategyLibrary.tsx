"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";

type Build = { name: string; activity: string; difficulty: string; gear: string[]; skills: string[]; play: string[]; warning: string };
type Strategy = { name: string; scenario: string; setup: string; execution: string[]; winCondition: string; adaptation: string };
type Props = { game: string; builds: Build[]; strategies: Strategy[] };

type Artwork = { image: string; alt: string; source: string };
const visualByGame: Record<string, { emoji: string; label: string; accent: string; artwork: Artwork }> = {
  "mobile-legends": { emoji: "⚔️", label: "Hero artwork", accent: "from-fuchsia-950 to-indigo-950", artwork: { image: "https://oneesports.blob.core.windows.net/cdn-data/sites/2/2021/04/Cyclops-2.jpg", alt: "Cyclops hero splash artwork", source: "https://www.oneesports.gg/mobile-legends/cyclops-jungler-nma-season-3/" } },
  "pubg-battlegrounds": { emoji: "🎯", label: "Weapon render", accent: "from-amber-950 to-stone-950", artwork: { image: "https://wstatic-prod.pubg.com/web/live/static/game-info/weapons/images/viewer/img-weapons-m416.png", alt: "PUBG M416 assault rifle render", source: "https://pubg.com/en/game-info/weapons" } },
  valorant: { emoji: "🔫", label: "Agent artwork", accent: "from-rose-950 to-slate-950", artwork: { image: "https://cdn.mos.cms.futurecdn.net/6bXqNkceszqHxfYck3S3Rn.jpg", alt: "Valorant agent character lineup", source: "https://www.pcgamer.com/valorant-how-riot-launched-a-successful-esport-in-a-global-pandemic/" } },
  "clash-royale": { emoji: "🛡️", label: "Deck card artwork", accent: "from-orange-950 to-purple-950", artwork: { image: "https://img.redbull.com/images/q_auto%2Cf_auto/redbullcom/2018/08/08/ee0d71b3-e544-4dd2-bbce-4bfff1857b4e/clash-royale", alt: "Clash Royale deck card artwork", source: "https://www.redbull.com/be-nl/clash-royale-decks-arena-4-5-6" } },
  minecraft: { emoji: "⛏️", label: "Survival build artwork", accent: "from-emerald-950 to-stone-950", artwork: { image: "https://blockical.com/wp-content/uploads/2025/12/duo-starter-png.png", alt: "Minecraft starter cabins and Nether portal build", source: "https://blockical.com/all-builds/" } },
  "genshin-impact": { emoji: "✨", label: "Team character artwork", accent: "from-cyan-950 to-violet-950", artwork: { image: "https://staticg.sportskeeda.com/editor/2024/11/57ce9-17304552501326-1920.jpg", alt: "Genshin Impact Hyperbloom team characters", source: "https://www.sportskeeda.com/esports/best-nahida-hyperbloom-team-comps-stats-rotations-gameplay-guide" } },
  "albion-online": { emoji: "🪓", label: "Weapon & armour icons", accent: "from-yellow-950 to-stone-950", artwork: { image: "https://www.gamersdecide.com/sites/default/files/styles/responsive_image_512xauto/public/authors/u161773/dreaded_bloodletter.jpg?itok=miBCjKSZ", alt: "Albion Online tier VIII weapon and armour icons", source: "https://www.gamersdecide.com/articles/albion-online-best-class-builds" } },
};

const buildArtwork: Record<string, Artwork> = {
  "Durable burst mage — Cyclops mid": { image: "https://oneesports.blob.core.windows.net/cdn-data/sites/2/2021/04/Cyclops-2.jpg", alt: "Cyclops hero artwork for the mid-lane build", source: "https://www.oneesports.gg/mobile-legends/cyclops-jungler-nma-season-3/" },
  "Peel-first tank roamer": { image: "https://mobilegame.dailytech.id/img/games/minotaur.webp", alt: "Minotaur tank hero artwork", source: "https://mobilegame.dailytech.id/build-minotaur-tersakit/" },
  "Anti-frontline EXP fighter": { image: "https://media.hitekno.com/thumbs/2023/01/05/56758-hero-mobile-legends-lapu-lapu/730x480-img-56758-hero-mobile-legends-lapu-lapu.jpg", alt: "Lapu-Lapu fighter hero artwork", source: "https://www.hitekno.com/games/2023/02/09/185549/3-fighter-paling-efektif-buat-counter-lapu-lapu-di-exp-lane-mobile-legends-auto-mendominasi" },
  "Balanced AR + DMR": { image: "https://wstatic-prod.pubg.com/web/live/static/game-info/weapons/images/viewer/img-weapons-m416.png", alt: "PUBG M416 assault rifle", source: "https://pubg.com/en/game-info/weapons" },
  "Compound breach kit": { image: "https://wstatic-prod.pubg.com/web/live/static/game-info/weapons/images/viewer/img-weapons-s1897.png", alt: "PUBG S1897 shotgun", source: "https://d3tpthp8lq9ou3.cloudfront.net/ja/game-info/weapons/sg" },
  "Long-range overwatch": { image: "https://wstatic-prod.pubg.com/web/live/static/game-info/weapons/images/viewer/img-weapons-mini14.png", alt: "PUBG Mini-14 designated marksman rifle", source: "https://pubg.com/en/game-info/weapons/dmr" },
  "Compact starter survival base": { image: "https://blockical.com/wp-content/uploads/2025/12/duo-starter-png.png", alt: "Minecraft starter survival base", source: "https://blockical.com/all-builds/" },
  "Nether portal travel hub": { image: "https://blockical.com/wp-content/uploads/2025/12/survival-temple-png-1024x683.png", alt: "Minecraft stone temple portal hub with terraced farms", source: "https://blockical.com/all-builds/" },
  "Coordinated full-buy rifle round": { image: "https://img.redbull.com/images/c_fill%2Cg_auto%2Cw_1200%2Ch_630/f_auto%2Cq_auto/redbullcom/2023/10/12/oczctcxyl53qhauw1yrh/valorant-phantom-vandal", alt: "Valorant Phantom and Vandal rifle comparison", source: "https://www.redbull.com/ca-en/phantom-or-vandal-which-one-to-pick-in-valorant" },
  "Low-economy grouped force": { image: "https://cdn.mos.cms.futurecdn.net/6bXqNkceszqHxfYck3S3Rn.jpg", alt: "Valorant agent character lineup", source: "https://www.pcgamer.com/valorant-how-riot-launched-a-successful-esport-in-a-global-pandemic/" },
  "Layered retake package": { image: "https://prod.assets.earlygamecdn.com/images/valorant-key-art.jpg?transform=Article+Webp", alt: "Valorant agents in a tactical team lineup", source: "https://earlygame.com/gaming/valorant-2-will-the-riot-shooter-ever-get-a-sequel" },
  "Hog cycle control": { image: "https://wallpapers.com/images/hd/hog-rider-clash-royale-card-tlyb8zxk6qlrahgr.png", alt: "Clash Royale Hog Rider card artwork", source: "https://wallpapers.com/png/hog-rider-clash-royale-card-tlyb8zxk6qlrahgr.html" },
  "Beatdown support push": { image: "https://img.redbull.com/images/q_auto%2Cf_auto/redbullcom/2018/08/08/ee0d71b3-e544-4dd2-bbce-4bfff1857b4e/clash-royale", alt: "Clash Royale card and deck artwork", source: "https://www.redbull.com/be-nl/clash-royale-decks-arena-4-5-6" },
  "Bait and punish": { image: "https://i.pinimg.com/736x/4e/71/a1/4e71a1720f181a774892c3e6a9bdea41.jpg", alt: "Clash Royale Goblin Barrel card artwork", source: "https://www.pinterest.com/pin/goblin-barrel--370139663143866617/" },
  "Crop and composter module": { image: "https://staticg.sportskeeda.com/editor/2022/08/6052c-16596048175811.png?w=720", alt: "Minecraft crop farm with a composter and water channel", source: "https://wiki.sportskeeda.com/minecraft/farmland" },
  "Vaporize carry team core": { image: "https://staticg.sportskeeda.com/editor/2022/09/2c1ee-16632412302186-1920.jpg", alt: "Genshin Impact Hu Tao and Hydro support Vaporize team", source: "https://www.sportskeeda.com/esports/5-best-genshin-impact-teams-tablet-analytics-event-day-1" },
  "Hyperbloom reaction core": { image: "https://staticg.sportskeeda.com/editor/2024/11/57ce9-17304552501326-1920.jpg", alt: "Genshin Impact Nahida Hyperbloom team", source: "https://www.sportskeeda.com/esports/best-nahida-hyperbloom-team-comps-stats-rotations-gameplay-guide" },
  "Freeze control team": { image: "https://staticg.sportskeeda.com/editor/2023/06/cc2e8-16856117102121-1920.jpg", alt: "Genshin Impact Ayaka Freeze team setup", source: "https://www.sportskeeda.com/esports/best-teams-genshin-impact-3-7-spiral-abyss" },
  "Battleaxe beginner all-rounder": { image: "https://render.albiononline.com/v1/item/T8_MAIN_AXE.png", alt: "Albion Online Battleaxe item render", source: "https://wiki.albiononline.com/wiki/Battleaxe" },
  "Dual Swords solo PvP": { image: "https://render.albiononline.com/v1/item/T8_2H_DUALSWORD.png", alt: "Albion Online Dual Swords item render", source: "https://wiki.albiononline.com/wiki/Dual_Swords" },
  "Bloodletter roaming assassin": { image: "https://render.albiononline.com/v1/item/T8_MAIN_DAGGER_HELL.png", alt: "Albion Online Bloodletter item render", source: "https://wiki.albiononline.com/wiki/Bloodletter" },
  "Fire Staff solo fame farming": { image: "https://render.albiononline.com/v1/item/T8_MAIN_FIRE.png", alt: "Albion Online Fire Staff item render", source: "https://wiki.albiononline.com/wiki/Fire_Staff" },
  "1H Curse Corrupted Dungeon duelist": { image: "https://render.albiononline.com/v1/item/T8_MAIN_CURSED.png", alt: "Albion Online One-Handed Cursed Staff item render", source: "https://wiki.albiononline.com/wiki/One-Handed_Cursed_Staff" },
  "2v2 Hellgate duo: Dagger Pair + Holy healer": { image: "https://render.albiononline.com/v1/item/T8_2H_DAGGERPAIR.png", alt: "Albion Online Dagger Pair item render", source: "https://albiononline.com/en/news/build-spotlight-gank-or-be-ganked" },
  "Carving Sword small-group PvP": { image: "https://render.albiononline.com/v1/item/T8_2H_CLEAVER.png", alt: "Albion Online Carving Sword item render", source: "https://www.kindpng.com/imgv/hJxhoRb_albion-tier-8-carving-sword-hd-png-download/" },
  "Damnation Staff ZvZ backline support": { image: "https://render.albiononline.com/v1/item/T8_2H_DEMONICSTAFF.png", alt: "Albion Online Damnation Staff item render", source: "https://albiononline.com/news/art-spotlight-magic-staffs" },
};

export default function StrategyLibrary({ game, builds, strategies }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "build" | "strategy">("all");
  const visual = visualByGame[game] || { emoji: "🎮", label: "Game setup", accent: "from-purple-950 to-slate-950", artwork: { image: "", alt: "Game setup artwork", source: "" } };
  const items = useMemo(() => [
    ...builds.map((item) => ({ ...item, type: "build" as const, searchable: [item.name, item.activity, item.difficulty, ...item.gear, ...item.skills, ...item.play, buildArtwork[item.name]?.alt || ""].join(" ") })),
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
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/25 shadow-xl sm:h-28 sm:w-28">{(item.type === "build" ? buildArtwork[item.name] : undefined)?.image || visual.artwork.image ? <Image src={(item.type === "build" ? buildArtwork[item.name] : undefined)?.image || visual.artwork.image} alt={(item.type === "build" ? buildArtwork[item.name] : undefined)?.alt || visual.artwork.alt} fill unoptimized sizes="(max-width: 640px) 96px, 112px" className="object-cover"/> : null}{!((item.type === "build" ? buildArtwork[item.name] : undefined)?.image || visual.artwork.image) && <span className="absolute text-4xl drop-shadow-lg" aria-hidden="true">{visual.emoji}</span>}</div>
            <div className="relative z-10 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200/80">{visual.label} · {item.type === "build" ? "Build" : "Custom tactic"}</p>
              <h3 className="mt-2 text-lg font-extrabold text-white sm:text-xl">{item.name}</h3>
              <p className="mt-1 text-xs text-slate-300">{item.type === "build" ? item.activity : item.scenario}</p>
              <a href={(item.type === "build" ? buildArtwork[item.name] : undefined)?.source || visual.artwork.source} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] text-blue-200/70 underline underline-offset-2">Image source</a>
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
