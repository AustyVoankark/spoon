import { useEffect, useMemo, useRef, useState } from "react";
import { CARDS, type Card } from "../data/cards";
import { generateDeck } from "../logic/optimize";
import { avgElixir } from "../logic/constraints";
import { deckAsList } from "../utils/format";
import { buildShareUrl, parseShare } from "../utils/share";
import {
  DEFAULT_OPTIONS,
  LOCAL_STORAGE_KEY,
  PRESETS,
  type GenOptions,
  type PresetKey
} from "./options";

function resolveInitialOptions(): GenOptions {
  if (typeof window === "undefined") return { ...DEFAULT_OPTIONS };
  const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  let base: GenOptions = { ...DEFAULT_OPTIONS, weights: { ...DEFAULT_OPTIONS.weights } };
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as GenOptions;
      base = { ...base, ...parsed, weights: { ...base.weights, ...parsed.weights } };
    } catch (error) {
      console.warn("Failed to parse saved options", error);
    }
  }
  const shared = parseShare(window.location.search);
  base = { ...base, ...shared.options, weights: { ...base.weights } };
  return base;
}

function resolveInitialDeck(): Card[] {
  if (typeof window === "undefined") return [];
  const shared = parseShare(window.location.search);
  if (!shared.deck) return [];
  const cards = shared.deck
    .map((name) => CARDS.find((card) => card.name === name))
    .filter((card): card is Card => Boolean(card));
  return cards.length === 8 ? cards : [];
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const show = (text: string) => {
    setMessage(text);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setMessage(null), 3000);
  };
  return { message, show };
}

export function useDeckState() {
  const [options, setOptions] = useState<GenOptions>(() => resolveInitialOptions());
  const [preset, setPreset] = useState<PresetKey>("Ladder");
  const [deck, setDeck] = useState<Card[]>(() => resolveInitialDeck());
  const [history, setHistory] = useState<Card[][]>([]);
  const toast = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    if (deck.length === 0) {
      const generated = generateDeck(options);
      if (generated) {
        setDeck(generated);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveOptions = (next: GenOptions) => {
    setOptions(next);
  };

  const applyPreset = (key: PresetKey) => {
    setPreset(key);
    const presetDefinition = PRESETS[key];
    const merged: GenOptions = {
      ...options,
      ...presetDefinition,
      weights: {
        ...options.weights,
        ...(presetDefinition.weights ?? options.weights)
      }
    } as GenOptions;
    saveOptions(merged);
  };

  const reroll = () => {
    const next = generateDeck(options);
    if (!next) {
      toast.show("No valid deck found. Loosen locks or blacklist settings.");
      return;
    }
    setHistory((prev) => (deck.length === 0 ? prev : [...prev.slice(-9), deck]));
    setDeck(next);
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setDeck(last);
      return prev.slice(0, -1);
    });
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return buildShareUrl(deck, options, window.location);
  }, [deck, options]);

  const averageElixir = useMemo(() => (deck.length ? avgElixir(deck).toFixed(2) : "0"), [deck]);

  const setOwned = (name: string, enabled: boolean) => {
    const next = new Set(options.owned);
    enabled ? next.add(name) : next.delete(name);
    saveOptions({ ...options, owned: Array.from(next) });
  };

  const setBlacklist = (name: string, enabled: boolean) => {
    const next = new Set(options.blacklist);
    enabled ? next.add(name) : next.delete(name);
    saveOptions({ ...options, blacklist: Array.from(next) });
  };

  const setUnderleveled = (name: string, enabled: boolean) => {
    const next = new Set(options.underleveled);
    enabled ? next.add(name) : next.delete(name);
    saveOptions({ ...options, underleveled: Array.from(next) });
  };

  return {
    deck,
    setDeck,
    options,
    saveOptions,
    preset,
    setPreset,
    applyPreset,
    reroll,
    undo,
    history,
    shareUrl,
    averageElixir,
    toast,
    setOwned,
    setBlacklist,
    setUnderleveled,
    deckText: deckAsList(deck)
  };
}
