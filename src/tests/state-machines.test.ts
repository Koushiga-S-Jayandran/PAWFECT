import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OrderStateMachine,
  IllegalOrderStateTransitionError,
} from '../state-machines/order-fsm';
import {
  MembershipStateMachine,
  IllegalMembershipStateTransitionError,
} from '../state-machines/membership-fsm';
import {
  ShelterApprovalStateMachine,
  IllegalShelterStateTransitionError,
} from '../state-machines/shelter-approval-fsm';

test('OrderStateMachine allows sequential order lifecycle transitions', () => {
  assert.equal(OrderStateMachine.transition('PAID', 'SHELTER_CONFIRMED'), 'SHELTER_CONFIRMED');
  assert.equal(OrderStateMachine.transition('SHELTER_CONFIRMED', 'FOOD_BOUGHT'), 'FOOD_BOUGHT');
  assert.equal(OrderStateMachine.transition('FOOD_BOUGHT', 'PROOF_UPLOADED'), 'PROOF_UPLOADED');
  assert.equal(OrderStateMachine.transition('PROOF_UPLOADED', 'CERTIFICATE_READY'), 'CERTIFICATE_READY');
});

test('OrderStateMachine throws IllegalOrderStateTransitionError on skipping states', () => {
  assert.throws(
    () => OrderStateMachine.transition('PAID', 'CERTIFICATE_READY'),
    IllegalOrderStateTransitionError
  );
  assert.throws(
    () => OrderStateMachine.transition('FOOD_BOUGHT', 'PAID'),
    IllegalOrderStateTransitionError
  );
});

test('MembershipStateMachine handles active, cancellation, and reactivation', () => {
  assert.equal(
    MembershipStateMachine.transition('ACTIVE', 'CANCELLED_PENDING_EXPIRY'),
    'CANCELLED_PENDING_EXPIRY'
  );
  assert.equal(
    MembershipStateMachine.transition('CANCELLED_PENDING_EXPIRY', 'ACTIVE'),
    'ACTIVE'
  );
  assert.equal(
    MembershipStateMachine.transition('CANCELLED_PENDING_EXPIRY', 'EXPIRED'),
    'EXPIRED'
  );
  assert.equal(
    MembershipStateMachine.transition('EXPIRED', 'ACTIVE'),
    'ACTIVE'
  );
});

test('MembershipStateMachine throws IllegalMembershipStateTransitionError on invalid transition', () => {
  assert.throws(
    () => MembershipStateMachine.transition('EXPIRED', 'CANCELLED_PENDING_EXPIRY'),
    IllegalMembershipStateTransitionError
  );
});

test('ShelterApprovalStateMachine enforces verification and soft deletion', () => {
  assert.equal(ShelterApprovalStateMachine.transition('pending', 'active'), 'active');
  assert.equal(ShelterApprovalStateMachine.transition('active', 'suspended'), 'suspended');
  assert.equal(ShelterApprovalStateMachine.transition('suspended', 'active'), 'active');
  assert.equal(ShelterApprovalStateMachine.transition('active', 'removed'), 'removed');

  // Terminal state: removed shelter cannot transition back
  assert.throws(
    () => ShelterApprovalStateMachine.transition('removed', 'active'),
    IllegalShelterStateTransitionError
  );
});
