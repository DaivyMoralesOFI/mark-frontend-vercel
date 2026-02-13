import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader, SendHorizonal, Sparkles } from "lucide-react";
import PostTypeSelector from "@/modules/creation-studio/components/dropdown/post-type-selector";
import SocialMediaSelector from "../dropdown/social-media-selector";
import PostToneSelector from "../dropdown/post-tone-selector";
import ToolsSelector from "../dropdown/tools-selector";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { brandMock } from "@/core/data/brand-mock";
import {
  CreateImage,
  createImageSchema,
} from "@/modules/creation-studio/schemas/create-image";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateImageResponse } from "@/modules/creation-studio/schemas/create-image";
import {
  useCreateImage,
  useGetCreatedImage,
} from "../../hooks/use-create-image";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface BottomNavbarProps {
  createImageMutation: UseMutationResult<
    CreateImageResponse,
    Error,
    CreateImage
  >;
}

// Schema parcial: solo los campos que el usuario controla directamente
const bottomNavbarSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  post_type: z.string().min(1, "Post type is required"),
  post_tone: z.string().min(1, "Post tone is required"),
});

type BottomNavbarForm = z.infer<typeof bottomNavbarSchema>;

/**
 * Transforma los datos del formulario + brand mock en el schema completo
 * para enviar al servicio de creación de imagen.
 */
function buildCreateImagePayload(formData: BottomNavbarForm): CreateImage {
  return {
    prompt: formData.prompt,
    platforms: formData.platforms,
    post_type: formData.post_type,
    post_tone: formData.post_tone,
    brand_dna: {
      color_palette: {
        primary: brandMock.brand_dna.color_pallete.primary,
        secondary: brandMock.brand_dna.color_pallete.secondary,
        accent: brandMock.brand_dna.color_pallete.accent,
        complementary: brandMock.brand_dna.color_pallete.complementary,
      },
      typography: {
        body: brandMock.brand_dna.typography.body.font_family,
        heading: brandMock.brand_dna.typography.headings.font_family,
      },
      tone: {
        description: brandMock.brand_tone_mood.description,
        keywords: brandMock.brand_tone_mood.keywords,
        voice: brandMock.brand_tone_mood.voice,
      },
    },
    identity: {
      logo_url: brandMock.identity.logo_url,
      name: brandMock.identity.name,
      slug: brandMock.identity.slug,
      site_url: brandMock.identity.url,
    },
  };
}

const BottomNavbar = () => {
  const [start_workflow, setStartWorkflow] = useState(false);
  const navigate = useNavigate();
  const { mutate: startCreation, isPending: isProcessing } = useCreateImage();
  const _form = useForm<BottomNavbarForm>({
    resolver: zodResolver(bottomNavbarSchema),
    defaultValues: {
      prompt: "",
      platforms: ["instagram"],
      post_type: "post",
      post_tone: "promotional",
    },
  });

  const onSubmit = async (data: BottomNavbarForm) => {
    const payload = buildCreateImagePayload(data);

    console.log("🔍 [Validation] Built payload:", payload);

    // Validate full payload before sending
    const validationResult = createImageSchema.safeParse(payload);
    if (!validationResult.success) {
      console.error("❌ [Validation] Invalid payload:", {
        errors: validationResult.error.flatten(),
        fieldErrors: validationResult.error.flatten().fieldErrors,
        formattedErrors: validationResult.error.format(),
        payload: payload,
      });
      // Show error toast to user (optional)
      return;
    }

    console.log("✅ [Validation] Payload is valid, sending to API...");

    setStartWorkflow(true);
    // 2. Ejecutamos la mutación
    startCreation(payload, {
      onSuccess: (response) => {
        console.log("✅ [API] Creation started successfully:", response);

        if (response.uuid) {
          // Pequeño delay para dar tiempo al backend a escribir en Firebase
          // Esto reduce la probabilidad de race condition
          console.log(
            "⏳ [Navigation] Waiting 500ms before navigating to allow backend to write to Firebase...",
          );
          setTimeout(() => {
            console.log("🔄 [Navigation] Navigating to workflow page...");
            navigate(`/app/creation-studio/new/content/${response.uuid}`);
          }, 500);
        }
      },
      onError: (error) => {
        // Manejo de errores de inicio de workflow
        console.error("❌ [API] Error starting creation:", error);
        setStartWorkflow(false);
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 flex flex-col items-center z-[1000] pointer-events-none">
      <div className="w-full max-w-3xl flex flex-col gap-4 pointer-events-auto">
        <form
          onSubmit={_form.handleSubmit(onSubmit)}
          id="create-image-form"
          className="w-full bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-start py-3 border-b border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-center gap-2 px-4">
              <Button
                type="button"
                variant="agent"
                className="group flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/80 backdrop-blur-md hover:bg-surface-container border border-outline-variant/30 rounded-full"
              >
                <Sparkles className="w-5 h-5" />
                Brainstorm
              </Button>
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
          <div className="w-full flex flex-col items-end gap-3 px-6 py-4">
            <div className="w-full flex-1 relative overflow-y-auto max-h-40">
              <Controller
                name="prompt"
                control={_form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Start from an idea for your content"
                    rows={2}
                    className="resize-none shadow-none border-none bg-transparent text-on-surface placeholder:text-on-surface-variant focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2"
                  />
                )}
              />
            </div>
            <div className="w-full flex-1 flex justify-between">
              <ToolsSelector />
              <Button
                type="submit"
                variant="primary"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={start_workflow || !_form.watch("prompt").trim()}
              >
                {start_workflow ? (
                  <Loader className="animate-spin" />
                ) : (
                  <SendHorizonal />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BottomNavbar;
