"use client";

import { useI18n } from "@/lib/i18n/context";

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
    label: "goalRetirement",
    description: "goalRetirementDesc",
    targetYears: 10,
    suggestedMonthly: 500,
    suggestedRisk: "moderate",
  },
  {
    id: "house",
    icon: "🏠",
    label: "goalHouse",
    description: "goalHouseDesc",
    targetYears: 10,
    suggestedMonthly: 800,
    suggestedRisk: "conservative",
  },
  {
    id: "education",
    icon: "🎓",
    label: "goalEducation",
    description: "goalEducationDesc",
    targetYears: 10,
    suggestedMonthly: 300,
    suggestedRisk: "moderate",
  },
  {
    id: "wealth",
    icon: "📈",
    label: "goalWealth",
    description: "goalWealthDesc",
    targetYears: 10,
    suggestedMonthly: 400,
    suggestedRisk: "aggressive",
  },
  {
    id: "travel",
    icon: "✈️",
    label: "goalTravel",
    description: "goalTravelDesc",
    targetYears: 10,
    suggestedMonthly: 200,
    suggestedRisk: "moderate",
  },
  {
    id: "emergency",
    icon: "🛡️",
    label: "goalEmergency",
    description: "goalEmergencyDesc",
    targetYears: 10,
    suggestedMonthly: 250,
    suggestedRisk: "conservative",
  },
];

interface Props {
  onSelect: (goal: Goal) => void;
  selectedId?: string;
}

import { useI18n } from "@/lib/i18n/context";

export default function GoalSelector({ onSelect, selectedId }: Props) {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-sm font-medium text-muted mb-3">{t("goalTitle")}</p>
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
              {t(g.label as any)}
            </span>
            {/* Tooltip on hover */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card border border-card-border rounded-lg text-xs text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-10">
              {t(g.description as any)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Goal };
export { GOALS };
