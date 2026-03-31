"use client";

import { useState } from "react";
import { UserInput } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  onResult: (risk: UserInput["riskTolerance"]) => void;
  onClose: () => void;
}

const questions = [
  {
    id: "horizon",
    text: "What is your investment time horizon?",
    options: [
      { label: "Less than 3 years", score: 0 },
      { label: "3–7 years", score: 1 },
      { label: "More than 7 years", score: 2 },
    ],
  },
  {
    id: "reaction",
    text: "Your portfolio drops 25% in one month. What do you do?",
    options: [
      { label: "Sell everything to limit losses", score: 0 },
      { label: "Wait and see without selling", score: 1 },
      { label: "Buy more at lower prices", score: 2 },
    ],
  },
  {
    id: "goal",
    text: "What is your primary investment goal?",
    options: [
      { label: "Preserve my capital", score: 0 },
      { label: "Balanced growth and safety", score: 1 },
      { label: "Maximum long-term growth", score: 2 },
    ],
  },
  {
    id: "income",
    text: "How much of your monthly income can you afford to lose?",
    options: [
      { label: "Less than 5%", score: 0 },
      { label: "5–20%", score: 1 },
      { label: "More than 20%", score: 2 },
    ],
  },
  {
    id: "experience",
    text: "How would you describe your investment experience?",
    options: [
      { label: "Beginner — I'm just starting", score: 0 },
      { label: "Intermediate — I've invested before", score: 1 },
      { label: "Advanced — I actively manage a portfolio", score: 2 },
    ],
  },
];

function scoreToRisk(score: number): UserInput["riskTolerance"] {
  if (score <= 3) return "conservative";
  if (score <= 6) return "moderate";
  return "aggressive";
}

const riskInfo: Record<
  UserInput["riskTolerance"],
  { label: string; color: string; desc: string }
> = {
  conservative: {
    label: "Conservative",
    color: "text-accent-blue border-accent-blue/40 bg-accent-blue/10",
    desc: "You prioritise capital preservation. Lower potential returns in exchange for stability.",
  },
  moderate: {
    label: "Moderate",
    color: "text-accent-purple border-accent-purple/40 bg-accent-purple/10",
    desc: "You seek a balance between growth and security, accepting occasional volatility.",
  },
  aggressive: {
    label: "Aggressive",
    color: "text-accent-orange border-accent-orange/40 bg-accent-orange/10",
    desc: "You chase maximum growth and can handle significant short-term losses.",
  },
};

export default function RiskQuiz({ onResult, onClose }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<UserInput["riskTolerance"] | null>(null);

  const current = questions[step];
  const totalScore = answers.reduce((a, b) => a + b, 0);

  const handleAnswer = (score: number) => {
    const next = [...answers, score];
    if (step < questions.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      const total = next.reduce((a, b) => a + b, 0);
      setAnswers(next);
      setResult(scoreToRisk(total));
    }
  };

  const handleApply = () => {
    if (result) onResult(result);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-sm">{t("quizTitle")}</h2>
            {!result && (
              <p className="text-xs text-muted mt-0.5">
                {step + 1} / {questions.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {!result && (
          <div className="h-1 bg-card-border rounded-full mb-5">
            <div
              className="h-full bg-accent-green rounded-full transition-all"
              style={{ width: `${((step) / questions.length) * 100}%` }}
            />
          </div>
        )}

        {result ? (
          /* Result screen */
          <div className="text-center">
            <p className="text-sm text-muted mb-3">Your risk profile is</p>
            <div className={`inline-block px-6 py-3 rounded-xl border text-lg font-bold mb-4 ${riskInfo[result].color}`}>
              {riskInfo[result].label}
            </div>
            <p className="text-sm text-muted mb-6 leading-relaxed">
              {riskInfo[result].desc}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-card-border text-sm text-muted hover:text-foreground transition cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-accent-green text-background text-sm font-bold hover:brightness-110 transition cursor-pointer"
              >
                Apply to form
              </button>
            </div>
          </div>
        ) : (
          /* Question screen */
          <div>
            <p className="text-sm font-semibold mb-4 leading-snug">
              {current.text}
            </p>
            <div className="space-y-2">
              {current.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-card-border text-sm text-muted hover:text-foreground hover:border-accent-green/50 hover:bg-accent-green/5 transition cursor-pointer"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => {
                  setAnswers(answers.slice(0, -1));
                  setStep(step - 1);
                }}
                className="mt-4 text-xs text-muted hover:text-foreground transition cursor-pointer"
              >
                ← Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
