import { Card } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { RotateCcw } from "lucide-react"

export function LearningSettings() {

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Learning Settings</h2>

      <div className="space-y-6">
        {/* Surprise Mode Toggle */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Surprise Me More Often</p>
            <p className="text-xs text-muted-foreground">Show more diverse results occasionally</p>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Preferences
        </Button>
        <p className="text-xs text-muted-foreground text-center">This will clear all learned preferences</p>
      </div>
    </Card>
  )
}
