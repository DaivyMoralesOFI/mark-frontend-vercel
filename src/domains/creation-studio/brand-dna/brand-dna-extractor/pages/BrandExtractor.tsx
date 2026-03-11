import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/Field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultExtractorForm,
  ExtractorFormData,
  extractorFormSchema,
} from "../schemas/BrandExtractor.schema";
import { Button } from "@/shared/components/ui/Button";
import { Sparkles, ArrowRight, Globe, Save, Check, Loader2, Dna } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useTheme } from "@/core/context/ThemeProvider";
import { brandExtractorWorkFlow } from "../services/brandExtractor.apiService";
import { setNewBrand, getAllBrands } from "@/modules/creation-studio/services/brandService";
import type { BrandExtractor, BrandsResponse } from "@/modules/creation-studio/schemas/BrandSchema";
import {
  calculateTimePerMessage,
  scheduleMessages,
  cleanupTimers,
} from "../utils/timerUtils";
import { getRandomMessage } from "../utils/messageUtils";
import { isSuccessfulResponse } from "../utils/responseUtils";
import { BrandCard } from "../components/BrandCard";
import { BrandDetailModal } from "../components/BrandDetailModal";

const loadingMessages = [
  "Checking the URL...",
  "Studying your style...",
  "Analyzing your colors...",
  "Reading your vibe...",
  "Discovering your essence...",
  "Crafting your DNA...",
];

const successMessages = [
  "Ta-da! Your brand is ready! 🎨",
  "Voilà! We've decoded your style! ✨",
  "Success! Your DNA is extracted! 🧬",
  "All done! Your brand awaits! 🎉",
  "Boom! Your identity is ready! 💫",
];

const Extractor = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [extractedBrand, setExtractedBrand] = useState<BrandExtractor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { theme } = useTheme();
  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  // Brands list state
  const [brands, setBrands] = useState<BrandsResponse>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<BrandExtractor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBrands = useCallback(async () => {
    setBrandsLoading(true);
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const onSubmit = async (data: ExtractorFormData) => {
    console.log({ data });
    setIsLoading(true);
    setIsAnimating(true);
    setCurrentMessageIndex(0);
    setIsSuccess(false);

    const startTime = Date.now();
    let messageTimers: NodeJS.Timeout[] = [];

    try {
      const response = await brandExtractorWorkFlow(data.brandUrl);
      const apiDuration = Date.now() - startTime;
      const timePerMessage = calculateTimePerMessage(
        apiDuration,
        30000,
        loadingMessages.length
      );
      messageTimers = scheduleMessages(
        timePerMessage,
        loadingMessages.length,
        setCurrentMessageIndex
      );
      await new Promise((resolve) => setTimeout(resolve, 20000));
      if (isSuccessfulResponse(response)) {
        setExtractedBrand(response.data.output);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error extracting brand DNA:", error);
      const apiDuration = Date.now() - startTime;
      const timePerMessage = calculateTimePerMessage(
        apiDuration,
        30000,
        loadingMessages.length
      );
      messageTimers = scheduleMessages(
        timePerMessage,
        loadingMessages.length,
        setCurrentMessageIndex
      );
      await new Promise((resolve) => setTimeout(resolve, 20000));
    } finally {
      cleanupTimers(messageTimers);
      setIsLoading(false);
      setIsAnimating(false);
      setCurrentMessageIndex(0);
    }
  };

  const handleSaveBrand = async () => {
    if (!extractedBrand) return;
    setIsSaving(true);
    try {
      await setNewBrand(extractedBrand);
      setIsSaved(true);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBrandClick = (brand: BrandExtractor) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: defaultExtractorForm,
  });

  const urlError = form.formState.errors.brandUrl?.message;

  return (
    <div className="min-w-svw min-h-svh m-0 p-0 bg-background relative overflow-y-auto overflow-x-hidden">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: isDark
            ? `
         radial-gradient(ellipse 80% 60% at 60% 20%, rgba(120, 60, 180, 0.40), transparent 65%),
          radial-gradient(ellipse 70% 60% at 20% 80%, rgba(180, 50, 100, 0.35), transparent 65%),
          radial-gradient(ellipse 60% 50% at 60% 65%, rgba(140, 120, 60, 0.30), transparent 62%),
          radial-gradient(ellipse 65% 40% at 50% 60%, rgba(50, 100, 160, 0.35), transparent 68%),
          linear-gradient(180deg, #1a1520 0%, #1c1218 100%)
        `
            : `
         radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
          radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
          radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
          radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
          linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
        `,
        }}
      />
      <div className="wrapper w-full min-h-svh m-0 flex flex-col items-center relative z-10 gap-8 p-4 py-12 md:py-16">
        {/* Extractor Card */}
        <Card className="main-input bg-card/95 backdrop-blur-sm py-12 md:py-16 px-8 md:px-12 rounded-lg border-border w-full max-w-md md:max-w-xl">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="w-full flex flex-col gap-8"
          >
            <div className="flex flex-col gap-6">
              <div className="text-center w-full">
                <h1 className="mb-3 text-[10cqw] md:text-[8cqw] lg:text-[4cqw] title text-title leading-[2.4rem] md:leading-[3.6rem] lg:leading-[3.2rem]">
                  From your website <br /> to your Brand DNA
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Your visual identity and design foundation, easily
                </p>
              </div>

              {!isSuccess && (
                <Field orientation="vertical" className="gap-2">
                  <FieldLabel>
                    <Globe className="w-4 h-4" />
                    <span>Website URL</span>
                  </FieldLabel>
                  <FieldContent>
                    <Controller
                      name="brandUrl"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://example.com"
                          disabled={isLoading}
                          aria-invalid={!!urlError}
                          className={cn(
                            "text-base",
                            urlError && "border-destructive focus-visible:border-destructive"
                          )}
                        />
                      )}
                    />
                    <FieldDescription>
                      Enter your website URL to extract your brand identity
                    </FieldDescription>
                    {urlError && (
                      <FieldError>{urlError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              )}
            </div>

            {!isSuccess ? (
              <div
                className={cn(
                  "relative w-full overflow-hidden border-primary duration-300",
                  isAnimating ? "rounded-4xl" : "rounded-md"
                )}
              >
                <Button
                  type="submit"
                  className={cn(
                    "py-6 w-full relative h-12 md:h-14 text-base",
                    isAnimating ? "rounded-4xl" : "rounded-md"
                  )}
                  variant="agent"
                  disabled={isLoading}
                >
                  <Sparkles className="w-5 h-5" />
                  <motion.span
                    key={currentMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1 }}
                  >
                    {isLoading ? loadingMessages[currentMessageIndex] : "Discover now"}
                  </motion.span>
                </Button>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={isAnimating ? { x: "100%" } : { x: "-100%" }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                    repeat: isLoading ? Infinity : 0,
                  }}
                  style={{
                    background:
                      isDark
                        ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
                        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                />
              </div>
            ) : (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                className="overflow-hidden flex flex-col gap-6"
              >
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-foreground">
                    {getRandomMessage(successMessages)}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    className="py-6 w-full h-12 md:h-14 text-base rounded-md"
                    variant="agent"
                    disabled={isSaving || isSaved}
                    onClick={handleSaveBrand}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-5 h-5" />
                        Brand Saved
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {isSaving ? "Saving..." : "Save Brand"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="py-6 w-full h-12 md:h-14 text-base rounded-md"
                    variant="outline"
                    onClick={() => navigate("/brand-dna")}
                  >
                    Explore your Brand DNA
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </Card>

        {/* Saved Brands List */}
        <div className="w-full max-w-md md:max-w-xl">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Dna className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Saved Brands
            </h2>
            {!brandsLoading && brands.length > 0 && (
              <span className="text-xs text-muted-foreground/70">
                ({brands.length})
              </span>
            )}
          </div>

          {brandsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Dna className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No brands saved yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Extract a brand DNA above and save it to see it here
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              {brands.map((brand, index) => (
                <motion.div
                  key={brand._meta?.uuid || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <BrandCard
                    brand={brand}
                    onClick={() => handleBrandClick(brand)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Brand Detail Modal */}
      <BrandDetailModal
        brand={selectedBrand}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Extractor;
