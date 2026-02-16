import { Card } from "@/shared/components/ui/card"

export function FeedbackOverview() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Feedback Overview</h2>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Donut Chart */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
            {/* Liked segment (67%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="168 83"
              className="text-primary"
            />
            {/* Disliked segment (33%) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray="83 168"
              strokeDashoffset="-168"
              className="text-muted-foreground"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-foreground">Liked</span>
          </div>
          <span className="text-sm font-semibold text-foreground">67%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-sm text-foreground">Disliked</span>
          </div>
          <span className="text-sm font-semibold text-foreground">33%</span>
        </div>
      </div>
    </Card>
  )
}