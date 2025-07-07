"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

function PortfolioContent() {
  const { stocks, trades, participants } = useApp()
  const { user } = useAuth()

  const participant = participants.find((p) => p.id === user?.id)
  const userTrades = trades.filter((t) => t.participantId === user?.id)

  // Calculate portfolio holdings
  const portfolioHoldings = userTrades.reduce(
    (acc, trade) => {
      const key = trade.symbol
      if (!acc[key]) {
        acc[key] = {
          symbol: trade.symbol,
          totalShares: 0,
          totalCost: 0,
          trades: [],
        }
      }

      if (trade.type === "buy") {
        acc[key].totalShares += trade.quantity
        acc[key].totalCost += trade.quantity * trade.price
      } else {
        acc[key].totalShares -= trade.quantity
        acc[key].totalCost -= trade.quantity * trade.price
      }

      acc[key].trades.push(trade)
      return acc
    },
    {} as Record<string, any>,
  )

  const portfolioWithCurrentValues = Object.values(portfolioHoldings)
    .filter((holding: any) => holding.totalShares > 0)
    .map((holding: any) => {
      const currentStock = stocks.find((s) => s.symbol === holding.symbol)
      const currentValue = currentStock ? holding.totalShares * currentStock.price : 0
      const averageCost = holding.totalShares > 0 ? holding.totalCost / holding.totalShares : 0
      const gainLoss = currentValue - holding.totalCost
      const gainLossPercent = holding.totalCost > 0 ? (gainLoss / holding.totalCost) * 100 : 0

      return {
        ...holding,
        currentPrice: currentStock?.price || 0,
        currentValue,
        averageCost,
        gainLoss,
        gainLossPercent,
      }
    })

  const totalPortfolioValue = portfolioWithCurrentValues.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalCost = portfolioWithCurrentValues.reduce((sum, holding) => sum + holding.totalCost, 0)
  const totalGainLoss = totalPortfolioValue - totalCost
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Portfolio</h1>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
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
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLoss >= 0 ? "+" : ""}${totalGainLoss.toFixed(2)}
            </div>
            <p className={`text-sm ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLoss >= 0 ? "+" : ""}
              {totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((participant?.walletBalance || 0) + totalPortfolioValue).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolioWithCurrentValues.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Avg Cost</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioWithCurrentValues.map((holding) => (
                  <TableRow key={holding.symbol}>
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell>{holding.totalShares}</TableCell>
                    <TableCell>${holding.averageCost.toFixed(2)}</TableCell>
                    <TableCell>${holding.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>${holding.currentValue.toFixed(2)}</TableCell>
                    <TableCell className={holding.gainLoss >= 0 ? "text-green-600" : "text-red-600"}>
                      {holding.gainLoss >= 0 ? "+" : ""}${holding.gainLoss.toFixed(2)}
                    </TableCell>
                    <TableCell className={holding.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"}>
                      {holding.gainLossPercent >= 0 ? "+" : ""}
                      {holding.gainLossPercent.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any stock holdings yet.</p>
              <p className="text-sm text-gray-400">Start trading to build your portfolio!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Portfolio() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <PortfolioContent />
    </ProtectedRoute>
  )
}
