import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultExtractorForm,
  ExtractorFormData,
  extractorFormSchema,
} from "../schemas/brand-extractor.schema";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/core/lib/utils";
import { brandExtractorWorkFlow } from "../services/brand-extractor.api";
import {
  calculateTimePerMessage,
  scheduleMessages,
  cleanupTimers,
} from "../utils/timer-utils";
import { getRandomMessage } from "../utils/message-utils";
import { isSuccessfulResponse } from "../utils/response-utils";

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

  const _form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: defaultExtractorForm,
  });

  return (
    <div className="min-w-svw min-h-svh max-w-svw max-h-svh m-0 p-0 bg-background relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      <div className="wrapper w-svw h-svh m-0 flex justify-center items-center relative z-[999] flex-col gap-12">
        <Card className="main-input bg-card py-16 md:py-4 px-8 rounded-lg border-border max-w-[90%]">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center w-full">
              <h1 className="mb-3 text-[10cqw] md:text-[8cqw] lg:text-[4cqw] title text-title leading-[2.4rem] md:leading-[3.6rem] lg:leading-[3.2rem]">
                From your website <br /> to your Brand DNA
              </h1>
              <h3 className="mb-4 text-gray-500">
                Your visual identity and design foundation, easily
              </h3>
            </div>
            <div className="w-full flex flex-col gap-3">
              {!isSuccess ? (
                <>
                  <form
                    onSubmit={_form.handleSubmit(onSubmit)}
                    noValidate
                    id="brand-extractor-form"
                    className="w-full"
                  >
                    <FieldSet>
                      <FieldGroup>
                        <Controller
                          name="brandUrl"
                          control={_form.control}
                          render={({ field, fieldState }) => (
                            <motion.div
                              initial={{ height: "auto", opacity: 1 }}
                              animate={
                                isAnimating
                                  ? { height: 0, opacity: 0 }
                                  : { height: "auto", opacity: 1 }
                              }
                              transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                              }}
                              className="overflow-hidden"
                            >
                              <Field data-invalid={fieldState.invalid}>
                                <Input
                                  {...field}
                                  id={`input-url-form`}
                                  aria-invalid={fieldState.invalid}
                                  placeholder="www.example.com"
                                  type="url"
                                  required
                                  className="py-7"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            </motion.div>
                          )}
                        />
                      </FieldGroup>
                    </FieldSet>
                  </form>
                  <Field orientation="horizontal" className="justify-end">
                    <div
                      className={cn(
                        "relative w-full overflow-hidden border-primary duration-300",
                        isAnimating ? "rounded-4xl" : "rounded-md"
                      )}
                    >
                      <Button
                        type="submit"
                        form={`brand-extractor-form`}
                        className={cn(
                          "py-8 w-full relative",
                          isAnimating ? "rounded-4xl" : "rounded-md"
                        )}
                        variant="agent"
                        disabled={isLoading}
                      >
                        <Sparkles />
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
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                        }}
                      />
                    </div>
                  </Field>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <div className="text-center py-4">
                      <p className="text-lg font-medium text-foreground">
                        {getRandomMessage(successMessages)}
                      </p>
                    </div>
                  </motion.div>
                  <Field orientation="horizontal" className="justify-end">
                    <Button
                      className="py-8 w-full relative rounded-md"
                      variant="agent"
                      onClick={() => navigate("/brand-dna")}
                    >
                      Explore your Brand DNA
                      <ArrowRight />
                    </Button>
                  </Field>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Extractor;
