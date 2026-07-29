// server/src/api/campaign.api.js

import api from "./axios.js";

/**
 * Get all campaigns
 */
export const getCampaigns = async (params = {}) => {
  const { data } = await api.get("/campaigns", {
    params,
  });

  return data;
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (campaignId) => {
  const { data } = await api.get(`/campaigns/${campaignId}`);

  return data;
};

/**
 * Create campaign
 */
export const createCampaign = async (payload) => {
  const { data } = await api.post("/campaigns", payload);

  return data;
};

/**
 * Update campaign
 */
export const updateCampaign = async (campaignId, payload) => {
  const { data } = await api.put(`/campaigns/${campaignId}`, payload);

  return data;
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (campaignId) => {
  const { data } = await api.delete(`/campaigns/${campaignId}`);

  return data;
};

/**
 * Duplicate campaign
 */
export const duplicateCampaign = async (campaignId) => {
  const { data } = await api.post(`/campaigns/${campaignId}/duplicate`);

  return data;
};

/**
 * Send campaign immediately
 */
export const sendCampaign = async (campaignId) => {
  const { data } = await api.post(`/campaigns/${campaignId}/send`);

  return data;
};

/**
 * Schedule campaign
 */
export const scheduleCampaign = async (campaignId, scheduleAt) => {
  const { data } = await api.post(`/campaigns/${campaignId}/schedule`, {
    scheduleAt,
  });

  return data;
};

/**
 * Pause campaign
 */
export const pauseCampaign = async (campaignId) => {
  const { data } = await api.patch(`/campaigns/${campaignId}/pause`);

  return data;
};

/**
 * Resume campaign
 */
export const resumeCampaign = async (campaignId) => {
  const { data } = await api.patch(`/campaigns/${campaignId}/resume`);

  return data;
};

/**
 * Cancel campaign
 */
export const cancelCampaign = async (campaignId) => {
  const { data } = await api.patch(`/campaigns/${campaignId}/cancel`);

  return data;
};

/**
 * Campaign analytics
 */
export const getCampaignAnalytics = async (campaignId) => {
  const { data } = await api.get(`/campaigns/${campaignId}/analytics`);

  return data;
};

/**
 * Campaign recipients
 */
export const getCampaignRecipients = async (campaignId, params = {}) => {
  const { data } = await api.get(`/campaigns/${campaignId}/recipients`, {
    params,
  });

  return data;
};

/**
 * Campaign activity log
 */
export const getCampaignActivity = async (campaignId) => {
  const { data } = await api.get(`/campaigns/${campaignId}/activity`);

  return data;
};

/**
 * Test send
 */
export const sendTestEmail = async (campaignId, emails) => {
  const { data } = await api.post(`/campaigns/${campaignId}/test`, {
    emails,
  });

  return data;
};

export default {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  duplicateCampaign,
  sendCampaign,
  scheduleCampaign,
  pauseCampaign,
  resumeCampaign,
  cancelCampaign,
  getCampaignAnalytics,
  getCampaignRecipients,
  getCampaignActivity,
  sendTestEmail,
};
