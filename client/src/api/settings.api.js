// server/src/api/settings.api.js

import api from "./axios.js";

/* -------------------------------------------------------------------------- */
/*                               General Settings                             */
/* -------------------------------------------------------------------------- */

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await api.put("/settings", payload);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                              Profile Settings                              */
/* -------------------------------------------------------------------------- */

export const getProfileSettings = async () => {
  const { data } = await api.get("/settings/profile");
  return data;
};

export const updateProfileSettings = async (payload) => {
  const { data } = await api.put("/settings/profile", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                              Company Settings                              */
/* -------------------------------------------------------------------------- */

export const getCompanySettings = async () => {
  const { data } = await api.get("/settings/company");
  return data;
};

export const updateCompanySettings = async (payload) => {
  const { data } = await api.put("/settings/company", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                               Branding                                     */
/* -------------------------------------------------------------------------- */

export const getBrandingSettings = async () => {
  const { data } = await api.get("/settings/branding");
  return data;
};

export const updateBrandingSettings = async (payload) => {
  const { data } = await api.put("/settings/branding", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                           Notification Settings                            */
/* -------------------------------------------------------------------------- */

export const getNotificationSettings = async () => {
  const { data } = await api.get("/settings/notifications");

  return data;
};

export const updateNotificationSettings = async (payload) => {
  const { data } = await api.put("/settings/notifications", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                              Security Settings                             */
/* -------------------------------------------------------------------------- */

export const getSecuritySettings = async () => {
  const { data } = await api.get("/settings/security");
  return data;
};

export const updateSecuritySettings = async (payload) => {
  const { data } = await api.put("/settings/security", payload);

  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.post("/settings/change-password", payload);

  return data;
};

export const enableTwoFactor = async () => {
  const { data } = await api.post("/settings/2fa/enable");

  return data;
};

export const disableTwoFactor = async () => {
  const { data } = await api.post("/settings/2fa/disable");

  return data;
};

/* -------------------------------------------------------------------------- */
/*                               API Keys                                     */
/* -------------------------------------------------------------------------- */

export const getApiKeys = async () => {
  const { data } = await api.get("/settings/api-keys");
  return data;
};

export const createApiKey = async (payload) => {
  const { data } = await api.post("/settings/api-keys", payload);

  return data;
};

export const revokeApiKey = async (keyId) => {
  const { data } = await api.delete(`/settings/api-keys/${keyId}`);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                               Webhooks                                     */
/* -------------------------------------------------------------------------- */

export const getWebhookSettings = async () => {
  const { data } = await api.get("/settings/webhooks");

  return data;
};

export const updateWebhookSettings = async (payload) => {
  const { data } = await api.put("/settings/webhooks", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                                Billing                                     */
/* -------------------------------------------------------------------------- */

export const getBillingSettings = async () => {
  const { data } = await api.get("/settings/billing");
  return data;
};

export const updateBillingSettings = async (payload) => {
  const { data } = await api.put("/settings/billing", payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                               Preferences                                  */
/* -------------------------------------------------------------------------- */

export const getPreferences = async () => {
  const { data } = await api.get("/settings/preferences");

  return data;
};

export const updatePreferences = async (payload) => {
  const { data } = await api.put("/settings/preferences", payload);

  return data;
};

export default {
  getSettings,
  updateSettings,

  getProfileSettings,
  updateProfileSettings,

  getCompanySettings,
  updateCompanySettings,

  getBrandingSettings,
  updateBrandingSettings,

  getNotificationSettings,
  updateNotificationSettings,

  getSecuritySettings,
  updateSecuritySettings,
  changePassword,
  enableTwoFactor,
  disableTwoFactor,

  getApiKeys,
  createApiKey,
  revokeApiKey,

  getWebhookSettings,
  updateWebhookSettings,

  getBillingSettings,
  updateBillingSettings,

  getPreferences,
  updatePreferences,
};
