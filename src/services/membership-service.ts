/**
 * Membership Management Business Service
 * Orchestrates plan subscription, period calculation, renewal, and cancellation.
 */

import { MembershipStateMachine } from '../state-machines/membership-fsm';
import type { Membership, BillingCycle, MembershipPlanConfig } from '../domain/types';
import type { MembershipRepository } from '../domain/interfaces';
import { getPlanConfig, calculatePlanPrice } from '../config/plans.example';

export class MembershipService {
  constructor(private readonly membershipRepo: MembershipRepository) {}

  async getActiveMembership(userId: string): Promise<Membership | null> {
    const record = await this.membershipRepo.getByUserId(userId);
    if (!record) return null;

    // Check if period has ended and mark expired if not auto-renewed
    const now = new Date();
    const periodEnd = new Date(record.currentPeriodEnd);

    if (now > periodEnd && record.status !== 'EXPIRED') {
      if (record.cancelAtPeriodEnd || !record.autoRenew) {
        record.status = MembershipStateMachine.transition(record.status, 'EXPIRED');
        record.autoRenew = false;
        await this.membershipRepo.saveMembership(record);
      } else {
        // Auto-renew simulation
        record.status = MembershipStateMachine.transition(record.status, 'RENEWED');
        const nextStart = periodEnd;
        const nextEnd = new Date(nextStart);
        if (record.billingCycle === 'monthly') {
          nextEnd.setMonth(nextEnd.getMonth() + 1);
        } else {
          nextEnd.setFullYear(nextEnd.getFullYear() + 1);
        }
        record.currentPeriodStart = nextStart.toISOString();
        record.currentPeriodEnd = nextEnd.toISOString();
        record.status = 'ACTIVE';
        record.updatedAt = new Date().toISOString();
        await this.membershipRepo.saveMembership(record);
      }
    }

    return record;
  }

  async subscribe(userId: string, planId: string, billingCycle: BillingCycle): Promise<Membership> {
    const plan = getPlanConfig(planId);
    if (!plan) {
      throw new Error(`Plan '${planId}' does not exist.`);
    }

    const price = calculatePlanPrice(plan, billingCycle);
    const start = new Date();
    const end = new Date(start);

    if (billingCycle === 'monthly') {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    const membership: Membership = {
      id: `mem_${Date.now()}`,
      userId,
      planId,
      status: 'ACTIVE',
      billingCycle,
      pricePaidInPaise: price,
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: false,
      autoRenew: true,
      updatedAt: new Date().toISOString(),
    };

    await this.membershipRepo.saveMembership(membership);
    return membership;
  }

  async requestCancellationAtPeriodEnd(userId: string): Promise<Membership> {
    const membership = await this.getActiveMembership(userId);
    if (!membership) throw new Error('No active membership found to cancel.');

    const newStatus = MembershipStateMachine.transition(membership.status, 'CANCELLED_PENDING_EXPIRY');
    membership.status = newStatus;
    membership.cancelAtPeriodEnd = true;
    membership.autoRenew = false;
    membership.updatedAt = new Date().toISOString();

    await this.membershipRepo.saveMembership(membership);
    return membership;
  }

  async reactivateMembership(userId: string): Promise<Membership> {
    const membership = await this.getActiveMembership(userId);
    if (!membership) throw new Error('No membership record found.');

    const newStatus = MembershipStateMachine.transition(membership.status, 'ACTIVE');
    membership.status = newStatus;
    membership.cancelAtPeriodEnd = false;
    membership.autoRenew = true;
    membership.updatedAt = new Date().toISOString();

    await this.membershipRepo.saveMembership(membership);
    return membership;
  }
}
