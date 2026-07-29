// server/src/api/smtp.api.js

import api from "./axios.js";

/* -------------------------------------------------------------------------- */
/*                               SMTP CRUD                                    */
/* -------------------------------------------------------------------------- */

export const getSMTPServers = async (params = {}) => {
  const { data } = await api.get("/smtp", { params });
  return data;
};

export const getSMTPServerById = async (smtpId) => {
  const { data } = await api.get(`/smtp/${smtpId}`);
  return data;
};

export const createSMTPServer = async (payload) => {
  const { data } = await api.post("/smtp", payload);
  return data;
};

export const updateSMTPServer = async (smtpId, payload) => {
  const { data } = await api.put(`/smtp/${smtpId}`, payload);
  return data;
};

export const deleteSMTPServer = async (smtpId) => {
  const { data } = await api.delete(`/smtp/${smtpId}`);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                              SMTP Actions                                  */
/* -------------------------------------------------------------------------- */

export const testSMTPConnection = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/test`);
  return data;
};

export const verifySMTPServer = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/verify`);
  return data;
};

export const sendTestEmail = async (smtpId, payload) => {
  const { data } = await api.post(`/smtp/${smtpId}/send-test`, payload);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                            SMTP Status                                     */
/* -------------------------------------------------------------------------- */

export const enableSMTPServer = async (smtpId) => {
  const { data } = await api.patch(`/smtp/${smtpId}/enable`);
  return data;
};

export const disableSMTPServer = async (smtpId) => {
  const { data } = await api.patch(`/smtp/${smtpId}/disable`);
  return data;
};

export const setDefaultSMTPServer = async (smtpId) => {
  const { data } = await api.patch(`/smtp/${smtpId}/default`);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                             SMTP Rotation                                  */
/* -------------------------------------------------------------------------- */

export const rotateSMTPServer = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/rotate`);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                            SMTP Analytics                                  */
/* -------------------------------------------------------------------------- */

export const getSMTPStatistics = async (smtpId) => {
  const { data } = await api.get(`/smtp/${smtpId}/stats`);
  return data;
};

export const getSMTPHealth = async (smtpId) => {
  const { data } = await api.get(`/smtp/${smtpId}/health`);
  return data;
};

export const getSMTPLogs = async (smtpId, params = {}) => {
  const { data } = await api.get(`/smtp/${smtpId}/logs`, {
    params,
  });

  return data;
};

/* -------------------------------------------------------------------------- */
/*                              SMTP Warmup                                   */
/* -------------------------------------------------------------------------- */

export const startSMTPWarmup = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/warmup/start`);
  return data;
};

export const pauseSMTPWarmup = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/warmup/pause`);
  return data;
};

export const resumeSMTPWarmup = async (smtpId) => {
  const { data } = await api.post(`/smtp/${smtpId}/warmup/resume`);
  return data;
};

export const getSMTPWarmupStatus = async (smtpId) => {
  const { data } = await api.get(`/smtp/${smtpId}/warmup`);
  return data;
};

export default {
  getSMTPServers,
  getSMTPServerById,
  createSMTPServer,
  updateSMTPServer,
  deleteSMTPServer,

  testSMTPConnection,
  verifySMTPServer,
  sendTestEmail,

  enableSMTPServer,
  disableSMTPServer,
  setDefaultSMTPServer,

  rotateSMTPServer,

  getSMTPStatistics,
  getSMTPHealth,
  getSMTPLogs,

  startSMTPWarmup,
  pauseSMTPWarmup,
  resumeSMTPWarmup,
  getSMTPWarmupStatus,
};
