import { useActiveBrand } from "@/modules/create-post/hooks/use-brands";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useGoogleFonts } from "@/shared/hooks/use-google-fonts";
import { cn } from "@/shared/utils/utils";
import { Menu } from "lucide-react";

const BrandDNA = () => {
  const { data: activeBrand, isLoading } = useActiveBrand();
  console.log(activeBrand);

  // Cargar fuentes dinámicamente si existe la marca
  const headfont = activeBrand?.typography?.headings?.font_family;
  const bodyfont = activeBrand?.typography?.body?.font_family;
  useGoogleFonts([headfont || "", bodyfont || ""].filter(Boolean));

  if (isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading Brand DNA...
        </p>
      </div>
    );
  }

  if (!activeBrand) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-center p-6">
        <p className="text-muted-foreground">
          No active brand found. Please extract or save a brand DNA.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group bg-surface-container-lowest border border-primary shadow-xl rounded-xl">
      <div className="flex flex-row justify-start items-center p-4 gap-2">
        <Button variant="outline">
          <Menu />
        </Button>
        <h2 className="text-xl font-bold">Brand DNA</h2>
      </div>
      <ScrollArea className="h-[80svh] w-full">
        <div className="p-4 space-y-6">
          {/* Logo Preview Section (Grande como pediste) */}
          <div className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl gap-4">
            {activeBrand.brand_identity.logo.url ? (
              <img
                src={activeBrand.brand_identity.logo.url}
                alt={`${activeBrand.brand_identity.name} Logo`}
                className="max-w-[200px] max-h-[150px] object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-outline-variant/20 rounded-full flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No Logo</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-center">
              {activeBrand.brand_identity.name}
            </h2>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
          >
            {/* 1. Identity */}
            <AccordionItem value="item-0">
              <AccordionTrigger>Brand Identity</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <InfoItem
                  label="Archetype"
                  value={activeBrand.brand_identity.brand_archetype}
                />
                <InfoItem
                  label="Industry"
                  value={activeBrand.brand_identity.industry}
                />
                <InfoItem
                  label="Website"
                  value={activeBrand.brand_identity.url}
                  isLink
                />
              </AccordionContent>
            </AccordionItem>

            {/* 2. Color System */}
            <AccordionItem value="item-1">
              <AccordionTrigger>Color System</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(activeBrand.color_system.roles).map(
                    ([role, color]) => (
                      <div key={role} className="flex items-center gap-3 p-1">
                        <div
                          className="w-8 h-8 rounded-md border border-outline/20 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                          title={role}
                        />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">
                            {role.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-mono">{color.hex}</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Typography */}
            <AccordionItem value="item-2">
              <AccordionTrigger>Typography</AccordionTrigger>
              <AccordionContent className="space-y-6">
                <TypeSection
                  title="Headings"
                  font={activeBrand.typography.headings}
                  preview="The quick brown fox jumps"
                />
                <TypeSection
                  title="Body"
                  font={activeBrand.typography.body}
                  preview="But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born."
                />
              </AccordionContent>
            </AccordionItem>

            {/* 4. Brand Voice */}
            <AccordionItem value="item-3">
              <AccordionTrigger>Brand Voice</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Tone of voice
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {activeBrand.brand_voice.tone_of_voice.map((tone) => (
                      <span
                        key={tone}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-[11px] font-medium"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                </div>
                <InfoItem
                  label="Comm. Style"
                  value={activeBrand.brand_voice.communication_style}
                />
                <InfoItem
                  label="Audience"
                  value={activeBrand.brand_voice.target_audience}
                />
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Positioning Statement
                  </span>
                  <p className="mt-1 text-sm italic border-l-2 border-primary/30 pl-3 py-1">
                    "{activeBrand.brand_voice.positioning_statement}"
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Social Presence */}
            <AccordionItem value="item-4">
              <AccordionTrigger>Social Presence</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {Object.entries(activeBrand.social_presence).map(
                  ([platform, url]) => (
                    <SocialItem key={platform} platform={platform} url={url} />
                  ),
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  isLink,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase font-bold text-muted-foreground">
      {label}
    </span>
    {isLink ? (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-primary hover:underline truncate"
      >
        {value}
      </a>
    ) : (
      <span className="text-sm">{value}</span>
    )}
  </div>
);

const TypeSection = ({
  title,
  font,
  preview,
}: {
  title: string;
  font: any;
  preview: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-baseline border-b border-outline/10 pb-1">
      <span className="text-xs font-bold text-muted-foreground uppercase">
        {title}
      </span>
      <span className="text-[11px] font-mono text-muted-foreground">
        {font.font_family}
      </span>
    </div>
    <p
      className="text-lg leading-snug"
      style={{ fontFamily: `'${font.font_family}', sans-serif` }}
    >
      {preview}
    </p>
    <div className="flex gap-4 text-[11px] text-muted-foreground">
      <span>{font.classification}</span>
      <span>{font.optical_size}</span>
    </div>
  </div>
);

const SocialItem = ({ platform, url }: { platform: string; url: string }) => {
  const isUnknown = url === "unknown";
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-lg border",
        isUnknown
          ? "bg-outline-variant/5 border-transparent opacity-60"
          : "bg-surface-container-lowest border-outline/20",
      )}
    >
      <span className="text-xs font-medium capitalize">{platform}</span>
      {isUnknown ? (
        <span className="text-[10px] text-muted-foreground">Not detected</span>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-primary hover:underline"
        >
          View Profile
        </a>
      )}
    </div>
  );
};

export default BrandDNA;
