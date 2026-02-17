import { Card } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"

const metrics = [
  { name: "Style Understanding", value: 82 },
  { name: "Pattern Recognition", value: 75 },
  { name: "Preference Accuracy", value: 89 },
]

export function LearningProgress() {
  return (
    <Card className="p-6 bg-accent/50 h-full">
      <h2 className="text-lg font-semibold text-foreground mb-6">Learning Progress</h2>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{metric.name}</span>
              <span className="text-sm font-semibold text-primary">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className="h-2 bg-muted [&>div]:bg-primary" />
          </div>
        ))}
      </div>
    </Card>
  )
}
