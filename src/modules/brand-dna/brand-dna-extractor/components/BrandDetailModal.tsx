import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/Dialog";
import { Badge } from "@/shared/components/ui/Badge";
import type { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import {
  Globe,
  Type,
  Palette,
  MessageSquare,
  Share2,
  Calendar,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface BrandDetailModalProps {
  brand: BrandExtractor | null;
  isOpen: boolean;
  onClose: () => void;
}

function ColorSwatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-md border border-border shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xs font-mono text-foreground">{hex}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-primary" />
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
    </div>
  );
}

export function BrandDetailModal({
  brand,
  isOpen,
  onClose,
}: BrandDetailModalProps) {
  if (!brand) return null;

  const { brand_identity, typography, color_system, brand_voice, social_presence, _meta } = brand;

  const mainColors = [
    { hex: color_system.roles.primary.hex, label: "Primary" },
    { hex: color_system.roles.secondary.hex, label: "Secondary" },
    { hex: color_system.roles.tertiary.hex, label: "Tertiary" },
    { hex: color_system.roles.surface.hex, label: "Surface" },
    { hex: color_system.roles.on_surface.hex, label: "On Surface" },
    { hex: color_system.roles.outline.hex, label: "Outline" },
  ];

  const socialLinks = Object.entries(social_presence).filter(
    ([, value]) => value !== "unknown",
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {brand_identity.logo?.url && (
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={brand_identity.logo.url}
                  alt={brand_identity.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div>
              <DialogTitle className="text-xl font-bold">
                {brand_identity.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-0.5">
                <Globe className="w-3 h-3" />
                {brand_identity.url}
              </DialogDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="primaryOutline">{brand_identity.industry}</Badge>
            <Badge variant="secondaryOutline">{brand_identity.brand_archetype}</Badge>
            {_meta.scraped_at && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(_meta.scraped_at).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-1">
          {/* Color System */}
          <section>
            <SectionHeader icon={Palette} title="Color System" />
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex gap-1 mb-4 rounded-lg overflow-hidden h-8">
                {color_system.source_palette.map((hex, i) => (
                  <div
                    key={i}
                    className="flex-1 first:rounded-l-md last:rounded-r-md"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mainColors.map((color) => (
                  <ColorSwatch key={color.label} hex={color.hex} label={color.label} />
                ))}
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <SectionHeader icon={Type} title="Typography" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Headings
                </p>
                <p
                  className="text-2xl font-semibold text-foreground"
                  style={{ fontFamily: typography.headings.font_family }}
                >
                  {typography.headings.font_family}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {typography.headings.classification} &middot;{" "}
                  {typography.headings.personality_signal}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Body
                </p>
                <p
                  className="text-lg text-foreground"
                  style={{ fontFamily: typography.body.font_family }}
                >
                  {typography.body.font_family}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {typography.body.classification} &middot;{" "}
                  {typography.body.personality_signal}
                </p>
              </div>
            </div>
            {typography.all_detected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {typography.all_detected.map((font) => (
                  <Badge key={font} variant="outline" className="text-xs">
                    {font}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          {/* Brand Voice */}
          <section>
            <SectionHeader icon={MessageSquare} title="Brand Voice" />
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Communication Style
                </p>
                <p className="text-sm text-foreground">
                  {brand_voice.communication_style}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Target Audience
                </p>
                <p className="text-sm text-foreground">
                  {brand_voice.target_audience}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  Positioning
                </p>
                <p className="text-sm text-foreground italic">
                  {brand_voice.positioning_statement}
                </p>
              </div>
              {brand_voice.tone_of_voice.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {brand_voice.tone_of_voice.map((tone) => (
                    <Badge key={tone} variant="secondaryOutline">
                      {tone}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Social Presence */}
          {socialLinks.length > 0 && (
            <section>
              <SectionHeader icon={Share2} title="Social Presence" />
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/50 border border-border text-sm text-foreground hover:bg-accent/50 transition-colors capitalize"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer / Return Action */}
        <div className="pt-6 border-t border-border mt-2 flex justify-end">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto"
            variant="secondary"
          >
            Return to List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
