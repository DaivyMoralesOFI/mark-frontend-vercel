import { Card } from "@/shared/components/ui/Card";
import { Check, Loader2 } from "lucide-react";
import { useBrandDna } from "../hooks/useBrandDna";

export function TypographySection() {
  const { data, loading } = useBrandDna();

  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Typography</h3>
          {data?.typography && (
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              <Check className="h-4 w-4" />
              Detected
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data?.typography ? (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                Headings
              </p>
              <div className="space-y-2">
                <p
                  className="text-4xl"
                  style={{
                    fontFamily: `${data.typography.headings.font_family}${data.typography.headings.category ? `, ${data.typography.headings.category}` : ""}`,
                  }}
                >
                  {data.typography.headings.font_family}
                </p>
                {data.typography.headings.category && (
                  <p className="text-sm text-muted-foreground">
                    {data.typography.headings.category}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The quick brown fox jumps
              </p>
            </div>

            {/* Body */}
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                Body
              </p>
              <div className="space-y-2">
                <p
                  className="text-lg"
                  style={{
                    fontFamily: `${data.typography.body.font_family}${data.typography.body.category ? `, ${data.typography.body.category}` : ""}`,
                  }}
                >
                  {data.typography.body.font_family}
                </p>
                {data.typography.body.category && (
                  <p className="text-sm text-muted-foreground">
                    {data.typography.body.category}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The quick brown fox jumps
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No typography data available
          </p>
        )}
      </div>
    </Card>
  );
}
