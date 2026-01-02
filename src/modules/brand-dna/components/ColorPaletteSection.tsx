import { Card } from "@/shared/components/ui/card"
import { Check, Loader2 } from "lucide-react"
import { useBrandDna } from "../hooks/useBrandDna"

export function ColorPaletteSection() {
  const { data, loading } = useBrandDna()

  // Build colors array from API data
  const colors = data?.color_palette ? [
    { hex: data.color_palette.primary, name: "Primary" },
    { hex: data.color_palette.secondary, name: "Secondary" },
    { hex: data.color_palette.accent, name: "Accent" },
    { hex: data.color_palette.background, name: "Background" },
    ...data.color_palette.complementary.map((hex, index) => ({
      hex,
      name: `Complementary ${index + 1}`
    }))
  ] : []

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Color Palette</h3>
          {data?.color_palette && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Check className="h-4 w-4" />
              Extracted
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : colors.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {colors.map((color, index) => (
              <div key={`${color.hex}-${index}`} className="space-y-2">
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
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No color data available</p>
        )}
      </div>
    </Card>
  )
}
