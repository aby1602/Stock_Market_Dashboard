"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockPriceDisplay } from "@/components/stock-price-display"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, Newspaper, History } from "lucide-react"

function ParticipantDashboardContent() {
  const { stocks, news, trades, participants } = useApp()
  const { user } = useAuth()

  const participant = participants.find((p) => p.id === user?.id)
  const userTrades = trades.filter((t) => t.participantId === user?.id)

  const getImpactColor = (impact: number) => {
    if (impact <= 2) return "bg-green-100 text-green-800"
    if (impact <= 3) return "bg-yellow-100 text-yellow-800"
    if (impact <= 4) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Participant Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${participant?.walletBalance.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${participant?.totalPortfolioValue.toLocaleString() || "0"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((participant?.walletBalance || 0) + (participant?.totalPortfolioValue || 0)).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTrades.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Live Stock Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stocks.map((stock) => (
                <StockPriceDisplay key={stock.id} stock={stock} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2" />
              Market News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.slice(0, 5).map((item) => (
                <div key={item.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">{item.headline}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <Badge className={getImpactColor(item.impact)}>Impact Level {item.impact}</Badge>
                    <span className="text-sm text-gray-500">{item.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {news.length === 0 && <p className="text-gray-500 text-center py-8">No news available.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTrades.slice(0, 10).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    <Badge variant={trade.type === "buy" ? "default" : "secondary"} className="mr-2">
                      {trade.type.toUpperCase()}
                    </Badge>
                    {trade.quantity} shares of {trade.symbol}
                  </p>
                  <p className="text-sm text-gray-600">{trade.timestamp.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${trade.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total: ${(trade.quantity * trade.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
            {userTrades.length === 0 && <p className="text-gray-500 text-center py-8">No trades recorded yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ParticipantDashboard() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <ParticipantDashboardContent />
    </ProtectedRoute>
  )
}
