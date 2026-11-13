"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Gamepad2, ChevronRight, Users, BookOpen, ShieldCheck, Swords, Menu, X } from "lucide-react";

const categories = [
  { name: "MOBA", icon: "⚔️", count: "Team tactics & builds" },
  { name: "FPS", icon: "🎯", count: "Aim, maps & loadouts" },
  { name: "Battle Royale", icon: "🪂", count: "Survival & rotations" },
  { name: "RPG", icon: "🐉", count: "Classes, quests & gear" },
  { name: "Strategy", icon: "♟️", count: "Decks & decision-making" },
  { name: "Survival", icon: "🔥", count: "Crafting & progression" },
  { name: "Sports", icon: "🏆", count: "Formations & tactics" },
  { name: "Racing", icon: "🏎️", count: "Tuning & driving lines" },
];

const games = [
  { name: "Mobile Legends: Bang Bang", slug: "mobile-legends", genre: "MOBA", platform: "Mobile", description: "Hero builds, lane matchups, counters and team-fight strategy.", mark: "MLBB", art: "linear-gradient(135deg,#35175d,#174a78)" },
  { name: "PUBG: Battlegrounds", slug: "pubg-battlegrounds", genre: "Battle Royale", platform: "PC · Console · Mobile", description: "Drop strategies, rotations, weapon setups and survival guides.", mark: "PUBG", art: "linear-gradient(135deg,#70411e,#292b47)" },
  { name: "Valorant", slug: "valorant", genre: "FPS", platform: "PC · Console", description: "Agent lineups, map control, crosshair and team compositions.", mark: "VALORANT", art: "linear-gradient(135deg,#672638,#252744)" },
  { name: "Clash Royale", slug: "clash-royale", genre: "Strategy", platform: "Mobile", description: "Deck guides, matchup plans, elixir management and card tips.", mark: "CLASH", art: "linear-gradient(135deg,#174b76,#5b3b91)" },
  { name: "Minecraft", slug: "minecraft", genre: "Survival", platform: "PC · Console · Mobile", description: "Building, farms, redstone, survival progression and exploration.", mark: "MINECRAFT", art: "linear-gradient(135deg,#285b37,#253f69)" },
  { name: "Genshin Impact", slug: "genshin-impact", genre: "RPG", platform: "PC · Console · Mobile", description: "Character builds, team synergies, artifacts and exploration.", mark: "GENSHIN", art: "linear-gradient(135deg,#315f85,#553b82)" },
];

const guides = [
  { icon: "🧭", title: "How to build a winning game plan", type: "Fundamentals", desc: "Turn a broad goal into a repeatable plan: learn the map, identify win conditions and review mistakes." },
  { icon: "🧩", title: "Understanding counters and matchups", type: "Competitive basics", desc: "Compare strengths, weaknesses and timing windows instead of relying on tier lists alone." },
  { icon: "🛠️", title: "Builds that fit your playstyle", type: "Build theory", desc: "Learn when to adapt equipment, weapons, skills and loadouts to the match in front of you." },
  { icon: "📈", title: "Improve through match reviews", type: "Skill improvement", desc: "Track decisions, positioning and resource use to find the mistakes that matter most." },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesCategory = activeCategory === "All" || game.genre === activeCategory;
      const matchesQuery = !q || [game.name, game.genre, game.platform, game.description].join(" ").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  function browseGames() {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="container flex h-[72px] items-center justify-between gap-5">
          <a href="#" className="brand">GAME<span>FORGE</span></a>
          <nav className="desktop-nav flex items-center gap-7">
            <a className="nav-link" href="#games">Games</a>
            <a className="nav-link" href="#categories">Categories</a>
            <a className="nav-link" href="#guides">Guides</a>
            <a className="nav-link" href="#community">Community</a>
          </nav>
          <a href="#community" className="primary-btn hidden sm:inline-flex">Join the community</a>
          <button className="rounded-lg border border-purple-900 p-2 md:hidden" aria-label="Toggle navigation" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
        {mobileMenu && <nav className="container flex flex-col gap-4 pb-5 md:hidden">
          <a className="nav-link" href="#games" onClick={() => setMobileMenu(false)}>Games</a>
          <a className="nav-link" href="#categories" onClick={() => setMobileMenu(false)}>Categories</a>
          <a className="nav-link" href="#guides" onClick={() => setMobileMenu(false)}>Guides</a>
          <a className="nav-link" href="#community" onClick={() => setMobileMenu(false)}>Community</a>
        </nav>}
      </header>

      <section className="hero">
        <div className="container relative z-10">
          <span className="eyebrow"><Gamepad2 size={14}/> The gaming strategy network</span>
          <h1 className="hero-title">LEARN.<br/><span className="gradient-text">STRATEGIZE.</span><br/>DOMINATE.</h1>
          <p className="hero-copy">Find smarter strategies, sharper builds and practical guides for the games you love. From mobile battles to PC and console competition.</p>
          <div className="search-wrap">
            <Search size={19} className="shrink-0 text-purple-300"/>
            <input aria-label="Search games" value={query} onChange={(e) => { setQuery(e.target.value); browseGames(); }} placeholder="Search games, genres or platforms..."/>
            <button className="primary-btn" onClick={browseGames}>Explore</button>
          </div>
          <p className="mt-4 text-xs text-slate-500">PC · MOBILE · CONSOLE</p>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="section-kicker">Find your battlefield</div><h2 className="section-title">Explore categories</h2><p className="section-desc">Strategies organized around the way you play.</p></div>
            <button className="text-link hidden sm:inline-flex" onClick={() => { setActiveCategory("All"); browseGames(); }}>View all games <ChevronRight size={15}/></button>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <button key={category.name} className={`category-card ${activeCategory === category.name ? "active" : ""}`} onClick={() => { setActiveCategory(activeCategory === category.name ? "All" : category.name); browseGames(); }}>
                <span className="category-icon">{category.icon}</span><span className="category-name block">{category.name}</span><span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="games" className="section pt-4">
        <div className="container">
          <div className="section-head">
            <div><div className="section-kicker">Choose your game</div><h2 className="section-title">Featured games</h2><p className="section-desc">A starting library. More games can be added as the platform grows.</p></div>
            <span className="text-xs text-slate-500">{filteredGames.length} results</span>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {["All", ...categories.map((c) => c.name)].map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${activeCategory === category ? "border-purple-400 bg-purple-500/20 text-white" : "border-[#302b48] bg-[#11111f] text-slate-400 hover:border-purple-500"}`}>{category}</button>
            ))}
          </div>
          <div className="game-grid">
            {filteredGames.length ? filteredGames.map((game) => (
              <article className="game-card" key={game.name}>
                <div className="game-art" style={{ background: game.art }}><span className="game-art-title">{game.mark}</span></div>
                <div className="game-body">
                  <div className="game-meta"><span>{game.genre}</span><span>{game.platform}</span></div>
                  <h3 className="mt-3 text-lg font-extrabold">{game.name}</h3>
                  <p className="game-description">{game.description}</p>
                  <Link className="text-link" href={`/games/${game.slug}`}>Explore strategies <ChevronRight className="inline" size={15}/></Link>
                </div>
              </article>
            )) : <div className="empty-state">No games match that search. Try another title or category.</div>}
          </div>
        </div>
      </section>

      <section id="guides" className="section pt-3">
        <div className="container">
          <div className="section-head"><div><div className="section-kicker">Get better, deliberately</div><h2 className="section-title">Strategy guides</h2><p className="section-desc">Practical principles that apply across genres.</p></div></div>
          <div className="guide-list">
            {guides.map((guide) => <article className="guide-item" key={guide.title}><div className="guide-symbol">{guide.icon}</div><div><div className="text-[.68rem] font-bold uppercase tracking-widest text-blue-300">{guide.type}</div><h3 className="mt-1 font-extrabold">{guide.title}</h3><p>{guide.desc}</p></div></article>)}
          </div>
        </div>
      </section>

      <section id="community" className="section pt-3">
        <div className="container">
          <div className="community flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="section-kicker">Built by players, for players</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Your strategy could help someone win.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Share a guide, publish a build or explain a matchup. Community submissions will be reviewed before appearing publicly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-purple-900/70 bg-black/20 p-4"><Users className="mb-2 text-purple-300"/><div className="font-bold">Community</div><div className="text-xs text-slate-500">Player knowledge</div></div>
              <div className="rounded-xl border border-blue-900/70 bg-black/20 p-4"><ShieldCheck className="mb-2 text-blue-300"/><div className="font-bold">Moderated</div><div className="text-xs text-slate-500">Quality first</div></div>
              <div className="rounded-xl border border-purple-900/70 bg-black/20 p-4"><BookOpen className="mb-2 text-purple-300"/><div className="font-bold">Guides</div><div className="text-xs text-slate-500">Learn together</div></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="brand text-base">GAME<span>FORGE</span></div>
          <p>© 2026 GAMEFORGE. Learn. Strategize. Dominate.</p>
          <p>Made for every kind of gamer.</p>
        </div>
      </footer>
    </main>
  );
}
