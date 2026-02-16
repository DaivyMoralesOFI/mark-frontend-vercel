import { queryKeys } from "@/core/config/query-keys";
import { useFirebaseQuery } from "@/core/hooks/use-firebase-query";
import { AllBrandsResponse } from "@/modules/creation-studio/schemas/brand-schema";

import { getAllBrands } from "@/modules/creation-studio/service/brand-service";

export function useBrands() {
  const query = useFirebaseQuery<AllBrandsResponse>({
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
