import { z } from "zod";

export const BackendErrorSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  detail: z.union([
    z.string(),
    z.array(z.object({
      loc: z.array(z.union([z.string(), z.number()])).optional(),
      msg: z.string(),
      type: z.string().optional(),
    })),
    z.record(z.unknown()),
  ]).optional(),
  statusCode: z.number().optional(),
}).passthrough(); 

export const ValidationErrorSchema = z.object({
  detail: z.array(z.object({
    loc: z.array(z.union([z.string(), z.number()])),
    msg: z.string(),
    type: z.string(),
  })),
});

export type BackendError = z.infer<typeof BackendErrorSchema>;
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
