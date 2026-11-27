"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Gamepad2,
  ChevronRight,
  Users,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

type GameGenre = {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  sort_order: number;
  is_primary: boolean;
};

type Game = {
  id: string;
  slug: string;
  name: string;
  platforms: string[];
  platformGroups: string[];
  genres: GameGenre[];
};

type GamesResponse = {
  games?: Game[];
  total?: number;
  error?: string;
};

const platformFilters = ["All", "PC", "Mobile", "Console"] as const;

const genreVisuals: Record<string, { icon: string; description: string }> = {
  moba: { icon: "⚔️", description: "Roles, matchups and team tactics" },
  mmorpg: { icon: "🛡️", description: "Builds, progression and group play" },
  "action-rpg": { icon: "🐉", description: "Combat, gear and character builds" },
  "role-playing-rpg": { icon: "✨", description: "Characters, quests and equipment" },
};

const gameVisuals: Record<string, { mark: string; art: string }> = {
  "mobile-legends": { mark: "MLBB", art: "linear-gradient(135deg,#35175d,#174a78)" },
  "pubg-battlegrounds": { mark: "PUBG", art: "linear-gradient(135deg,#70411e,#292b47)" },
  valorant: { mark: "VALORANT", art: "linear-gradient(135deg,#672638,#252744)" },
  "clash-royale": { mark: "CLASH", art: "linear-gradient(135deg,#174b76,#5b3b91)" },
  minecraft: { mark: "MINECRAFT", art: "linear-gradient(135deg,#285b37,#253f69)" },
  "genshin-impact": { mark: "GENSHIN", art: "linear-gradient(135deg,#315f85,#553b82)" },
  "albion-online": { mark: "ALBION", art: "linear-gradient(135deg,#5b4325,#1c3340)" },
};

const fallbackArt = "linear-gradient(135deg,#25204a,#123b52)";

function getGenreVisual(slug: string) {
  return genreVisuals[slug] ?? {
    icon: "🎮",
    description: "Builds, guides and game strategy",
  };
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [activePlatform, setActivePlatform] = useState<(typeof platformFilters)[number]>("All");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/games", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as GamesResponse;

        if (!response.ok) {
          throw new Error(payload.error ?? "Could not load the game catalogue.");
        }

        setGames(Array.isArray(payload.games) ? payload.games : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadError(
          error instanceof Error ? error.message : "Could not load the game catalogue."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadGames();
    return () => controller.abort();
  }, [reloadKey]);

  const categories = useMemo(() => {
    const linkedGenres = new Map<string, GameGenre>();

    for (const game of games) {
      for (const genre of game.genres ?? []) {
        linkedGenres.set(genre.id, genre);
      }
    }

    return Array.from(linkedGenres.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [games]);

  const filteredGames = useMemo(() => {
    const search = query.trim().toLowerCase();

    return games.filter((game) => {
      const matchesGenre =
        activeGenre === "All" ||
        (game.genres ?? []).some((genre) => genre.id === activeGenre);
      const matchesPlatform =
        activePlatform === "All" ||
        (game.platformGroups ?? []).includes(activePlatform);
      const searchable = [
        game.name,
        ...(game.platforms ?? []),
        ...(game.platformGroups ?? []),
        ...(game.genres ?? []).map((genre) => genre.name),
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);

      return matchesGenre && matchesPlatform && matchesSearch;
    });
  }, [games, query, activeGenre, activePlatform]);

  function browseGames() {
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <div className="container flex h-[72px] items-center justify-between gap-5">
          <a href="#" className="brand">STRATEGY<span> LIBRARY</span></a>
          <nav className="desktop-nav flex items-center gap-7">
            <a className="nav-link" href="#games">Games</a>
            <a className="nav-link" href="#categories">Genres</a>
            <a className="nav-link" href="#guides">Guides</a>
            <a className="nav-link" href="/knowledge">Knowledge Library</a>
            <a className="nav-link" href="/community">Community</a>
          </nav>
          <a href="/community" className="primary-btn hidden sm:inline-flex">Join the community</a>
          <button
            className="rounded-lg border border-purple-900 p-2 md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenu && (
          <nav className="container flex flex-col gap-4 pb-5 md:hidden">
            <a className="nav-link" href="#games" onClick={() => setMobileMenu(false)}>Games</a>
            <a className="nav-link" href="#categories" onClick={() => setMobileMenu(false)}>Genres</a>
            <a className="nav-link" href="#guides" onClick={() => setMobileMenu(false)}>Guides</a>
            <a className="nav-link" href="/knowledge" onClick={() => setMobileMenu(false)}>Knowledge Library</a>
            <a className="nav-link" href="/community" onClick={() => setMobileMenu(false)}>Community</a>
          </nav>
        )}
      </header>

      <section className="hero">
        <div className="container relative z-10">
          <span className="eyebrow"><Gamepad2 size={14} /> The gaming strategy network</span>
          <h1 className="hero-title">LEARN.<br /><span className="gradient-text">STRATEGIZE.</span><br />DOMINATE.</h1>
          <p className="hero-copy">
            Find practical guides, builds and counters for PC, mobile and console games.
            Explore the catalogue and learn from other players.
          </p>
          <div className="search-wrap">
            <Search size={19} className="shrink-0 text-purple-300" />
            <input
              aria-label="Search games"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search games, genres or platforms..."
            />
            <button className="primary-btn" onClick={browseGames}>Explore</button>
          </div>
          <p className="mt-4 text-xs text-slate-500">PC · MOBILE · CONSOLE</p>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Find your battlefield</div>
              <h2 className="section-title">Genres in the catalogue</h2>
              <p className="section-desc">Only genres currently assigned to at least one game appear here.</p>
            </div>
            <button
              className="text-link hidden sm:inline-flex"
              onClick={() => {
                setActiveGenre("All");
                setActivePlatform("All");
                browseGames();
              }}
            >
              View all games <ChevronRight size={15} />
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-400">Loading genres from the database…</p>
          ) : categories.length ? (
            <div className="category-grid">
              {categories.map((category) => {
                const visual = getGenreVisual(category.slug);
                const count = games.filter((game) =>
                  (game.genres ?? []).some((genre) => genre.id === category.id)
                ).length;

                return (
                  <button
                    key={category.id}
                    className={`category-card ${activeGenre === category.id ? "active" : ""}`}
                    onClick={() => {
                      setActiveGenre(activeGenre === category.id ? "All" : category.id);
                      browseGames();
                    }}
                  >
                    <span className="category-icon">{visual.icon}</span>
                    <span className="category-name block">{category.name}</span>
                    <span className="category-count">{count} {count === 1 ? "game" : "games"}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No game genres have been linked yet.</p>
          )}
        </div>
      </section>

      <section id="games" className="section pt-4">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Choose your game</div>
              <h2 className="section-title">Game catalogue</h2>
              <p className="section-desc">Games and filters are loaded from Supabase.</p>
            </div>
            <span className="text-xs text-slate-500">
              {loading ? "Loading…" : `${filteredGames.length} of ${games.length} games`}
            </span>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {platformFilters.map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition ${activePlatform === platform ? "border-blue-400 bg-blue-500/20 text-white" : "border-[#302b48] bg-[#11111f] text-slate-400 hover:border-blue-500"}`}
              >
                {platform === "All" ? "All platforms" : platform}
              </button>
            ))}
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveGenre("All")}
              className={`rounded-full border px-3 py-2 text-xs font-bold transition ${activeGenre === "All" ? "border-purple-400 bg-purple-500/20 text-white" : "border-[#302b48] bg-[#11111f] text-slate-400 hover:border-purple-500"}`}
            >
              All genres
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveGenre(category.id)}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition ${activeGenre === category.id ? "border-purple-400 bg-purple-500/20 text-white" : "border-[#302b48] bg-[#11111f] text-slate-400 hover:border-purple-500"}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loadError ? (
            <div className="empty-state">
              <p>{loadError}</p>
              <button className="primary-btn mt-4" onClick={() => setReloadKey((value) => value + 1)}>
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="empty-state">Loading games from Supabase…</div>
          ) : filteredGames.length ? (
            <div className="game-grid">
              {filteredGames.map((game) => {
                const visual = gameVisuals[game.slug];
                const genreNames = (game.genres ?? []).map((genre) => genre.name);
                const platformNames = game.platformGroups ?? [];

                return (
                  <article className="game-card" key={game.id}>
                    <div className="game-art" style={{ background: visual?.art ?? fallbackArt }}>
                      <span className="game-art-title">
                        {visual?.mark ?? game.name.split(/\s+/).slice(0, 2).join(" ").toUpperCase()}
                      </span>
                    </div>
                    <div className="game-body">
                      <div className="game-meta">
                        <span>{genreNames.length ? genreNames.join(" · ") : "Genre not assigned"}</span>
                        <span>{platformNames.length ? platformNames.join(" · ") : "Platform not classified"}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-extrabold">{game.name}</h3>
                      <p className="game-description">
                        Browse the game catalogue and discover available builds, counters and strategy guides.
                      </p>
                      <Link className="text-link" href={`/games/${game.slug}`}>
                        Explore strategies <ChevronRight className="inline" size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">No games match those filters. Try another genre, platform or search term.</div>
          )}
        </div>
      </section>

      <section id="guides" className="section pt-3">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-kicker">Get better, deliberately</div>
              <h2 className="section-title">Strategy guides</h2>
              <p className="section-desc">Practical principles that apply across genres.</p>
            </div>
          </div>
          <div className="guide-list">
            {[
              { icon: "🧭", title: "How to build a winning game plan", type: "Fundamentals", desc: "Turn a broad goal into a repeatable plan: learn the map, identify win conditions and review mistakes." },
              { icon: "🧩", title: "Understanding counters and matchups", type: "Competitive basics", desc: "Compare strengths, weaknesses and timing windows instead of relying on tier lists alone." },
              { icon: "🛠️", title: "Builds that fit your playstyle", type: "Build theory", desc: "Adapt equipment, weapons, skills and loadouts to the match in front of you." },
              { icon: "📈", title: "Improve through match reviews", type: "Skill improvement", desc: "Track decisions, positioning and resource use to find the mistakes that matter most." },
            ].map((guide) => (
              <article className="guide-item" key={guide.title}>
                <div className="guide-symbol">{guide.icon}</div>
                <div>
                  <div className="text-[.68rem] font-bold uppercase tracking-widest text-blue-300">{guide.type}</div>
                  <h3 className="mt-1 font-extrabold">{guide.title}</h3>
                  <p>{guide.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="section pt-3">
        <div className="container">
          <div className="community flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="section-kicker">Built by players, for players</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Find your squad. Share your game plan.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Join player-created public channels or invite-only rooms to discuss builds, tactics and matchups.
                Community chat is text-only for now.
              </p>
              <a href="/community" className="primary-btn mt-5 inline-flex">Open community</a>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/community" aria-label="Find and join player channels" className="block min-w-[190px] rounded-xl border border-purple-900/70 bg-black/20 p-4 transition hover:border-purple-400 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <Users className="mb-2 text-purple-300" />
                <div className="font-bold">Player channels</div>
                <div className="text-xs text-slate-400">Find and join public rooms</div>
                <div className="mt-3 text-xs font-bold text-purple-300">Browse channels →</div>
              </Link>
              <Link href="/community" aria-label="Open invite-only rooms" className="block min-w-[190px] rounded-xl border border-blue-900/70 bg-black/20 p-4 transition hover:border-blue-400 hover:bg-blue-500/10 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <ShieldCheck className="mb-2 text-blue-300" />
                <div className="font-bold">Invite-only rooms</div>
                <div className="text-xs text-slate-400">Join with a private invite</div>
              </Link>
              <Link href="/community" aria-label="Open community text chat" className="block min-w-[190px] rounded-xl border border-purple-900/70 bg-black/20 p-4 transition hover:border-purple-400 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <BookOpen className="mb-2 text-purple-300" />
                <div className="font-bold">Text chat</div>
                <div className="text-xs text-slate-400">Discuss strategies with players</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="brand text-base">STRATEGY<span> LIBRARY</span></div>
          <p>Gaming strategies for PC, mobile and console.</p>
          <p>Made for every kind of gamer.</p>
        </div>
      </footer>
    </main>
  );
}
