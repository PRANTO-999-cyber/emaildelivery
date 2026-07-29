export type TenantPlan = 'Starter' | 'Pro' | 'Enterprise';

export interface TenantFeatureFlags {
  enableDedicatedIp: boolean;
  enableAITestGeneration: boolean;
  enableCustomSmtp: boolean;
  enableWarmupAutomation: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  featureFlags: TenantFeatureFlags;
  createdAt: string;
  updatedAt: string;
}