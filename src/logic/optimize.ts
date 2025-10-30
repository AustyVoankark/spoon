import type { Card, Role } from "../data/cards";
import type { GenOptions } from "../state/options";
import { buildPools, cloneDeck, countChampions, requiredCounts } from "./constraints";
import { scoreDeck } from "./scoring";
import { hashStringToSeed, rng } from "./rng";

export type RandomFn = () => number;

function pickFromPool(pool: Card[], rand: RandomFn, preferEvo: boolean): Card | null {
  const available = pool;
  if (available.length === 0) return null;
  if (!preferEvo) {
    return available[Math.floor(rand() * available.length)];
  }
  const evoCards = available.filter((card) => card.tags?.includes("evo"));
  if (evoCards.length > 0 && rand() < 0.6) {
    return evoCards[Math.floor(rand() * evoCards.length)];
  }
  return available[Math.floor(rand() * available.length)];
}

function takeRole(
  role: Role,
  pools: Record<Role, Card[]>,
  deck: Card[],
  used: Set<string>,
  rand: RandomFn,
  options: GenOptions,
  forced?: Card
): Card | null {
  const pool = forced ? [forced] : pools[role];
  const filtered = pool.filter((card) => !used.has(card.name));
  const championCapReached = countChampions(deck) >= options.championCap;
  const eligible = filtered.filter((card) => !card.champion || !championCapReached);
  if (eligible.length === 0) return null;
  const picked = pickFromPool(eligible, rand, options.preferEvo && role === "support");
  if (!picked) return null;
  used.add(picked.name);
  deck.push(picked);
  return picked;
}

export function createInitialDeck(pools: Record<Role, Card[]>, options: GenOptions, rand: RandomFn): Card[] | null {
  const deck: Card[] = [];
  const used = new Set<string>();

  // Apply specific role locks first
  (Object.entries(options.roleLocks) as [Role, string | undefined][]).forEach(([role, lock]) => {
    if (!lock || lock === "ANY") return;
    const card = pools[role].find((candidate) => candidate.name === lock);
    if (!card || used.has(card.name)) throw new Error(`Locked card ${lock} unavailable for role ${role}`);
    const taken = takeRole(role, pools, deck, used, rand, options, card);
    if (!taken) throw new Error(`Unable to place locked card ${lock}`);
  });

  const reserveAny = (role: Role) => {
    if (options.roleLocks[role] !== "ANY") return false;
    if (role === "building" && !options.includeDefBuilding && !options.allowExtraWinconBuilding) return false;
    return !deck.some((card) => card.role === role);
  };
  const counts = requiredCounts(options, deck);

  const winconNeeded = Math.max(counts.wincon, reserveAny("wincon") ? 1 : counts.wincon);
  for (let i = 0; i < winconNeeded; i += 1) {
    if (!takeRole("wincon", pools, deck, used, rand, options)) return null;
  }

  const smallNeeded = Math.max(counts.small, reserveAny("spell-small") ? 1 : counts.small);
  for (let i = 0; i < smallNeeded; i += 1) {
    if (!takeRole("spell-small", pools, deck, used, rand, options)) return null;
  }

  const bigNeeded = Math.max(counts.big, reserveAny("spell-big") ? 1 : counts.big);
  for (let i = 0; i < bigNeeded; i += 1) {
    if (!takeRole("spell-big", pools, deck, used, rand, options)) return null;
  }

  const buildingNeeded = Math.max(counts.building, reserveAny("building") ? 1 : counts.building);
  for (let i = 0; i < buildingNeeded; i += 1) {
    if (!takeRole("building", pools, deck, used, rand, options)) return null;
  }

  while (deck.length < 8) {
    if (!takeRole("support", pools, deck, used, rand, options)) return null;
  }

  return deck;
}

export function anneal(deck: Card[], pools: Record<Role, Card[]>, options: GenOptions, rand: RandomFn): Card[] {
  let best = cloneDeck(deck);
  let bestScore = scoreDeck(best, options);
  let current = cloneDeck(deck);
  let currentScore = bestScore;

  const steps = 1200;
  for (let i = 0; i < steps; i += 1) {
    const temperature = 1 - i / steps;
    const index = Math.floor(rand() * current.length);
    const currentCard = current[index];
    const rolePool = pools[currentCard.role].filter((candidate) => !current.some((card) => card.name === candidate.name));
    if (rolePool.length === 0) continue;
    const replacement = pickFromPool(rolePool, rand, options.preferEvo && currentCard.role === "support");
    if (!replacement) continue;

    const next = cloneDeck(current);
    next[index] = replacement;
    const nextScore = scoreDeck(next, options);
    const delta = nextScore - currentScore;

    if (delta > 0 || Math.exp(delta / Math.max(0.0001, temperature)) > rand()) {
      current = next;
      currentScore = nextScore;
      if (nextScore > bestScore) {
        best = next;
        bestScore = nextScore;
      }
    }
  }

  return best;
}

export function generateDeck(options: GenOptions): Card[] | null {
  const pools = buildPools(options);
  const mainSeed = hashStringToSeed(options.seed);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const seed = hashStringToSeed(`${options.seed}:${attempt}`) ^ mainSeed;
    const rand = rng(seed);
    try {
      const initial = createInitialDeck(pools, options, rand);
      if (!initial) continue;
      const best = anneal(initial, pools, options, rand);
      if (scoreDeck(best, options) <= -1e8) continue;
      return best;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  return null;
}
