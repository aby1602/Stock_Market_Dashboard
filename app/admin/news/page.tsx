"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

function NewsManagementContent() {
  const { news, publishNews } = useApp()
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [headline, setHeadline] = useState("")
  const [impact, setImpact] = useState("")

  const handlePublishNews = () => {
    if (headline && impact && user) {
      publishNews(headline, Number.parseInt(impact), user.name)
      setHeadline("")
      setImpact("")
      setIsDialogOpen(false)
    }
  }

  const getImpactColor = (impact: number) => {
    if (impact <= 2) return "bg-green-100 text-green-800"
    if (impact <= 3) return "bg-yellow-100 text-yellow-800"
    if (impact <= 4) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getImpactLabel = (impact: number) => {
    const labels = ["", "Very Low", "Low", "Medium", "High", "Very High"]
    return labels[impact] || "Unknown"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Publish News
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish News</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="News headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
              <Select value={impact} onValueChange={setImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low Impact</SelectItem>
                  <SelectItem value="2">2 - Low Impact</SelectItem>
                  <SelectItem value="3">3 - Medium Impact</SelectItem>
                  <SelectItem value="4">4 - High Impact</SelectItem>
                  <SelectItem value="5">5 - Very High Impact</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handlePublishNews} className="w-full">
                Publish News
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Published News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.headline}</h3>
                  <Badge className={getImpactColor(item.impact)}>Impact: {getImpactLabel(item.impact)}</Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Published by: {item.publishedBy}</span>
                  <span>{item.timestamp.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-gray-500 text-center py-8">No news published yet.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewsManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <NewsManagementContent />
    </ProtectedRoute>
  )
}
