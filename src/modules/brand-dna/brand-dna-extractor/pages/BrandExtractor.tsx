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
import { Sparkles, ArrowRight, Globe } from "lucide-react";
import { Card } from "@/shared/components/ui/Card";
import { Input } from "@/shared/components/ui/Input";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils/utils";
import { useTheme } from "@/core/context/ThemeProvider";
import { brandExtractorWorkFlow } from "../services/brandExtractor.apiService";
import {
  calculateTimePerMessage,
  scheduleMessages,
  cleanupTimers,
} from "../utils/timerUtils";
import { getRandomMessage } from "../utils/messageUtils";
import { isSuccessfulResponse } from "../utils/responseUtils";

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
  const { theme } = useTheme();
  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

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

  const form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: defaultExtractorForm,
  });

  const urlError = form.formState.errors.brandUrl?.message;

  return (
    <div className="min-w-svw min-h-svh max-w-svw max-h-svh m-0 p-0 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
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
      <div className="wrapper w-svw h-svh m-0 flex justify-center items-center relative z-[999] flex-col gap-12 p-4">
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
                <Button
                  type="button"
                  className="py-6 w-full h-12 md:h-14 text-base rounded-md"
                  variant="agent"
                  onClick={() => navigate("/brand-dna")}
                >
                  Explore your Brand DNA
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Extractor;
