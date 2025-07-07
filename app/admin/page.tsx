"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockPriceDisplay } from "@/components/stock-price-display"
import { TrendingUp, Users, DollarSign, Newspaper } from "lucide-react"

function AdminDashboardContent() {
  const { stocks, participants, news, trades } = useApp()

  const totalTrades = trades.length
  const totalParticipants = participants.length
  const totalStocks = stocks.length
  const totalNews = news.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stocks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStocks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Published</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stocks.map((stock) => (
                <StockPriceDisplay key={stock.id} stock={stock} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Participant Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants
                .sort((a, b) => b.totalPortfolioValue - a.totalPortfolioValue)
                .map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-600">{participant.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${participant.totalPortfolioValue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Portfolio Value</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
