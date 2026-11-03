/**
 * Pawfect Dependency Injection Container / Composition Root
 * Adheres strictly to Dependency Inversion:
 * UI and features depend solely on domain interfaces wired in this single file.
 * Switching from mock data to a real production backend requires changing only this file.
 */

import {
  InMemoryShelterRepository,
  InMemoryGiftRepository,
  InMemoryOrderRepository,
  InMemoryFamilyMemberRepository,
  InMemoryMembershipRepository,
  InMemoryCommunityRepository,
  InMemoryAuditLogger,
  InMemoryContentModerationRepository,
  InMemoryUserRepository,
} from '../repositories/in-memory-repositories';
import {
  NoOpPayoutPolicy,
  type ShelterReader,
  type ShelterWriter,
  type GiftRepository,
  type OrderRepository,
  type OrderTracker,
  type FamilyMemberRepository,
  type MembershipRepository,
  type CommunityRepository,
  type AuditLogger,
  type ContentModerationRepository,
  type UserRepository,
  type PayoutPolicy,
} from '../domain/interfaces';
import { CheckoutService } from '../services/checkout-service';
import { MembershipService } from '../services/membership-service';
import { ModerationService } from '../services/moderation-service';
import { MockAdminAuthService, type AdminAuthContract } from '../security/auth-service';

export interface ServiceContainer {
  shelterReader: ShelterReader;
  shelterWriter: ShelterWriter;
  giftRepository: GiftRepository;
  orderRepository: OrderRepository;
  orderTracker: OrderTracker;
  familyMemberRepository: FamilyMemberRepository;
  membershipRepository: MembershipRepository;
  communityRepository: CommunityRepository;
  auditLogger: AuditLogger;
  contentModerationRepository: ContentModerationRepository;
  userRepository: UserRepository;
  payoutPolicy: PayoutPolicy;
  checkoutService: CheckoutService;
  membershipService: MembershipService;
  moderationService: ModerationService;
  adminAuthService: AdminAuthContract;
}

export function createServiceContainer(): ServiceContainer {
  // Repositories
  const shelterRepo = new InMemoryShelterRepository();
  const giftRepo = new InMemoryGiftRepository();
  const orderRepo = new InMemoryOrderRepository();
  const familyRepo = new InMemoryFamilyMemberRepository();
  const membershipRepo = new InMemoryMembershipRepository();
  const communityRepo = new InMemoryCommunityRepository();
  const auditLogger = new InMemoryAuditLogger();
  const moderationRepo = new InMemoryContentModerationRepository();
  const userRepo = new InMemoryUserRepository();

  // Payout policy (NoOp implementation per spec)
  const payoutPolicy = new NoOpPayoutPolicy();

  // Domain Services
  const checkoutService = new CheckoutService(orderRepo);
  const membershipService = new MembershipService(membershipRepo);
  const moderationService = new ModerationService(moderationRepo);

  // Admin Auth Service with audit hook
  const adminAuthService = new MockAdminAuthService(async (action, email, details) => {
    await auditLogger.log({
      adminEmail: email,
      adminRole: 'Super Admin',
      action,
      targetType: 'system',
      targetId: 'auth',
      details,
    });
  });

  return {
    shelterReader: shelterRepo,
    shelterWriter: shelterRepo,
    giftRepository: giftRepo,
    orderRepository: orderRepo,
    orderTracker: orderRepo,
    familyMemberRepository: familyRepo,
    membershipRepository: membershipRepo,
    communityRepository: communityRepo,
    auditLogger,
    contentModerationRepository: moderationRepo,
    userRepository: userRepo,
    payoutPolicy,
    checkoutService,
    membershipService,
    moderationService,
    adminAuthService,
  };
}

// Singleton instance for the React context tree
export const appContainer = createServiceContainer();
