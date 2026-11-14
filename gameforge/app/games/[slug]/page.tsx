import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Lightbulb, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";

const gameGuides: Record<string, { name: string; genre: string; intro: string; objective: string; plan: string[]; tips: string[]; mistakes: string[]; rolePriorities?: { role: string; focus: string; avoid: string }[]; buildRules?: string[]; lanePlans?: { role: string; early: string; mid: string; late: string; emblem: string; spell: string; build: string; }[]; matchups?: { lane: string; pick: string; why: string; warning: string; }[]; phases?: { phase: string; priorities: string[] }[] }> = {
  "mobile-legends": {
    name: "Mobile Legends: Bang Bang", genre: "MOBA",
    intro: "A role-by-role framework for lane control, rotations, objectives and adapting your build to the enemy draft.",
    objective: "Convert safe lane pressure into map control. Protect your farm, rotate with a clear purpose and take Turtle or Lord only when your team has enough information and nearby lane pressure.",
    plan: ["Draft with a balanced team in mind: reliable frontline, damage, crowd control and a way to secure objectives. Identify the enemy's main damage source and strongest engage threat.", "In lane, manage the minion wave before trading or rotating. Fight around your important skill cooldowns, protect your health and avoid extended trades when the enemy wave is larger.", "After clearing your wave, rotate only when there is a useful target: help your jungler, contest river vision, defend a teammate or pressure a side lane. Return before losing unnecessary farm or tower health.", "Before Turtle or Lord, push nearby lanes, check bushes and track the enemy jungler. Start only when your team can contest safely; otherwise trade for a tower, farm or vision on the opposite side."],
    rolePriorities: [
      { role: "EXP Lane", focus: "Clear the wave, trade around cooldowns and rotate to Turtle when your wave is handled. Track the enemy jungler before extending.", avoid: "Chasing a kill while your wave crashes into your turret or joining a fight too late." },
      { role: "Jungle", focus: "Choose a route based on lane priority, secure buffs efficiently and keep Retribution available for neutral objectives. Gank lanes with setup or an enemy pushed forward.", avoid: "Fighting constantly instead of farming, or starting Turtle/Lord without checking enemy positions and lane priority." },
      { role: "Mid Lane", focus: "Clear mid quickly, then move with your roamer. Help establish river control and arrive early to side-lane skirmishes.", avoid: "Staying mid after clearing when a safe rotation can create a numbers advantage." },
      { role: "Gold Lane", focus: "Prioritize last hits, safe trades and your first major damage item. Stay behind your frontline in fights and track flank routes.", avoid: "Walking into river or jungle alone to chase a low-health target." },
      { role: "Roam", focus: "Help mid clear, check bushes with teammates, protect the carry or start fights when allies are in range. Adapt between engage and peel.", avoid: "Taking farm from lanes, face-checking alone or engaging when your damage dealers cannot follow." }
    ],
    lanePlans: [
      { role: "EXP Lane", early: "Start by identifying whether the matchup is a short trade, sustain duel or ranged poke lane. Last-hit safely, keep the wave near your side when threatened and use bushes to break enemy vision.", mid: "After clearing, rotate toward Turtle or help your jungler invade only when nearby lanes can move first. If the enemy EXP laner leaves, ping and push the wave or protect the objective.", late: "Use a flank or side-lane pressure when your team can see the enemy backline. In 5v5 fights, either dive the enemy damage dealer or peel for your own carry—do not split your focus.", emblem: "Custom Fighter: Thrill or Firmness (Tier 1), Festival of Blood or Tenacity (Tier 2), Brave Smite or War Cry (Core). Pick sustain talents for extended trades; choose durability when being burst down.", spell: "Vengeance for extended brawls; Flicker for engage, escape or repositioning. Use Purify only when the enemy has dangerous removable crowd control.", build: "Start with lane-appropriate boots. Add a damage/sustain core that matches the hero, then defensive slots against the enemy's fed damage type. Consider Dominance Ice against strong healing and attack-speed threats; Antique Cuirass against repeated physical skill damage; Athena's Shield against burst magic.", },
      { role: "Jungle", early: "Use Retribution and a clear route that reaches a lane with gank setup. Avoid contesting an early buff or river fight when your lanes cannot rotate.", mid: "Convert successful ganks into Turtle, enemy camps or a turret. Track the enemy jungler and save Retribution for objective secure rather than wasting it before a contest.", late: "Stay alive for Lord fights. Do not show on a distant lane just before Lord spawns; approach with your team, control the entrance and time Retribution with burst damage.", emblem: "Assassin emblem: Rupture or Thrill (Tier 1), Seasoned Hunter (Tier 2), Killing Spree for snowball assassins or Lethal Ignition for burst. Tank/Fighter junglers can use their matching emblem with Seasoned Hunter.", spell: "Retribution is mandatory for the jungler role. Select the blessing/upgrade that fits the hero and team plan.", build: "Use jungle boots/roaming jungle equipment as required by the current game rules, then build the hero's damage or durability core. Add Malefic Roar for physical armor penetration, Divine Glaive for magic resistance penetration, and defensive items when dying before using your skills.", },
      { role: "Mid Lane", early: "Clear the first waves without spending every skill unnecessarily. Watch both side lanes and move with your roamer when the wave is cleared.", mid: "Use your range, crowd control or burst to control river entrances before Turtle. Rotate to the lane where your team has crowd control or a numbers advantage.", late: "Play around your skill range and cooldowns. Zone entrances before an objective and avoid stepping ahead of your frontline to land one extra poke.", emblem: "Mage emblem: Rupture or Inspire (Tier 1), Bargain Hunter or Pull Yourself Together (Tier 2), Impure Rage for frequent skill poke or Lethal Ignition for burst.", spell: "Flicker is a flexible default for repositioning. Purify can be valuable against reliable crowd control; choose a defensive spell if the enemy has a direct dive threat.", build: "Build magic penetration and cooldown/mana support around the mage's kit. Divine Glaive is a situational penetration slot against magic defense; Necklace of Durance is for meaningful enemy healing, not an automatic purchase.", },
      { role: "Gold Lane", early: "Prioritize safe last hits and avoid losing half your health for a small trade. Keep track of the enemy roamer and jungler before using your escape skill aggressively.", mid: "Take nearby farm safely and rotate to fights only when your wave is handled or an objective is decisive. Stay near a teammate when the enemy has assassins.", late: "Your survival is a win condition. Attack the closest safe target, keep distance from flank angles and do not cross the frontline to chase a low-health enemy.", emblem: "Marksman emblem: Swift or Fatal (Tier 1), Weapon Master (Tier 2), Quantum Charge for kiting/sustain or Weakness Finder for attack-speed control.", spell: "Inspire for attack-speed heroes who can safely commit; Purify against heavy control; Flicker when extra repositioning is needed. Match the spell to the hero and enemy draft.", build: "Complete the hero's main damage pattern first (crit, attack speed, on-hit or skill burst). Add Wind of Nature against physical burst when its active can save you; Sea Halberd against healing; Malefic Roar against armor. Do not buy every situational item in one build.", },
      { role: "Roam", early: "Help mid clear, then establish safe vision around river and entrances. Choose whether your job is to engage, counter-engage or protect a carry.", mid: "Move with the teammate who can convert your setup into a kill or objective. Check bushes with backup and use pings to coordinate your next move.", late: "Hold key crowd control for the enemy diver or the moment your team can follow. If your carry is being targeted, peel instead of chasing the enemy backline.", emblem: "Tank emblem: Firmness or Vitality (Tier 1), Tenacity or Wilderness Blessing (Tier 2), Concussive Blast for personal durability/damage or Focusing Mark for team damage. Support emblem with Agility and Focusing Mark suits utility supports.", spell: "Flicker for surprise engage or escape; Vengeance for heroes who must absorb damage; Revitalize when the hero and team composition benefit from a stationary heal zone.", build: "Buy the roam blessing that fits your team and hero. Prioritize boots and defensive items against the enemy's main damage source. Dominance Ice can reduce healing/attack speed; Athena's Shield helps against magic burst; Radiant Armor suits repeated magic damage. Adjust after checking who is fed.", }
    ],
    matchups: [
      { lane: "EXP", pick: "Dyrroth into armor-reliant frontliners; Minsitthar into dash-heavy opponents; X.Borg into teams that must walk into his sustained area damage.", why: "Dyrroth can reduce defenses, Minsitthar punishes movement skills, and X.Borg can pressure short-range fighters while managing space.", warning: "These are draft answers, not guaranteed lane wins. Respect range, cooldowns and jungle pressure; verify current hero balance after patches." },
      { lane: "Jungle", pick: "Saber to threaten isolated, fragile carries; Akai or Fredrinn when your draft needs disruption and a sturdier frontline.", why: "Saber offers targeted pickoff threat; durable/disruptive junglers can contest space and protect objective setups.", warning: "Saber struggles if the enemy groups and peels well. Tank junglers still need lane priority and Retribution timing." },
      { lane: "Mid", pick: "Valir against short-range divers and melee engage; burst/control mages when the enemy backline has limited mobility.", why: "Valir's knockback and zone control make direct approaches harder and can interrupt predictable engages.", warning: "Long-range poke and flank access can still punish Valir. Draft around range and team follow-up." },
      { lane: "Gold", pick: "Karrie when the enemy draft has multiple high-HP frontliners; Clint when you can punish shorter-range lanes with safe poke.", why: "Karrie's true-damage pattern is useful into durable targets; Clint can control space through range and burst trades.", warning: "Protect your positioning. A favorable lane matchup does not make a marksman safe from coordinated dives." },
      { lane: "Roam", pick: "Diggie against heavy, predictable crowd-control engage; Lolita against projectile-heavy drafts; Khufra against teams that rely on dashes.", why: "These picks can disrupt the enemy's primary engage or mobility pattern and create safer fights for your carries.", warning: "Read the actual enemy lineup. A counterpick is weaker if the opponent can change their engage angle or bait your key skill." }
    ],
    phases: [
      { phase: "Early game", priorities: ["Clear your own wave/camp before rotating unless an immediate fight is clearly favorable.", "Track the enemy jungler and avoid isolated river checks.", "Use the first Turtle setup to contest with lane priority, not just because the timer is close."] },
      { phase: "Mid game", priorities: ["Group around the teammate with the strongest current power spike.", "Convert kills into towers, Turtle/Lord, or enemy jungle control.", "Stop taking low-value fights while important waves are moving toward your base."] },
      { phase: "Late game", priorities: ["Do not die alone while Lord is available or both teams are grouped.", "Keep the jungler alive for Retribution and protect the main damage dealer.", "Push lanes before starting Lord; if the enemy is missing, assume the objective entrance is dangerous."] }
    ],
    buildRules: ["Build for the enemy who is actually threatening you, not the hero with the highest kill count alone.", "Anti-heal is valuable against meaningful healing, but buying it too early can delay your own power spike; coordinate so the team does not waste multiple slots.", "Physical defense examples: Antique Cuirass for repeated physical skill damage, Blade Armor against basic-attack-heavy threats, and Dominance Ice when attack speed or healing is a problem.", "Magic defense examples: Athena's Shield against burst magic, Radiant Armor against repeated magic damage. Check the enemy's damage pattern before choosing.", "Penetration examples: Malefic Roar for physical damage into armor and Divine Glaive for magic damage into magic defense.", "Treat item order as match-dependent. Start from a reliable hero build, then change one or two slots in response to the scoreboard and enemy purchases."],
    tips: ["Check the minimap frequently and count enemies who are not visible.", "Track key enemy ultimates and battle spells before committing to a fight.", "Use bushes for information and ambushes, but do not face-check alone.", "If your team is behind, defend waves and trade objectives instead of forcing a fair fight."],
    mistakes: ["Chasing kills while losing towers, Turtle or Lord control.", "Rotating before clearing a wave and giving up free farm.", "Copying a fixed build without checking enemy damage and sustain.", "Starting an objective while teammates are too far away or the enemy jungler is missing."]
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
            {guide.rolePriorities && <div className="mt-8">
              <div className="section-kicker">Role-by-role priorities</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {guide.rolePriorities.map((item) => <div key={item.role} className="rounded-xl border border-purple-900/60 bg-black/20 p-4">
                  <h3 className="font-extrabold text-purple-200">{item.role}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.focus}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500"><span className="font-bold text-slate-400">Avoid:</span> {item.avoid}</p>
                </div>)}
              </div>
            </div>}
            {guide.lanePlans && <div className="mt-10">
              <div className="section-kicker">Five-lane playbook</div>
              <h2 className="mt-2 text-2xl font-black">What to do in your role</h2>
              <div className="mt-4 space-y-4">
                {guide.lanePlans.map((item) => <section key={item.role} className="rounded-2xl border border-purple-900/60 bg-black/20 p-4 sm:p-5">
                  <h3 className="text-lg font-extrabold text-purple-200">{item.role}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Early</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.early}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Mid</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.mid}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Late</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.late}</p></div>
                  </div>
                  <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-purple-300">Emblem</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.emblem}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-purple-300">Battle spell</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.spell}</p></div>
                    <div className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-purple-300">Build direction</p><p className="mt-1 text-sm leading-6 text-slate-300">{item.build}</p></div>
                  </div>
                </section>)}
              </div>
            </div>}
            {guide.matchups && <div className="mt-10">
              <div className="section-kicker">Draft and counter picks</div>
              <h2 className="mt-2 text-2xl font-black">Pick with a reason</h2>
              <div className="mt-4 space-y-3">
                {guide.matchups.map((item) => <section key={item.lane} className="rounded-xl border border-blue-900/50 bg-blue-950/15 p-4">
                  <h3 className="font-extrabold text-blue-200">{item.lane} lane</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.pick}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.why}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500"><strong className="text-slate-400">Limit:</strong> {item.warning}</p>
                </section>)}
              </div>
            </div>}
            {guide.phases && <div className="mt-10">
              <div className="section-kicker">Macro checklist</div>
              <h2 className="mt-2 text-2xl font-black">Win through every phase</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {guide.phases.map((item) => <section key={item.phase} className="rounded-xl border border-purple-900/60 bg-black/20 p-4">
                  <h3 className="font-extrabold text-purple-200">{item.phase}</h3>
                  <ul className="mt-3 space-y-2">{item.priorities.map((priority) => <li key={priority} className="flex gap-2 text-sm leading-6 text-slate-300"><span className="text-blue-300">•</span>{priority}</li>)}</ul>
                </section>)}
              </div>
            </div>}
            {guide.buildRules && <div className="mt-8">
              <div className="section-kicker">Adaptive build checklist</div>
              <ul className="mt-4 space-y-3">{guide.buildRules.map((rule) => <li key={rule} className="flex gap-2 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-1 shrink-0 text-blue-300" size={16}/>{rule}</li>)}</ul>
            </div>}
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
