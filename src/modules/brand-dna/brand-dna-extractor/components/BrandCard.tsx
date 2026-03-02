import type { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { Badge } from "@/shared/components/ui/Badge";
import { Globe, ChevronRight } from "lucide-react";

interface BrandCardProps {
  brand: BrandExtractor;
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  const { brand_identity, color_system, typography, _meta } = brand;
  const paletteColors = color_system.source_palette.slice(0, 6);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:bg-accent/30 transition-all group text-left"
    >
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
        {brand_identity.logo?.url ? (
          <img
            src={brand_identity.logo.url}
            alt={brand_identity.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `<span class="text-xs font-semibold text-muted-foreground">${brand_identity.name.substring(0, 2).toUpperCase()}</span>`;
            }}
          />
        ) : (
          <span className="text-xs font-semibold text-muted-foreground">
            {brand_identity.name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {brand_identity.name}
          </h3>
          <Badge variant="outline" className="text-[10px] shrink-0 hidden sm:inline-flex">
            {brand_identity.industry}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            <Globe className="w-3 h-3 shrink-0" />
            {brand_identity.url}
          </span>
          <span className="text-xs text-muted-foreground shrink-0 hidden md:inline">
            {typography.headings.font_family}
          </span>
        </div>
      </div>

      {/* Color preview */}
      <div className="flex gap-0.5 shrink-0">
        {paletteColors.map((hex, i) => (
          <div
            key={i}
            className="w-4 h-4 first:rounded-l-md last:rounded-r-md"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </button>
  );
}
