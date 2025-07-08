"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StockChart } from "@/components/stock-chart"
import { ActivityFeed } from "@/components/activity-feed"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Users,
  DollarSign,
  Newspaper,
  RefreshCw,
  Play,
  Pause,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function AdminDashboardContent() {
  const { stocks, participants, news, trades, resetSystem, simulateLiveTrading, isLiveTrading, systemState } = useApp()
  const { addActivityLog } = useAuth()

  // Add safety checks
  const totalTrades = trades?.length || 0
  const totalParticipants = participants?.length || 0
  const totalStocks = stocks?.length || 0
  const totalNews = news?.length || 0

  const topPerformingStocks = (stocks || [])
    .filter((stock) => stock && typeof stock.changePercent === "number")
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)

  const recentTrades = (trades || []).slice(0, 10)

  const handleSystemReset = () => {
    resetSystem()
    addActivityLog("System Reset", "Admin reset the entire system to fresh state", "admin")
  }

  const handleToggleLiveTrading = () => {
    simulateLiveTrading()
    addActivityLog(
      isLiveTrading ? "Live Trading Stopped" : "Live Trading Started",
      `Admin ${isLiveTrading ? "stopped" : "started"} live trading simulation`,
      "admin",
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <div className="flex space-x-3">
          <Button
            onClick={handleToggleLiveTrading}
            variant={isLiveTrading ? "destructive" : "default"}
            className={`flex items-center space-x-2 ${
              isLiveTrading ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isLiveTrading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isLiveTrading ? "Stop Live Trading" : "Start Live Trading"}</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 text-red-400 border-red-500/50 bg-red-500/10 hover:bg-red-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset System</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Confirm System Reset</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-300">
                  This will permanently delete all data and reset the system to its initial state:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  <li>All trades will be deleted</li>
                  <li>All user portfolios will be reset</li>
                  <li>Stock prices will be reset to initial values</li>
                  <li>All news will be cleared</li>
                  <li>Activity logs will be cleared</li>
                </ul>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSystemReset}
                    variant="destructive"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Yes, Reset Everything
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Status */}
      <div className="mb-6">
        <Card className="border-l-4 border-l-blue-500 bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">System Status</p>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={
                      systemState.systemStatus === "active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {systemState.systemStatus.toUpperCase()}
                  </Badge>
                  {isLiveTrading && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                      LIVE TRADING
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Last Reset</p>
                <p className="font-medium text-white">{systemState.lastReset.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Active Stocks</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalStocks}</div>
            <p className="text-xs text-blue-400">Market instruments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">Participants</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalParticipants}</div>
            <p className="text-xs text-green-400">Active traders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">Total Trades</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTrades}</div>
            <p className="text-xs text-purple-400">Executed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-400">News Published</CardTitle>
            <Newspaper className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalNews}</div>
            <p className="text-xs text-orange-400">Market updates</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <BarChart3 className="h-5 w-5" />
              <span>Top Performing Stocks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingStocks.map((stock, index) => (
                <div key={stock.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">#{index + 1}</Badge>
                    <div>
                      <p className="font-semibold text-white">{stock.symbol}</p>
                      <p className="text-sm text-gray-400">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${stock.price.toFixed(2)}</p>
                    <p className={`text-sm ${stock.changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Participant Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants
                .sort((a, b) => b.totalPortfolioValue + b.walletBalance - (a.totalPortfolioValue + a.walletBalance))
                .slice(0, 5)
                .map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`${
                          index === 0
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-white">{participant.name}</p>
                        <p className="text-sm text-gray-400">{participant.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        ${(participant.totalPortfolioValue + participant.walletBalance).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Total Value</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {stocks.slice(0, 4).map((stock) => (
          <Card key={stock.id} className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>
                  {stock.symbol} - {stock.name}
                </span>
                <Badge
                  className={
                    stock.changePercent >= 0
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StockChart stock={stock} height={200} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
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
