"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Stock, News, Portfolio, Trade, Participant } from "@/types"

interface AppContextType {
  stocks: Stock[]
  news: News[]
  portfolios: Portfolio[]
  trades: Trade[]
  participants: Participant[]
  updateStock: (stockId: string, newPrice: number) => void
  addStock: (stock: Omit<Stock, "id" | "lastUpdated">) => void
  deleteStock: (stockId: string) => void
  publishNews: (headline: string, impact: number, publishedBy: string) => void
  updateWalletBalance: (participantId: string, newBalance: number) => void
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock data
const initialStocks: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    previousPrice: 148.5,
    change: 1.75,
    changePercent: 1.18,
    lastUpdated: new Date(),
  },
  {
    id: "2",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 2750.8,
    previousPrice: 2780.2,
    change: -29.4,
    changePercent: -1.06,
    lastUpdated: new Date(),
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 305.15,
    previousPrice: 302.9,
    change: 2.25,
    changePercent: 0.74,
    lastUpdated: new Date(),
  },
]

const initialNews: News[] = [
  {
    id: "1",
    headline: "Tech stocks rally on positive earnings reports",
    impact: 4,
    timestamp: new Date(Date.now() - 3600000),
    publishedBy: "Admin User",
  },
  {
    id: "2",
    headline: "Federal Reserve hints at interest rate changes",
    impact: 5,
    timestamp: new Date(Date.now() - 7200000),
    publishedBy: "Admin User",
  },
]

const initialParticipants: Participant[] = [
  {
    id: "3",
    name: "Participant User",
    email: "participant@example.com",
    walletBalance: 10000,
    totalPortfolioValue: 15000,
  },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks)
  const [news, setNews] = useState<News[]>(initialNews)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)

  const updateStock = (stockId: string, newPrice: number) => {
    setStocks((prev) =>
      prev.map((stock) => {
        if (stock.id === stockId) {
          const change = newPrice - stock.price
          const changePercent = (change / stock.price) * 100
          return {
            ...stock,
            previousPrice: stock.price,
            price: newPrice,
            change,
            changePercent,
            lastUpdated: new Date(),
          }
        }
        return stock
      }),
    )
  }

  const addStock = (stockData: Omit<Stock, "id" | "lastUpdated">) => {
    const newStock: Stock = {
      ...stockData,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    }
    setStocks((prev) => [...prev, newStock])
  }

  const deleteStock = (stockId: string) => {
    setStocks((prev) => prev.filter((stock) => stock.id !== stockId))
  }

  const publishNews = (headline: string, impact: number, publishedBy: string) => {
    const newNews: News = {
      id: Date.now().toString(),
      headline,
      impact,
      timestamp: new Date(),
      publishedBy,
    }
    setNews((prev) => [newNews, ...prev])
  }

  const updateWalletBalance = (participantId: string, newBalance: number) => {
    setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, walletBalance: newBalance } : p)))
  }

  const addTrade = (tradeData: Omit<Trade, "id" | "timestamp">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setTrades((prev) => [newTrade, ...prev])
  }

  return (
    <AppContext.Provider
      value={{
        stocks,
        news,
        portfolios,
        trades,
        participants,
        updateStock,
        addStock,
        deleteStock,
        publishNews,
        updateWalletBalance,
        addTrade,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
