import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Upload, Loader2 } from "lucide-react";
import { useBrandDna } from "../hooks/useBrandDna";

export function LogoSection() {
  const { data, loading } = useBrandDna();

  return (
    <Card className="overflow-hidden w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Logo</h3>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Replace
          </Button>
        </div>

        <div className="aspect-square rounded-lg flex items-center justify-center p-8 border border-border bg-muted">
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : data?.brand_identity?.logo?.url ? (
            <img
              src={data.brand_identity.logo.url}
              alt={data.brand_identity.name || "Brand Logo"}
              className="max-w-[60%] max-h-[60%] object-contain"
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No logo available
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
