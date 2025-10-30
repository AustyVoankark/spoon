import type { Card, Tag } from "../data/cards";

const TAG_LOOKUP: Record<string, Tag> = {
  swarm: "swarm-answer",
  splash: "splash",
  air: "air",
  reset: "reset"
};

export type CoverageKey = keyof typeof TAG_LOOKUP;

export const COVERAGE_KEYS: CoverageKey[] = ["swarm", "splash", "air", "reset"];

export function hasTag(cards: Card[], tag: Tag): boolean {
  return cards.some((card) => card.tags?.includes(tag));
}

export function coverageMap(cards: Card[]): Record<CoverageKey, boolean> {
  return {
    swarm: hasTag(cards, TAG_LOOKUP.swarm),
    splash: hasTag(cards, TAG_LOOKUP.splash),
    air: hasTag(cards, TAG_LOOKUP.air),
    reset: hasTag(cards, TAG_LOOKUP.reset)
  };
}
