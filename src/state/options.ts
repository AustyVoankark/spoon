import type { Role } from "../data/cards";

export type Weights = {
  avgWeight: number;
  synergyWeight: number;
  coverageWeight: number;
  biasAir: number;
  biasCycle: number;
  biasBeatdown: number;
  biasControl: number;
};

export type BiasSliders = {
  air: number;
  cycle: number;
  control: number;
  beatdown: number;
};

export type RoleLocks = Partial<Record<Role, string | "ANY">>;

export type GenOptions = {
  targetAvg: number;
  allowChampions: boolean;
  championCap: number;
  includeDefBuilding: boolean;
  allowExtraWinconBuilding: boolean;
  smallSpellCount: number;
  bigSpellCount: number;
  winconCount: 1 | 2;
  weights: Weights;
  seed: string;
  ownedOnly: boolean;
  owned: string[];
  blacklist: string[];
  preferEvo: boolean;
  avoidUnderleveled: boolean;
  underleveled: string[];
  biasSliders: BiasSliders;
  roleLocks: RoleLocks;
};

export type PresetKey = "Ladder" | "Classic" | "TwoVTwo" | "DraftAssist";

export const DEFAULT_WEIGHTS: Weights = {
  avgWeight: 1,
  synergyWeight: 1,
  coverageWeight: 1,
  biasAir: 0,
  biasCycle: 0,
  biasBeatdown: 0,
  biasControl: 0
};

export const DEFAULT_OPTIONS: GenOptions = {
  targetAvg: 3.5,
  allowChampions: true,
  championCap: 1,
  includeDefBuilding: true,
  allowExtraWinconBuilding: false,
  smallSpellCount: 1,
  bigSpellCount: 1,
  winconCount: 1,
  weights: { ...DEFAULT_WEIGHTS },
  seed: "CLASH-SEED",
  ownedOnly: false,
  owned: [],
  blacklist: [],
  preferEvo: false,
  avoidUnderleveled: false,
  underleveled: [],
  biasSliders: { air: 0, cycle: 0, control: 0, beatdown: 0 },
  roleLocks: {}
};

export const PRESETS: Record<PresetKey, Partial<GenOptions>> = {
  Ladder: {
    targetAvg: 3.2,
    includeDefBuilding: true,
    allowChampions: true,
    winconCount: 1,
    weights: {
      ...DEFAULT_WEIGHTS,
      avgWeight: 1,
      synergyWeight: 1.05,
      coverageWeight: 1.2,
      biasCycle: 0.1,
      biasControl: 0.1
    }
  },
  Classic: {
    targetAvg: 3.4,
    includeDefBuilding: true,
    allowChampions: true,
    winconCount: 1,
    weights: {
      ...DEFAULT_WEIGHTS,
      avgWeight: 1,
      synergyWeight: 1.1,
      coverageWeight: 1.1
    }
  },
  TwoVTwo: {
    targetAvg: 3.8,
    includeDefBuilding: true,
    allowChampions: true,
    winconCount: 2,
    weights: {
      ...DEFAULT_WEIGHTS,
      avgWeight: 0.8,
      synergyWeight: 1.3,
      coverageWeight: 1.4,
      biasAir: 0.2,
      biasBeatdown: 0.2,
      biasControl: 0.2
    }
  },
  DraftAssist: {
    targetAvg: 3.6,
    includeDefBuilding: false,
    allowChampions: true,
    winconCount: 1,
    weights: {
      ...DEFAULT_WEIGHTS,
      avgWeight: 0.9,
      synergyWeight: 1.2,
      coverageWeight: 1.3,
      biasAir: 0.1,
      biasControl: 0.1
    }
  }
};

export const LOCAL_STORAGE_KEY = "cr_deck_gen_v2";
