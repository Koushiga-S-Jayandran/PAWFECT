/**
 * Explicit Finite State Machine for Shelter Approval Lifecycle
 * States: pending, active, suspended, removed (soft-delete)
 */

import type { ShelterStatus } from '../domain/types';

export class IllegalShelterStateTransitionError extends Error {
  constructor(public readonly fromState: ShelterStatus, public readonly toState: ShelterStatus) {
    super(`Illegal shelter state transition from '${fromState}' to '${toState}'.`);
    this.name = 'IllegalShelterStateTransitionError';
  }
}

const SHELTER_TRANSITIONS: Record<ShelterStatus, ShelterStatus[]> = {
  pending: ['active', 'removed'],
  active: ['suspended', 'removed'],
  suspended: ['active', 'removed'],
  removed: [], // Terminal soft-deleted state
};

export class ShelterApprovalStateMachine {
  static canTransition(from: ShelterStatus, to: ShelterStatus): boolean {
    const allowed = SHELTER_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  static transition(from: ShelterStatus, to: ShelterStatus): ShelterStatus {
    if (!this.canTransition(from, to)) {
      throw new IllegalShelterStateTransitionError(from, to);
    }
    return to;
  }
}
