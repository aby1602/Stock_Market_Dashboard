export type UserRole = "admin" | "employee" | "participant"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  username: string
  password: string
  createdAt: Date
  lastLogin: Date
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
  priceHistory: PricePoint[]
  volume: number
  marketCap: number
  sector: string
}

export interface PricePoint {
  timestamp: Date
  price: number
  volume: number
}

export interface News {
  id: string
  headline: string
  impact: number // 1-5
  timestamp: Date
  publishedBy: string
  category: string
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
  status: "pending" | "executed" | "cancelled"
}

export interface Participant {
  id: string
  name: string
  email: string
  username: string
  walletBalance: number
  totalPortfolioValue: number
  joinedAt: Date
  lastActive: Date
  riskTolerance: "low" | "medium" | "high"
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details: string
  timestamp: Date
  category: "trade" | "admin" | "system" | "user"
}

export interface SystemState {
  lastReset: Date
  totalUsers: number
  totalTrades: number
  systemStatus: "active" | "maintenance"
}
