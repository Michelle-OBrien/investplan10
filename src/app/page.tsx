"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <a href="#content" className="skip-link">Skip to content</a>

      <header className="border-b border-card-border py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-accent-green">Invest</span>Plan10
          </Link>
          <Link
            href="/tool"
            className="text-sm text-muted border border-card-border rounded-lg px-3 py-1.5 hover:border-foreground/30"
          >
            Go to Tool
          </Link>
        </div>
      </header>

      <section id="content" className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-accent-green">Invest</span>Plan10
          </h1>
          <p className="text-lg text-muted mx-auto max-w-3xl mb-8">
            Your AI-powered 10-year investment planning assistant for stocks, crypto, and forex.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/tool"
              className="bg-accent-green text-background px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-green/90 transition"
            >
              Start Planning Now
            </Link>
            <Link
              href="/dashboard"
              className="text-sm border border-card-border px-6 py-4 rounded-lg hover:bg-foreground/5 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card border-y border-card-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Why InvestPlan10?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-semibold mb-2">AI-driven strategies</h3>
              <p className="text-muted">Data-backed asset allocation and risk insights.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-semibold mb-2">10-year projections</h3>
              <p className="text-muted">Visualize long-term growth with automated charts.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="font-semibold mb-2">Risk scores included</h3>
              <p className="text-muted">See asset-level and total risk metrics with API data.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-card-border">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted">
          © {new Date().getFullYear()} InvestPlan10 — Built with Next.js and Gemini AI.
        </div>
      </footer>
    </main>
  );
}
