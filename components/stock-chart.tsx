"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Stock } from "@/types"

interface StockChartProps {
  stock: Stock
  height?: number
}

export function StockChart({ stock, height = 300 }: StockChartProps) {
  if (!stock.priceHistory || stock.priceHistory.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        <p>No price history available</p>
      </div>
    )
  }

  const chartData = stock.priceHistory.slice(-20).map((point, index) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: Number(point.price.toFixed(2)),
    volume: point.volume,
    index,
  }))

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 1", "dataMax + 1"]} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: stock.change >= 0 ? "#10b981" : "#ef4444" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
