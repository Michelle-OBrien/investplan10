import { UserInput } from "./types";

/**
 * Encode UserInput into URL search params.
 * Keys are abbreviated to keep URLs short.
 */
export function encodeInput(input: UserInput): string {
  const params = new URLSearchParams({
    b: String(input.budget),
    m: String(input.monthlyContribution),
    r: input.riskTolerance,
    s: String(input.allocationStocks),
    c: String(input.allocationCrypto),
    f: String(input.allocationForex),
  });
  return params.toString();
}

/**
 * Decode UserInput from URL search params.
 * Returns null if any required param is missing or invalid.
 */
export function decodeInput(search: string): UserInput | null {
  try {
    const params = new URLSearchParams(search);
    const budget = Number(params.get("b"));
    const monthlyContribution = Number(params.get("m"));
    const risk = params.get("r") as UserInput["riskTolerance"];
    const allocationStocks = Number(params.get("s"));
    const allocationCrypto = Number(params.get("c"));
    const allocationForex = Number(params.get("f"));

    if (
      !budget ||
      isNaN(monthlyContribution) ||
      !["conservative", "moderate", "aggressive"].includes(risk) ||
      isNaN(allocationStocks) ||
      isNaN(allocationCrypto) ||
      isNaN(allocationForex) ||
      allocationStocks + allocationCrypto + allocationForex !== 100
    ) {
      return null;
    }

    return {
      budget,
      monthlyContribution,
      riskTolerance: risk,
      allocationStocks,
      allocationCrypto,
      allocationForex,
    };
  } catch {
    return null;
  }
}
