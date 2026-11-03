/**
 * Explicit Finite State Machine for Membership Lifecycle
 * States: ACTIVE, CANCELLED_PENDING_EXPIRY, EXPIRED, RENEWED
 */

import type { MembershipStatus } from '../domain/types';

export class IllegalMembershipStateTransitionError extends Error {
  constructor(public readonly fromState: MembershipStatus, public readonly toState: MembershipStatus) {
    super(`Illegal membership state transition from '${fromState}' to '${toState}'.`);
    this.name = 'IllegalMembershipStateTransitionError';
  }
}

const MEMBERSHIP_TRANSITIONS: Record<MembershipStatus, MembershipStatus[]> = {
  ACTIVE: ['CANCELLED_PENDING_EXPIRY', 'EXPIRED', 'RENEWED'],
  CANCELLED_PENDING_EXPIRY: ['EXPIRED', 'ACTIVE'], // User can reactivate before expiry
  EXPIRED: ['ACTIVE'], // User resubscribes
  RENEWED: ['ACTIVE', 'CANCELLED_PENDING_EXPIRY'],
};

export class MembershipStateMachine {
  static canTransition(from: MembershipStatus, to: MembershipStatus): boolean {
    const allowed = MEMBERSHIP_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  static transition(from: MembershipStatus, to: MembershipStatus): MembershipStatus {
    if (!this.canTransition(from, to)) {
      throw new IllegalMembershipStateTransitionError(from, to);
    }
    return to;
  }
}
