"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Stock, News, Portfolio, Trade, Participant, SystemState } from "@/types"
import { SimulatedDatabase } from "@/lib/database"
import { generateRealisticStocks, generateRealisticParticipants, generateInitialNews } from "@/lib/mock-data"

interface AppContextType {
  stocks: Stock[]
  news: News[]
  portfolios: Portfolio[]
  trades: Trade[]
  participants: Participant[]
  systemState: SystemState
  updateStock: (stockId: string, newPrice: number) => void
  addStock: (stock: Omit<Stock, "id" | "lastUpdated" | "priceHistory">) => void
  deleteStock: (stockId: string) => void
  publishNews: (headline: string, impact: number, publishedBy: string, category: string) => void
  updateWalletBalance: (participantId: string, newBalance: number) => void
  addTrade: (trade: Omit<Trade, "id" | "timestamp">) => void
  resetSystem: () => void
  simulateLiveTrading: () => void
  isLiveTrading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<News[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [systemState, setSystemState] = useState<SystemState>({
    lastReset: new Date(),
    totalUsers: 0,
    totalTrades: 0,
    systemStatus: "active",
  })
  const [isLiveTrading, setIsLiveTrading] = useState(false)

  const db = SimulatedDatabase.getInstance()

  // Initialize data from database or create initial data
  useEffect(() => {
    const loadData = () => {
      try {
        let loadedStocks = db.getStocks()
        let loadedParticipants = db.getParticipants()
        let loadedNews = db.getNews()
        const loadedTrades = db.getTrades()
        const loadedSystemState = db.getSystemState()

        // Convert date strings back to Date objects
        if (loadedStocks.length > 0) {
          loadedStocks = loadedStocks.map((stock: any) => ({
            ...stock,
            lastUpdated: new Date(stock.lastUpdated),
            priceHistory:
              stock.priceHistory?.map((point: any) => ({
                ...point,
                timestamp: new Date(point.timestamp),
              })) || [],
          }))
        } else {
          loadedStocks = generateRealisticStocks()
          db.saveStocks(loadedStocks)
        }

        if (loadedParticipants.length > 0) {
          loadedParticipants = loadedParticipants.map((participant: any) => ({
            ...participant,
            joinedAt: new Date(participant.joinedAt),
            lastActive: new Date(participant.lastActive),
          }))
        } else {
          loadedParticipants = generateRealisticParticipants()
          db.saveParticipants(loadedParticipants)
        }

        if (loadedNews.length > 0) {
          loadedNews = loadedNews.map((news: any) => ({
            ...news,
            timestamp: new Date(news.timestamp),
          }))
        } else {
          loadedNews = generateInitialNews()
          db.saveNews(loadedNews)
        }

        const processedTrades = loadedTrades.map((trade: any) => ({
          ...trade,
          timestamp: new Date(trade.timestamp),
        }))

        const processedSystemState = {
          ...loadedSystemState,
          lastReset: new Date(loadedSystemState.lastReset),
        }

        setStocks(loadedStocks)
        setParticipants(loadedParticipants)
        setNews(loadedNews)
        setTrades(processedTrades)
        setSystemState(processedSystemState)
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to initial data
        const newStocks = generateRealisticStocks()
        const newParticipants = generateRealisticParticipants()
        const newNews = generateInitialNews()

        setStocks(newStocks)
        setParticipants(newParticipants)
        setNews(newNews)
        setTrades([])
        setSystemState({
          lastReset: new Date(),
          totalUsers: 0,
          totalTrades: 0,
          systemStatus: "active",
        })
      }
    }

    loadData()
  }, [])

  // Live trading simulation
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isLiveTrading) {
      interval = setInterval(() => {
        setStocks((prevStocks) => {
          const updatedStocks = prevStocks.map((stock) => {
            // Random price movement (±2%)
            const changePercent = (Math.random() - 0.5) * 0.04
            const newPrice = stock.price * (1 + changePercent)
            const change = newPrice - stock.price
            const changePercentValue = (change / stock.price) * 100

            // Add to price history
            const newPricePoint = {
              timestamp: new Date(),
              price: newPrice,
              volume: Math.floor(Math.random() * 1000000) + 100000,
            }

            return {
              ...stock,
              previousPrice: stock.price,
              price: newPrice,
              change,
              changePercent: changePercentValue,
              lastUpdated: new Date(),
              priceHistory: [...stock.priceHistory.slice(-99), newPricePoint], // Keep last 100 points
              volume: stock.volume + newPricePoint.volume,
            }
          })

          db.saveStocks(updatedStocks)
          return updatedStocks
        })
      }, 5000) // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLiveTrading])

  const updateStock = (stockId: string, newPrice: number) => {
    setStocks((prev) => {
      const updated = prev.map((stock) => {
        if (stock.id === stockId) {
          const change = newPrice - stock.price
          const changePercent = (change / stock.price) * 100

          const newPricePoint = {
            timestamp: new Date(),
            price: newPrice,
            volume: Math.floor(Math.random() * 1000000) + 100000,
          }

          const updatedStock = {
            ...stock,
            previousPrice: stock.price,
            price: newPrice,
            change,
            changePercent,
            lastUpdated: new Date(),
            priceHistory: [...stock.priceHistory.slice(-99), newPricePoint],
          }
          return updatedStock
        }
        return stock
      })

      db.saveStocks(updated)
      return updated
    })
  }

  const addStock = (stockData: Omit<Stock, "id" | "lastUpdated" | "priceHistory">) => {
    const newStock: Stock = {
      ...stockData,
      id: Date.now().toString(),
      lastUpdated: new Date(),
      priceHistory: [
        {
          timestamp: new Date(),
          price: stockData.price,
          volume: Math.floor(Math.random() * 1000000) + 100000,
        },
      ],
    }

    setStocks((prev) => {
      const updated = [...prev, newStock]
      db.saveStocks(updated)
      return updated
    })
  }

  const deleteStock = (stockId: string) => {
    setStocks((prev) => {
      const updated = prev.filter((stock) => stock.id !== stockId)
      db.saveStocks(updated)
      return updated
    })
  }

  const publishNews = (headline: string, impact: number, publishedBy: string, category: string) => {
    const newNews: News = {
      id: Date.now().toString(),
      headline,
      impact,
      timestamp: new Date(),
      publishedBy,
      category,
    }

    setNews((prev) => {
      const updated = [newNews, ...prev]
      db.saveNews(updated)
      return updated
    })
  }

  const updateWalletBalance = (participantId: string, newBalance: number) => {
    setParticipants((prev) => {
      const updated = prev.map((p) => (p.id === participantId ? { ...p, walletBalance: newBalance } : p))
      db.saveParticipants(updated)
      return updated
    })
  }

  const addTrade = (tradeData: Omit<Trade, "id" | "timestamp">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "executed",
    }

    setTrades((prev) => {
      const updated = [newTrade, ...prev]
      db.saveTrades(updated)
      return updated
    })

    // Update system state
    setSystemState((prev) => {
      const updated = { ...prev, totalTrades: prev.totalTrades + 1 }
      db.saveSystemState(updated)
      return updated
    })
  }

  const resetSystem = () => {
    // Reset all data to initial state
    const newStocks = generateRealisticStocks()
    const newParticipants = generateRealisticParticipants()
    const newNews = generateInitialNews()
    const newSystemState: SystemState = {
      lastReset: new Date(),
      totalUsers: 0,
      totalTrades: 0,
      systemStatus: "active",
    }

    setStocks(newStocks)
    setParticipants(newParticipants)
    setNews(newNews)
    setTrades([])
    setPortfolios([])
    setSystemState(newSystemState)

    // Clear database
    db.resetAll()
    db.saveStocks(newStocks)
    db.saveParticipants(newParticipants)
    db.saveNews(newNews)
    db.saveTrades([])
    db.saveSystemState(newSystemState)
  }

  const simulateLiveTrading = () => {
    setIsLiveTrading(!isLiveTrading)
  }

  return (
    <AppContext.Provider
      value={{
        stocks,
        news,
        portfolios,
        trades,
        participants,
        systemState,
        updateStock,
        addStock,
        deleteStock,
        publishNews,
        updateWalletBalance,
        addTrade,
        resetSystem,
        simulateLiveTrading,
        isLiveTrading,
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
