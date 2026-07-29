import * as Yup from "yup";

export const inviteMemberSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid team member email address")
    .required("Email address is required"),

  role: Yup.string()
    .oneOf(
      ["Owner", "Admin", "Campaign Manager", "Analyst"],
      "Invalid role selected",
    )
    .required("Role designation is required"),
});

export const workspaceSettingsSchema = Yup.object().shape({
  workspaceName: Yup.string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name cannot exceed 50 characters")
    .required("Workspace name is required"),

  organizationSlug: Yup.string()
    .matches(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .required("URL slug is required"),

  notificationEmails: Yup.array()
    .of(Yup.string().email("Invalid email"))
    .min(1, "Provide at least one alert email recipient"),
});
