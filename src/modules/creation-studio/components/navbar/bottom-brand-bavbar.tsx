import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Loader, SendHorizonal } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExtractorFormData,
  extractorFormSchema,
} from "@/modules/creation-studio/schemas/brand-schema";
import { useBrandExtractor } from "../../hooks/use-brands";
import { useFlowStore } from "../../store/flow-store";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BottomBrandNavbar = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const { mutate: brandExtractor, isPending: isProcessing } =
    useBrandExtractor();
  const setBrandData = useFlowStore((state) => state.setBrandData);

  const _form = useForm<ExtractorFormData>({
    resolver: zodResolver(extractorFormSchema),
    defaultValues: {
      brandUrl: "",
    },
  });

  const onSubmit = async (data: ExtractorFormData) => {
    setHasStarted(true);
    brandExtractor(data.brandUrl, {
      onSuccess: (response) => {
        if (response?.output) {
          setBrandData(response.output);
        }
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 flex flex-col items-center z-1000 pointer-events-none">
      <div className="w-full max-w-2xl flex flex-col gap-4 pointer-events-auto">
        <form
          onSubmit={_form.handleSubmit(onSubmit)}
          id="create-image-form"
          className="w-full bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-lg overflow-hidden"
        >
          <div className="w-full flex flex-col items-end gap-3 px-6 py-4">
            <AnimatePresence>
              {!hasStarted && (
                <motion.div
                  initial={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="text-center w-full overflow-hidden"
                >
                  <h1 className="mb-3 text-[8cqw] md:text-[5cqw] lg:text-[2cqw] title text-title leading-6">
                    From your website <br /> to your Brand DNA
                  </h1>
                  <h3 className="mb-4 text-gray-500">
                    Your visual identity and design foundation, easily
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
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
        </form>
      </div>
    </div>
  );
};

export default BottomBrandNavbar;
