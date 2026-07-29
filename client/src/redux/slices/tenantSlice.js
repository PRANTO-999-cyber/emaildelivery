import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTenant: {
    id: "org_acme",
    name: "Acme Growth Corp",
    slug: "acme-growth",
    plan: "Enterprise",
    role: "Admin",
    featureFlags: {
      enableDedicatedIp: true,
      enableAITestGeneration: true,
      enableCustomSmtp: true,
      enableWarmupAutomation: true,
    },
  },
  availableTenants: [
    {
      id: "org_acme",
      name: "Acme Growth Corp",
      slug: "acme-growth",
      plan: "Enterprise",
      role: "Admin",
    },
    {
      id: "org_stark",
      name: "Stark Email Labs",
      slug: "stark-labs",
      plan: "Pro",
      role: "Campaign Manager",
    },
  ],
  isSwitchingTenant: false,
};

/**
 * Tenant / Workspace Context Slice
 * Controls the active organization context, workspace feature flags, and multi-tenant switching state.
 */
const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    /**
     * Sets the currently active tenant workspace context.
     */
    setActiveTenant: (state, action) => {
      state.activeTenant = action.payload;
      state.isSwitchingTenant = false;
    },

    /**
     * Updates the full list of accessible workspaces for the logged-in user.
     */
    setAvailableTenants: (state, action) => {
      state.availableTenants = action.payload;
    },

    /**
     * Toggles switching state indicator during cross-workspace context migration.
     */
    setSwitchingTenant: (state, action) => {
      state.isSwitchingTenant = action.payload;
    },

    /**
     * Dynamically updates feature flag toggles for the current active workspace.
     */
    updateTenantFeatureFlags: (state, action) => {
      if (state.activeTenant) {
        state.activeTenant.featureFlags = {
          ...state.activeTenant.featureFlags,
          ...action.payload,
        };
      }
    },

    /**
     * Resets tenant context back to initial state upon session teardown / logout.
     */
    resetTenantState: (state) => {
      state.activeTenant = null;
      state.availableTenants = [];
      state.isSwitchingTenant = false;
    },
  },
});

// Export synchronous actions
export const {
  setActiveTenant,
  setAvailableTenants,
  setSwitchingTenant,
  updateTenantFeatureFlags,
  resetTenantState,
} = tenantSlice.actions;

// Selectors for easy component subscription
export const selectActiveTenant = (state) => state.tenant.activeTenant;
export const selectActiveTenantId = (state) => state.tenant.activeTenant?.id;
export const selectAvailableTenants = (state) => state.tenant.availableTenants;
export const selectIsSwitchingTenant = (state) =>
  state.tenant.isSwitchingTenant;
export const selectTenantFeatureFlags = (state) =>
  state.tenant.activeTenant?.featureFlags || {};

// Default export reducer for Redux Store registration
export default tenantSlice.reducer;
