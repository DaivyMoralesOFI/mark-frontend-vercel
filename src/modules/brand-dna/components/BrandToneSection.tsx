import { Card } from "@/shared/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useBrandDna } from "../hooks/useBrandDna";

export function BrandToneSection() {
  const { data, loading } = useBrandDna();

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">
            Brand Tone & Mood
          </h3>
          {data?.brand_tone_mood && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Check className="h-4 w-4" />
              Analyzed
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data?.brand_tone_mood ? (
          <div className="space-y-3">
            {data.brand_tone_mood.voice && (
              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Voice
                </p>
                <p className="font-semibold text-foreground">
                  {data.brand_tone_mood.voice}
                </p>
              </div>
            )}

            {data.brand_tone_mood.keywords &&
              data.brand_tone_mood.keywords.length > 0 && (
                <div className="p-4 rounded-lg bg-accent/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.brand_tone_mood.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-md bg-background text-sm font-medium text-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {data.brand_tone_mood.description && (
              <div className="p-4 rounded-lg bg-accent/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Description
                </p>
                <p className="text-sm text-foreground">
                  {data.brand_tone_mood.description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No brand tone data available
          </p>
        )}
      </div>
    </Card>
  );
}
