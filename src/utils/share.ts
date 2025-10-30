import type { Card } from "../data/cards";
import type { GenOptions } from "../state/options";

const SHARE_KEYS: Array<keyof GenOptions> = [
  "seed",
  "targetAvg",
  "winconCount",
  "smallSpellCount",
  "bigSpellCount",
  "includeDefBuilding",
  "allowExtraWinconBuilding",
  "allowChampions",
  "championCap"
];

export type ShareState = {
  deck: string[] | null;
  options: Partial<GenOptions>;
};

export function buildShareUrl(deck: Card[], options: GenOptions, locationRef: Location = window.location): string {
  const params = new URLSearchParams();
  if (deck.length === 8) {
    params.set("deck", deck.map((card) => encodeURIComponent(card.name)).join(","));
  }
  SHARE_KEYS.forEach((key) => {
    const value = options[key];
    if (typeof value === "boolean") {
      params.set(key, value ? "1" : "0");
    } else {
      params.set(key, String(value));
    }
  });
  return `${locationRef.origin}${locationRef.pathname}?${params.toString()}`;
}

export function parseShare(search: string): ShareState {
  const params = new URLSearchParams(search);
  const deckParam = params.get("deck");
  const deck = deckParam
    ? deckParam.split(",").map((name) => decodeURIComponent(name)).filter(Boolean)
    : null;

  const options: Partial<GenOptions> = {};
  SHARE_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value === null) return;
    if (typeof (DEFAULT_CASTERS as any)[key] === "function") {
      (options as any)[key] = (DEFAULT_CASTERS as any)[key](value);
    }
  });

  return { deck, options };
}

const DEFAULT_CASTERS: Partial<Record<keyof GenOptions, (value: string) => any>> = {
  seed: (value) => value,
  targetAvg: (value) => parseFloat(value),
  winconCount: (value) => (value === "2" ? 2 : 1),
  smallSpellCount: (value) => parseInt(value, 10),
  bigSpellCount: (value) => parseInt(value, 10),
  includeDefBuilding: (value) => value === "1",
  allowExtraWinconBuilding: (value) => value === "1",
  allowChampions: (value) => value === "1",
  championCap: (value) => parseInt(value, 10)
};
