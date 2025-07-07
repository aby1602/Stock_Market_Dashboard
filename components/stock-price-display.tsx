"use client"

import type { Stock } from "@/types"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StockPriceDisplayProps {
  stock: Stock
}

export function StockPriceDisplay({ stock }: StockPriceDisplayProps) {
  const isPositive = stock.change >= 0

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="font-semibold text-lg">{stock.symbol}</h3>
        <p className="text-sm text-gray-600">{stock.name}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">${stock.price.toFixed(2)}</p>
        <div className={`flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span className="text-sm">
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  )
}
