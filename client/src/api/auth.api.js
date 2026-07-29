/**
 * Authentication & Workspace API client endpoints.
 * Handles primary auth flows, token lifecycle, and tenant workspace selection.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api/v1";

/**
 * Standardized HTTP request handler with automatic JSON headers & token propagation.
 */
async function request(
  endpoint,
  { body, headers: customHeaders, ...customConfig } = {},
) {
  const token = localStorage.getItem("auth_token");
  const tenantId = localStorage.getItem("active_tenant_id");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(tenantId && { "x-tenant-id": tenantId }),
    ...customHeaders,
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Handle unauthorized session / token expiration
    localStorage.removeItem("auth_token");
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "An error occurred during authentication request",
    );
  }

  return data;
}

export const authApi = {
  /**
   * Authenticate user with credentials.
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    return request("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  /**
   * Register a new user account and initial workspace context.
   * @param {Object} userData - { fullName, email, password, organizationName }
   */
  register: async (userData) => {
    return request("/auth/register", {
      method: "POST",
      body: userData,
    });
  },

  /**
   * Refresh current access token using refresh token strategy.
   * @param {string} refreshToken
   */
  refreshToken: async (refreshToken) => {
    return request("/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
    });
  },

  /**
   * Fetch current authenticated user profile and active workspace context.
   */
  getCurrentUser: async () => {
    return request("/auth/me");
  },

  /**
   * Switch active tenant workspace context and obtain tenant-scoped context headers.
   * @param {string} tenantId
   */
  switchWorkspace: async (tenantId) => {
    return request("/auth/switch-workspace", {
      method: "POST",
      body: { tenantId },
    });
  },

  /**
   * Terminate current active session and revoke refresh tokens.
   */
  logout: async () => {
    return request("/auth/logout", {
      method: "POST",
    });
  },
};

export default authApi;
