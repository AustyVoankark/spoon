import type { Card } from "../data/cards";
import { COVERAGE_KEYS, coverageMap } from "../logic/coverage";

const roleColors: Record<string, string> = {
  wincon: "bg-amber-500/20 text-amber-300",
  support: "bg-indigo-500/20 text-indigo-200",
  "spell-small": "bg-emerald-500/20 text-emerald-200",
  "spell-big": "bg-rose-500/20 text-rose-200",
  building: "bg-cyan-500/20 text-cyan-200"
};

type DeckViewProps = {
  deck: Card[];
};

export function DeckView({ deck }: DeckViewProps) {
  const coverage = coverageMap(deck);

  return (
    <section className="rounded-2xl bg-neutral-900 p-4">
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Generated deck</h2>
          <p className="text-xs text-neutral-500">Synergy-driven eight-card list balancing spells, roles, and coverage.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {COVERAGE_KEYS.map((key) => (
            <span
              key={key}
              className={`rounded-full px-3 py-1 font-medium uppercase tracking-wide ${
                coverage[key] ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
              }`}
            >
              {key} {coverage[key] ? "ready" : "missing"}
            </span>
          ))}
        </div>
      </header>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {deck.map((card) => (
          <article key={card.name} className="rounded-xl bg-neutral-800/60 p-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">{card.name}</h3>
                <p className="text-xs text-neutral-400">Cost {card.cost} • {card.type}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${roleColors[card.role]}`}>
                {card.role.replace("-", " ")}
              </span>
            </div>
            {card.tags && card.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wide">
                {card.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-neutral-900 px-2 py-1 text-neutral-400">
                    {tag.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      {deck.length === 0 && <p className="text-sm text-neutral-500">Roll the generator to build a deck.</p>}
    </section>
  );
}
