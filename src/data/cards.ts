export type Role = "wincon" | "support" | "spell-small" | "spell-big" | "building";
export type Kind = "troop" | "spell" | "building";
export type Tag =
  | "splash"
  | "air"
  | "swarm-answer"
  | "reset"
  | "anti-building"
  | "cheap-tank"
  | "cycle"
  | "control"
  | "beatdown"
  | "evo";

export type Card = {
  name: string;
  cost: number;
  role: Role;
  type: Kind;
  champion?: boolean;
  tags?: Tag[];
  weight?: number;
};

export const CARDS: Card[] = [
  // Win conditions
  { name: "Hog Rider", cost: 4, role: "wincon", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Royal Giant", cost: 6, role: "wincon", type: "troop", tags: ["control"], weight: 1 },
  { name: "Giant", cost: 5, role: "wincon", type: "troop", tags: ["beatdown", "cheap-tank"], weight: 1 },
  { name: "Golem", cost: 8, role: "wincon", type: "troop", tags: ["beatdown"], weight: 1 },
  { name: "Balloon", cost: 5, role: "wincon", type: "troop", tags: ["air"], weight: 1 },
  { name: "Graveyard", cost: 5, role: "wincon", type: "spell", tags: ["control"], weight: 1 },
  { name: "X-Bow", cost: 6, role: "wincon", type: "building", tags: ["control"], weight: 1 },
  { name: "Mortar", cost: 4, role: "wincon", type: "building", tags: ["cycle"], weight: 1 },
  { name: "Goblin Drill", cost: 4, role: "wincon", type: "building", tags: ["cycle"], weight: 1 },
  { name: "Ram Rider", cost: 5, role: "wincon", type: "troop", tags: ["control"], weight: 1 },
  { name: "Battle Ram", cost: 4, role: "wincon", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Royal Hogs", cost: 5, role: "wincon", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Goblin Barrel", cost: 3, role: "wincon", type: "spell", tags: ["cycle"], weight: 1 },
  { name: "Miner", cost: 3, role: "wincon", type: "troop", tags: ["cycle", "control"], weight: 1 },
  { name: "Wall Breakers", cost: 2, role: "wincon", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Electro Giant", cost: 8, role: "wincon", type: "troop", tags: ["beatdown"], weight: 1 },
  { name: "Lava Hound", cost: 7, role: "wincon", type: "troop", tags: ["air", "beatdown"], weight: 1 },
  { name: "Elixir Golem", cost: 3, role: "wincon", type: "troop", tags: ["beatdown"], weight: 1 },

  // Support troops
  { name: "Musketeer", cost: 4, role: "support", type: "troop", tags: ["air"], weight: 1 },
  { name: "Baby Dragon", cost: 4, role: "support", type: "troop", tags: ["splash", "air"], weight: 1 },
  { name: "Electro Wizard", cost: 4, role: "support", type: "troop", tags: ["reset", "air"], weight: 1 },
  { name: "Wizard", cost: 5, role: "support", type: "troop", tags: ["splash"], weight: 1 },
  { name: "Night Witch", cost: 4, role: "support", type: "troop", tags: ["splash", "air"], weight: 1 },
  { name: "Ice Wizard", cost: 3, role: "support", type: "troop", tags: ["control", "air"], weight: 1 },
  { name: "Mega Minion", cost: 3, role: "support", type: "troop", tags: ["air"], weight: 1 },
  { name: "Hunter", cost: 4, role: "support", type: "troop", tags: ["air"], weight: 1 },
  { name: "Magic Archer", cost: 4, role: "support", type: "troop", tags: ["control"], weight: 1 },
  { name: "Mother Witch", cost: 4, role: "support", type: "troop", tags: ["splash"], weight: 1 },
  { name: "Phoenix", cost: 4, role: "support", type: "troop", tags: ["air", "evo"], weight: 1 },
  { name: "Cannon Cart", cost: 5, role: "support", type: "troop", tags: ["control"], weight: 1 },
  { name: "Dart Goblin", cost: 3, role: "support", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Flying Machine", cost: 4, role: "support", type: "troop", tags: ["air"], weight: 1 },
  { name: "Mini P.E.K.K.A", cost: 4, role: "support", type: "troop", tags: ["anti-building"], weight: 1 },
  { name: "Dark Prince", cost: 4, role: "support", type: "troop", tags: ["splash"], weight: 1 },
  { name: "Prince", cost: 5, role: "support", type: "troop", tags: ["control"], weight: 1 },
  { name: "Valkyrie", cost: 4, role: "support", type: "troop", tags: ["splash", "cheap-tank"], weight: 1 },
  { name: "Bandit", cost: 3, role: "support", type: "troop", tags: ["control"], weight: 1 },
  { name: "Lumberjack", cost: 4, role: "support", type: "troop", tags: ["beatdown"], weight: 1 },
  { name: "Bowler", cost: 5, role: "support", type: "troop", tags: ["splash"], weight: 1 },
  { name: "Electro Dragon", cost: 5, role: "support", type: "troop", tags: ["reset", "air", "evo"], weight: 1 },
  { name: "Inferno Dragon", cost: 4, role: "support", type: "troop", tags: ["reset", "air"], weight: 1 },
  { name: "Archers", cost: 3, role: "support", type: "troop", tags: ["air"], weight: 1 },
  { name: "Bats", cost: 2, role: "support", type: "troop", tags: ["air", "swarm-answer"], weight: 1 },
  { name: "Skeletons", cost: 1, role: "support", type: "troop", tags: ["cycle"], weight: 1 },
  { name: "Ice Spirit", cost: 1, role: "support", type: "troop", tags: ["cycle", "reset"], weight: 1 },
  { name: "Fire Spirit", cost: 1, role: "support", type: "troop", tags: ["cycle", "swarm-answer"], weight: 1 },
  { name: "Goblin Gang", cost: 3, role: "support", type: "troop", tags: ["swarm-answer"], weight: 1 },
  { name: "Skeleton Army", cost: 3, role: "support", type: "troop", tags: ["swarm-answer"], weight: 1 },
  { name: "Fisherman", cost: 3, role: "support", type: "troop", tags: ["control"], weight: 1 },
  { name: "Knight", cost: 3, role: "support", type: "troop", tags: ["cheap-tank"], weight: 1 },
  { name: "Ice Golem", cost: 2, role: "support", type: "troop", tags: ["cheap-tank", "cycle"], weight: 1 },

  // Champions
  { name: "Archer Queen", cost: 5, role: "support", type: "troop", champion: true, tags: ["air"], weight: 1 },
  { name: "Golden Knight", cost: 4, role: "support", type: "troop", champion: true, tags: ["control"], weight: 1 },
  { name: "Skeleton King", cost: 4, role: "support", type: "troop", champion: true, tags: ["swarm-answer"], weight: 1 },
  { name: "Mighty Miner", cost: 4, role: "support", type: "troop", champion: true, tags: ["control"], weight: 1 },
  { name: "Monk", cost: 5, role: "support", type: "troop", champion: true, tags: ["control"], weight: 1 },

  // Small spells
  { name: "The Log", cost: 2, role: "spell-small", type: "spell", tags: ["swarm-answer"], weight: 1 },
  { name: "Zap", cost: 2, role: "spell-small", type: "spell", tags: ["reset", "swarm-answer"], weight: 1 },
  { name: "Barbarian Barrel", cost: 2, role: "spell-small", type: "spell", tags: ["swarm-answer"], weight: 1 },
  { name: "Snowball", cost: 2, role: "spell-small", type: "spell", tags: ["swarm-answer"], weight: 1 },
  { name: "Arrows", cost: 3, role: "spell-small", type: "spell", tags: ["swarm-answer"], weight: 1 },

  // Big spells
  { name: "Fireball", cost: 4, role: "spell-big", type: "spell", tags: ["splash"], weight: 1 },
  { name: "Poison", cost: 4, role: "spell-big", type: "spell", tags: ["splash", "control"], weight: 1 },
  { name: "Lightning", cost: 6, role: "spell-big", type: "spell", tags: ["reset", "anti-building"], weight: 1 },
  { name: "Rocket", cost: 6, role: "spell-big", type: "spell", tags: ["anti-building"], weight: 1 },
  { name: "Freeze", cost: 4, role: "spell-big", type: "spell", tags: ["control"], weight: 1 },
  { name: "Earthquake", cost: 3, role: "spell-big", type: "spell", tags: ["anti-building"], weight: 1 },
  { name: "Tornado", cost: 3, role: "spell-big", type: "spell", tags: ["control"], weight: 1 },

  // Buildings
  { name: "Cannon", cost: 3, role: "building", type: "building", tags: ["anti-building"], weight: 1 },
  { name: "Tesla", cost: 4, role: "building", type: "building", tags: ["air", "evo"], weight: 1 },
  { name: "Inferno Tower", cost: 5, role: "building", type: "building", tags: ["reset"], weight: 1 },
  { name: "Bomb Tower", cost: 4, role: "building", type: "building", tags: ["splash"], weight: 1 },
  { name: "Goblin Cage", cost: 4, role: "building", type: "building", tags: ["control"], weight: 1 },
  { name: "Tombstone", cost: 3, role: "building", type: "building", tags: ["control", "swarm-answer"], weight: 1 },
  { name: "Furnace", cost: 4, role: "building", type: "building", tags: ["control", "evo"], weight: 1 },
  { name: "Goblin Hut", cost: 5, role: "building", type: "building", tags: ["control"], weight: 1 },
  { name: "Barbarian Hut", cost: 7, role: "building", type: "building", tags: ["control"], weight: 1 }
];

export const BASE_POOLS: Record<Role, Card[]> = {
  wincon: CARDS.filter((c) => c.role === "wincon"),
  support: CARDS.filter((c) => c.role === "support"),
  "spell-small": CARDS.filter((c) => c.role === "spell-small"),
  "spell-big": CARDS.filter((c) => c.role === "spell-big"),
  building: CARDS.filter((c) => c.role === "building")
};
