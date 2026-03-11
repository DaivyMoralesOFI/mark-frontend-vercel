import { Card } from "@/shared/components/ui/Card";
import { Check, Loader2 } from "lucide-react";
import { useBrandDna } from "../hooks/useBrandDna";

export function ColorPaletteSection() {
  const { data, loading } = useBrandDna();

  const colors = data?.color_palette;

  if (!colors) return null;

  const palette = [
    { hex: colors.primary, name: "Primary" },
    { hex: colors.secondary, name: "Secondary" },
    { hex: colors.accent, name: "Accent" },
    ...colors.complementary.map((hex: string, index: number) => ({
      hex,
      name: `Complementary ${index + 1}`,
    })),
  ];

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">
            Color Palette
          </h3>
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
        ) : palette.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {palette.map((color, index) => (
              <div key={`${color.hex}-${index}`} className="space-y-2">
                <div
                  className="aspect-square rounded-lg border border-border shadow-sm transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">
                    {color.hex}
                  </p>
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No color data available
          </p>
        )}
      </div>
    </Card>
  );
}
