import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserInput, AssetRecommendation } from "@/lib/types";
import { generateProjections } from "@/lib/projections";
import { checkRateLimit } from "@/lib/rateLimit";

// 5 requests per minute per IP
const RATE_LIMIT = { limit: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const { allowed, remaining, resetIn } = checkRateLimit(ip, RATE_LIMIT);

  if (!allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please wait ${Math.ceil(resetIn / 1000)}s before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(resetIn / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const input: UserInput = await req.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `You are a financial advisor AI. A user wants to invest with the following parameters:
- Initial budget: ${input.budget}€
- Monthly contribution: ${input.monthlyContribution}€/month
- Risk tolerance: ${input.riskTolerance}
- Allocation: ${input.allocationStocks}% stocks, ${input.allocationCrypto}% crypto, ${input.allocationForex}% forex

Based on the last 10 years of market data you know, recommend specific assets to invest in.
Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "summary": "A 2-3 sentence overview of the investment strategy",
  "assets": [
    {
      "name": "Full name of the asset",
      "ticker": "TICKER",
      "category": "stock" or "crypto" or "forex",
      "allocation": percentage within its category (number, all allocations within a category should sum to 100),
      "reason": "Why this asset is recommended (1 sentence)"
    }
  ],
  "compoundDetails": "Explanation of the compound interest strategy (2-3 sentences)"
}

Recommend 3-5 stocks, 2-3 crypto, and 2-3 forex pairs. Be specific with real tickers.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean potential markdown code blocks from Gemini response
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const aiResponse = JSON.parse(cleaned);

    const projections = generateProjections(input);
    const finalProjection = projections[projections.length - 1];

    const plan = {
      summary: aiResponse.summary,
      assets: aiResponse.assets as AssetRecommendation[],
      projections,
      totalInvested: finalProjection.contributions,
      projectedValue: finalProjection.totalValue,
      totalReturn: Math.round(
        ((finalProjection.totalValue - finalProjection.contributions) /
          finalProjection.contributions) *
          100
      ),
      compoundDetails: aiResponse.compoundDetails,
    };

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Gemini API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate plan: ${message}` },
      { status: 500 }
    );
  }
}
