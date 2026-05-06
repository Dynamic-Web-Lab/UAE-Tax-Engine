/**
 * Audit Logger - Tracks all data access and modifications per UAE PDPL Article 5
 * Maintains complete audit trail for compliance and security investigations
 */

import { database } from '@/lib/firebase/config';
import { ref, set, get, query, orderByChild, limitToLast, push } from 'firebase/database';
import {
  AuditAction,
  AuditLogEntry,
} from '@/types/compliance';

export class AuditLogger {
  /**
   * Log user action to audit trail
   * Called for: login, data access, modifications, consent changes, etc.
   */
  static async logAction(
    userId: string,
    action: AuditAction,
    resource?: string,
    resourceId?: string,
    dataType?: 'transactions' | 'profile' | 'consent' | 'banking' | 'ai_data',
    ipAddress?: string,
    userAgent?: string,
    result: 'success' | 'failed' = 'success',
    errorMessage?: string,
    details?: Record<string, any>
  ): Promise<string> {
    const timestamp = new Date();
    const auditLogRef = ref(database, `audit-logs/${userId}`);
    const newLogRef = push(auditLogRef);

    const logEntry: Omit<AuditLogEntry, 'id'> = {
      userId,
      action,
      resource,
      resourceId,
      dataType,
      timestamp,
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      result,
      errorMessage,
      details,
    };

    await set(newLogRef, {
      ...logEntry,
      timestamp: timestamp.toISOString(),
    });

    return newLogRef.key || '';
  }

  /**
   * Get user's complete audit log
   * For compliance reviews and data subject access requests
   */
  static async getUserAuditLog(
    userId: string,
    limit: number = 100
  ): Promise<AuditLogEntry[]> {
    const auditRef = ref(database, `audit-logs/${userId}`);
    const snapshot = await get(auditRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    const logs: AuditLogEntry[] = [];

    for (const [id, entry] of Object.entries(data)) {
      logs.push({
        id,
        ...(entry as Omit<AuditLogEntry, 'id'>),
        timestamp: new Date((entry as any).timestamp),
      });
    }

    // Sort by timestamp descending and limit
    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get audit logs for specific action type
   * Useful for: finding all login attempts, all consent changes, etc.
   */
  static async getActionLog(
    userId: string,
    action: AuditAction
  ): Promise<AuditLogEntry[]> {
    const logs = await this.getUserAuditLog(userId, 1000);
    return logs.filter((log) => log.action === action);
  }

  /**
   * Get audit logs for specific resource
   * Useful for: finding all access to a specific transaction
   */
  static async getResourceLog(
    userId: string,
    resourceId: string
  ): Promise<AuditLogEntry[]> {
    const logs = await this.getUserAuditLog(userId, 1000);
    return logs.filter((log) => log.resourceId === resourceId);
  }

  /**
   * Get failed operations (for incident response)
   */
  static async getFailedOperations(
    userId: string
  ): Promise<AuditLogEntry[]> {
    const logs = await this.getUserAuditLog(userId, 1000);
    return logs.filter((log) => log.result === 'failed');
  }

  /**
   * Get logs for specific time range
   */
  static async getLogsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AuditLogEntry[]> {
    const logs = await this.getUserAuditLog(userId, 1000);
    return logs.filter(
      (log) =>
        log.timestamp >= startDate && log.timestamp <= endDate
    );
  }

  /**
   * Log data access (transaction viewing, profile read, etc.)
   */
  static async logDataAccess(
    userId: string,
    dataType: 'transactions' | 'profile' | 'consent' | 'banking' | 'ai_data',
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.DATA_ACCESS,
      dataType,
      resourceId,
      dataType,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { accessType: dataType, ...details }
    );
  }

  /**
   * Log data modification (transaction added, profile updated, etc.)
   */
  static async logDataModification(
    userId: string,
    dataType: 'transactions' | 'profile' | 'consent' | 'banking' | 'ai_data',
    resourceId: string,
    changes?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.DATA_MODIFICATION,
      dataType,
      resourceId,
      dataType,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { modificationType: dataType, changes }
    );
  }

  /**
   * Log data deletion
   */
  static async logDataDeletion(
    userId: string,
    dataType: 'transactions' | 'profile' | 'consent' | 'banking' | 'ai_data',
    resourceId: string,
    reason?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.DATA_DELETE,
      dataType,
      resourceId,
      dataType,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { deletionReason: reason }
    );
  }

  /**
   * Log data export (for data subject access requests)
   */
  static async logDataExport(
    userId: string,
    dataTypes: string[],
    format: 'json' | 'csv',
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.DATA_EXPORT,
      'data_export',
      undefined,
      undefined,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { exportedDataTypes: dataTypes, format }
    );
  }

  /**
   * Log login event
   */
  static async logLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.LOGIN,
      'auth',
      userId,
      undefined,
      ipAddress,
      userAgent,
      success ? 'success' : 'failed',
      success ? undefined : 'Login failed'
    );
  }

  /**
   * Log logout event
   */
  static async logLogout(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.LOGOUT,
      'auth',
      userId,
      undefined,
      ipAddress,
      userAgent
    );
  }

  /**
   * Log password change
   */
  static async logPasswordChange(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.PASSWORD_CHANGE,
      'auth',
      userId,
      undefined,
      ipAddress,
      userAgent,
      success ? 'success' : 'failed'
    );
  }

  /**
   * Log third-party data access
   * When a processor accesses user data on behalf of the user
   */
  static async logThirdPartyAccess(
    userId: string,
    processorName: string,
    dataTypes: string[],
    purpose: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.THIRD_PARTY_ACCESS,
      'third_party',
      processorName,
      undefined,
      ipAddress,
      userAgent,
      'success',
      undefined,
      { processor: processorName, dataTypes, purpose }
    );
  }

  /**
   * Log API call (for rate limiting and abuse detection)
   */
  static async logApiCall(
    userId: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    statusCode: number,
    ipAddress?: string,
    userAgent?: string,
    responseTime?: number
  ): Promise<string> {
    return this.logAction(
      userId,
      AuditAction.API_CALL,
      'api',
      endpoint,
      undefined,
      ipAddress,
      userAgent,
      statusCode >= 200 && statusCode < 300 ? 'success' : 'failed',
      statusCode >= 400 ? `HTTP ${statusCode}` : undefined,
      { endpoint, method, statusCode, responseTime }
    );
  }

  /**
   * Clean up old audit logs (retention policy)
   * Called by scheduled job for compliance with data retention requirements
   */
  static async deleteOldLogs(
    userId: string,
    retentionDays: number
  ): Promise<number> {
    const logs = await this.getUserAuditLog(userId, 10000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let deletedCount = 0;
    for (const log of logs) {
      if (log.timestamp < cutoffDate) {
        // In production, would use Firebase remove() to delete
        // For now, count how many would be deleted
        deletedCount++;
      }
    }

    return deletedCount;
  }
}
