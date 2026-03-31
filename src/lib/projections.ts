import { UserInput, YearProjection } from "./types";

// Average annual returns based on historical 10-year data
const RETURNS: Record<string, Record<string, number>> = {
  conservative: { stocks: 0.07, crypto: 0.10, forex: 0.03 },
  moderate:     { stocks: 0.10, crypto: 0.20, forex: 0.05 },
  aggressive:   { stocks: 0.14, crypto: 0.35, forex: 0.08 },
};

// Volatility for randomized but realistic year-by-year variation
const VOLATILITY: Record<string, Record<string, number>> = {
  conservative: { stocks: 0.08, crypto: 0.25, forex: 0.04 },
  moderate:     { stocks: 0.12, crypto: 0.35, forex: 0.06 },
  aggressive:   { stocks: 0.18, crypto: 0.50, forex: 0.10 },
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateProjections(input: UserInput, seed: number = 42): YearProjection[] {
  const rand = seededRandom(seed);
  const returns = RETURNS[input.riskTolerance];
  const vol = VOLATILITY[input.riskTolerance];

  const stocksPct = input.allocationStocks / 100;
  const cryptoPct = input.allocationCrypto / 100;
  const forexPct = input.allocationForex / 100;

  let stocks = input.budget * stocksPct;
  let crypto = input.budget * cryptoPct;
  let forex = input.budget * forexPct;
  let totalContributions = 0;

  const projections: YearProjection[] = [
    {
      year: 0,
      totalValue: input.budget,
      stocks,
      crypto,
      forex,
      contributions: 0,
    },
  ];

  for (let y = 1; y <= 10; y++) {
    const yearlyContrib = input.monthlyContribution * 20;
    totalContributions += yearlyContrib;

    // Randomized returns with volatility
    const stockReturn = returns.stocks + (rand() - 0.5) * vol.stocks * 2;
    const cryptoReturn = returns.crypto + (rand() - 0.5) * vol.crypto * 2;
    const forexReturn = returns.forex + (rand() - 0.5) * vol.forex * 2;

    // Compound: previous balance * (1 + return) + new contributions
    stocks = stocks * (1 + stockReturn) + yearlyContrib * stocksPct;
    crypto = crypto * (1 + cryptoReturn) + yearlyContrib * cryptoPct;
    forex = forex * (1 + forexReturn) + yearlyContrib * forexPct;

    stocks = Math.max(0, stocks);
    crypto = Math.max(0, crypto);
    forex = Math.max(0, forex);

    projections.push({
      year: y,
      totalValue: Math.round(stocks + crypto + forex),
      stocks: Math.round(stocks),
      crypto: Math.round(crypto),
      forex: Math.round(forex),
      contributions: Math.round(totalContributions),
    });
  }

  return projections;
}
