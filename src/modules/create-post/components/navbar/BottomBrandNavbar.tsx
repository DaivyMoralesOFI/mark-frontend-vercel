import { Button } from "@/shared/components/ui/Button";
import { Textarea } from "@/shared/components/ui/Textarea";
import {
  Loader,
  SendHorizonal,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Save,
  Plus,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExtractorFormData,
  extractorFormSchema,
} from "@/modules/create-post/schemas/BrandSchema";
import { useBrandExtractor, useSetNewBrand } from "../../hooks/useBrands";
import { useFlowStore } from "../../store/flowStoreSlice";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BottomBrandNavbar = () => {
  const { brandData, resetFlow } = useFlowStore();
  const { mutate: brandExtractor, isPending: isProcessing } =
    useBrandExtractor();
  const { mutate: saveBrand } = useSetNewBrand();

  const _form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: {
      brandUrl: "",
    },
  });

  const onSubmit = async (data: ExtractorFormData) => {
    brandExtractor(data.brandUrl);
  };

  const handleNew = () => {
    resetFlow();
    _form.reset();
  };

  const handleSave = () => {
    if (brandData) {
      saveBrand(brandData);
    }
  };

  const handleFeedback = (type: "good" | "bad") => {
    toast.info(`Thanks for your feedback: ${type === "good" ? "👍" : "👎"}`);
  };

  const handleTryAgain = () => {
    const url = _form.getValues("brandUrl");
    if (url) {
      onSubmit({ brandUrl: url });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 flex flex-col items-center z-1000 pointer-events-none">
      <div className="w-full max-w-2xl flex flex-col gap-4 pointer-events-auto">
        <AnimatePresence mode="wait">
          {!brandData ? (
            <motion.form
              key="input-form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onSubmit={_form.handleSubmit(onSubmit)}
              className="w-full bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="w-full flex flex-col items-end gap-3 px-6 py-4">
                <div className="w-full flex items-start gap-3 px-3 py-4">
                  <div className="w-full max-w-[90%] relative overflow-y-auto max-h-20">
                    <Controller
                      name="brandUrl"
                      control={_form.control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          rows={1}
                          placeholder="Type your brand url e.g. https://www.google.com"
                          className="resize-none shadow-none rounded-none border-0 border-b border-outline-variant bg-transparent text-on-surface placeholder:text-on-surface-variant focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-2 min-h-0"
                        />
                      )}
                    />
                  </div>
                  <div className="w-full max-w-[10%] flex justify-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <SendHorizonal />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="action-buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback("good")}
                  className="rounded-full gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Good
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFeedback("bad")}
                  className="rounded-full gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Bad
                </Button>
              </div>

              <div className="h-8 w-px bg-outline-variant/30" />

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTryAgain}
                  disabled={isProcessing}
                  className="rounded-full gap-2"
                >
                  {isProcessing ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  Try again
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSave}
                  className="rounded-full gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNew}
                  className="rounded-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New extractor
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BottomBrandNavbar;
