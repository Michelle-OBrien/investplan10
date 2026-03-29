"use client";

import { useState } from "react";
import BudgetForm from "@/components/BudgetForm";
import { UserInput } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (input: UserInput) => {
    setLoading(true);
    setSubmitted(false);
    // API integration coming in a future PR
    console.log("User input:", input);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-accent-green">Invest</span>Plan10
            </h1>
            <p className="text-sm text-muted mt-1">
              AI-powered 10-year investment strategy
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Powered by Gemini
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="bg-card border border-card-border rounded-2xl p-6 sticky top-8">
              <h2 className="text-lg font-bold mb-1">Your Budget</h2>
              <p className="text-xs text-muted mb-6">
                Set your parameters and let AI build your plan
              </p>
              <BudgetForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-8">
            {submitted ? (
              <div className="bg-card border border-accent-green/30 rounded-2xl p-12 text-center glow-green">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-bold mb-2">Budget received!</h2>
                <p className="text-muted text-sm">
                  Charts and AI recommendations coming soon...
                </p>
              </div>
            ) : (
              <div className="bg-card border border-card-border rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">💰</div>
                <h2 className="text-xl font-bold mb-2">
                  Ready to plan your future?
                </h2>
                <p className="text-muted text-sm max-w-md mx-auto">
                  Enter your budget, choose your risk level and allocation, then
                  hit generate. Our AI will create a personalized 10-year
                  investment plan with specific assets to buy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
