    import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card"
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, DollarSign } from "lucide-react"

const metrics = [
  {
    title: "Total Reach",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Engagement Rate",
    value: "6.9%",
    change: "+2.1%",
    trend: "up",
    icon: MousePointer,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "New Followers",
    value: "12.8K",
    change: "-3.2%",
    trend: "down",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Conversion Rate",
    value: "3.7%",
    change: "+0.8%",
    trend: "up",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="flex items-center mt-1">
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
