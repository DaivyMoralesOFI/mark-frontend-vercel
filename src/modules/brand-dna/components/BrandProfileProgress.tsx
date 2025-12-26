import { Card } from "@/shared/components/ui/card"
import { RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export function BrandProfileProgress() {
  const progress = 94

  return (
    <Card className="relative overflow-hidden bg-accent/50 border-border">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Brand Profile Completeness</h3>
            <p className="text-sm text-muted-foreground mt-1">Last synced 2 hours ago</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">{progress}%</span>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Re-sync from website
            </Button>
          </div>
        </div>

        <div className="relative h-3 bg-card rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
