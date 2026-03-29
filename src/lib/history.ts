import { InvestmentPlan, UserInput } from "./types";

export interface SavedPlan {
  id: string;
  date: string;
  input: UserInput;
  plan: InvestmentPlan;
}

const STORAGE_KEY = "investplan10_history";
const MAX_HISTORY = 10;

export function savePlan(input: UserInput, plan: InvestmentPlan): SavedPlan {
  const saved: SavedPlan = {
    id: Date.now().toString(36),
    date: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    input,
    plan,
  };

  const history = getHistory();
  history.unshift(saved);
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  return saved;
}

export function getHistory(): SavedPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deletePlan(id: string): void {
  const history = getHistory().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
