import { BASE_POOLS, type Card, type Role } from "../data/cards";
import type { GenOptions } from "../state/options";

export type RolePools = Record<Role, Card[]>;

export function cloneDeck<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function countByRole(cards: Card[], role: Role): number {
  return cards.filter((card) => card.role === role).length;
}

export function countChampions(cards: Card[]): number {
  return cards.filter((card) => card.champion).length;
}

export function avgElixir(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.cost, 0) / (cards.length || 1);
}

export function buildPools(options: GenOptions): RolePools {
  const ownedSet = new Set(options.owned);
  const blacklistSet = new Set(options.blacklist);
  const underleveledSet = new Set(options.underleveled);

  const filterPool = (card: Card) => {
    if (blacklistSet.has(card.name)) return false;
    if (!options.allowChampions && card.champion) return false;
    if (options.ownedOnly && options.owned.length > 0 && !ownedSet.has(card.name)) return false;
    if (options.avoidUnderleveled && underleveledSet.has(card.name)) return false;
    return true;
  };

  const pools: RolePools = {
    wincon: BASE_POOLS.wincon.filter(filterPool),
    support: BASE_POOLS.support.filter(filterPool),
    "spell-small": BASE_POOLS["spell-small"].filter(filterPool),
    "spell-big": BASE_POOLS["spell-big"].filter(filterPool),
    building: BASE_POOLS.building.filter(filterPool)
  };

  return pools;
}

export function requiredCounts(options: GenOptions, current: Card[] = []) {
  const wincons = current.filter((card) => card.role === "wincon");
  const buildingWincon = wincons.some((card) => card.type === "building");
  const defensiveBuildings = current.filter((card) => card.role === "building");

  let buildingSlots = options.includeDefBuilding ? 1 : 0;
  if (!options.allowExtraWinconBuilding && buildingWincon) {
    buildingSlots = Math.max(0, buildingSlots - 1);
  }

  return {
    wincon: Math.max(0, options.winconCount - wincons.length),
    small: Math.max(0, options.smallSpellCount - countByRole(current, "spell-small")),
    big: Math.max(0, options.bigSpellCount - countByRole(current, "spell-big")),
    building: Math.max(0, buildingSlots - defensiveBuildings.length)
  } as const;
}

export function buildingSlotAvailable(options: GenOptions, deck: Card[]): boolean {
  const buildingWincon = deck.some((card) => card.role === "wincon" && card.type === "building");
  if (!options.includeDefBuilding) return false;
  if (options.allowExtraWinconBuilding) return true;
  if (!buildingWincon) return true;
  return false;
}
