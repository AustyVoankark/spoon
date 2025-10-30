import { useMemo, useState } from "react";
import { CARDS } from "../data/cards";
import type { GenOptions } from "../state/options";

const roleLabels: Record<string, string> = {
  wincon: "Win condition",
  support: "Support",
  "spell-small": "Small spell",
  "spell-big": "Big spell",
  building: "Building"
};

type CardManagerProps = {
  options: GenOptions;
  setOwned: (name: string, enabled: boolean) => void;
  setBlacklist: (name: string, enabled: boolean) => void;
  setUnderleveled: (name: string, enabled: boolean) => void;
};

export function CardManager({ options, setOwned, setBlacklist, setUnderleveled }: CardManagerProps) {
  const [query, setQuery] = useState("");

  const cards = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return CARDS.filter((card) => card.name.toLowerCase().includes(normalized)).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [query]);

  return (
    <section className="rounded-2xl bg-neutral-900 p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-200">Card manager</h3>
          <p className="text-xs text-neutral-500">
            Mark owned cards to restrict generation, blacklist cards to avoid them, and flag underleveled cards to skip when the
            avoidance toggle is active.
          </p>
        </div>
        <input
          className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm sm:w-64"
          placeholder="Search cards"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="max-h-80 space-y-2 overflow-y-auto pr-2">
        {cards.map((card) => {
          const owned = options.owned.includes(card.name);
          const blacklisted = options.blacklist.includes(card.name);
          const underleveled = options.underleveled.includes(card.name);
          return (
            <div
              key={card.name}
              className="flex items-center justify-between rounded-xl bg-neutral-800/60 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-neutral-200">{card.name}</p>
                <p className="text-xs text-neutral-500">
                  {roleLabels[card.role]} • {card.cost} elixir
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <ToggleChip label="Owned" active={owned} onClick={() => setOwned(card.name, !owned)} />
                <ToggleChip label="Blacklist" active={blacklisted} onClick={() => setBlacklist(card.name, !blacklisted)} />
                <ToggleChip label="Underleveled" active={underleveled} onClick={() => setUnderleveled(card.name, !underleveled)} />
              </div>
            </div>
          );
        })}
        {cards.length === 0 && <p className="text-sm text-neutral-500">No cards match this search.</p>}
      </div>
    </section>
  );
}

type ToggleChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function ToggleChip({ label, active, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 transition ${
        active
          ? "border-accent/70 bg-accent/20 text-accent"
          : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500"
      }`}
    >
      {label}
    </button>
  );
}
