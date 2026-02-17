import { queryKeys } from "@/core/config/query-keys";
import { useFirebaseQuery } from "@/core/hooks/use-firebase-query";
import { BrandsResponse } from "@/modules/creation-studio/schemas/brand-schema";
import {
  getAllBrands,
  setBrandExtractor,
} from "@/modules/creation-studio/service/brand-service";
import { useMutation } from "@tanstack/react-query";

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

export function useBrandExtractor() {
  return useMutation({
    mutationFn: (target_url: string) => setBrandExtractor(target_url),
    onSuccess: () => {
      console.log("✅ Job updated successfully");
    },
    onError: () => {
      console.log("❌ Error updating job");
    },
  });
}
