// server/src/api/template.api.js

import api from "./axios.js";

/* -------------------------------------------------------------------------- */
/*                              Template CRUD                                 */
/* -------------------------------------------------------------------------- */

export const getTemplates = async (params = {}) => {
  const { data } = await api.get("/templates", {
    params,
  });

  return data;
};

export const getTemplateById = async (templateId) => {
  const { data } = await api.get(`/templates/${templateId}`);

  return data;
};

export const createTemplate = async (payload) => {
  const { data } = await api.post("/templates", payload);

  return data;
};

export const updateTemplate = async (templateId, payload) => {
  const { data } = await api.put(`/templates/${templateId}`, payload);

  return data;
};

export const deleteTemplate = async (templateId) => {
  const { data } = await api.delete(`/templates/${templateId}`);

  return data;
};

/* -------------------------------------------------------------------------- */
/*                             Template Actions                               */
/* -------------------------------------------------------------------------- */

export const duplicateTemplate = async (templateId) => {
  const { data } = await api.post(`/templates/${templateId}/duplicate`);

  return data;
};

export const previewTemplate = async (templateId, variables = {}) => {
  const { data } = await api.post(`/templates/${templateId}/preview`, {
    variables,
  });

  return data;
};

export const renderTemplate = async (templateId, variables = {}) => {
  const { data } = await api.post(`/templates/${templateId}/render`, {
    variables,
  });

  return data;
};

export const sendTemplateTest = async (templateId, payload) => {
  const { data } = await api.post(
    `/templates/${templateId}/send-test`,
    payload,
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/*                              Template Versions                             */
/* -------------------------------------------------------------------------- */

export const getTemplateVersions = async (templateId) => {
  const { data } = await api.get(`/templates/${templateId}/versions`);

  return data;
};

export const restoreTemplateVersion = async (templateId, versionId) => {
  const { data } = await api.post(
    `/templates/${templateId}/versions/${versionId}/restore`,
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/*                             Template Categories                            */
/* -------------------------------------------------------------------------- */

export const getTemplateCategories = async () => {
  const { data } = await api.get("/templates/categories");

  return data;
};

/* -------------------------------------------------------------------------- */
/*                                Search                                      */
/* -------------------------------------------------------------------------- */

export const searchTemplates = async (query) => {
  const { data } = await api.get("/templates/search", {
    params: {
      q: query,
    },
  });

  return data;
};

export default {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,

  duplicateTemplate,
  previewTemplate,
  renderTemplate,
  sendTemplateTest,

  getTemplateVersions,
  restoreTemplateVersion,

  getTemplateCategories,
  searchTemplates,
};
