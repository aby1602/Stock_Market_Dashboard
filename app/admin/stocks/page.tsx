"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"

function StockManagementContent() {
  const { stocks, addStock, updateStock, deleteStock } = useApp()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState("")

  // Form state for adding new stock
  const [newStock, setNewStock] = useState({
    symbol: "",
    name: "",
    price: "",
    previousPrice: "",
    change: 0,
    changePercent: 0,
  })

  const handleAddStock = () => {
    if (newStock.symbol && newStock.name && newStock.price) {
      const price = Number.parseFloat(newStock.price)
      const previousPrice = Number.parseFloat(newStock.previousPrice) || price
      const change = price - previousPrice
      const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0

      addStock({
        symbol: newStock.symbol.toUpperCase(),
        name: newStock.name,
        price,
        previousPrice,
        change,
        changePercent,
      })

      setNewStock({ symbol: "", name: "", price: "", previousPrice: "", change: 0, changePercent: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdatePrice = (stockId: string) => {
    if (newPrice) {
      updateStock(stockId, Number.parseFloat(newPrice))
      setEditingStock(null)
      setNewPrice("")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Stock Symbol (e.g., AAPL)"
                value={newStock.symbol}
                onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
              />
              <Input
                placeholder="Company Name"
                value={newStock.name}
                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Current Price"
                value={newStock.price}
                onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Previous Price (optional)"
                value={newStock.previousPrice}
                onChange={(e) => setNewStock({ ...newStock, previousPrice: e.target.value })}
              />
              <Button onClick={handleAddStock} className="w-full">
                Add Stock
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>${stock.price.toFixed(2)}</TableCell>
                  <TableCell className={stock.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </TableCell>
                  <TableCell>{stock.lastUpdated.toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingStock === stock.id ? (
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="New price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-24"
                          />
                          <Button size="sm" onClick={() => handleUpdatePrice(stock.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingStock(null)}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStock(stock.id)
                              setNewPrice(stock.price.toString())
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteStock(stock.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StockManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <StockManagementContent />
    </ProtectedRoute>
  )
}
