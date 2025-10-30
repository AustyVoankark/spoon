import { describe, expect, it } from "vitest";
import { CARDS } from "../src/data/cards";
import { buildPools, countByRole, requiredCounts } from "../src/logic/constraints";
import { createInitialDeck } from "../src/logic/optimize";
import { hashStringToSeed, rng } from "../src/logic/rng";
import { DEFAULT_OPTIONS, type GenOptions } from "../src/state/options";

const pick = (name: string) => {
  const card = CARDS.find((candidate) => candidate.name === name);
  if (!card) throw new Error(`Missing card ${name}`);
  return card;
};

describe("constraints", () => {
  it("respects building win condition slot", () => {
    const options: GenOptions = {
      ...DEFAULT_OPTIONS,
      includeDefBuilding: true,
      allowExtraWinconBuilding: false,
      winconCount: 1,
      smallSpellCount: 1,
      bigSpellCount: 1
    };

    const deck = [
      pick("Mortar"),
      pick("The Log"),
      pick("Fireball"),
      pick("Musketeer"),
      pick("Knight"),
      pick("Archers"),
      pick("Ice Spirit"),
      pick("Tesla")
    ];

    const counts = requiredCounts(options, deck.slice(0, 3));
    expect(counts.building).toBe(0);
    expect(countByRole(deck, "building")).toBe(1);
  });

  it("builds an initial deterministic deck with required roles", () => {
    const options: GenOptions = {
      ...DEFAULT_OPTIONS,
      seed: "TEST-SEED",
      winconCount: 2,
      smallSpellCount: 1,
      bigSpellCount: 1,
      includeDefBuilding: true,
      allowExtraWinconBuilding: false
    };

    const pools = buildPools(options);
    const deck = createInitialDeck(pools, options, rng(hashStringToSeed(options.seed)));
    expect(deck).not.toBeNull();
    expect(deck).toHaveLength(8);
    expect(countByRole(deck!, "wincon")).toBe(2);
    expect(countByRole(deck!, "spell-small")).toBe(1);
    expect(countByRole(deck!, "spell-big")).toBe(1);
  });
});
