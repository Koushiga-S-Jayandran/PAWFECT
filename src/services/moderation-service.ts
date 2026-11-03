/**
 * Content Moderation Service
 * Inspects submitted dog names, dedications, and service reviews.
 * Open/Closed Principle: Moderation rules implement an inspection interface.
 */

import type { ContentModerationItem, ModerationStatus } from '../domain/types';
import type { ContentModerationRepository } from '../domain/interfaces';
import { sanitizeCleanDisplay } from '../security/sanitizer';

export interface ModerationRule {
  id: string;
  name: string;
  check(text: string): { isFlagged: boolean; reason?: string };
}

export class BlockedWordsRule implements ModerationRule {
  id = 'blocked_words';
  name = 'Profanity and Offensive Terms Filter';

  private readonly blockedList = [
    'hate', 'kill', 'abuse', 'poison', 'ugly', 'die', 'stupid', 'curse', 'scam', 'fraud'
  ];

  check(text: string): { isFlagged: boolean; reason?: string } {
    const lower = text.toLowerCase();
    for (const term of this.blockedList) {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(lower)) {
        return { isFlagged: true, reason: `Contains inappropriate term: "${term}"` };
      }
    }
    return { isFlagged: false };
  }
}

export class LengthAndSpamRule implements ModerationRule {
  id = 'length_and_spam';
  name = 'Length and Repetitive Character Check';

  check(text: string): { isFlagged: boolean; reason?: string } {
    if (text.length > 500) {
      return { isFlagged: true, reason: 'Text exceeds maximum character limit of 500' };
    }
    if (/(.)\1{5,}/.test(text)) {
      return { isFlagged: true, reason: 'Excessive character repetition detected' };
    }
    return { isFlagged: false };
  }
}

export class ModerationService {
  private rules: ModerationRule[] = [
    new BlockedWordsRule(),
    new LengthAndSpamRule(),
  ];

  constructor(private readonly moderationRepo: ContentModerationRepository) {}

  addRule(rule: ModerationRule): void {
    this.rules.push(rule);
  }

  evaluateContent(text: string): { autoApproved: boolean; reason?: string } {
    const cleaned = sanitizeCleanDisplay(text);
    for (const rule of this.rules) {
      const result = rule.check(cleaned);
      if (result.isFlagged) {
        return { autoApproved: false, reason: result.reason };
      }
    }
    return { autoApproved: true };
  }

  async submitForReview(
    type: 'dog_name' | 'dedication' | 'service_review',
    content: string,
    submittedBy: string,
    targetRefId: string
  ): Promise<{ status: ModerationStatus; item?: ContentModerationItem }> {
    const evaluation = this.evaluateContent(content);

    if (evaluation.autoApproved) {
      return { status: 'approved' };
    }

    const item = await this.moderationRepo.submit({
      type,
      content: sanitizeCleanDisplay(content),
      submittedBy,
      targetRefId,
      rejectionReason: evaluation.reason,
    });

    return { status: 'pending', item };
  }
}
