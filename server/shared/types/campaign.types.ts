export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'queued'
  | 'dispatching'
  | 'paused'
  | 'paused_circuit_breaker'
  | 'completed'
  | 'failed';

export type DispatchStrategy = 'immediate' | 'scheduled' | 'throttled';

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complaints: number;
  deliveredRate: number; // percentage e.g. 98.5
  openRate: number;
  bounceRate: number;
}

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  domainId: string;
  templateId?: string;
  contactListId: string;
  status: CampaignStatus;
  dispatchStrategy: DispatchStrategy;
  hourlyThrottleLimit?: number;
  scheduledAt?: string;
  recipientCount: number;
  metrics: CampaignMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDTO {
  name: string;
  subject: string;
  domainId: string;
  templateId?: string;
  contactListId: string;
  dispatchStrategy: DispatchStrategy;
  hourlyThrottleLimit?: number;
  scheduledAt?: string;
}