export type DnsVerificationStatus = 'VALID' | 'INVALID' | 'MISSING';

export interface DnsRecordDetails {
  status: DnsVerificationStatus;
  record?: string | null;
  selector?: string; // e.g., 's1' for DKIM
}

export interface DomainDnsRecords {
  spf: DnsRecordDetails;
  dkim: DnsRecordDetails;
  dmarc: DnsRecordDetails;
}

export interface WarmupConfig {
  enabled: boolean;
  dailyLimit: number;
  currentRampDay: number;
  totalSentToday: number;
}

export interface Domain {
  id: string;
  tenantId: string;
  domainName: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'FAILED';
  dnsRecords: DomainDnsRecords;
  warmupConfig: WarmupConfig;
  createdAt: string;
  updatedAt: string;
}

export type SuppressionReason = 'HARD_BOUNCE' | 'SPAM_COMPLAINT' | 'UNSUBSCRIBE';

export interface SuppressionEntry {
  id: string;
  tenantId: string;
  email: string;
  reason: SuppressionReason;
  campaignId?: string;
  createdAt: string;
}