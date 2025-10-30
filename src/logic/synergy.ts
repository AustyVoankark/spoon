import { CARDS } from "../data/cards";

export type PositiveRule = {
  with: string[];
  weight: number;
};

export const POSITIVE_SYNERGY: Record<string, PositiveRule[]> = {
  "Lava Hound": [
    { with: ["Balloon"], weight: 3 },
    { with: ["Baby Dragon", "Tombstone"], weight: 2 }
  ],
  "Graveyard": [
    { with: ["Poison", "Freeze"], weight: 3 },
    { with: ["Valkyrie", "Knight", "Ice Golem"].filter((name) => CARDS.some((c) => c.name === name)), weight: 2 }
  ],
  "Hog Rider": [
    { with: ["Earthquake", "The Log"], weight: 3 },
    { with: ["Ice Spirit", "Skeletons"], weight: 2 },
    { with: ["Tesla", "Cannon"], weight: 1 }
  ],
  "Royal Giant": [
    { with: ["Fisherman"], weight: 3 },
    { with: ["Mother Witch", "Hunter"], weight: 2 }
  ],
  "Miner": [
    { with: ["Wall Breakers"], weight: 3 },
    { with: ["Poison"], weight: 2 }
  ]
};

export const NEGATIVE_SYNERGY: string[][] = [
  ["Golem", "Rocket"],
  ["Electro Giant", "X-Bow"]
];

export const WINCON_PAIRS: string[][] = [
  ["Miner", "Wall Breakers"],
  ["Royal Giant", "Fisherman"],
  ["Goblin Barrel", "Rocket"],
  ["Mortar", "Miner"]
];
