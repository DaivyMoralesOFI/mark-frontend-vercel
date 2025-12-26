import { Card } from "@/shared/components/ui/card"
import { Check } from "lucide-react"

const colors = [
  { hex: "#F59E0B", name: "Primary" },
  { hex: "#FCD34D", name: "Accent" },
  { hex: "#FBF24D", name: "Highlight" },
  { hex: "#1F2937", name: "Dark" },
  { hex: "#000000", name: "Black" },
  { hex: "#FFFFFF", name: "White" },
]

export function ColorPaletteSection() {
  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Color Palette</h3>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Check className="h-4 w-4" />
            Extracted
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {colors.map((color) => (
            <div key={color.hex} className="space-y-2">
              <div
                className="aspect-square rounded-lg border border-border shadow-sm transition-transform hover:scale-105 cursor-pointer"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{color.hex}</p>
                <p className="text-xs text-muted-foreground">{color.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
