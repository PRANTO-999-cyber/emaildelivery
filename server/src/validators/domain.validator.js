import { z } from "zod";

const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const createDomainSchema = z.object({
  domain: z
    .string()
    .min(3, "Domain is required")
    .regex(domainRegex, "Enter a valid domain (e.g. mail.yourcompany.com)")
    .toLowerCase(),
  dkimSelector: z.string().min(1).optional(),
});
