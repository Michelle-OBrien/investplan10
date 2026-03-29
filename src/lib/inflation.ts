import { YearProjection } from "./types";

/**
 * Default assumed annual inflation rate (ECB target: 2%)
 */
export const DEFAULT_INFLATION = 0.02;

/**
 * Deflate a nominal value to its real (inflation-adjusted) equivalent.
 * Formula: real = nominal / (1 + rate)^years
 */
export function deflate(nominal: number, years: number, rate = DEFAULT_INFLATION): number {
  return Math.round(nominal / Math.pow(1 + rate, years));
}

/**
 * Return a copy of projections with all money values deflated to today's purchasing power.
 */
export function adjustForInflation(
  projections: YearProjection[],
  rate = DEFAULT_INFLATION
): YearProjection[] {
  return projections.map((p) => ({
    ...p,
    totalValue: deflate(p.totalValue, p.year, rate),
    stocks: deflate(p.stocks, p.year, rate),
    crypto: deflate(p.crypto, p.year, rate),
    forex: deflate(p.forex, p.year, rate),
    contributions: deflate(p.contributions, p.year, rate),
  }));
}
