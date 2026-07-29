// server/src/api/contact.api.js

import api from "./axios.js";

/**
 * Get all contacts
 */
export const getContacts = async (params = {}) => {
  const { data } = await api.get("/contacts", {
    params,
  });

  return data;
};

/**
 * Get contact by ID
 */
export const getContactById = async (contactId) => {
  const { data } = await api.get(`/contacts/${contactId}`);

  return data;
};

/**
 * Create contact
 */
export const createContact = async (payload) => {
  const { data } = await api.post("/contacts", payload);

  return data;
};

/**
 * Update contact
 */
export const updateContact = async (contactId, payload) => {
  const { data } = await api.put(`/contacts/${contactId}`, payload);

  return data;
};

/**
 * Delete contact
 */
export const deleteContact = async (contactId) => {
  const { data } = await api.delete(`/contacts/${contactId}`);

  return data;
};

/**
 * Bulk delete contacts
 */
export const bulkDeleteContacts = async (contactIds) => {
  const { data } = await api.post("/contacts/bulk-delete", {
    contactIds,
  });

  return data;
};

/**
 * Import contacts (CSV)
 */
export const importContacts = async (file, listId) => {
  const formData = new FormData();

  formData.append("file", file);

  if (listId) {
    formData.append("listId", listId);
  }

  const { data } = await api.post("/contacts/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/**
 * Export contacts
 */
export const exportContacts = async (params = {}) => {
  const response = await api.get("/contacts/export", {
    params,
    responseType: "blob",
  });

  return response.data;
};

/**
 * Search contacts
 */
export const searchContacts = async (query) => {
  const { data } = await api.get("/contacts/search", {
    params: {
      q: query,
    },
  });

  return data;
};

/**
 * Verify contact email
 */
export const verifyContact = async (contactId) => {
  const { data } = await api.patch(`/contacts/${contactId}/verify`);

  return data;
};

/**
 * Unsubscribe contact
 */
export const unsubscribeContact = async (contactId) => {
  const { data } = await api.patch(`/contacts/${contactId}/unsubscribe`);

  return data;
};

/**
 * Resubscribe contact
 */
export const resubscribeContact = async (contactId) => {
  const { data } = await api.patch(`/contacts/${contactId}/resubscribe`);

  return data;
};

/**
 * Get contact activity
 */
export const getContactActivity = async (contactId) => {
  const { data } = await api.get(`/contacts/${contactId}/activity`);

  return data;
};

/**
 * Get contact campaigns
 */
export const getContactCampaigns = async (contactId) => {
  const { data } = await api.get(`/contacts/${contactId}/campaigns`);

  return data;
};

/**
 * Add tags
 */
export const addTagsToContact = async (contactId, tags) => {
  const { data } = await api.patch(`/contacts/${contactId}/tags`, {
    tags,
  });

  return data;
};

/**
 * Remove tags
 */
export const removeTagsFromContact = async (contactId, tags) => {
  const { data } = await api.patch(`/contacts/${contactId}/remove-tags`, {
    tags,
  });

  return data;
};

/**
 * Bulk update contacts
 */
export const bulkUpdateContacts = async (contactIds, payload) => {
  const { data } = await api.patch("/contacts/bulk-update", {
    contactIds,
    ...payload,
  });

  return data;
};

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  importContacts,
  exportContacts,
  searchContacts,
  verifyContact,
  unsubscribeContact,
  resubscribeContact,
  getContactActivity,
  getContactCampaigns,
  addTagsToContact,
  removeTagsFromContact,
  bulkUpdateContacts,
};
