"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

function TradeHistoryContent() {
  const { trades } = useApp()
  const { user } = useAuth()

  const userTrades = trades.filter((t) => t.participantId === user?.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trade History</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Your Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {userTrades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Executed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTrades
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>{trade.timestamp.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === "buy" ? "default" : "secondary"}>
                          {trade.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell>${trade.price.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">${(trade.quantity * trade.price).toFixed(2)}</TableCell>
                      <TableCell>{trade.executedBy || "System"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't made any trades yet.</p>
              <p className="text-sm text-gray-400">Contact an employee to execute your first trade!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function TradeHistory() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <TradeHistoryContent />
    </ProtectedRoute>
  )
}
