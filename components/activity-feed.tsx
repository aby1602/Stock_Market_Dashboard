"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, User, DollarSign, Settings } from "lucide-react"

export function ActivityFeed() {
  const { activityLogs } = useAuth()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trade":
        return <DollarSign className="h-4 w-4" />
      case "admin":
        return <Settings className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trade":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "user":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {activityLogs.slice(0, 50).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-shrink-0">
                  <Badge className={getCategoryColor(log.category)}>{getCategoryIcon(log.category)}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{log.action}</p>
                  <p className="text-sm text-gray-400">{log.details}</p>
                  <p className="text-xs text-gray-500">{log.timestamp.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activityLogs.length === 0 && <p className="text-gray-400 text-center py-8">No activity recorded yet.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
