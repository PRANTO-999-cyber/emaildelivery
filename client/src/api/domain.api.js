// server/src/api/domain.api.js

import api from "./axios.js";

/**
 * Get all sender domains
 */
export const getDomains = async (params = {}) => {
  const { data } = await api.get("/domains", {
    params,
  });

  return data;
};

/**
 * Get a domain by ID
 */
export const getDomainById = async (domainId) => {
  const { data } = await api.get(`/domains/${domainId}`);

  return data;
};

/**
 * Add a new sender domain
 */
export const createDomain = async (payload) => {
  const { data } = await api.post("/domains", payload);

  return data;
};

/**
 * Update domain
 */
export const updateDomain = async (domainId, payload) => {
  const { data } = await api.put(`/domains/${domainId}`, payload);

  return data;
};

/**
 * Delete domain
 */
export const deleteDomain = async (domainId) => {
  const { data } = await api.delete(`/domains/${domainId}`);

  return data;
};

/**
 * Verify DNS records (SPF, DKIM, DMARC, etc.)
 */
export const verifyDomain = async (domainId) => {
  const { data } = await api.post(`/domains/${domainId}/verify`);

  return data;
};

/**
 * Refresh DNS verification
 */
export const refreshDomainVerification = async (domainId) => {
  const { data } = await api.post(`/domains/${domainId}/refresh`);

  return data;
};

/**
 * Get DNS records required for setup
 */
export const getDomainDNSRecords = async (domainId) => {
  const { data } = await api.get(`/domains/${domainId}/dns`);

  return data;
};

/**
 * Generate new DKIM keys
 */
export const regenerateDKIM = async (domainId) => {
  const { data } = await api.post(`/domains/${domainId}/dkim/regenerate`);

  return data;
};

/**
 * Get domain health
 */
export const getDomainHealth = async (domainId) => {
  const { data } = await api.get(`/domains/${domainId}/health`);

  return data;
};

/**
 * Get deliverability report
 */
export const getDomainDeliverability = async (domainId) => {
  const { data } = await api.get(`/domains/${domainId}/deliverability`);

  return data;
};

/**
 * Get domain analytics
 */
export const getDomainAnalytics = async (domainId) => {
  const { data } = await api.get(`/domains/${domainId}/analytics`);

  return data;
};

/**
 * Set default sender domain
 */
export const setDefaultDomain = async (domainId) => {
  const { data } = await api.patch(`/domains/${domainId}/default`);

  return data;
};

export default {
  getDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  verifyDomain,
  refreshDomainVerification,
  getDomainDNSRecords,
  regenerateDKIM,
  getDomainHealth,
  getDomainDeliverability,
  getDomainAnalytics,
  setDefaultDomain,
};
