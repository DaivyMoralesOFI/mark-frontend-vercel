import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Loader,
  SendHorizonal,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  ChevronUp,
  X,
} from "lucide-react";
import PostTypeSelector from "@/modules/create-post/components/dropdown/post-type-selector";
import SocialMediaSelector from "../dropdown/social-media-selector";
import PostToneSelector from "../dropdown/post-tone-selector";
import BrandDnaSelector from "../dropdown/brand-dna-selector";
import ToolsSelector from "../dropdown/tools-selector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  CreateImage,
  createImageSchema,
} from "@/modules/create-post/schemas/create-image";

import { useCreateImage } from "../../hooks/use-create-image";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import { BrandExtractor } from "@/modules/create-post/schemas/brand-schema";
import { useAppDispatch } from "@/core/store/store";
import { setSelectedBrandId } from "../../store/createPostSlice";
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
 * Builds the create-image payload using the selected brand data.
 */
function buildCreateImagePayload(
  formData: BottomNavbarForm,
  brand: BrandExtractor | null
): CreateImage {
  if (brand) {
    const colors = brand.color_system.roles;
    return {
      prompt: formData.prompt,
      platforms: formData.platforms,
      post_type: formData.post_type,
      post_tone: formData.post_tone,
      brand_dna: {
        color_palette: {
          primary: colors.primary.hex,
          secondary: colors.secondary.hex,
          accent: colors.tertiary.hex,
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
      },
      identity: {
        logo_url: brand.brand_identity.logo.url,
        name: brand.brand_identity.name,
        slug: brand.brand_identity.name.toLowerCase().replace(/\s+/g, "-"),
        site_url: brand.brand_identity.url,
      },
    };
  }

  return {
    prompt: formData.prompt,
    platforms: formData.platforms,
    post_type: formData.post_type,
    post_tone: formData.post_tone,
    brand_dna: {
      color_palette: {
        primary: "#6C5CE7",
        secondary: "#A29BFE",
        accent: "#FD79A8",
        complementary: ["#00CEC9", "#FFEAA7", "#55EFC4"],
      },
      typography: {
        body: "Roboto",
        heading: "Inter",
      },
      tone: {
        description: "A modern, creative brand",
        keywords: ["creative", "modern", "professional"],
        voice: "Friendly yet professional",
      },
    },
    identity: {
      logo_url:
        "https://uploads.magnetme-images.com/b6ef6eec4cf95e65643013e.png",
      name: "Default",
      slug: "default",
      site_url: "https://example.com",
    },
  };
}

const BottomNavbar = () => {
  const [start_workflow, setStartWorkflow] = useState(false);
  const [selectedBrand, setSelectedBrand] =
    useState<BrandExtractor | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: startCreation } = useCreateImage();

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

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-5 flex flex-col items-center z-1000 pointer-events-none">
      <div
        className={cn(
          "w-full max-w-[680px] flex flex-col pointer-events-auto",
          "bg-surface-container-lowest/95 backdrop-blur-2xl",
          "border rounded-2xl shadow-2xl",
          "transition-all duration-300 ease-out",
          isFocused || hasPrompt
            ? "border-primary/40 shadow-primary/5"
            : "border-outline-variant/30 shadow-black/5"
        )}
      >
        <form
          onSubmit={_form.handleSubmit(onSubmit)}
          id="create-image-form"
          className="w-full"
        >
          {/* Expandable Settings Panel */}
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
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="p-0.5 rounded-full hover:bg-outline-variant/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
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

          {/* Main Input Area */}
          <div className="px-4 pt-3 pb-2">
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
                  rows={1}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => {
                    field.onChange(e);
                    handleTextareaChange();
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "resize-none shadow-none border-none bg-transparent",
                    "text-on-surface text-[15px] leading-relaxed",
                    "placeholder:text-on-surface-variant/40",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "px-0 py-1 min-h-[28px] max-h-[120px]"
                  )}
                />
              )}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            {/* Left: Quick action chips */}
            <div className="flex items-center gap-1">
              <BrandDnaSelector
                value={selectedBrandName}
                onChange={handleBrandChange}
              />

              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                  "border transition-all duration-200",
                  showSettings
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-container-low/60 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container hover:border-outline-variant/40"
                )}
              >
                <ChevronUp
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    showSettings ? "rotate-180" : ""
                  )}
                />
                Settings
              </button>

              <ToolsSelector />
            </div>

            {/* Right: Submit */}
            <div className="flex items-center gap-2">
              {hasPrompt && (
                <span className="text-[10px] text-muted-foreground/50 hidden sm:block">
                  ⌘ Enter
                </span>
              )}
              <button
                type="submit"
                disabled={start_workflow || !hasPrompt}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center",
                  "transition-all duration-200 ease-out",
                  hasPrompt && !start_workflow
                    ? "bg-primary text-on-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
                    : "bg-outline-variant/15 text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                {start_workflow ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <SendHorizonal className="w-4 h-4" />
                )}
              </button>
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
