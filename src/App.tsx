import { Copy, RefreshCw, Undo2 } from "lucide-react";
import { Controls } from "./components/Controls";
import { DeckView } from "./components/DeckView";
import { ExportBar } from "./components/ExportBar";
import { CardManager } from "./components/CardManager";
import { RoleLocks } from "./components/RoleLocks";
import { Toast } from "./components/Toast";
import { useDeckState } from "./state/store";
import type { GenOptions } from "./state/options";

export default function App() {
  const state = useDeckState();
  const { deck, options, reroll, undo, shareUrl, toast } = state;

  const toggleOption = (key: keyof GenOptions, value: boolean) => {
    state.saveOptions({ ...state.options, [key]: value } as GenOptions);
  };

  const copyDeck = async () => {
    if (deck.length === 0) return;
    await navigator.clipboard.writeText(state.deckText);
    toast.show("Deck copied");
  };

  return (
    <div className="min-h-screen bg-surface pb-20 text-neutral-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Clash Royale Deck Generator — Pro</h1>
            <p className="text-sm text-neutral-400">
              Smart synergy, coverage gates, presets, and shareable exports. Everything runs in your browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reroll}
              className="flex items-center gap-2 rounded-xl bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/30"
            >
              <RefreshCw className="h-4 w-4" /> Reroll
            </button>
            <button
              type="button"
              onClick={undo}
              className="flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm transition hover:border-neutral-500"
            >
              <Undo2 className="h-4 w-4" /> Undo
            </button>
            <button
              type="button"
              onClick={copyDeck}
              className="flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2 text-sm transition hover:border-neutral-500"
            >
              <Copy className="h-4 w-4" /> Copy deck
            </button>
          </div>
        </header>

        <Controls
          options={options}
          saveOptions={state.saveOptions}
          preset={state.preset}
          applyPreset={state.applyPreset}
          averageElixir={state.averageElixir}
          onReroll={reroll}
        />

        <section className="rounded-2xl bg-neutral-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-200">Player preferences</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <ToggleTile
              label="Owned cards only"
              description="Restrict generation to your owned list when available."
              active={options.ownedOnly}
              onToggle={(value) => toggleOption("ownedOnly", value)}
            />
            <ToggleTile
              label="Prefer Evolution cards"
              description="Bias the optimizer toward cards with evolution tags."
              active={options.preferEvo}
              onToggle={(value) => toggleOption("preferEvo", value)}
            />
            <ToggleTile
              label="Avoid underleveled"
              description="Skip cards flagged as underleveled in the card manager."
              active={options.avoidUnderleveled}
              onToggle={(value) => toggleOption("avoidUnderleveled", value)}
            />
          </div>
        </section>

        <RoleLocks options={options} saveOptions={state.saveOptions} />
        <DeckView deck={deck} />
        <ExportBar deck={deck} options={options} shareUrl={shareUrl} notify={toast.show} />
        <CardManager
          options={options}
          setOwned={state.setOwned}
          setBlacklist={state.setBlacklist}
          setUnderleveled={state.setUnderleveled}
        />
      </div>
      <Toast message={toast.message} />
    </div>
  );
}

type ToggleTileProps = {
  label: string;
  description: string;
  active: boolean;
  onToggle: (value: boolean) => void;
};

function ToggleTile({ label, description, active, onToggle }: ToggleTileProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-neutral-100">{label}</h4>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={active}
            onChange={(event) => onToggle(event.target.checked)}
          />
          <span className="h-5 w-10 rounded-full bg-neutral-700 transition peer-checked:bg-accent"></span>
        </label>
      </div>
    </div>
  );
}
