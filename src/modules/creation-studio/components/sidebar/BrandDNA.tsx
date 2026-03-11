import { useBrands, useActiveBrand } from "@/modules/creation-studio/hooks/useBrands";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import { useGoogleFonts } from "@/shared/hooks/useGoogleFonts";
import { cn } from "@/shared/utils/utils";
import {
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAppSelector, useAppDispatch, RootState } from "@/core/store/store";
import { setSelectedBrandId } from "@/modules/creation-studio/store/createPostSlice";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { useMemo, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   Collapsible section — lightweight, no Radix
   ───────────────────────────────────────────── */
const Section = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-outline-variant/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 group cursor-pointer"
      >
        <span className="text-[11px] uppercase tracking-widest font-semibold text-on-surface/50">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-on-surface/30 group-hover:text-on-surface/50 transition-colors" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-on-surface/30 group-hover:text-on-surface/50 transition-colors" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          open ? "max-h-[600px] opacity-100 pb-4" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main BrandDNA Component
   ───────────────────────────────────────────── */
const BrandDNA = () => {
  const dispatch = useAppDispatch();
  const selectedBrandId = useAppSelector(
    (state: RootState) => state.createPost.selectedBrandId
  );

  const { data: allBrands, isLoading: brandsLoading } = useBrands();
  const { data: activeBrand, isLoading: activeLoading } = useActiveBrand();

  const displayBrand: BrandExtractor | null | undefined = useMemo(() => {
    if (selectedBrandId && allBrands) {
      return allBrands.find((b) => b.brand_identity.name === selectedBrandId) ?? null;
    }
    return activeBrand;
  }, [selectedBrandId, allBrands, activeBrand]);

  const isLoading = brandsLoading || activeLoading;

  const headfont = displayBrand?.typography?.headings?.font_family;
  const bodyfont = displayBrand?.typography?.body?.font_family;
  useGoogleFonts([headfont || "", bodyfont || ""].filter(Boolean));

  useEffect(() => {
    if (!selectedBrandId && activeBrand) {
      dispatch(setSelectedBrandId(activeBrand.brand_identity.name));
    }
  }, [activeBrand, selectedBrandId, dispatch]);

  const handleBrandSwitch = useCallback(
    (brandName: string) => dispatch(setSelectedBrandId(brandName)),
    [dispatch]
  );

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs text-on-surface/40">Loading brand...</span>
        </div>
      </div>
    );
  }

  if (!displayBrand) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-center p-6 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-outline-variant/20">
        <p className="text-sm text-on-surface/40">
          No brand found. Extract or save a brand DNA to get started.
        </p>
      </div>
    );
  }

  // Pick the 6 most important color roles to show
  const keyColors = ["primary", "secondary", "tertiary", "surface", "primary_container", "outline"] as const;
  const colorEntries = keyColors
    .map((key) => {
      const color = (displayBrand.color_system.roles as Record<string, { hex: string }>)[key];
      return color ? { name: key, hex: color.hex } : null;
    })
    .filter(Boolean) as { name: string; hex: string }[];

  // Source palette (raw detected colors)
  const palette = displayBrand.color_system.source_palette?.slice(0, 8) ?? [];

  return (
    <div className="w-full relative bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/20 shadow-lg shadow-black/5 rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary/70" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-on-surface/40">
              Brand DNA
            </span>
          </div>
          {allBrands && allBrands.length > 1 && (
            <Select
              value={displayBrand.brand_identity.name}
              onValueChange={handleBrandSwitch}
            >
              <SelectTrigger className="w-auto max-w-[120px] h-7 text-[11px] border-outline-variant/20 rounded-full px-2.5 gap-1 bg-transparent">
                <SelectValue placeholder="Switch" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                {allBrands.map((brand) => (
                  <SelectItem
                    key={brand._meta.uuid}
                    value={brand.brand_identity.name}
                    className="text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            brand.color_system?.roles?.primary?.hex ?? "#888",
                        }}
                      />
                      {brand.brand_identity.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Brand card — compact */}
        <div className="flex items-center gap-3">
          {displayBrand.brand_identity.logo.url ? (
            <img
              src={displayBrand.brand_identity.logo.url}
              alt={displayBrand.brand_identity.name}
              className="w-10 h-10 object-contain rounded-lg bg-white/80 p-1 border border-outline-variant/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-outline-variant/10 flex items-center justify-center">
              <span className="text-xs font-bold text-on-surface/30">
                {displayBrand.brand_identity.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-on-surface truncate">
              {displayBrand.brand_identity.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-on-surface/40">
                {displayBrand.brand_identity.industry}
              </span>
              <span className="text-on-surface/20">·</span>
              <span className="text-[10px] text-on-surface/40">
                {displayBrand.brand_identity.brand_archetype}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <ScrollArea className="h-[65svh]">
        <div className="px-4 pb-4">
          {/* ── Color Palette ── */}
          <Section title="Colors" defaultOpen>
            {/* Source palette as a row of circles */}
            {palette.length > 0 && (
              <div className="mb-3">
                <div className="flex gap-1.5">
                  {palette.map((hex, i) => (
                    <div
                      key={i}
                      className="group relative"
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-black/5 shadow-sm transition-transform hover:scale-125 cursor-default"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key color roles */}
            <div className="space-y-1.5">
              {colorEntries.map(({ name, hex }) => (
                <div key={name} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-md border border-black/5 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[11px] text-on-surface/50 flex-1 capitalize">
                    {name.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface/30">
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Typography ── */}
          <Section title="Typography">
            <div className="space-y-4">
              {/* Headings */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[10px] text-on-surface/40 uppercase tracking-wide">
                    Headings
                  </span>
                  <span className="text-[10px] font-mono text-on-surface/30">
                    {displayBrand.typography.headings.font_family}
                  </span>
                </div>
                <p
                  className="text-xl leading-tight text-on-surface/80"
                  style={{
                    fontFamily: `'${displayBrand.typography.headings.font_family}', sans-serif`,
                  }}
                >
                  The quick brown fox
                </p>
                <p className="text-[10px] text-on-surface/30 mt-1">
                  {displayBrand.typography.headings.classification} · {displayBrand.typography.headings.optical_size}
                </p>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[10px] text-on-surface/40 uppercase tracking-wide">
                    Body
                  </span>
                  <span className="text-[10px] font-mono text-on-surface/30">
                    {displayBrand.typography.body.font_family}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed text-on-surface/60"
                  style={{
                    fontFamily: `'${displayBrand.typography.body.font_family}', sans-serif`,
                  }}
                >
                  A journey through craft and flavor, every detail tells a story.
                </p>
                <p className="text-[10px] text-on-surface/30 mt-1">
                  {displayBrand.typography.body.classification} · {displayBrand.typography.body.optical_size}
                </p>
              </div>
            </div>
          </Section>

          {/* ── Brand Voice ── */}
          <Section title="Voice">
            <div className="space-y-3">
              {/* Tone tags */}
              <div className="flex flex-wrap gap-1.5">
                {displayBrand.brand_voice.tone_of_voice.map((tone) => (
                  <span
                    key={tone}
                    className="px-2 py-0.5 bg-primary/8 text-primary/80 rounded-full text-[10px] font-medium"
                  >
                    {tone}
                  </span>
                ))}
              </div>

              {/* Communication style */}
              <div>
                <span className="text-[10px] text-on-surface/35 uppercase tracking-wide">
                  Style
                </span>
                <p className="text-xs text-on-surface/60 mt-0.5 leading-relaxed">
                  {displayBrand.brand_voice.communication_style}
                </p>
              </div>

              {/* Audience */}
              <div>
                <span className="text-[10px] text-on-surface/35 uppercase tracking-wide">
                  Audience
                </span>
                <p className="text-xs text-on-surface/60 mt-0.5 leading-relaxed">
                  {displayBrand.brand_voice.target_audience}
                </p>
              </div>

              {/* Positioning */}
              <div className="mt-2 pl-3 border-l-2 border-primary/15">
                <p className="text-xs italic text-on-surface/50 leading-relaxed">
                  "{displayBrand.brand_voice.positioning_statement}"
                </p>
              </div>
            </div>
          </Section>

          {/* ── Links ── */}
          <Section title="Links">
            <div className="space-y-1">
              {/* Website */}
              <a
                href={displayBrand.brand_identity.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container transition-colors group"
              >
                <Globe className="w-3.5 h-3.5 text-on-surface/30 group-hover:text-primary transition-colors" />
                <span className="text-xs text-on-surface/60 group-hover:text-primary transition-colors flex-1 truncate">
                  {displayBrand.brand_identity.url.replace(/^https?:\/\//, "")}
                </span>
                <ExternalLink className="w-3 h-3 text-on-surface/20 group-hover:text-primary/50 transition-colors" />
              </a>

              {/* Social links */}
              {Object.entries(displayBrand.social_presence).map(
                ([platform, url]) => {
                  if (url === "unknown") return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-container transition-colors group"
                    >
                      <SocialIcon platform={platform} />
                      <span className="text-xs text-on-surface/60 group-hover:text-primary transition-colors flex-1 capitalize">
                        {platform}
                      </span>
                      <ExternalLink className="w-3 h-3 text-on-surface/20 group-hover:text-primary/50 transition-colors" />
                    </a>
                  );
                }
              )}
            </div>
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Social platform icon (lightweight SVG inline)
   ───────────────────────────────────────────── */
const SocialIcon = ({ platform }: { platform: string }) => {
  const cls = "w-3.5 h-3.5 text-on-surface/30";
  switch (platform.toLowerCase()) {
    case "twitter":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    default:
      return <Globe className={cls} />;
  }
};

export default BrandDNA;
