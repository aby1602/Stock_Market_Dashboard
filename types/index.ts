export type UserRole = "admin" | "employee" | "participant"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

export interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
  lastUpdated: Date
}

export interface News {
  id: string
  headline: string
  impact: number // 1-5
  timestamp: Date
  publishedBy: string
}

export interface Portfolio {
  participantId: string
  stocks: PortfolioStock[]
  walletBalance: number
  totalValue: number
}

export interface PortfolioStock {
  stockId: string
  symbol: string
  quantity: number
  averageCost: number
  currentValue: number
}

export interface Trade {
  id: string
  participantId: string
  stockId: string
  symbol: string
  type: "buy" | "sell"
  quantity: number
  price: number
  timestamp: Date
  executedBy?: string
}

export interface Participant {
  id: string
  name: string
  email: string
  walletBalance: number
  totalPortfolioValue: number
}
