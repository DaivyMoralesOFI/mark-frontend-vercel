import { Card } from "@/shared/components/ui/Card"
import { FileText, Filter, Award } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Content Generation",
    description: "All AI-generated content matches your brand colors, fonts, and tone",
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    icon: Filter,
    title: "Style Filtering",
    description: "CNN models filter results to show only brand-consistent options",
    color: "text-chart-1",
    bgColor: "bg-accent",
  },
  {
    icon: Award,
    title: "Quality Scoring",
    description: "Each post gets a brand consistency score before publishing",
    color: "text-primary",
    bgColor: "bg-accent",
  },
]

export function UsageFeaturesSection() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl text-foreground">How We Use Your Brand DNA</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
