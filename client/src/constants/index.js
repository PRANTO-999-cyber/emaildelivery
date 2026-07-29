export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  CAMPAIGNS: "/campaigns",
  CONTACTS: "/contacts",
  DOMAINS: "/domains",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
};

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

export const PERMISSIONS = {
  MANAGE_CAMPAIGNS: "manage_campaigns",
  MANAGE_DOMAINS: "manage_domains",
  VIEW_ANALYTICS: "view_analytics",
};

export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  SENDING: "sending",
  COMPLETED: "completed",
  PAUSED: "paused",
  FAILED: "failed",
};

export const CAMPAIGN_STATUS_BADGES = {
  [CAMPAIGN_STATUS.DRAFT]: "default",
  [CAMPAIGN_STATUS.SCHEDULED]: "info",
  [CAMPAIGN_STATUS.SENDING]: "warning",
  [CAMPAIGN_STATUS.COMPLETED]: "success",
  [CAMPAIGN_STATUS.PAUSED]: "danger",
  [CAMPAIGN_STATUS.FAILED]: "danger",
};
