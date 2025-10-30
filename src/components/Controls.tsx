import type { GenOptions, PresetKey } from "../state/options";

type ControlsProps = {
  options: GenOptions;
  saveOptions: (next: GenOptions) => void;
  preset: PresetKey;
  applyPreset: (key: PresetKey) => void;
  averageElixir: string;
  onReroll: () => void;
};

const presetKeys: PresetKey[] = ["Ladder", "Classic", "TwoVTwo", "DraftAssist"];

export function Controls({ options, saveOptions, preset, applyPreset, averageElixir, onReroll }: ControlsProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm text-neutral-300">Preset</label>
          <select
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm"
            value={preset}
            onChange={(event) => applyPreset(event.target.value as PresetKey)}
          >
            {presetKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-neutral-300">Seed</label>
          <input
            className="w-52 rounded-lg bg-neutral-900 px-3 py-2 text-sm"
            value={options.seed}
            onChange={(event) => saveOptions({ ...options, seed: event.target.value })}
          />
          <button
            type="button"
            className="rounded-lg bg-accent/20 px-3 py-2 text-sm font-medium text-accent transition hover:bg-accent/30"
            onClick={onReroll}
          >
            Roll with Seed
          </button>
        </div>
        <div className="text-sm text-neutral-400">
          Average elixir: <span className="font-semibold text-neutral-100">{averageElixir}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-neutral-900 p-4">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-neutral-200">
              Target average elixir ({options.targetAvg.toFixed(2)})
            </label>
            <input
              type="range"
              min={2.5}
              max={5}
              step={0.05}
              value={options.targetAvg}
              onChange={(event) => saveOptions({ ...options, targetAvg: parseFloat(event.target.value) })}
              className="w-full"
            />
          </div>
          <ToggleRow
            label="Include 1 defensive building"
            checked={options.includeDefBuilding}
            onChange={(checked) => saveOptions({ ...options, includeDefBuilding: checked })}
          />
          <ToggleRow
            label="Allow champions"
            checked={options.allowChampions}
            onChange={(checked) => saveOptions({ ...options, allowChampions: checked })}
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>Champion cap</span>
            <select
              className="rounded-lg bg-neutral-800 px-3 py-2 text-sm"
              value={options.championCap}
              onChange={(event) => saveOptions({ ...options, championCap: parseInt(event.target.value, 10) })}
            >
              {[0, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900 p-4">
          <SelectRow
            label="Win conditions"
            value={options.winconCount}
            onChange={(value) => saveOptions({ ...options, winconCount: value as 1 | 2 })}
            options={[1, 2]}
          />
          <SelectRow
            label="Small spells"
            value={options.smallSpellCount}
            onChange={(value) => saveOptions({ ...options, smallSpellCount: value })}
            options={[0, 1, 2]}
          />
          <SelectRow
            label="Big spells"
            value={options.bigSpellCount}
            onChange={(value) => saveOptions({ ...options, bigSpellCount: value })}
            options={[0, 1, 2]}
          />
          <ToggleRow
            label="Allow extra defensive building when wincon is a building"
            checked={options.allowExtraWinconBuilding}
            onChange={(checked) => saveOptions({ ...options, allowExtraWinconBuilding: checked })}
          />
        </div>

        <div className="rounded-2xl bg-neutral-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-200">Bias sliders</h3>
          <SliderRow
            label={`Air focus (${options.biasSliders.air.toFixed(2)})`}
            value={options.biasSliders.air}
            onChange={(value) =>
              saveOptions({ ...options, biasSliders: { ...options.biasSliders, air: value } })
            }
            min={0}
            max={0.5}
            step={0.05}
          />
          <SliderRow
            label={`Cycle speed (${options.biasSliders.cycle.toFixed(2)})`}
            value={options.biasSliders.cycle}
            onChange={(value) =>
              saveOptions({ ...options, biasSliders: { ...options.biasSliders, cycle: value } })
            }
            min={0}
            max={0.5}
            step={0.05}
          />
          <SliderRow
            label={`Control (${options.biasSliders.control.toFixed(2)})`}
            value={options.biasSliders.control}
            onChange={(value) =>
              saveOptions({ ...options, biasSliders: { ...options.biasSliders, control: value } })
            }
            min={0}
            max={0.5}
            step={0.05}
          />
          <SliderRow
            label={`Beatdown (${options.biasSliders.beatdown.toFixed(2)})`}
            value={options.biasSliders.beatdown}
            onChange={(value) =>
              saveOptions({ ...options, biasSliders: { ...options.biasSliders, beatdown: value } })
            }
            min={0}
            max={0.5}
            step={0.05}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-900 p-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-200">Advanced weights</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(options.weights).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between text-sm">
              <span className="capitalize text-neutral-300">{formatKey(key)}</span>
              <input
                type="number"
                step={0.1}
                className="w-24 rounded-lg bg-neutral-800 px-3 py-2 text-right text-sm"
                value={value}
                onChange={(event) =>
                  saveOptions({
                    ...options,
                    weights: { ...options.weights, [key]: parseFloat(event.target.value) || 0 }
                  })
                }
              />
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          Coverage weight tightens the swarm / splash / air / reset gates. Synergy weight increases how much rules influence
          the optimizer.
        </p>
      </div>
    </section>
  );
}

type ToggleRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="mt-3 flex items-center justify-between text-sm">
      <span className="text-neutral-300">{label}</span>
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-neutral-700 bg-neutral-800"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

type SelectRowProps = {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
};

function SelectRow({ label, value, options, onChange }: SelectRowProps) {
  return (
    <label className="mt-3 flex items-center justify-between text-sm">
      <span className="text-neutral-300">{label}</span>
      <select
        className="rounded-lg bg-neutral-800 px-3 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(parseInt(event.target.value, 10))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function SliderRow({ label, value, min, max, step, onChange }: SliderRowProps) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        className="w-full"
      />
    </div>
  );
}

function formatKey(key: string) {
  return key
    .replace(/Weight$/, "")
    .replace(/([A-Z])/g, " $1")
    .trim();
}
