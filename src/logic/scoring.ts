import type { Card } from "../data/cards";
import { coverageMap, hasTag } from "./coverage";
import { NEGATIVE_SYNERGY, POSITIVE_SYNERGY, WINCON_PAIRS } from "./synergy";
import { avgElixir, countByRole, countChampions } from "./constraints";
import type { GenOptions } from "../state/options";

const HARD_FAIL = -1e9;

export function scoreDeck(deck: Card[], options: GenOptions): number {
  if (deck.length !== 8) return HARD_FAIL;

  const wincons = deck.filter((card) => card.role === "wincon");
  const buildingWincons = wincons.filter((card) => card.type === "building");
  const defensiveBuildings = deck.filter((card) => card.role === "building");
  const smallSpells = countByRole(deck, "spell-small");
  const bigSpells = countByRole(deck, "spell-big");

  if (countChampions(deck) > options.championCap) return HARD_FAIL;
  if (smallSpells !== options.smallSpellCount) return HARD_FAIL;
  if (bigSpells !== options.bigSpellCount) return HARD_FAIL;
  if (wincons.length !== options.winconCount) return HARD_FAIL;
  if (
    !options.allowExtraWinconBuilding &&
    options.includeDefBuilding &&
    buildingWincons.length > 0 &&
    defensiveBuildings.length > 0
  ) {
    return HARD_FAIL;
  }

  let score = 0;

  // Average elixir proximity
  const avg = avgElixir(deck);
  score -= Math.abs(avg - options.targetAvg) * 10 * options.weights.avgWeight;

  // Coverage requirements
  const coverage = coverageMap(deck);
  const coveragePenalty = 6 * options.weights.coverageWeight;
  (Object.keys(coverage) as Array<keyof typeof coverage>).forEach((key) => {
    if (!coverage[key]) score -= coveragePenalty;
  });

  // Positive synergy rules
  for (const anchor of deck) {
    const rules = POSITIVE_SYNERGY[anchor.name] || [];
    for (const rule of rules) {
      const matches = deck.filter((card) => rule.with.includes(card.name)).length;
      score += matches * 5 * rule.weight * options.weights.synergyWeight;
    }
  }

  // Complementary win condition pairs
  for (const pair of WINCON_PAIRS) {
    if (pair.every((name) => deck.some((card) => card.name === name))) {
      score += 10 * options.weights.synergyWeight;
    }
  }

  // Anti synergy penalties
  for (const pair of NEGATIVE_SYNERGY) {
    if (pair.every((name) => deck.some((card) => card.name === name))) {
      score -= 12 * options.weights.synergyWeight;
    }
  }

  if (options.winconCount === 2 && buildingWincons.length === 2 && !options.allowExtraWinconBuilding) {
    score -= 15;
  }

  // Bias sliders and weight controls
  const airCount = deck.filter((card) => card.tags?.includes("air")).length;
  const cycleCount = deck.filter((card) => card.tags?.includes("cycle")).length;
  const controlCount = deck.filter((card) => card.tags?.includes("control")).length;
  const beatdownCount = deck.filter((card) => card.tags?.includes("beatdown")).length;

  score += airCount * 2 * (options.weights.biasAir + options.biasSliders.air);
  score += cycleCount * 1.5 * (options.weights.biasCycle + options.biasSliders.cycle);
  score += controlCount * 1.5 * (options.weights.biasControl + options.biasSliders.control);
  score += beatdownCount * 1.5 * (options.weights.biasBeatdown + options.biasSliders.beatdown);

  // Prefer Evo cards when requested
  if (options.preferEvo) {
    const evoCount = deck.filter((card) => card.tags?.includes("evo")).length;
    score += evoCount * 2;
  }

  // Ensure at least one swarm answer / splash / reset / air by giving extra bumps when present
  if (hasTag(deck, "swarm-answer")) score += 3;
  if (hasTag(deck, "splash")) score += 3;
  if (hasTag(deck, "reset")) score += 3;
  if (hasTag(deck, "air")) score += 3;

  // Per-card weights
  score += deck.reduce((acc, card) => acc + (card.weight ?? 0), 0);

  return score;
}
