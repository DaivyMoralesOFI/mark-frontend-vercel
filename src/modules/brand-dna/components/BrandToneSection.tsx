import { Card } from "@/shared/components/ui/card"
import { Check } from "lucide-react"

export function BrandToneSection() {
  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Brand Tone & Mood</h3>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Check className="h-4 w-4" />
            Analyzed
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Voice</p>
            <p className="font-semibold text-foreground">Professional & Consultative</p>
          </div>

          <div className="p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Mood</p>
            <p className="font-semibold text-foreground">Trustworthy & Expert</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
