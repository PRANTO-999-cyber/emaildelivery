import { z } from "zod";

export const createTemplateSchema = z.object({
  name: z.string().min(2, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  htmlContent: z.string().min(1, "HTML content is required"),
  textContent: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
});

export const updateTemplateSchema = createTemplateSchema.partial();
