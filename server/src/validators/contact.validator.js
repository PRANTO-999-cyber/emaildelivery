import { z } from "zod";

export const createContactSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  groups: z.array(z.string()).optional().default([]),
  consentSource: z.enum(
    ["signup_form", "checkout", "manual_import", "event_registration"],
    {
      errorMap: () => ({
        message: "consentSource must be a recognized opt-in source",
      }),
    },
  ),
});

export const createGroupSchema = z.object({
  name: z.string().min(2, "Group name must be at least 2 characters"),
  description: z.string().optional(),
});
