import type { Card } from "../data/cards";
import type { GenOptions } from "../state/options";

export function royaleApiText(deck: Card[]): string {
  return deck.map((card) => card.name).join("; ");
}

export function deckAsList(deck: Card[]): string {
  return deck.map((card) => card.name).join(" • ");
}

export function jsonExport(deck: Card[], options: GenOptions): string {
  return JSON.stringify(
    {
      deck: deck.map((card) => card.name),
      settings: {
        seed: options.seed,
        targetAvg: options.targetAvg,
        winconCount: options.winconCount,
        smallSpellCount: options.smallSpellCount,
        bigSpellCount: options.bigSpellCount,
        includeDefBuilding: options.includeDefBuilding,
        allowExtraWinconBuilding: options.allowExtraWinconBuilding,
        allowChampions: options.allowChampions,
        championCap: options.championCap,
        weights: options.weights,
        biasSliders: options.biasSliders
      }
    },
    null,
    2
  );
}
