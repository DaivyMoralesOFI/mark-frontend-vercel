import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { MessageSquare, Heart, Share, TrendingUp } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "post",
    platform: "Instagram",
    content: "New product launch campaign",
    engagement: "2.4K",
    time: "2 hours ago",
    status: "trending",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "comment",
    platform: "Twitter",
    content: "Customer feedback on latest ad",
    engagement: "156",
    time: "4 hours ago",
    status: "active",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "share",
    platform: "LinkedIn",
    content: "Industry insights article",
    engagement: "89",
    time: "6 hours ago",
    status: "shared",
    icon: Share,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "like",
    platform: "Facebook",
    content: "Brand awareness campaign",
    engagement: "1.2K",
    time: "8 hours ago",
    status: "liked",
    icon: Heart,
    color: "text-red-600",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-pink-50 transition-colors"
          >
            <div className="p-2 rounded-full bg-gray-100">
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.content}</p>
                <Badge variant="secondary" className="bg-purple-500 text-xs text-white">
                  {activity.platform}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">{activity.time}</p>
                <p className="text-xs font-medium text-gray-700">{activity.engagement} interactions</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-full">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900">Mark suggests optimizing your posting schedule</p>
              <p className="text-xs text-purple-700 mt-1">AI recommendation based on engagement patterns</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
