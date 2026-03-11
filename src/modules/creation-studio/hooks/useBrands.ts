import { useMutation } from "@tanstack/react-query";
import { setBrandExtractor } from "@/modules/creation-studio/services/brandService";
import { useFlowStore } from "../store/flowStoreSlice";
import { toast } from "sonner";

export function useBrandExtractor() {
  const { setIsLoading, setBrandData, setError } = useFlowStore();

  return useMutation({
    mutationFn: (target_url: string) => setBrandExtractor(target_url),
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      if (response?.output) {
        setBrandData(response.output);
      }
      setIsLoading(false);
    },
    onError: (err: any) => {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
    },
  });
}
