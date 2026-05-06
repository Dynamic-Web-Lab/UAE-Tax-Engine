/**
 * Consent Manager - Handles user consent per UAE PDPL Article 7
 * Manages consent recording, withdrawal, and preferences
 */

import { database } from '@/lib/firebase/config';
import { ref, set, get, update, remove } from 'firebase/database';
import {
  ConsentType,
  ConsentRecord,
  UserConsent,
  DataDeletionRequest,
} from '@/types/compliance';

export class ConsentManager {
  /**
   * Record user consent for a specific type
   * Called during signup, settings update, or banner interaction
   */
  static async recordConsent(
    userId: string,
    consentType: ConsentType,
    given: boolean,
    source: 'signup' | 'settings' | 'banner' | 'api',
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const timestamp = new Date();
    const version = process.env.NEXT_PUBLIC_PRIVACY_POLICY_VERSION || '1.0.0';

    const consentRecord: ConsentRecord = {
      userId,
      type: consentType,
      given,
      timestamp,
      version,
      ipAddress,
      userAgent,
      source,
    };

    // Store in Firebase
    const consentRef = ref(
      database,
      `consent/${userId}/${consentType}`
    );

    await set(consentRef, {
      ...consentRecord,
      timestamp: timestamp.toISOString(),
    });

    // Also log in audit trail
    await this.logConsentAction(userId, consentType, given, source);
  }

  /**
   * Get user's complete consent profile
   */
  static async getUserConsent(userId: string): Promise<UserConsent | null> {
    const consentRef = ref(database, `consent/${userId}`);
    const snapshot = await get(consentRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    const essentials = data[ConsentType.ESSENTIAL];

    // All consents must have at least essential
    if (!essentials) {
      return null;
    }

    return {
      userId,
      essentials: {
        ...essentials,
        timestamp: new Date(essentials.timestamp),
      },
      analytics: data[ConsentType.ANALYTICS]
        ? {
            ...data[ConsentType.ANALYTICS],
            timestamp: new Date(data[ConsentType.ANALYTICS].timestamp),
          }
        : undefined,
      aiLearning: data[ConsentType.AI_LEARNING]
        ? {
            ...data[ConsentType.AI_LEARNING],
            timestamp: new Date(data[ConsentType.AI_LEARNING].timestamp),
          }
        : undefined,
      marketing: data[ConsentType.MARKETING]
        ? {
            ...data[ConsentType.MARKETING],
            timestamp: new Date(data[ConsentType.MARKETING].timestamp),
          }
        : undefined,
      thirdParty: data[ConsentType.THIRD_PARTY]
        ? {
            ...data[ConsentType.THIRD_PARTY],
            timestamp: new Date(data[ConsentType.THIRD_PARTY].timestamp),
          }
        : undefined,
      lastUpdated: new Date(essentials.timestamp),
    };
  }

  /**
   * Check if user has given consent for specific type
   */
  static async hasConsent(
    userId: string,
    consentType: ConsentType
  ): Promise<boolean> {
    // Essential is always required
    if (consentType === ConsentType.ESSENTIAL) {
      return true;
    }

    const consentRecord = await get(
      ref(database, `consent/${userId}/${consentType}`)
    );

    if (!consentRecord.exists()) {
      return false;
    }

    return consentRecord.val().given === true;
  }

  /**
   * Withdraw consent for a specific type
   * User can withdraw optional consents at any time
   */
  static async withdrawConsent(
    userId: string,
    consentType: ConsentType
  ): Promise<void> {
    if (consentType === ConsentType.ESSENTIAL) {
      throw new Error('Cannot withdraw consent for essential services');
    }

    await this.recordConsent(
      userId,
      consentType,
      false,
      'settings'
    );
  }

  /**
   * Get consent history (for audit purposes)
   */
  static async getConsentHistory(
    userId: string,
    consentType?: ConsentType
  ): Promise<ConsentRecord[]> {
    const historyRef = ref(
      database,
      consentType
        ? `consent-history/${userId}/${consentType}`
        : `consent-history/${userId}`
    );

    const snapshot = await get(historyRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();

    if (consentType) {
      // Single type - data is array
      return Array.isArray(data)
        ? data.map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp),
          }))
        : [];
    }

    // Multiple types - flatten them
    const allRecords: ConsentRecord[] = [];
    for (const type in data) {
      if (Array.isArray(data[type])) {
        allRecords.push(
          ...data[type].map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp),
          }))
        );
      }
    }

    return allRecords.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Log consent action to audit trail
   * Private method used internally
   */
  private static async logConsentAction(
    userId: string,
    consentType: ConsentType,
    given: boolean,
    source: string
  ): Promise<void> {
    const auditRef = ref(
      database,
      `consent-history/${userId}/${consentType}/${Date.now()}`
    );

    const action = given ? 'CONSENT_GIVEN' : 'CONSENT_WITHDRAWN';

    await set(auditRef, {
      userId,
      type: consentType,
      given,
      action,
      source,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Delete all consent records (when user deletes account)
   * This is soft-delete - records kept for 7 years in deleted-data archive
   */
  static async deleteUserConsent(userId: string): Promise<void> {
    const consentRef = ref(database, `consent/${userId}`);
    const historyRef = ref(database, `consent-history/${userId}`);

    // Archive before deletion
    const snapshot = await get(consentRef);
    if (snapshot.exists()) {
      const archiveRef = ref(
        database,
        `deleted-data/${userId}/consent/${Date.now()}`
      );
      await set(archiveRef, {
        ...snapshot.val(),
        deletedAt: new Date().toISOString(),
        deletionReason: 'user_requested_deletion',
      });
    }

    // Soft delete
    await update(ref(database, `users/${userId}`), {
      consentDeleted: true,
      consentDeletedAt: new Date().toISOString(),
    });

    // Hard delete after 30 days is handled by scheduled cleanup job
  }

  /**
   * Export user's consent history as JSON
   * For data subject access request (PDPL Article 14)
   */
  static async exportConsentData(userId: string): Promise<object> {
    const userConsent = await this.getUserConsent(userId);
    const history = await this.getConsentHistory(userId);

    return {
      currentConsent: userConsent,
      history: history,
      exportedAt: new Date().toISOString(),
    };
  }
}
