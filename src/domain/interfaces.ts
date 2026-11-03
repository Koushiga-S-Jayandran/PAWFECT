/**
 * Segregated Interfaces for Pawfect Domain Services & Repositories
 * Adheres strictly to Interface Segregation and Dependency Inversion.
 */

import type {
  Shelter,
  ShelterProof,
  ShelterStatus,
  Gift,
  Order,
  OrderStatus,
  OrderTimelineEvent,
  FamilyMember,
  SpecialDate,
  Membership,
  Batch,
  SponsoredDog,
  ServiceReview,
  AdminAuditLog,
  LeaderboardEntry,
  ContentModerationItem,
  User,
} from './types';

export interface ShelterReader {
  getAll(): Promise<Shelter[]>;
  getById(id: string): Promise<Shelter | null>;
  getByCity(city: string): Promise<Shelter[]>;
  search(query: string): Promise<Shelter[]>;
}

export interface ShelterWriter {
  register(shelter: Omit<Shelter, 'id' | 'createdAt' | 'mealsFundedTotal' | 'proofHistory' | 'status'>): Promise<Shelter>;
  updateStatus(id: string, status: ShelterStatus, reason?: string): Promise<void>;
  addProof(shelterId: string, proof: Omit<ShelterProof, 'id' | 'timestamp'>): Promise<ShelterProof>;
  updateShelterDetails(id: string, updates: Partial<Shelter>): Promise<Shelter>;
}

export interface GiftRepository {
  getAll(): Promise<Gift[]>;
  getById(id: string): Promise<Gift | null>;
  getByShelterId(shelterId: string): Promise<Gift[]>;
}

export interface OrderTracker {
  getOrder(orderId: string): Promise<Order | null>;
  getOrderByCertificateId(certId: string): Promise<Order | null>;
  listUserOrders(userId: string): Promise<Order[]>;
}

export interface OrderRepository extends OrderTracker {
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'certificateId' | 'status'>): Promise<Order>;
  advanceOrderStatus(orderId: string, nextStatus: OrderStatus, note?: string): Promise<Order>;
  attachProof(orderId: string, proofPhotoUrl: string, note: string): Promise<Order>;
}

export interface FamilyMemberRepository {
  getByUserId(userId: string): Promise<FamilyMember[]>;
  addMember(userId: string, member: Omit<FamilyMember, 'id' | 'userId'>): Promise<FamilyMember>;
  updateMember(userId: string, memberId: string, member: Partial<Omit<FamilyMember, 'id' | 'userId'>>): Promise<FamilyMember>;
  deleteMember(userId: string, memberId: string): Promise<void>;
  addSpecialDate(userId: string, memberId: string, date: Omit<SpecialDate, 'id'>): Promise<SpecialDate>;
  updateSpecialDate(userId: string, memberId: string, dateId: string, updates: Partial<SpecialDate>): Promise<SpecialDate>;
  deleteSpecialDate(userId: string, memberId: string, dateId: string): Promise<void>;
  toggleMute(userId: string, memberId: string, dateId: string): Promise<boolean>;
  deleteUserData(userId: string): Promise<void>;
}

export interface MembershipRepository {
  getByUserId(userId: string): Promise<Membership | null>;
  saveMembership(membership: Membership): Promise<void>;
}

export interface CommunityRepository {
  getBatches(): Promise<Batch[]>;
  getBatchById(id: string): Promise<Batch | null>;
  contributeToBatch(batchId: string, paise: number): Promise<Batch>;
  getDogs(): Promise<SponsoredDog[]>;
  getDogById(id: string): Promise<SponsoredDog | null>;
  nameAndSponsorDog(dogId: string, name: string, collarColor: string, donorName: string): Promise<SponsoredDog>;
  getReviews(): Promise<ServiceReview[]>;
  addReview(review: Omit<ServiceReview, 'id' | 'createdAt' | 'moderationStatus'>): Promise<ServiceReview>;
  getLeaderboard(metric: 'meals' | 'streak' | 'city'): Promise<LeaderboardEntry[]>;
}

export interface AuditLogger {
  log(entry: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<void>;
  getLogs(limit?: number): Promise<AdminAuditLog[]>;
}

export interface ContentModerationRepository {
  getAllPending(): Promise<ContentModerationItem[]>;
  submit(item: Omit<ContentModerationItem, 'id' | 'submittedAt' | 'status'>): Promise<ContentModerationItem>;
  review(id: string, status: 'approved' | 'rejected', reason?: string): Promise<void>;
}

export interface UserRepository {
  getCurrentUser(): User;
  switchUserRole(role: User['role'], adminRole?: User['adminRole'], shelterId?: string): Promise<User>;
  updateProfile(updates: Partial<User>): Promise<User>;
  toggleLeaderboardOptOut(userId: string): Promise<boolean>;
}

/**
 * PayoutPolicy Interface
 * Per requirement 19:
 * "Payout hold is REMOVED for now. Do not build it. Keep a PayoutPolicy interface
 * with a no-op default implementation so it can be added later without edits to existing code."
 */
export interface PayoutPolicy {
  evaluateDisbursement(shelterId: string, amountInPaise: number): Promise<{ canDisburse: boolean; reason?: string }>;
}

export class NoOpPayoutPolicy implements PayoutPolicy {
  async evaluateDisbursement(_shelterId: string, _amountInPaise: number): Promise<{ canDisburse: boolean; reason?: string }> {
    // Unconditional approval — no hold logic is enforced
    return { canDisburse: true };
  }
}
