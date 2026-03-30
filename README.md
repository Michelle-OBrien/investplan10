# InvestPlan10

AI-powered 10-year investment planner across stocks, crypto, and forex.

## Features

- **Budget input** with initial amount and monthly contributions
- **Risk tolerance** selection (conservative, moderate, aggressive)
- **Custom allocation** between stocks, crypto, and forex
- **AI recommendations** via Google Gemini for specific assets to invest in
- **10-year projection chart** with compound interest calculations
- **Detailed asset list** with tickers and reasons

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Google Gemini API** for AI-powered recommendations
- **Vercel** for deployment

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd investplan10
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Gemini API key:
```bash
cp .env.example .env.local
# Edit .env.local and add your key from https://aistudio.google.com/apikey
```

4. Configure Finnhub API key (risk score data):
```bash
# in .env.local
FINNHUB_API_KEY=your_finnhub_key_here
```
Get a free key at https://finnhub.io/signup (free tier 60 calls/min).

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

Deploy on Vercel:
1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add `GEMINI_API_KEY` as an environment variable
4. Deploy

## License

MIT
