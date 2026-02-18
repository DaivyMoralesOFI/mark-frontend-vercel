import { queryKeys } from "@/core/config/query-keys";
import { useFirebaseQuery } from "@/core/hooks/use-firebase-query";
import {
  BrandExtractor,
  BrandsResponse,
} from "@/modules/creation-studio/schemas/brand-schema";
import {
  getActiveBrand,
  getAllBrands,
  setBrandExtractor,
  setNewBrand,
} from "@/modules/creation-studio/service/brand-service";
import { useMutation } from "@tanstack/react-query";
import { useFlowStore } from "../store/flow-store";
import { toast } from "sonner";

export const brandKeys = {
  all: ["brands"] as const,
  extractor: () => [...brandKeys.all, "extractor"] as const,
};

export function useBrands() {
  const query = useFirebaseQuery<BrandsResponse>({
    queryKey: queryKeys.brands.list(),
    queryFn: async () => {
      const brands = await getAllBrands();
      return brands;
    },
    enabled: true,
    type: "brands", // 5 min staleTime, 30 min gcTime
  });

  return {
    ...query,
  };
}

export function useActiveBrand() {
  const query = useFirebaseQuery<BrandExtractor | null>({
    queryKey: [...queryKeys.brands.all, "active"] as const,
    queryFn: async () => {
      const brand = await getActiveBrand();
      return brand;
    },
    enabled: true,
    type: "brands",
  });

  return {
    ...query,
  };
}

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

export function useSetNewBrand() {
  return useMutation({
    mutationFn: (brand: BrandExtractor) => setNewBrand(brand),
    onSuccess: () => {
      toast.success("Brand DNA saved successfully!");
    },
    onError: () => {
      toast.error("Error saving brand DNA");
    },
  });
}
