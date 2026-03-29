export interface UserInput {
  budget: number;
  monthlyContribution: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  allocationStocks: number;
  allocationCrypto: number;
  allocationForex: number;
}

export interface AssetRecommendation {
  name: string;
  ticker: string;
  category: "stock" | "crypto" | "forex";
  allocation: number;
  reason: string;
}

export interface YearProjection {
  year: number;
  totalValue: number;
  stocks: number;
  crypto: number;
  forex: number;
  contributions: number;
}

export interface InvestmentPlan {
  summary: string;
  assets: AssetRecommendation[];
  projections: YearProjection[];
  totalInvested: number;
  projectedValue: number;
  totalReturn: number;
  compoundDetails: string;
}
