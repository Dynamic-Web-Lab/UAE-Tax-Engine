/**
 * Compliance & Data Law Types
 * UAE Personal Data Protection Law (Federal Law No. 45 of 2021)
 */

/**
 * Consent types aligned with UAE PDPL Article 7
 */
export enum ConsentType {
  ESSENTIAL = 'essential',           // Required for service (no consent needed)
  ANALYTICS = 'analytics',           // Usage analytics (optional)
  AI_LEARNING = 'ai_learning',       // AI model improvement (optional)
  MARKETING = 'marketing',           // Marketing communications (optional)
  THIRD_PARTY = 'third_party',       // Third-party data sharing (optional)
}

/**
 * Consent record - tracks what the user has agreed to
 */
export interface ConsentRecord {
  userId: string;
  type: ConsentType;
  given: boolean;                    // true = user accepted, false = user rejected
  timestamp: Date;
  version: string;                   // Policy version at time of consent
  ipAddress?: string;                // IP for audit trail
  userAgent?: string;                // Browser for audit trail
  source: 'signup' | 'settings' | 'banner' | 'api';
}

/**
 * User's complete consent profile
 */
export interface UserConsent {
  userId: string;
  essentials: ConsentRecord;         // Always recorded (audit trail)
  analytics?: ConsentRecord;
  aiLearning?: ConsentRecord;
  marketing?: ConsentRecord;
  thirdParty?: ConsentRecord;
  lastUpdated: Date;
  preferencesCookie?: string;        // Hash of preferences for quick lookup
}

/**
 * Audit log entry - tracks all data access and changes
 */
export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  DATA_DELETE = 'data_delete',
  DATA_EXPORT = 'data_export',
  CONSENT_GIVEN = 'consent_given',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  PASSWORD_CHANGE = 'password_change',
  ACCOUNT_DELETE_REQUESTED = 'account_delete_requested',
  ACCOUNT_DELETED = 'account_deleted',
  API_CALL = 'api_call',
  THIRD_PARTY_ACCESS = 'third_party_access',
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: AuditAction;
  resource?: string;                 // What was accessed (transactions, profile, etc)
  resourceId?: string;               // Specific record ID
  dataType?: 'transactions' | 'profile' | 'consent' | 'banking' | 'ai_data';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failed';
  errorMessage?: string;
  details?: Record<string, any>;     // Additional context
}

/**
 * Data retention policy per data type
 */
export interface DataRetentionPolicy {
  dataType: 'profile' | 'transactions' | 'login_logs' | 'audit_logs' | 'consent' | 'deleted_account';
  retentionDays: number;
  reason: string;
  softDeleteDays?: number;           // Days before hard delete (for recovery window)
}

/**
 * Data deletion request - for right to be forgotten
 */
export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestType: 'full' | 'partial';   // full = delete everything, partial = delete specific data types
  dataTypes?: string[];              // If partial, which data types to delete
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: Date;
  completedAt?: Date;
  processedBy?: string;              // Admin user who processed it
}

/**
 * Data access request - for right to access
 */
export interface DataAccessRequest {
  id: string;
  userId: string;
  format: 'json' | 'csv';            // Portable format
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;              // Time-limited download link
  expiresAt?: Date;                  // When download link expires
}

/**
 * Third-party processor information
 */
export interface DataProcessor {
  name: string;
  type: 'payment' | 'ai' | 'banking' | 'hosting' | 'analytics' | 'other';
  purpose: string;
  dataTypes: string[];               // What data they process
  location: string;                  // Where data is stored
  dpaStatus: 'signed' | 'pending' | 'not_applicable';
  dpaUrl?: string;
  privacyPolicyUrl: string;
  contactEmail: string;
}

/**
 * Data breach notification record
 */
export interface BreachNotification {
  id: string;
  detectedAt: Date;
  notifiedAt: Date;
  affectedUsers: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dataTypesAffected: string[];
  actions: string[];                 // Steps taken to remediate
  notifiedAuthority: boolean;        // UAE DPA notification sent
  notifiedUsers: boolean;
}

/**
 * Privacy impact assessment (DPIA)
 */
export interface PrivacyImpactAssessment {
  id: string;
  processName: string;
  date: Date;
  risks: {
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  approved: boolean;
  approvedBy?: string;
  expiresAt: Date;
}
