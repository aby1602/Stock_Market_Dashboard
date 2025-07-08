import type { Stock, Participant, News } from "@/types"

export const generateRealisticStocks = (): Stock[] => {
  const baseStocks = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", basePrice: 175.5 },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", basePrice: 2850.75 },
    { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", basePrice: 415.25 },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", basePrice: 3250.8 },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", basePrice: 245.6 },
    { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", basePrice: 875.3 },
    { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", basePrice: 485.9 },
    { symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment", basePrice: 425.15 },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial", basePrice: 185.4 },
    { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", basePrice: 165.75 },
    { symbol: "V", name: "Visa Inc.", sector: "Financial", basePrice: 275.2 },
    { symbol: "PG", name: "Procter & Gamble Co.", sector: "Consumer Goods", basePrice: 155.85 },
    { symbol: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare", basePrice: 525.6 },
    { symbol: "HD", name: "Home Depot Inc.", sector: "Retail", basePrice: 385.45 },
    { symbol: "MA", name: "Mastercard Inc.", sector: "Financial", basePrice: 425.3 },
  ]

  return baseStocks.map((stock, index) => {
    const priceVariation = (Math.random() - 0.5) * 0.1 // ±5% variation
    const currentPrice = stock.basePrice * (1 + priceVariation)
    const previousPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.05)
    const change = currentPrice - previousPrice
    const changePercent = (change / previousPrice) * 100

    // Generate price history for the last 30 days
    const priceHistory = []
    let price = previousPrice
    for (let i = 30; i >= 0; i--) {
      const dailyChange = (Math.random() - 0.5) * 0.03 // ±1.5% daily variation
      price = price * (1 + dailyChange)
      priceHistory.push({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        price: price,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      })
    }

    return {
      id: (index + 1).toString(),
      symbol: stock.symbol,
      name: stock.name,
      price: currentPrice,
      previousPrice,
      change,
      changePercent,
      lastUpdated: new Date(),
      priceHistory,
      volume: Math.floor(Math.random() * 50000000) + 5000000,
      marketCap: Math.floor(currentPrice * (Math.random() * 5000000000 + 1000000000)),
      sector: stock.sector,
    }
  })
}

export const generateRealisticParticipants = (): Participant[] => {
  const names = [
    "Alex Johnson",
    "Sarah Chen",
    "Michael Rodriguez",
    "Emily Davis",
    "David Kim",
    "Jessica Wilson",
    "Robert Taylor",
    "Amanda Brown",
    "Christopher Lee",
    "Jennifer Garcia",
    "Matthew Anderson",
    "Lisa Martinez",
    "Daniel Thompson",
    "Ashley White",
    "James Harris",
    "Nicole Clark",
    "Ryan Lewis",
    "Stephanie Walker",
    "Kevin Hall",
    "Rachel Young",
  ]

  return names.map((name, index) => ({
    id: `participant_${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@stocksim.com`,
    username: `@${name.toLowerCase().replace(" ", "_")}_trader`,
    walletBalance: Math.floor(Math.random() * 50000) + 10000,
    totalPortfolioValue: Math.floor(Math.random() * 75000) + 5000,
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    riskTolerance: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
  }))
}

export const generateInitialNews = (): News[] => [
  {
    id: "1",
    headline: "Tech Giants Report Strong Q4 Earnings, Market Rallies",
    impact: 4,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    publishedBy: "Market Admin",
    category: "earnings",
  },
  {
    id: "2",
    headline: "Federal Reserve Signals Potential Interest Rate Changes",
    impact: 5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    publishedBy: "Market Admin",
    category: "monetary_policy",
  },
  {
    id: "3",
    headline: "Healthcare Sector Shows Resilience Amid Market Volatility",
    impact: 3,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    publishedBy: "Market Admin",
    category: "sector_analysis",
  },
  {
    id: "4",
    headline: "Electric Vehicle Sales Surge, Auto Stocks Gain Momentum",
    impact: 4,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    publishedBy: "Market Admin",
    category: "industry_trends",
  },
]
