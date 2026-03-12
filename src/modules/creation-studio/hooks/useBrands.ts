import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllBrands,
  setBrandExtractor,
  setNewBrand,
} from "@/modules/creation-studio/services/brandService";
import { BrandExtractor } from "@/modules/creation-studio/schemas/BrandSchema";
import { useFlowStore } from "../store/flowStoreSlice";
import { toast } from "sonner";

export function useBrandExtractor() {
  const { setIsLoading, setBrandData, setError } = useFlowStore();

  return useMutation({
    mutationFn: (targetUrl: string) => setBrandExtractor(targetUrl),
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
    onError: (err: Error) => {
      setError(err.message || "Something went wrong");
      setIsLoading(false);
      toast.error(err.message || "Failed to extract brand");
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["creation-studio", "brands"],
    queryFn: getAllBrands,
    retry: false,
  });
}

export function useActiveBrand() {
  const brandData = useFlowStore((state) => state.brandData);

  return {
    data: brandData,
    isLoading: false,
  };
}

export function useSetNewBrand() {
  return useMutation({
    mutationFn: (brand: BrandExtractor) => setNewBrand(brand),
    onSuccess: () => {
      toast.success("Brand already saved in the backend.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save brand");
    },
  });
}
