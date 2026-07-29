// server/src/api/queue.api.js

import api from "./axios.js";

/**
 * Get all queue statistics
 */
export const getQueueStats = async () => {
  const { data } = await api.get("/queues/stats");
  return data;
};

/**
 * Get all queues
 */
export const getQueues = async () => {
  const { data } = await api.get("/queues");
  return data;
};

/**
 * Get queue details
 */
export const getQueueByName = async (queueName) => {
  const { data } = await api.get(`/queues/${queueName}`);
  return data;
};

/**
 * Pause queue
 */
export const pauseQueue = async (queueName) => {
  const { data } = await api.post(`/queues/${queueName}/pause`);

  return data;
};

/**
 * Resume queue
 */
export const resumeQueue = async (queueName) => {
  const { data } = await api.post(`/queues/${queueName}/resume`);

  return data;
};

/**
 * Clean completed jobs
 */
export const cleanQueue = async (queueName, grace = 1000) => {
  const { data } = await api.post(`/queues/${queueName}/clean`, {
    grace,
  });

  return data;
};

/**
 * Empty queue
 */
export const emptyQueue = async (queueName) => {
  const { data } = await api.delete(`/queues/${queueName}/jobs`);

  return data;
};

/**
 * Retry failed jobs
 */
export const retryFailedJobs = async (queueName) => {
  const { data } = await api.post(`/queues/${queueName}/retry`);

  return data;
};

/**
 * Get queue jobs
 */
export const getQueueJobs = async (queueName, params = {}) => {
  const { data } = await api.get(`/queues/${queueName}/jobs`, {
    params,
  });

  return data;
};

/**
 * Get job details
 */
export const getJob = async (queueName, jobId) => {
  const { data } = await api.get(`/queues/${queueName}/jobs/${jobId}`);

  return data;
};

/**
 * Remove job
 */
export const removeJob = async (queueName, jobId) => {
  const { data } = await api.delete(`/queues/${queueName}/jobs/${jobId}`);

  return data;
};

/**
 * Retry single job
 */
export const retryJob = async (queueName, jobId) => {
  const { data } = await api.post(`/queues/${queueName}/jobs/${jobId}/retry`);

  return data;
};

/**
 * Promote delayed job
 */
export const promoteJob = async (queueName, jobId) => {
  const { data } = await api.post(`/queues/${queueName}/jobs/${jobId}/promote`);

  return data;
};

/**
 * Get queue metrics
 */
export const getQueueMetrics = async (queueName) => {
  const { data } = await api.get(`/queues/${queueName}/metrics`);

  return data;
};

export default {
  getQueueStats,
  getQueues,
  getQueueByName,
  pauseQueue,
  resumeQueue,
  cleanQueue,
  emptyQueue,
  retryFailedJobs,
  getQueueJobs,
  getJob,
  removeJob,
  retryJob,
  promoteJob,
  getQueueMetrics,
};
