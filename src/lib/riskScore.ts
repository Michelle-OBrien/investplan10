import { AssetRecommendation } from "./types";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

function getUnixTimeDaysAgo(days: number) {
  return Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;
}

function formatFinnhubSymbol(asset: AssetRecommendation) {
  if (asset.category === "stock") {
    return asset.ticker.toUpperCase();
  }

  if (asset.category === "crypto") {
    const ticker = asset.ticker.toUpperCase().replace("/", "").replace("USDT", "");
    return `BINANCE:${ticker}USDT`;
  }

  if (asset.category === "forex") {
    // input may be like EUR/USD or EURUSD
    const pair = asset.ticker.replace("/", "_").toUpperCase();
    return `OANDA:${pair}`;
  }

  return asset.ticker;
}

function volatilityToRiskScore(stdev: number) {
  // normalize to 0-100 (higher stdev => higher risk score)
  const raw = Math.round((stdev / 0.05) * 100);
  if (Number.isNaN(raw) || !Number.isFinite(raw)) return 50;
  return Math.min(100, Math.max(0, raw));
}

async function fetchCandleData(symbol: string, token: string) {
  const from = getUnixTimeDaysAgo(90);
  const to = Math.floor(Date.now() / 1000);

  const url = `${FINNHUB_BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${from}&to=${to}&token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Finnhub candle fetch failed ${res.status}`);
  }
  const data = await res.json();

  if (data.s !== "ok" || !Array.isArray(data.c) || data.c.length < 2) {
    throw new Error("Finnhub candle data unavailable");
  }

  return data.c as number[];
}

export async function getAssetRiskScore(asset: AssetRecommendation): Promise<number> {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    // fallback by user-selected tolerance if API key is absent
    return asset.allocation > 0
      ? Math.min(100, Math.max(10, Math.round((asset.allocation / 100) * 80)))
      : 50;
  }

  const symbol = formatFinnhubSymbol(asset);

  try {
    const prices = await fetchCandleData(symbol, apiKey);
    const returns = prices
      .slice(1)
      .map((price, i) => (price - prices[i]) / prices[i]);

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
    const stdev = Math.sqrt(variance);

    return volatilityToRiskScore(stdev);
  } catch (error) {
    console.warn("Risk score fetch failed for", asset.ticker, error);
    // fallback to moderate default when API fails
    return 45;
  }
}
