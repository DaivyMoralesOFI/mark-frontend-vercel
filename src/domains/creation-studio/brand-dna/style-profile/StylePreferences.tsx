import { Card } from "@/shared/components/ui/Card"
import { Progress } from "@/shared/components/ui/Progress"
import { TrendingUp } from "lucide-react"

const preferences = [
  { name: "Minimalist", value: 78 },
  { name: "Bold Typography", value: 65 },
  { name: "Professional Tone", value: 82 },
  { name: "Data Visualization", value: 72 },
  { name: "Whitespace", value: 68 },
]

export function StylePreferences() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Your Style Preferences</h2>
        <span className="text-sm text-muted-foreground ml-2">Based on 142 interactions</span>
      </div>

      <div className="space-y-6">
        {preferences.map((pref) => (
          <div key={pref.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{pref.name}</span>
              <span className="text-sm font-semibold text-primary">{pref.value}%</span>
            </div>
            <Progress value={pref.value} className="h-2 bg-muted [&>div]:bg-primary" />
          </div>
        ))}
      </div>
    </Card>
  )
}
