import { Copy, Download, Link as LinkIcon, List } from "lucide-react";
import type { Card } from "../data/cards";
import type { GenOptions } from "../state/options";
import { deckAsList, jsonExport, royaleApiText } from "../utils/format";

const canvasSize = { width: 1000, height: 560 };

type ExportBarProps = {
  deck: Card[];
  options: GenOptions;
  shareUrl: string;
  notify: (message: string) => void;
};

export function ExportBar({ deck, options, shareUrl, notify }: ExportBarProps) {
  const copy = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text);
    notify(message);
  };

  const downloadImage = async () => {
    if (deck.length !== 8) {
      notify("Roll a deck before exporting.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#0f172a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#111827";
    context.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    context.fillStyle = "#e5e7eb";
    context.font = "bold 28px Inter, system-ui";
    context.fillText("Clash Royale Deck", 40, 60);
    context.font = "16px Inter, system-ui";

    const columns = 4;
    const rows = 2;
    const boxWidth = (canvas.width - 80) / columns;
    const boxHeight = (canvas.height - 120) / rows;

    deck.forEach((card, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const x = 40 + column * boxWidth;
      const y = 90 + row * boxHeight;

      context.fillStyle = "#0f172a";
      context.fillRect(x, y, boxWidth - 20, boxHeight - 20);
      context.fillStyle = "#38bdf8";
      context.font = "bold 18px Inter, system-ui";
      context.fillText(card.name, x + 16, y + 36);
      context.fillStyle = "#cbd5f5";
      context.font = "14px Inter, system-ui";
      context.fillText(`${card.role} • ${card.cost} elixir`, x + 16, y + 62);
      const tags = (card.tags ?? []).slice(0, 3).join(", ");
      context.fillText(tags, x + 16, y + 86);
    });

    const url = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "deck.png";
    anchor.click();
    notify("PNG card saved");
  };

  return (
    <section className="rounded-2xl bg-neutral-900 p-4">
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">Export & Share</h3>
      <div className="flex flex-wrap gap-3">
        <ActionButton icon={<Copy className="h-4 w-4" />} label="Copy deck" onClick={() => copy(deckAsList(deck), "Deck copied")} />
        <ActionButton
          icon={<List className="h-4 w-4" />}
          label="RoyaleAPI"
          onClick={() => copy(royaleApiText(deck), "RoyaleAPI format copied")}
        />
        <ActionButton
          icon={<Copy className="h-4 w-4" />}
          label="Copy JSON"
          onClick={() => copy(jsonExport(deck, options), "JSON copied")}
        />
        <ActionButton icon={<LinkIcon className="h-4 w-4" />} label="Copy share URL" onClick={() => copy(shareUrl, "Share URL copied")} />
        <ActionButton icon={<Download className="h-4 w-4" />} label="PNG card" onClick={downloadImage} />
      </div>
    </section>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition hover:border-accent/70 hover:text-accent"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
