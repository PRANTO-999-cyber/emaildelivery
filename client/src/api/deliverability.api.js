// server/src/api/deliverability.api.js

import api from "./axios.js";

/**
 * Dashboard overview
 */
export const getDeliverabilityDashboard = async () => {
  const { data } = await api.get("/deliverability/dashboard");
  return data;
};

/**
 * Overall deliverability statistics
 */
export const getDeliverabilityStats = async (params = {}) => {
  const { data } = await api.get("/deliverability/stats", {
    params,
  });

  return data;
};

/**
 * Domain health
 */
export const getDomainHealth = async (domainId) => {
  const { data } = await api.get(`/deliverability/domains/${domainId}`);

  return data;
};

/**
 * Check domain authentication
 */
export const verifyDomain = async (domainId) => {
  const { data } = await api.post(`/deliverability/domains/${domainId}/verify`);

  return data;
};

/**
 * Refresh domain DNS status
 */
export const refreshDomainHealth = async (domainId) => {
  const { data } = await api.post(
    `/deliverability/domains/${domainId}/refresh`,
  );

  return data;
};

/**
 * SMTP health
 */
export const getSMTPHealth = async (smtpId) => {
  const { data } = await api.get(`/deliverability/smtp/${smtpId}`);

  return data;
};

/**
 * Test SMTP connection
 */
export const testSMTPConnection = async (smtpId) => {
  const { data } = await api.post(`/deliverability/smtp/${smtpId}/test`);

  return data;
};

/**
 * Blacklist check
 */
export const getBlacklistStatus = async (domain) => {
  const { data } = await api.get("/deliverability/blacklist", {
    params: {
      domain,
    },
  });

  return data;
};

/**
 * Inbox placement report
 */
export const getInboxPlacement = async (campaignId) => {
  const { data } = await api.get(
    `/deliverability/inbox-placement/${campaignId}`,
  );

  return data;
};

/**
 * Bounce report
 */
export const getBounceReport = async (params = {}) => {
  const { data } = await api.get("/deliverability/bounces", {
    params,
  });

  return data;
};

/**
 * Complaint report
 */
export const getComplaintReport = async (params = {}) => {
  const { data } = await api.get("/deliverability/complaints", {
    params,
  });

  return data;
};

/**
 * Suppression list
 */
export const getSuppressionList = async (params = {}) => {
  const { data } = await api.get("/deliverability/suppressions", {
    params,
  });

  return data;
};

/**
 * Remove suppression
 */
export const removeSuppression = async (email) => {
  const { data } = await api.delete("/deliverability/suppressions", {
    data: {
      email,
    },
  });

  return data;
};

/**
 * Warmup status
 */
export const getWarmupStatus = async (smtpId) => {
  const { data } = await api.get(`/deliverability/warmup/${smtpId}`);

  return data;
};

/**
 * Start warmup
 */
export const startWarmup = async (smtpId) => {
  const { data } = await api.post(`/deliverability/warmup/${smtpId}/start`);

  return data;
};

/**
 * Pause warmup
 */
export const pauseWarmup = async (smtpId) => {
  const { data } = await api.post(`/deliverability/warmup/${smtpId}/pause`);

  return data;
};

/**
 * Resume warmup
 */
export const resumeWarmup = async (smtpId) => {
  const { data } = await api.post(`/deliverability/warmup/${smtpId}/resume`);

  return data;
};

export default {
  getDeliverabilityDashboard,
  getDeliverabilityStats,
  getDomainHealth,
  verifyDomain,
  refreshDomainHealth,
  getSMTPHealth,
  testSMTPConnection,
  getBlacklistStatus,
  getInboxPlacement,
  getBounceReport,
  getComplaintReport,
  getSuppressionList,
  removeSuppression,
  getWarmupStatus,
  startWarmup,
  pauseWarmup,
  resumeWarmup,
};
