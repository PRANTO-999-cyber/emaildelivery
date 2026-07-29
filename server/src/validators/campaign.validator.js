import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  template: objectId.optional(),
  subject: z.string().min(1, "Subject is required"),
  htmlContent: z.string().min(1, "Email content is required"),
  textContent: z.string().optional(),
  fromDomain: objectId,
  fromEmail: z.string().email("Enter a valid from email"),
  fromName: z.string().min(1, "From name is required"),
  replyTo: z.string().email().optional().or(z.literal("")),
  groups: z.array(objectId).min(1, "Select at least one recipient group"),
  scheduledAt: z.coerce.date().optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();
