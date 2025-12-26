import { Card } from "@/shared/components/ui/card"
import { Check } from "lucide-react"    

export function TypographySection() {
  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Typography</h3>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Check className="h-4 w-4" />
            Detected
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Primary Font</p>
            <h4 className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Inter
            </h4>
            <p className="text-sm text-muted-foreground">The quick brown fox jumps</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Secondary Font</p>
            <h4 className="text-2xl font-bold mb-1">SF Pro Display</h4>
            <p className="text-sm text-muted-foreground">The quick brown fox jumps</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
