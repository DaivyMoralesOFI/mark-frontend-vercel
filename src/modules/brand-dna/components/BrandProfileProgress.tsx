import { Card } from "@/shared/components/ui/card";

import { useBrandDna } from "../hooks/useBrandDna";

export function BrandProfileProgress() {
  const { data, loading } = useBrandDna();

  // Calculate progress based on available data
  const calculateProgress = () => {
    if (!data) return 0;

    let completed = 0;
    const total = 4;

    if (data.brand_identity?.logo?.url) completed++;
    if (data.color_palette) completed++;
    if (data.typography) completed++;
    if (data.brand_tone_mood) completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <Card className="relative overflow-hidden bg:white">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Brand Profile Completeness
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {loading
                ? "Loading..."
                : data?.brand_identity?.name
                  ? `${data.brand_identity.name} - ${data.brand_identity.url || "No URL"}`
                  : "Select a company to view brand DNA"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">{progress}%</span>
          </div>
        </div>

        <div className="relative h-3 bg-card rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
