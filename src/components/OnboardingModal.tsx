"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "investplan10_onboarded";

const steps = [
  {
    icon: "💰",
    title: "Set your budget",
    desc: "Enter your initial capital and how much you can invest each month.",
  },
  {
    icon: "⚖️",
    title: "Choose your risk level",
    desc: "Conservative, moderate, or aggressive — pick what fits your profile.",
  },
  {
    icon: "📊",
    title: "Allocate your assets",
    desc: "Decide how to split between stocks, crypto, and forex. Use presets or tune manually.",
  },
  {
    icon: "🤖",
    title: "Let AI do the rest",
    desc: "Gemini generates specific asset recommendations and a 10-year growth projection.",
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        className="bg-card border border-card-border rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === step
                  ? "w-6 bg-accent-green"
                  : "w-1.5 bg-card-border hover:bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-lg font-bold mb-2">{current.title}</h2>
          <p className="text-sm text-muted leading-relaxed">{current.desc}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleClose}
            className="text-xs text-muted hover:text-foreground transition cursor-pointer"
          >
            Skip
          </button>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-lg border border-card-border text-sm text-muted hover:text-foreground hover:border-foreground/30 transition cursor-pointer"
              >
                Back
              </button>
            )}
            {isLast ? (
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-lg bg-accent-green text-background text-sm font-bold hover:brightness-110 transition cursor-pointer"
              >
                Get started
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-lg bg-accent-green text-background text-sm font-bold hover:brightness-110 transition cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
