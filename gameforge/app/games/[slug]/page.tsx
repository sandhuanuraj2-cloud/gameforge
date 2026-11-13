import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Lightbulb, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";

const gameGuides: Record<string, { name: string; genre: string; intro: string; objective: string; plan: string[]; tips: string[]; mistakes: string[] }> = {
  "mobile-legends": {
    name: "Mobile Legends: Bang Bang", genre: "MOBA",
    intro: "A practical framework for making better decisions before, during and after every match.",
    objective: "Turn lane pressure into map control. Win your lane when possible, but prioritize objectives, safe rotations and team fights that have a clear advantage.",
    plan: ["Before the match, check enemy crowd control, damage types and engage range. Adjust your role and build to the actual draft.", "In lane, protect your health and experience. Trade when your key skill is available, and avoid fighting inside a large enemy minion wave.", "After clearing a wave, look for a useful rotation: help secure an objective, protect your jungler or pressure another lane.", "Before contesting Turtle or Lord, push nearby lanes and check enemy positions. Do not start an objective blindly."],
    tips: ["Track enemy ultimates and battle spells before committing.", "Build defensively when the enemy's fed damage dealer is deciding fights.", "Use bushes and map information; do not cross the map alone without a reason."],
    mistakes: ["Chasing kills while losing towers or objectives.", "Copying a fixed build without checking the enemy team.", "Starting fights when teammates are too far away."]
  },
  "pubg-battlegrounds": {
    name: "PUBG: Battlegrounds", genre: "Battle Royale",
    intro: "A survival-first framework for smarter drops, rotations and fights.",
    objective: "Reach strong late-game positions with enough health, ammunition and utility to choose your fights instead of being forced into them.",
    plan: ["Choose a landing area based on the flight path, loot needs and how much early combat you want.", "Loot efficiently: prioritize a reliable weapon pair, ammunition, healing and grenades rather than searching one building too long.", "Move before the zone forces you. Use terrain and cover, and avoid crossing open ground without smoke or a route.", "When firing, identify your exit and nearby third-party threats. Reset after a knock if the position is exposed."],
    tips: ["Use sound cues and the minimap to estimate nearby threats.", "Keep smoke grenades for revives and dangerous crossings.", "Take fights when you have cover, information or a numbers advantage."],
    mistakes: ["Staying in the blue zone for unnecessary loot.", "Driving directly into a crowded compound without scouting.", "Looting a crate for too long after a fight."]
  },
  valorant: {
    name: "Valorant", genre: "FPS",
    intro: "Build consistent rounds through information, utility and coordinated space-taking.",
    objective: "Create a numbers or positioning advantage before committing to a site. A good round is built through information and utility, not aim alone.",
    plan: ["Learn a small map pool deeply: common angles, rotations, timings and safe plant positions.", "On attack, use utility to clear dangerous angles and take space together. Avoid isolated dry peeks.", "On defense, vary your positions and preserve utility for the execute or retake.", "After gaining a numbers advantage, trade together and avoid giving the opponents isolated duels."],
    tips: ["Communicate enemy locations and utility used, not guesses.", "Keep crosshair at likely head height before you see an opponent.", "Review deaths to identify positioning and timing errors."],
    mistakes: ["Repeeking the same angle after being spotted.", "Using all utility before the enemy commits.", "Taking isolated fights when teammates can trade."]
  },
  "clash-royale": {
    name: "Clash Royale", genre: "Strategy",
    intro: "Win more consistently by managing elixir, tracking cards and understanding your deck's win condition.",
    objective: "Create a favorable elixir trade, defend efficiently and convert the surviving troops into pressure with your win condition.",
    plan: ["Identify your win condition and the opponent's strongest counter as soon as both are revealed.", "Avoid spending your full elixir bar on offense without knowing how you will defend the counterpush.", "Track key enemy cards after they are played. Pressure when their best answer is out of cycle.", "In double elixir, build pushes around a defended unit instead of stacking expensive cards at the bridge."],
    tips: ["Learn the elixir cost of the opponent's rotation.", "Use cheap cards to defend when they provide a positive trade.", "Adapt your spell value to the opponent's troop placement."],
    mistakes: ["Overcommitting after taking tower damage.", "Ignoring card cycle and repeatedly attacking into the same counter.", "Using spells on low-value targets."]
  },
  minecraft: {
    name: "Minecraft", genre: "Survival",
    intro: "A safe progression route from your first night to a reliable long-term base.",
    objective: "Secure food, shelter and essential tools early, then build renewable resources before taking bigger exploration risks.",
    plan: ["Collect wood, stone and food immediately; make a bed and light your first shelter before night.", "Find iron and craft a shield, bucket and reliable armor before exploring dangerous caves.", "Create farms and organized storage so food and materials do not become constant bottlenecks.", "Prepare maps, blocks, food and spare equipment before long expeditions."],
    tips: ["Carry a water bucket when exploring high places or caves.", "Light up caves and your base perimeter to reduce hostile mob spawns.", "Store valuable items before attempting a risky exploration."],
    mistakes: ["Mining straight down or digging directly above yourself.", "Exploring without food, light or an escape route.", "Carrying every valuable item on a dangerous trip."]
  },
  "genshin-impact": {
    name: "Genshin Impact", genre: "RPG",
    intro: "Build effective teams by combining roles, reactions, energy needs and investment priorities.",
    objective: "Build a team with a clear damage plan: a main damage source, reaction or buff support, enough energy generation and survivability.",
    plan: ["Choose a team around a reaction or damage synergy instead of selecting four characters independently.", "Level the most important talents and weapons for your main damage dealer before spreading resources thinly.", "Use artifacts with useful main stats first; optimize substats after the core build works.", "Check energy recharge needs and adjust rotations so key bursts are ready when needed."],
    tips: ["Test rotations against real enemies, not only character-screen stats.", "Prioritize a coherent team over several unrelated high-rarity characters.", "Use defensive support when it prevents interrupted damage rotations."],
    mistakes: ["Farming perfect artifacts before upgrading core talents and weapons.", "Ignoring energy recharge and losing burst uptime.", "Building teams without considering elemental application and enemy resistance."]
  }
};

export default async function GameGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = gameGuides[slug];
  if (!guide) notFound();

  return (
    <main className="site-shell min-h-screen">
      <header className="topbar">
        <div className="container flex h-[72px] items-center justify-between">
          <Link href="/" className="brand">GAME<span>FORGE</span></Link>
          <Link href="/#games" className="text-link"><ArrowLeft size={15} className="inline" /> All games</Link>
        </div>
      </header>
      <section className="hero !py-16">
        <div className="container relative z-10">
          <span className="eyebrow"><Target size={14} /> {guide.genre} strategy guide</span>
          <h1 className="hero-title !text-4xl sm:!text-6xl">{guide.name}</h1>
          <p className="hero-copy">{guide.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <article className="game-card p-6 sm:p-8">
            <div className="section-kicker">Your win condition</div>
            <h2 className="section-title !text-2xl">Play with a purpose</h2>
            <p className="mt-3 leading-7 text-slate-300">{guide.objective}</p>
            <div className="mt-8 section-kicker">Game plan</div>
            <div className="mt-4 space-y-5">
              {guide.plan.map((step, index) => <div key={step} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-500/50 bg-purple-500/15 text-sm font-black text-purple-200">{index + 1}</span><p className="pt-1 leading-7 text-slate-300">{step}</p></div>)}
            </div>
          </article>
          <aside className="space-y-6">
            <div className="game-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Lightbulb className="text-blue-300" size={19}/> Useful habits</h2>
              <ul className="mt-4 space-y-3">{guide.tips.map((tip) => <li key={tip} className="flex gap-2 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-1 shrink-0 text-blue-300" size={16}/>{tip}</li>)}</ul>
            </div>
            <div className="game-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><ShieldAlert className="text-purple-300" size={19}/> Avoid these mistakes</h2>
              <ul className="mt-4 space-y-3">{guide.mistakes.map((mistake) => <li key={mistake} className="flex gap-2 text-sm leading-6 text-slate-300"><span className="text-purple-300">•</span>{mistake}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
      <footer className="footer"><div className="container flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><Link href="/" className="brand text-base">GAME<span>FORGE</span></Link><p>© 2026 GAMEFORGE. Learn. Strategize. Dominate.</p><Link href="/#games" className="text-link">Explore more games <ArrowLeft className="inline rotate-180" size={14}/></Link></div></footer>
    </main>
  );
}
