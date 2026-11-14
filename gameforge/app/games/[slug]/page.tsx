import Link from "next/link";
import { ArrowLeft, CheckCircle2, Target, Lightbulb, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";

const gameGuides: Record<string, { name: string; genre: string; intro: string; objective: string; plan: string[]; tips: string[]; mistakes: string[]; rolePriorities?: { role: string; focus: string; avoid: string }[]; buildRules?: string[]; lanePlans?: { role: string; early: string; mid: string; late: string; emblem: string; spell: string; build: string; }[]; matchups?: { lane: string; pick: string; why: string; warning: string; }[]; phases?: { phase: string; priorities: string[] }[]; builds?: { name: string; activity: string; difficulty: string; gear: string[]; skills: string[]; play: string[]; warning: string }[] }> = {
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

    rolePriorities: [
      { role: "Shot-caller", focus: "Choose rotations using zone position, terrain, vehicle access and available information.", avoid: "Changing direction repeatedly without communicating a clear plan." },
      { role: "Scout", focus: "Gather information from safe cover and report enemy positions, compounds and rotation routes.", avoid: "Moving so far ahead that teammates cannot trade or rescue you." },
      { role: "Entry fragger", focus: "Create pressure when the squad has utility and a follow-up angle.", avoid: "Taking a solo push before teammates are in position." },
      { role: "Support", focus: "Carry smokes, cover revives and help teammates reset after fights.", avoid: "Spending all utility early or looting while a teammate needs immediate cover." }
    ],
    phases: [
      { phase: "Drop and loot", priorities: ["Choose a landing spot that matches the flight path and squad risk tolerance.", "Call nearby teams and loot separate buildings without losing teammate distance.", "Secure a weapon, armor, healing and a vehicle before chasing upgrades."] },
      { phase: "Rotation", priorities: ["Move early when the next zone requires a long or exposed crossing.", "Use ridges, hard cover and vehicles to reduce open-ground exposure.", "Avoid driving into a compound before scouting its occupancy."] },
      { phase: "Final circles", priorities: ["Hold cover and playable terrain instead of chasing every knock.", "Save smokes for crossings, revives and blocking enemy sightlines.", "Fight only when the position, numbers or timing gives your squad an advantage."] }
    ],
    buildRules: ["Use a weapon pair that covers your preferred engagement ranges and that you can control reliably.", "Carry enough ammunition and healing without sacrificing all utility space.", "Prioritize smoke grenades for squad play; frag grenades can force enemies out of cover.", "Adjust scopes and attachments to the weapon and range you actually use rather than collecting every attachment."],
    plan: ["Choose a landing area based on the flight path, loot needs and how much early combat you want.", "Loot efficiently: prioritize a reliable weapon pair, ammunition, healing and grenades rather than searching one building too long.", "Move before the zone forces you. Use terrain and cover, and avoid crossing open ground without smoke or a route.", "When firing, identify your exit and nearby third-party threats. Reset after a knock if the position is exposed."],
    tips: ["Use sound cues and the minimap to estimate nearby threats.", "Keep smoke grenades for revives and dangerous crossings.", "Take fights when you have cover, information or a numbers advantage."],
    mistakes: ["Staying in the blue zone for unnecessary loot.", "Driving directly into a crowded compound without scouting.", "Looting a crate for too long after a fight."]
  },
  valorant: {
    name: "Valorant", genre: "FPS",
    intro: "Build consistent rounds through information, utility and coordinated space-taking.",
    objective: "Create a numbers or positioning advantage before committing to a site. A good round is built through information and utility, not aim alone.",

    rolePriorities: [
      { role: "Duelist", focus: "Create first contact with utility and take space with a teammate ready to trade.", avoid: "Entering alone without a flash, smoke or trade partner." },
      { role: "Initiator", focus: "Gather information and use recon or flash utility to help the team clear contested areas.", avoid: "Using every ability before the team is ready to act." },
      { role: "Controller", focus: "Place smokes to isolate angles and support the team's timing; communicate smoke duration.", avoid: "Blocking your own team's sightlines or smoking too early." },
      { role: "Sentinel", focus: "Secure flanks and anchor space with traps or utility while staying ready to rotate.", avoid: "Over-rotating and leaving a free flank route." }
    ],
    phases: [
      { phase: "Buy phase", priorities: ["Check team credits and coordinate a full buy, force or save.", "Agree on a site plan and who has entry, utility and spike duties.", "Use free time to choose a setup rather than standing in spawn."] },
      { phase: "Mid-round", priorities: ["Use gathered information to decide whether to commit or rotate.", "Trade teammates and avoid giving isolated duels.", "Keep track of enemy ultimates and utility already spent."] },
      { phase: "Post-plant / retake", priorities: ["Play crossfires and use utility to delay the defuse.", "Do not peek one by one when you can hold together.", "On retake, clear angles methodically and coordinate the defuse."] }
    ],
    buildRules: ["Buy weapons and shields according to team economy; avoid a lone expensive buy that breaks the next round.", "Prioritize utility that supports the planned execute or defense.", "Use the practice range and short deathmatch sessions to warm up aim, but review positioning and decision-making too.", "Learn common lineups and angles for your selected agents and maps before expanding your agent pool."],
    plan: ["Learn a small map pool deeply: common angles, rotations, timings and safe plant positions.", "On attack, use utility to clear dangerous angles and take space together. Avoid isolated dry peeks.", "On defense, vary your positions and preserve utility for the execute or retake.", "After gaining a numbers advantage, trade together and avoid giving the opponents isolated duels."],
    tips: ["Communicate enemy locations and utility used, not guesses.", "Keep crosshair at likely head height before you see an opponent.", "Review deaths to identify positioning and timing errors."],
    mistakes: ["Repeeking the same angle after being spotted.", "Using all utility before the enemy commits.", "Taking isolated fights when teammates can trade."]
  },
  "clash-royale": {
    name: "Clash Royale", genre: "Strategy",
    intro: "Win more consistently by managing elixir, tracking cards and understanding your deck's win condition.",
    objective: "Create a favorable elixir trade, defend efficiently and convert the surviving troops into pressure with your win condition.",

    phases: [
      { phase: "Single elixir", priorities: ["Start with low-risk cycle plays when your opponent's deck is unknown.", "Identify their win condition and the best counter in your hand.", "Avoid committing your full elixir bar unless you know the defensive answer."] },
      { phase: "Double elixir", priorities: ["Build pushes around surviving defensive troops.", "Track the opponent's counters and pressure when the key answer is out of cycle.", "Keep enough elixir to defend their main win condition."] },
      { phase: "Overtime", priorities: ["Know whether spell cycle, tower pressure or a full push is your best route.", "Do not panic-spend when a small positive trade can protect your lead.", "Use spells only when the tower damage or troop value justifies the cost."] }
    ],
    buildRules: ["Build around one reliable win condition and include answers to air, ground and swarm threats.", "Check average elixir cost; a deck that is too heavy can struggle to defend fast cycle pressure.", "Include a spell package that fits your win condition and common matchups.", "Practice the deck long enough to learn its starting plays, defensive rotations and recovery plan after a bad hand."],
    plan: ["Identify your win condition and the opponent's strongest counter as soon as both are revealed.", "Avoid spending your full elixir bar on offense without knowing how you will defend the counterpush.", "Track key enemy cards after they are played. Pressure when their best answer is out of cycle.", "In double elixir, build pushes around a defended unit instead of stacking expensive cards at the bridge."],
    tips: ["Learn the elixir cost of the opponent's rotation.", "Use cheap cards to defend when they provide a positive trade.", "Adapt your spell value to the opponent's troop placement."],
    mistakes: ["Overcommitting after taking tower damage.", "Ignoring card cycle and repeatedly attacking into the same counter.", "Using spells on low-value targets."]
  },
  minecraft: {
    name: "Minecraft", genre: "Survival",
    intro: "A safe progression route from your first night to a reliable long-term base.",
    objective: "Secure food, shelter and essential tools early, then build renewable resources before taking bigger exploration risks.",

    phases: [
      { phase: "First day", priorities: ["Collect wood, stone and food before nightfall.", "Craft a bed, basic tools, furnace and shield as soon as resources allow.", "Light and secure a compact shelter rather than building an elaborate base immediately."] },
      { phase: "Early progression", priorities: ["Mine safely for iron and prepare armor, a bucket and spare tools.", "Create renewable food and organize storage near your base.", "Mark routes and carry blocks, torches and food before cave exploration."] },
      { phase: "Long-term world", priorities: ["Build farms that solve recurring resource bottlenecks.", "Prepare potions, strong gear and a return route before dangerous dimensions or bosses.", "Back up important builds and store rare items before risky expeditions."] }
    ],
    buildRules: ["Keep a shield, food, torches and blocks on your hotbar for survival exploration.", "Use a water bucket and fall-damage plan when exploring cliffs, ravines or caves.", "Make storage and farms before collecting large amounts of rare materials.", "Carry only what you need on risky trips and leave irreplaceable items at base."],
    plan: ["Collect wood, stone and food immediately; make a bed and light your first shelter before night.", "Find iron and craft a shield, bucket and reliable armor before exploring dangerous caves.", "Create farms and organized storage so food and materials do not become constant bottlenecks.", "Prepare maps, blocks, food and spare equipment before long expeditions."],
    tips: ["Carry a water bucket when exploring high places or caves.", "Light up caves and your base perimeter to reduce hostile mob spawns.", "Store valuable items before attempting a risky exploration."],
    mistakes: ["Mining straight down or digging directly above yourself.", "Exploring without food, light or an escape route.", "Carrying every valuable item on a dangerous trip."]
  },
  "albion-online": {
    name: "Albion Online", genre: "MMORPG",
    intro: "Practical equipment builds for solo PvE, solo PvP and open-world roaming. Every setup lists the gear, skill choices and fight plan.",
    objective: "Choose a build for the activity you are actually doing. In lethal zones, bring a set you can replace, understand your escape options and never assume a popular loadout wins every matchup.",
    builds: [
      {
        name: "Battleaxe beginner all-rounder",
        activity: "Solo open-world PvE · Mists · first PvP fights",
        difficulty: "Beginner · forgiving sustain",
        gear: ["Main hand: Battleaxe", "Off hand: Torch", "Head: Hunter Hood", "Chest: Mercenary Jacket", "Shoes: Soldier Boots", "Cape: Thetford Cape", "Food: Beef Stew", "Potion: Healing Potion", "Mount: Armored Horse"],
        skills: ["Q: Rending Rage", "W: Adrenaline Boost", "E: Blood Bandit", "Passive: Deep Cuts"],
        play: ["Use Adrenaline Boost to close distance or reposition.", "Build pressure with Rending Rage and basic attacks.", "Save Blood Bandit until you have lost health and can hit the enemy or several mobs.", "Use Mercenary Jacket after your weapon heal window rather than activating both heals together."],
        warning: "This is a forgiving starter, not a hard counter to ranged kiting. Do not chase a mobile opponent across the map. The reference gear is T5; start cheaper if you are still learning."
      },
      {
        name: "Dual Swords solo PvP",
        activity: "Open-world solo · Mists · hybrid PvE/PvP",
        difficulty: "Beginner to intermediate · mobile melee",
        gear: ["Main hand: Dual Swords (two-handed)", "Head: Guardian Helmet", "Chest: Mercenary Jacket", "Shoes: Soldier Boots", "Cape: Thetford Cape", "Food: Beef Stew", "Potion: Healing Potion", "Mount: Armored Horse"],
        skills: ["Q: Heroic Strike", "W: Blade Cyclone", "E: Spinning Blades", "Passive: Deep Cuts"],
        play: ["Build Heroic Charges with Heroic Strike before committing.", "Stay close; the build loses pressure when ranged enemies kite you.", "Use Blade Cyclone for damage and repositioning.", "Hold Spinning Blades until the opponent has spent a dash or defensive skill.", "Use Guardian Helmet and Mercenary Jacket as separate defensive windows."],
        warning: "The reference starter set is T5. Dual Swords are versatile but not an automatic win against every weapon. Swap Guardian Helmet for Mercenary Hood when you want more offensive pressure and understand the matchup."
      },
      {
        name: "Bloodletter roaming assassin",
        activity: "Solo open-world PvP · Mists · ganking · gathering escape",
        difficulty: "Intermediate · pick fights and disengage",
        gear: ["Main hand: Bloodletter", "Off hand: Mistcaller", "Head: Mercenary Hood", "Chest: Stalker Jacket", "Shoes: Scholar Sandals", "Cape: Undead Cape", "Food: Beef Stew", "Potion: Healing Potion", "Mount: Armored Horse"],
        skills: ["Q: Deadly Swipe", "W: Dash", "E: Lunging Stabs"],
        play: ["Look for isolated targets, gatherers or players already weakened by mobs.", "Use Dash to engage only when you have a clean angle; keep mobility available if the fight turns.", "Pressure with Deadly Swipe and basic attacks.", "Hold Lunging Stabs for its execute window when the target is below roughly 40% health.", "Disengage if the enemy survives your burst and the matchup turns against you."],
        warning: "This is a pick-and-finish build, not a stand-and-trade bruiser. Do not spend your escape tools just to start a fight. The reference loadout is T6/T6.1."
      },
      {
        name: "Fire Staff solo fame farming",
        activity: "Solo PvE · open-world mobs · solo dungeons",
        difficulty: "Beginner · ranged damage",
        gear: ["Main hand: Fire Staff", "Off hand: Tome of Spells", "Head: Scholar Cowl", "Chest: Cleric Robe", "Shoes: Mercenary Shoes", "Cape: regular Cape (upgrade only if affordable)", "Food: Cabbage Soup", "Potion: Healing Potion"],
        skills: ["Q: Fire Bolt", "W: Flame Blast", "E: Pyroblast", "Passive: Burn"],
        play: ["Keep range and group mobs before spending area damage.", "Use Fire Bolt for repeatable damage and Flame Blast to add burst.", "Use Pyroblast when you have a safe cast window; do not stand still in avoidable attacks.", "Use Scholar Cowl for energy/defense and Cleric Robe's shield when you are pressured.", "Use food and healing between pulls to keep farming downtime low."],
        warning: "This is a PvE farming setup, not a safe solo-PvP build. Fire Staff has limited mobility and can be punished by dives. A group build or open-world PvP build needs different gear and skills."
      },
      {
        name: "1H Curse Corrupted Dungeon duelist",
        activity: "Corrupted Dungeons · solo 1v1",
        difficulty: "Intermediate · damage over time and defensive timing",
        gear: ["Main hand: One-Handed Cursed Staff", "Off hand: Shield", "Head: Cultist Cowl", "Chest: Cleric Robe", "Shoes: Scholar Sandals", "Cape: Undead Cape", "Food: Beef Stew", "Potion: Poison Potion"],
        skills: ["Q: Vile Curse", "W: Desecrate", "E: Death Curse", "Passive: damage or cooldown option suited to your spec"],
        play: ["Keep curse stacks on the opponent while avoiding unnecessary trades.", "Use Desecrate to pressure or interrupt movement when the opponent commits.", "Save Cleric Robe's defensive window for the enemy burst rather than activating it early.", "Apply Death Curse when the opponent is committed and cannot easily reset.", "Use the dungeon layout and mobs to avoid being forced into a bad melee trade."],
        warning: "Corrupted Dungeon builds depend heavily on matchup and skill choice. This is a reference setup; check current weapon abilities and the dungeon's item-power rules before entering."
      },
      {
        name: "2v2 Hellgate duo: Dagger Pair + Holy healer",
        activity: "2v2 Hellgates · coordinated lethal or non-lethal duo",
        difficulty: "Advanced · requires voice or clear timing",
        gear: ["DPS: Dagger Pair, Fiend Cowl, Hellion Jacket, Stalker Shoes, Undead Cape", "Healer: One-Handed Holy Staff + Tome of Spells, Cleric Cowl, Cleric Robe, Royal Shoes, Lymhurst Cape", "DPS food: Beef Stew; healer food: Omelette", "Potions: Poison for DPS; defensive or energy potion for healer"],
        skills: ["DPS: choose a burst Q/W setup; reserve E for a confirmed engage", "Healer: use Holy healing abilities with a defensive option for the enemy's burst", "Both players: agree who calls the engage and who tracks enemy interrupts"],
        play: ["Do not engage until the healer is in position and both players have key cooldowns.", "DPS pressures one target and commits burst after the healer or enemy defensive cooldown is forced.", "Healer stays at safe range, watches interrupts and saves major healing for the enemy's damage window.", "If the enemy uses major defensives, kite and reset instead of wasting the full combo.", "Use the Hellgate shrinking ring to control space and avoid being split."],
        warning: "This is a role template, not a guaranteed top-tier composition. Hellgate balance, IP caps and team matchups matter; practise in non-lethal before risking a lethal set."
      },
      {
        name: "Carving Sword small-group PvP",
        activity: "Small-scale open-world fights · Roads roaming · 3–7 player groups",
        difficulty: "Advanced · engage timing and target selection",
        gear: ["Main hand: Carving Sword", "Off hand: Mistcaller", "Head: Stalker Hood", "Chest: Hellion Jacket", "Shoes: Royal Sandals", "Cape: Thetford Cape", "Food: Beef Stew", "Potion: Resistance Potion"],
        skills: ["Q: Heroic Strike", "W: Interrupt or mobility option for the matchup", "E: Splitting Slash", "Passive: damage option"],
        play: ["Build Heroic Charges before the group's engage where possible.", "Wait for your tank or caller to create a clump; do not dive alone.", "Use E to pressure clustered targets and help your team reach the backline.", "Activate Hellion Jacket when surrounded by enemies and able to sustain from multiple hits.", "Keep enough mobility to leave after the first engage if your team does not secure a knockdown."],
        warning: "Carving Sword is a bruiser/armor-reduction role, not the main ZvZ engage tank. Coordinate with your shotcaller and adapt W and boots to enemy crowd control."
      },
      {
        name: "Damnation Staff ZvZ backline support",
        activity: "Large-scale ZvZ · guild battles · coordinated clump pressure",
        difficulty: "Advanced · follow shotcaller timing",
        gear: ["Main hand: Damnation Staff", "Head: Royal Hood", "Chest: Feyscale Robe", "Shoes: Scholar Sandals", "Cape: Caerleon Cape", "Food: Beef Stew", "Potion: Invisibility Potion"],
        skills: ["Use the staff's armour-reduction area ability on the called clump", "Head: Royal Hood damage amplification when the shotcaller calls the bomb", "Chest: Feyscale Robe for the assigned damage/utility window", "Shoes: Scholar Sandals for energy and repositioning"],
        play: ["Stay behind the frontline and keep a safe distance from enemy engage tanks.", "Wait for the shotcaller's target marker or voice call; do not cast early.", "Drop the staff ability on the clump together with the team's damage cooldowns.", "Reposition immediately after casting and avoid standing in enemy counter-engage.", "Use invisibility to disengage or reset when the fight is lost, not to chase kills."],
        warning: "ZvZ gear is role- and guild-specific. Confirm the guild's exact composition, skill bar and caller instructions before buying; do not substitute this backline setup for a tank or healer role."
      }
    ],
    phases: [
      { phase: "Before leaving town", priorities: ["Check the activity and zone rules; yellow-zone knockdowns and lethal-zone full loot are not the same risk.", "Buy a replacement set and consumables before taking expensive gear out.", "Repair, set skills and confirm your mount and escape plan."] },
      { phase: "During the run", priorities: ["Watch the minimap and nearby nameplates; do not tunnel on mobs or gathering nodes.", "Avoid fighting multiple players alone unless your build is designed to escape.", "Use cooldowns with a purpose and keep at least one mobility or defensive option for disengaging."] },
      { phase: "After a fight", priorities: ["Loot only when the area is safe; nearby players may be waiting.", "Review whether you lost because of matchup, item power, cooldown timing or positioning.", "Replace lost gear with the same affordable set before upgrading."] }
    ],
    buildRules: ["Treat these as reference loadouts, not universal best-in-slot builds. Albion's weapon balance and activity meta change.", "Start around T4.1–T5.0 while learning; move toward T6.1 only when the silver loss is comfortable.", "In lethal full-loot zones, never wear gear you cannot afford to lose repeatedly.", "Choose food and potions for the activity: damage food for pressure, healing for sustain, and defensive potions when the matchup demands them.", "Weapon specialization and item power matter, but a good matchup and correct cooldown use often matter more than blindly upgrading tiers."],
    plan: ["Pick one main weapon and level its specialization instead of spreading fame across many unrelated trees.", "Use the Battleaxe if you want a forgiving first solo set, Dual Swords for straightforward melee pressure, Bloodletter for mobile roaming, or Fire Staff for safer ranged PvE damage.", "Practice your Q/W/E rotation in non-lethal content before risking a set in lethal zones.", "Check market prices before buying and keep a reserve of silver for replacement sets."],
    tips: ["Inspect enemy weapon and armor before committing when possible.", "Use terrain, mobs and exits to control whether a fight can start or end.", "A mount is part of your escape plan; dismount only when you are ready to commit.", "Keep an affordable spare set in the bank so one death does not stop progression."],
    mistakes: ["Taking your most expensive gear into a lethal zone before you understand the matchup.", "Using every defensive and mobility cooldown at the start of a fight.", "Chasing ranged weapons that can kite you indefinitely.", "Copying a group ZvZ build for solo Mists or using a PvE farming build for PvP."]
  },
  "genshin-impact": {
    name: "Genshin Impact", genre: "RPG",
    intro: "Build effective teams by combining roles, reactions, energy needs and investment priorities.",
    objective: "Build a team with a clear damage plan: a main damage source, reaction or buff support, enough energy generation and survivability.",

    rolePriorities: [
      { role: "On-field damage dealer", focus: "Stay on field for the part of the rotation where your kit deals the most damage.", avoid: "Extending field time after buffs or off-field effects have expired." },
      { role: "Off-field damage", focus: "Apply elements and deal damage while allowing the main damage dealer to act.", avoid: "Using skills at timings that disrupt the team's reaction sequence." },
      { role: "Buffer / reaction support", focus: "Apply the right buffs or elemental aura before the main damage window.", avoid: "Building personal damage at the expense of the team's core reaction or buff uptime." },
      { role: "Sustain", focus: "Provide healing, shielding or interruption resistance without breaking the rotation.", avoid: "Over-investing in healing when the team needs more energy or damage support." }
    ],
    phases: [
      { phase: "Team planning", priorities: ["Choose a main damage plan and reactions the team can apply consistently.", "Check elemental application, enemy resistance and whether the team needs healing or shielding.", "Confirm that each character has a useful role rather than overlapping without purpose."] },
      { phase: "Build investment", priorities: ["Level key talents and weapons before chasing perfect artifact substats.", "Use correct artifact main stats and enough Energy Recharge for reliable bursts.", "Invest in supports that improve the whole team's damage or survivability."] },
      { phase: "Combat rotation", priorities: ["Start with setup skills and buffs before the main damage window.", "Keep elemental application and energy generation consistent.", "Adapt to enemy phases and avoid wasting long cooldowns during invulnerability."] }
    ],
    buildRules: ["Prioritize weapon level and the talents that contribute most to each character's role.", "Choose artifact main stats that fit the character; substat optimization comes later.", "Meet practical Energy Recharge needs so the intended rotation is repeatable.", "Do not copy a build without checking the character's team, reaction and field-time role."],
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
            {guide.builds && <div className="mt-10">
              <div className="section-kicker">Equipment builds</div>
              <h2 className="mt-2 text-2xl font-black">Choose your loadout</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Gear is a reference template. Check current market prices and patch changes before buying.</p>
              <div className="mt-4 space-y-4">
                {guide.builds.map((build) => <section key={build.name} className="rounded-2xl border border-purple-900/60 bg-black/20 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-extrabold text-purple-200">{build.name}</h3><span className="rounded-full border border-blue-900/60 px-3 py-1 text-xs text-blue-200">{build.difficulty}</span></div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{build.activity}</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Equipment</p><ul className="mt-2 space-y-1">{build.gear.map((item) => <li key={item} className="text-sm leading-6 text-slate-300">{item}</li>)}</ul></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-blue-300">Skills</p><ul className="mt-2 space-y-1">{build.skills.map((item) => <li key={item} className="text-sm leading-6 text-slate-300">{item}</li>)}</ul></div>
                  </div>
                  <div className="mt-4 border-t border-white/10 pt-4"><p className="text-xs font-bold uppercase tracking-wider text-purple-300">How to play</p><ol className="mt-2 list-decimal space-y-1 pl-5">{build.play.map((item) => <li key={item} className="text-sm leading-6 text-slate-300">{item}</li>)}</ol></div>
                  <p className="mt-4 rounded-lg border border-amber-900/40 bg-amber-950/10 p-3 text-xs leading-5 text-amber-100/80"><strong>Limit:</strong> {build.warning}</p>
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
