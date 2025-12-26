import { z } from "zod";

export const extractorSchema = z.object({
  brandUrl: z
    .url()
    .min(10, { message: "Brand URL muts be www.example.com" })
});

export type ExtractorFormData = z.infer<typeof extractorSchema>;

export const defaultExtractorForm: ExtractorFormData = {
  brandUrl: "", 
};