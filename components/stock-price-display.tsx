"use client"

import type { Stock } from "@/types"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StockPriceDisplayProps {
  stock: Stock
  showChart?: boolean
}

export function StockPriceDisplay({ stock, showChart = false }: StockPriceDisplayProps) {
  const isPositive = stock.change >= 0

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 card-hover">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-bold text-lg text-white">{stock.symbol}</h3>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">{stock.sector}</Badge>
        </div>
        <p className="text-sm text-gray-400 mb-1">{stock.name}</p>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Vol: {stock.volume.toLocaleString()}</span>
          <span>•</span>
          <span>Cap: ${(stock.marketCap / 1000000000).toFixed(1)}B</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</p>
        <div className={`flex items-center justify-end space-x-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-medium">
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Updated: {stock.lastUpdated.toLocaleTimeString()}</p>
      </div>

      {showChart && (
        <div className="ml-4">
          <BarChart3 className="h-6 w-6 text-purple-400" />
        </div>
      )}
    </div>
  )
}
