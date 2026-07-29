import * as Yup from "yup";

const DOMAIN_REGEX =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const addDomainSchema = Yup.object().shape({
  domainName: Yup.string()
    .matches(
      DOMAIN_REGEX,
      "Please enter a valid domain name (e.g. mail.acme.com)",
    )
    .required("Domain name is required"),

  customTrackingSubdomain: Yup.string()
    .matches(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens",
    )
    .default("track"),

  enableWarmupPlan: Yup.boolean().default(true),

  initialWarmupVolume: Yup.number().when("enableWarmupPlan", {
    is: true,
    then: (schema) =>
      schema
        .min(50, "Starting volume must be at least 50 emails/day")
        .max(5000, "Initial warm-up volume cannot exceed 5,000")
        .required("Initial volume required"),
    otherwise: (schema) => schema.nullable(),
  }),
});
