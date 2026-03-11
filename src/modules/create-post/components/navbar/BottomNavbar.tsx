import { Textarea } from "@/shared/components/ui/Textarea";
import {
  Loader,
  ArrowUp,
  Paperclip,
  Link,
  SlidersHorizontal,
  Maximize2,
  Hash,
} from "lucide-react";
import PostTypeSelector from "@/modules/create-post/components/dropdown/PostTypeSelector";
import SocialMediaSelector from "../dropdown/SocialMediaSelector";
import PostToneSelector from "../dropdown/PostToneSelector";
import BrandDnaSelector from "../dropdown/BrandDnaSelector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  CreateImage,
  createImageSchema,
} from "@/modules/create-post/schemas/CreateImage";

import { useCreateImage } from "../../hooks/useCreateImage";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { BrandExtractor } from "@/modules/create-post/schemas/BrandSchema";
import { useAppDispatch } from "@/core/store/store";
import { setSelectedBrandId } from "../../store/createPostSlice";
import { useFlowStore } from "../../store/flowStoreSlice";
import { cn } from "@/shared/utils/utils";

// Schema parcial: solo los campos que el usuario controla directamente
const bottomNavbarSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  post_type: z.string().min(1, "Post type is required"),
  post_tone: z.string().min(1, "Post tone is required"),
});

type BottomNavbarForm = z.infer<typeof bottomNavbarSchema>;

/**
 * Builds the content generation payload using the selected brand data.
 */
function buildCreateImagePayload(
  formData: BottomNavbarForm,
  brand: BrandExtractor | null
): CreateImage {
  const colorRoles = brand?.color_system.roles;

  const brandDna = brand
    ? {
        color_palette: {
          primary: colorRoles?.primary.hex ?? "#000000",
          secondary: colorRoles?.secondary.hex ?? "#333333",
          accent: colorRoles?.tertiary.hex ?? "#666666",
          complementary: brand.color_system.source_palette.slice(0, 3),
        },
        typography: {
          body: brand.typography.body.font_family,
          heading: brand.typography.headings.font_family,
        },
        tone: {
          description: brand.brand_voice.positioning_statement,
          keywords: brand.brand_voice.tone_of_voice,
          voice: brand.brand_voice.communication_style,
        },
      }
    : {
        color_palette: {
          primary: "#000000",
          secondary: "#333333",
          accent: "#666666",
          complementary: ["#000000", "#333333", "#FFFFFF"],
        },
        typography: {
          body: "Inter",
          heading: "Inter",
        },
        tone: {
          description: "A modern, creative brand",
          keywords: ["professional", "creative"],
          voice: "Friendly and professional",
        },
      };

  const identity = brand
    ? {
        logo_url: brand.brand_identity.logo.url,
        name: brand.brand_identity.name,
        slug: brand.brand_identity.name.toLowerCase().replace(/\s+/g, "-"),
        site_url: brand.brand_identity.url,
      }
    : {
        logo_url: "",
        name: "Default Brand",
        slug: "default-brand",
        site_url: "",
      };

  return {
    prompt: formData.prompt,
    platforms: formData.platforms,
    post_type: formData.post_type,
    post_tone: formData.post_tone,
    brand_dna: brandDna,
    identity,
  };
}

interface BottomNavbarProps {
  centered?: boolean;
}

const BottomNavbar = ({ centered = false }: BottomNavbarProps) => {
  const [start_workflow, setStartWorkflow] = useState(false);
  const [selectedBrand, setSelectedBrand] =
    useState<BrandExtractor | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: startCreation } = useCreateImage();
  const { setUserPrompt, setPostCopy, setLastCreationPayload, addCopyVersion } = useFlowStore();

  const _form = useForm<BottomNavbarForm>({
    resolver: zodResolver(bottomNavbarSchema),
    defaultValues: {
      prompt: "",
      platforms: ["instagram"],
      post_type: "post",
      post_tone: "promotional",
    },
  });

  const [selectedBrandName, setSelectedBrandName] = useState<string | null>(
    null
  );
  const promptValue = _form.watch("prompt");
  const hasPrompt = promptValue?.trim().length > 0;

  const handleBrandChange = (
    brandName: string | null,
    brand: BrandExtractor | null
  ) => {
    setSelectedBrandName(brandName);
    setSelectedBrand(brand);
    dispatch(setSelectedBrandId(brandName));
  };

  // Auto-resize textarea
  const handleTextareaChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const onSubmit = async (data: BottomNavbarForm) => {
    const payload = buildCreateImagePayload(data, selectedBrand);

    console.log("🔍 [Validation] Built payload:", payload);

    const validationResult = createImageSchema.safeParse(payload);
    if (!validationResult.success) {
      console.error("❌ [Validation] Invalid payload:", {
        errors: validationResult.error.flatten(),
        fieldErrors: validationResult.error.flatten().fieldErrors,
        formattedErrors: validationResult.error.format(),
        payload: payload,
      });
      return;
    }

    console.log("✅ [Validation] Payload is valid, sending to API...");

    setStartWorkflow(true);
    startCreation(payload, {
      onSuccess: (response) => {
        console.log("✅ [API] Creation started successfully:", response);
        if (response.uuid) {
          setUserPrompt(data.prompt);
          setPostCopy(response.copy);
          setLastCreationPayload(payload);
          addCopyVersion(response.copy);
          console.log(
            "⏳ [Navigation] Waiting 500ms before navigating..."
          );
          setTimeout(() => {
            navigate(`/app/creation-studio/new/content/${response.uuid}`);
          }, 500);
        }
      },
      onError: (error) => {
        console.error("❌ [API] Error starting creation:", error);
        setStartWorkflow(false);
      },
    });
  };

  // Handle Ctrl/Cmd + Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      _form.handleSubmit(onSubmit)();
    }
  };

  if (start_workflow) {
    return (
      <div className={cn(
        centered
          ? "w-full flex flex-col items-center pointer-events-auto"
          : "fixed bottom-0 left-0 w-full px-4 pb-5 flex flex-col items-center z-1000 pointer-events-none"
      )}>
        <div className="w-full max-w-[540px] pointer-events-auto">
          <div className={cn(
            "w-full flex items-center justify-center gap-3 px-5 py-4",
            "bg-surface-container-lowest/95 dark:bg-[#1C1C1C] backdrop-blur-2xl",
            "border border-outline-variant/60 dark:border-outline/10",
            "rounded-[1.25rem] shadow-xl shadow-black/5"
          )}>
            <Loader className="w-4 h-4 animate-spin text-on-surface-variant/50 flex-shrink-0" />
            <span className="text-[15px] text-on-surface-variant/60 font-medium">
              Creating your image...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      centered
        ? "w-full flex flex-col items-center pointer-events-auto"
        : "fixed bottom-0 left-0 w-full px-4 pb-5 flex flex-col items-center z-1000 pointer-events-none"
    )}>
      <div className="w-full max-w-[540px] flex flex-col items-center pointer-events-auto">
        <form
          onSubmit={_form.handleSubmit(onSubmit)}
          id="create-image-form"
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Centered Settings Toolbar */}
          {centered && (
            <div className="flex items-center gap-1.5 p-1.5 bg-surface-container-lowest/90 dark:bg-[#1C1C1C] backdrop-blur-xl border border-outline-variant/30 dark:border-outline/20 rounded-2xl shadow-sm z-10">
              <Controller
                name="post_tone"
                control={_form.control}
                render={({ field }) => (
                  <PostToneSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="platforms"
                control={_form.control}
                render={({ field }) => (
                  <SocialMediaSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="post_type"
                control={_form.control}
                render={({ field }) => (
                  <PostTypeSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          )}

          {/* Main Input Container */}
          <div
            className={cn(
              "w-full flex flex-col pointer-events-auto",
              "bg-surface-container-lowest/95 dark:bg-[#1C1C1C] backdrop-blur-2xl",
              "border rounded-[1.25rem] shadow-xl",
              "transition-all duration-300 ease-out",
              isFocused || hasPrompt
                ? "border-primary/40 shadow-primary/5"
                : "border-outline-variant/60 dark:border-outline/10 shadow-black/5"
            )}
          >
            {/* Expandable Settings Panel - Only shown in bottom navbar mode */}
            {!centered && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-out",
                  showSettings ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Post Settings
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Controller
                      name="post_tone"
                      control={_form.control}
                      render={({ field }) => (
                        <PostToneSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      name="platforms"
                      control={_form.control}
                      render={({ field }) => (
                        <SocialMediaSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      name="post_type"
                      control={_form.control}
                      render={({ field }) => (
                        <PostTypeSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mx-4 border-b border-outline-variant/15" />
              </div>
            )}

            {/* Main Input Area */}
            <div className="px-4 pt-3 pb-2 flex items-start gap-3">
              {/* Attach icon */}
              <button
                type="button"
                className="mt-1.5 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant/50 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
                title="Attach media"
              >
                <Paperclip className="w-4 h-4" strokeWidth={1.8} />
              </button>

              <Controller
                name="prompt"
                control={_form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      (textareaRef as any).current = e;
                    }}
                    placeholder="Describe your post idea..."
                    rows={2}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                      field.onChange(e);
                      handleTextareaChange();
                    }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "flex-1 resize-none shadow-none border-none bg-transparent",
                      "text-on-surface text-[15px] leading-relaxed",
                      "placeholder:text-on-surface-variant/40",
                      "focus-visible:ring-0 focus-visible:ring-offset-0",
                      "px-0 py-1 min-h-[48px] max-h-[120px]"
                    )}
                  />
                )}
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              {/* Left: Quick action chips */}
              <div className="flex items-center gap-0.5">
                {/* Aspect Ratio */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
                  title="Aspect ratio"
                >
                  <Hash className="w-3.5 h-3.5" strokeWidth={1.8} />
                  <span>4:3</span>
                </button>

                {/* Link */}
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
                  title="Add link"
                >
                  <Link className="w-4 h-4" strokeWidth={1.8} />
                </button>

                {/* Brand DNA */}
                <BrandDnaSelector
                  value={selectedBrandName}
                  onChange={handleBrandChange}
                />

                {/* Settings (hidden in centered mode as it's active above) */}
                {!centered && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                      showSettings
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5"
                    )}
                    title="Settings"
                  >
                    <SlidersHorizontal className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                )}
              </div>

              {/* Right: Expand + Submit */}
              <div className="flex items-center gap-1.5">
                {/* Expand */}
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant/60 hover:text-on-surface hover:bg-on-surface/5 transition-all duration-200"
                  title="Expand"
                >
                  <Maximize2 className="w-4 h-4" strokeWidth={1.8} />
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={start_workflow || !hasPrompt}
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center",
                    "transition-all duration-200 ease-out",
                    hasPrompt && !start_workflow
                      ? "bg-[#D946EF] text-white  hover:scale-105 active:scale-95"
                      : "bg-outline-variant/15 text-muted-foreground/40 cursor-not-allowed"
                  )}
                >
                  {start_workflow ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Subtle hint text */}
      <p className="text-[10px] text-muted-foreground/30 mt-2 pointer-events-none select-none">
        Mark AI will generate content using your Brand DNA
      </p>
    </div>
  );
};

export default BottomNavbar;
