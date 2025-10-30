import { describe, expect, it } from "vitest";
import { CARDS } from "../src/data/cards";
import { scoreDeck } from "../src/logic/scoring";
import { DEFAULT_OPTIONS, type GenOptions } from "../src/state/options";

const pick = (name: string) => {
  const card = CARDS.find((candidate) => candidate.name === name);
  if (!card) throw new Error(`Missing card ${name}`);
  return card;
};

describe("scoreDeck", () => {
  const baseOptions: GenOptions = {
    ...DEFAULT_OPTIONS,
    includeDefBuilding: false,
    smallSpellCount: 1,
    bigSpellCount: 1,
    winconCount: 1,
    championCap: 1
  };

  it("rewards positive synergy pairs", () => {
    const lavaBalloon = [
      pick("Lava Hound"),
      pick("Balloon"),
      pick("Baby Dragon"),
      pick("Tombstone"),
      pick("Mega Minion"),
      pick("Electro Wizard"),
      pick("The Log"),
      pick("Fireball")
    ];

    const lavaNoBalloon = [
      pick("Lava Hound"),
      pick("Inferno Dragon"),
      pick("Baby Dragon"),
      pick("Tombstone"),
      pick("Mega Minion"),
      pick("Electro Wizard"),
      pick("The Log"),
      pick("Fireball")
    ];

    expect(scoreDeck(lavaBalloon, baseOptions)).toBeGreaterThan(scoreDeck(lavaNoBalloon, baseOptions));
  });

  it("penalizes anti synergy combinations", () => {
    const golemRocket = [
      pick("Golem"),
      pick("Rocket"),
      pick("The Log"),
      pick("Baby Dragon"),
      pick("Mega Minion"),
      pick("Mini P.E.K.K.A"),
      pick("Knight"),
      pick("Electro Wizard")
    ];

    const golemFireball = [
      pick("Golem"),
      pick("Fireball"),
      pick("The Log"),
      pick("Baby Dragon"),
      pick("Mega Minion"),
      pick("Mini P.E.K.K.A"),
      pick("Knight"),
      pick("Electro Wizard")
    ];

    expect(scoreDeck(golemRocket, baseOptions)).toBeLessThan(scoreDeck(golemFireball, baseOptions));
  });
});
