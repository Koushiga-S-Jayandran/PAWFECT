/**
 * Explicit Finite State Machine for Order Status Lifecycle
 * Flow: PAID -> SHELTER_CONFIRMED -> FOOD_BOUGHT -> PROOF_UPLOADED -> CERTIFICATE_READY
 */

import type { OrderStatus } from '../domain/types';

export class IllegalOrderStateTransitionError extends Error {
  constructor(public readonly fromState: OrderStatus, public readonly toState: OrderStatus) {
    super(`Illegal order state transition from '${fromState}' to '${toState}'.`);
    this.name = 'IllegalOrderStateTransitionError';
  }
}

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PAID: ['SHELTER_CONFIRMED'],
  SHELTER_CONFIRMED: ['FOOD_BOUGHT'],
  FOOD_BOUGHT: ['PROOF_UPLOADED'],
  PROOF_UPLOADED: ['CERTIFICATE_READY'],
  CERTIFICATE_READY: [], // Terminal state
};

export class OrderStateMachine {
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowed = ORDER_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  static transition(from: OrderStatus, to: OrderStatus): OrderStatus {
    if (!this.canTransition(from, to)) {
      throw new IllegalOrderStateTransitionError(from, to);
    }
    return to;
  }

  static getNextState(current: OrderStatus): OrderStatus | null {
    const allowed = ORDER_TRANSITIONS[current];
    return allowed && allowed.length > 0 ? allowed[0] : null;
  }
}
