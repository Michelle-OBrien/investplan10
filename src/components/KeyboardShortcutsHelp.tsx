"use client";

interface Props {
  onClose: () => void;
}

const shortcuts = [
  { keys: ["G"], description: "Focus & submit the generate button" },
  { keys: ["N"], description: "New plan / reset results" },
  { keys: ["?"], description: "Open this help panel" },
  { keys: ["Esc"], description: "Close this panel" },
];

export default function KeyboardShortcutsHelp({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-sm">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition cursor-pointer text-xs"
          >
            ✕ Esc
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.description}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted">{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 rounded-md border border-card-border bg-background text-xs font-mono"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-5 text-center">
          Shortcuts are disabled when typing in input fields
        </p>
      </div>
    </div>
  );
}
