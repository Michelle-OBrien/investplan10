"use client";

interface Goal {
  id: string;
  icon: string;
  label: string;
  description: string;
  targetYears: number;
  suggestedMonthly: number;
  suggestedRisk: "conservative" | "moderate" | "aggressive";
}

const GOALS: Goal[] = [
  {
    id: "retirement",
    icon: "🏖️",
    label: "Retirement",
    description: "Build long-term wealth for financial freedom",
    targetYears: 10,
    suggestedMonthly: 500,
    suggestedRisk: "moderate",
  },
  {
    id: "house",
    icon: "🏠",
    label: "Buy a Home",
    description: "Save for your dream property down payment",
    targetYears: 10,
    suggestedMonthly: 800,
    suggestedRisk: "conservative",
  },
  {
    id: "education",
    icon: "🎓",
    label: "Education",
    description: "Fund studies or your children's future",
    targetYears: 10,
    suggestedMonthly: 300,
    suggestedRisk: "moderate",
  },
  {
    id: "wealth",
    icon: "📈",
    label: "Grow Wealth",
    description: "Maximize returns with aggressive growth",
    targetYears: 10,
    suggestedMonthly: 400,
    suggestedRisk: "aggressive",
  },
  {
    id: "travel",
    icon: "✈️",
    label: "Travel Fund",
    description: "Save for incredible experiences worldwide",
    targetYears: 10,
    suggestedMonthly: 200,
    suggestedRisk: "moderate",
  },
  {
    id: "emergency",
    icon: "🛡️",
    label: "Safety Net",
    description: "Build a secure emergency fund",
    targetYears: 10,
    suggestedMonthly: 250,
    suggestedRisk: "conservative",
  },
];

interface Props {
  onSelect: (goal: Goal) => void;
  selectedId?: string;
}

export default function GoalSelector({ onSelect, selectedId }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-muted mb-3">Investment Goal</p>
      <div className="grid grid-cols-3 gap-2">
        {GOALS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g)}
            className={`group relative flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition cursor-pointer ${
              selectedId === g.id
                ? "border-accent-green bg-accent-green/10"
                : "border-card-border hover:border-foreground/30"
            }`}
          >
            <span className="text-xl">{g.icon}</span>
            <span
              className={`text-xs font-medium leading-tight ${
                selectedId === g.id ? "text-accent-green" : "text-foreground"
              }`}
            >
              {g.label}
            </span>
            {/* Tooltip on hover */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card border border-card-border rounded-lg text-xs text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-10">
              {g.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Goal };
export { GOALS };
