"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

function TradeEntryContent() {
  const { stocks, trades, addTrade, participants } = useApp()
  const { user } = useAuth()
  const [tradeForm, setTradeForm] = useState({
    participantId: "",
    stockId: "",
    type: "",
    quantity: "",
    price: "",
  })

  const handleSubmitTrade = () => {
    if (tradeForm.participantId && tradeForm.stockId && tradeForm.type && tradeForm.quantity && tradeForm.price) {
      const stock = stocks.find((s) => s.id === tradeForm.stockId)
      if (stock) {
        addTrade({
          participantId: tradeForm.participantId,
          stockId: tradeForm.stockId,
          symbol: stock.symbol,
          type: tradeForm.type as "buy" | "sell",
          quantity: Number.parseInt(tradeForm.quantity),
          price: Number.parseFloat(tradeForm.price),
          executedBy: user?.name,
        })

        setTradeForm({
          participantId: "",
          stockId: "",
          type: "",
          quantity: "",
          price: "",
        })
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trade Entry</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trade Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter New Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={tradeForm.participantId}
              onValueChange={(value) => setTradeForm({ ...tradeForm, participantId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select participant" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name} ({participant.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tradeForm.stockId} onValueChange={(value) => setTradeForm({ ...tradeForm, stockId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select stock" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tradeForm.type} onValueChange={(value) => setTradeForm({ ...tradeForm, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Buy or Sell" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Quantity"
              value={tradeForm.quantity}
              onChange={(e) => setTradeForm({ ...tradeForm, quantity: e.target.value })}
            />

            <Input
              type="number"
              step="0.01"
              placeholder="Price per share"
              value={tradeForm.price}
              onChange={(e) => setTradeForm({ ...tradeForm, price: e.target.value })}
            />

            <Button onClick={handleSubmitTrade} className="w-full">
              Execute Trade
            </Button>
          </CardContent>
        </Card>

        {/* Current Stock Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stocks.map((stock) => (
                <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${stock.price.toFixed(2)}</p>
                    <p className={`text-sm ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Executed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.slice(0, 20).map((trade) => {
                const participant = participants.find((p) => p.id === trade.participantId)
                return (
                  <TableRow key={trade.id}>
                    <TableCell>{participant?.name || trade.participantId}</TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.type === "buy" ? "default" : "secondary"}>{trade.type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell>${trade.price.toFixed(2)}</TableCell>
                    <TableCell>${(trade.quantity * trade.price).toFixed(2)}</TableCell>
                    <TableCell>{trade.timestamp.toLocaleString()}</TableCell>
                    <TableCell>{trade.executedBy || "System"}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TradeEntry() {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <TradeEntryContent />
    </ProtectedRoute>
  )
}
