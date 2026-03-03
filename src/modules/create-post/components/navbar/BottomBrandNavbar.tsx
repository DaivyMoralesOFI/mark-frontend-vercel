import { Button } from "@/shared/components/ui/Button";
import {
  Loader,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Save,
  Plus,
} from "lucide-react";
import { useBrandExtractor, useSetNewBrand } from "../../hooks/useBrands";
import { useFlowStore } from "../../store/flowStoreSlice";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BottomBrandNavbar = () => {
  const { brandData, resetFlow } = useFlowStore();
  const { mutate: brandExtractor, isPending: isProcessing } =
    useBrandExtractor();
  const { mutate: saveBrand } = useSetNewBrand();

  const handleNew = () => {
    resetFlow();
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
    // Re-extract using the brand's existing URL if available
    const url = brandData?.brand_identity?.url;
    if (url) {
      brandExtractor(url);
    }
  };

  // Only show the bottom navbar when brand data exists
  if (!brandData) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 flex flex-col items-center z-1000 pointer-events-none">
      <div className="w-full max-w-2xl flex flex-col gap-4 pointer-events-auto">
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BottomBrandNavbar;
