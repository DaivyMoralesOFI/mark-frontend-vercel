import { z } from "zod";

export const extractorFormSchema = z.object({
  brandUrl: z
    .string()
    .min(1, "Please enter a URL")
    .transform((val) => {
      // Si la URL no comienza con http:// o https://, agregar https://
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        return `https://${val}`;
      }
      return val;
    })
    .pipe(
      z.string().refine(
        (val) => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Please enter a valid URL" }
      )
    )
});

export type ExtractorFormData = z.infer<typeof extractorFormSchema>;

export const defaultExtractorForm: ExtractorFormData = {
  brandUrl: "", 
};