import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"

export function PerformanceChart() {
  const data = [
    { day: "Mon", reach: 85, engagement: 65, clicks: 45, conversions: 12 },
    { day: "Tue", reach: 92, engagement: 78, clicks: 58, conversions: 18 },
    { day: "Wed", reach: 78, engagement: 82, clicks: 62, conversions: 15 },
    { day: "Thu", reach: 95, engagement: 88, clicks: 71, conversions: 22 },
    { day: "Fri", reach: 88, engagement: 75, clicks: 55, conversions: 16 },
    { day: "Sat", reach: 76, engagement: 68, clicks: 42, conversions: 11 },
    { day: "Sun", reach: 82, engagement: 72, clicks: 48, conversions: 14 },
  ]

  const maxValue = Math.max(...data.flatMap((d) => [d.reach, d.engagement, d.clicks, d.conversions]))

  const totalReach = data.reduce((sum, d) => sum + d.reach, 0)
  const totalEngagement = data.reduce((sum, d) => sum + d.engagement, 0)
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0)
  const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Weekly Performance</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 days
            </Button>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Reach: {totalReach}K
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            Engagement: {totalEngagement}K
          </Badge>
          <Badge variant="outline" className="text-green-600 border-green-200">
            Clicks: {totalClicks}K
          </Badge>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Conversions: {totalConversions}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full flex space-x-0.5 items-end h-48">
                <div
                  className="bg-blue-500 rounded-t flex-1"
                  style={{ height: `${(item.reach / maxValue) * 100}%` }}
                  title={`Reach: ${item.reach}K`}
                ></div>
                <div
                  className="bg-purple-500 rounded-t flex-1"
                  style={{ height: `${(item.engagement / maxValue) * 100}%` }}
                  title={`Engagement: ${item.engagement}K`}
                ></div>
                <div
                  className="bg-green-500 rounded-t flex-1"
                  style={{ height: `${(item.clicks / maxValue) * 100}%` }}
                  title={`Clicks: ${item.clicks}K`}
                ></div>
                <div
                  className="bg-orange-500 rounded-t flex-1"
                  style={{ height: `${(item.conversions / maxValue) * 100}%` }}
                  title={`Conversions: ${item.conversions}`}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{item.day}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium">AVG REACH</p>
            <p className="text-lg font-bold text-blue-900">{Math.round(totalReach / 7)}K</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-medium">AVG ENGAGEMENT</p>
            <p className="text-lg font-bold text-purple-900">{Math.round(totalEngagement / 7)}K</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 font-medium">AVG CLICKS</p>
            <p className="text-lg font-bold text-green-900">{Math.round(totalClicks / 7)}K</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 font-medium">CONVERSION RATE</p>
            <p className="text-lg font-bold text-orange-900">{((totalConversions / totalClicks) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
