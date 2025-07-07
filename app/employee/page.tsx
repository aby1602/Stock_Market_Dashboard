"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockPriceDisplay } from "@/components/stock-price-display"
import { TrendingUp, Clock, BarChart3 } from "lucide-react"

function EmployeeDashboardContent() {
  const { stocks, trades } = useApp()

  const todayTrades = trades.filter((trade) => {
    const today = new Date()
    const tradeDate = new Date(trade.timestamp)
    return tradeDate.toDateString() === today.toDateString()
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stocks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stocks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTrades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stocks.length > 0
                ? new Date(Math.max(...stocks.map((s) => s.lastUpdated.getTime()))).toLocaleTimeString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Prices */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Stock Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <StockPriceDisplay key={stock.id} stock={stock} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Trade Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trades.slice(0, 10).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    {trade.type.toUpperCase()} {trade.quantity} shares of {trade.symbol}
                  </p>
                  <p className="text-sm text-gray-600">Participant ID: {trade.participantId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${trade.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{trade.timestamp.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {trades.length === 0 && <p className="text-gray-500 text-center py-8">No trades recorded yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EmployeeDashboard() {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <EmployeeDashboardContent />
    </ProtectedRoute>
  )
}
