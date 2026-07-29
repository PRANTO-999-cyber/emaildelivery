import * as Yup from "yup";

/**
 * Step 1: Campaign Metadata & Setup Schema
 */
export const campaignSetupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Campaign name must be at least 3 characters")
    .max(100, "Campaign name cannot exceed 100 characters")
    .required("Campaign name is required"),

  sendingDomainId: Yup.string().required(
    "Please select an authenticated sending domain",
  ),

  fromName: Yup.string()
    .min(2, "From Name is too short")
    .required("Sender display name is required"),

  fromEmail: Yup.string()
    .email("Must be a valid email address")
    .required("From email address is required"),

  replyToEmail: Yup.string().email("Must be a valid email address").nullable(),

  trackOpens: Yup.boolean().default(true),
  trackClicks: Yup.boolean().default(true),
});

/**
 * Step 2: Content & Subject Line Schema
 */
export const campaignContentSchema = Yup.object().shape({
  subject: Yup.string()
    .min(2, "Subject line is required")
    .max(150, "Subject line is too long")
    .required("Subject line is required"),

  previewText: Yup.string().max(
    200,
    "Preheader text cannot exceed 200 characters",
  ),

  htmlContent: Yup.string()
    .min(10, "Email body content is too short")
    .required("Email content body is required"),

  plainTextContent: Yup.string().nullable(),
});

/**
 * Step 3: Audience & Schedule Schema
 */
export const campaignAudienceSchema = Yup.object().shape({
  targetListIds: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one recipient list")
    .required("Recipient list selection is required"),

  excludedListIds: Yup.array().of(Yup.string()),

  sendStrategy: Yup.string()
    .oneOf(["immediate", "scheduled", "throttled"], "Invalid dispatch strategy")
    .required("Select a dispatch strategy"),

  scheduledAt: Yup.date().when("sendStrategy", {
    is: "scheduled",
    then: (schema) =>
      schema
        .min(new Date(), "Schedule date must be in the future")
        .required("Schedule date and time are required"),
    otherwise: (schema) => schema.nullable(),
  }),

  hourlyThrottleLimit: Yup.number().when("sendStrategy", {
    is: "throttled",
    then: (schema) =>
      schema
        .min(100, "Minimum throttle rate is 100 emails/hour")
        .max(50000, "Maximum throttle rate is 50,000 emails/hour")
        .required("Hourly throttle limit is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});
