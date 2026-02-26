import z from "zod";

export const extractorSchema = z.object({
  target_url:z.string()
})

export const extractorResponse = z.object({
  message: z.string()
})

export type ExtractorFormData = z.infer<typeof extractorSchema>;
export type ExtractorResponse = z.infer<typeof extractorResponse>;