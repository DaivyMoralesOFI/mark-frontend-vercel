import { setBrandExtractor } from "@/modules/creation-studio/services/brandService";

export const brandExtractorWorkFlow = async (targetUrl: string) => ({
  status: 200,
  data: await setBrandExtractor(targetUrl),
});
