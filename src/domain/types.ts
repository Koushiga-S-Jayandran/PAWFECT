/**
 * Core Domain Entities and Value Objects for Pawfect
 * Pure TypeScript — No framework dependencies
 */

export interface Money {
  amountInPaise: number;
  currency: 'INR';
}

export function createMoney(paise: number): Money {
  if (!Number.isInteger(paise) || paise < 0) {
    throw new Error('Money amount must be a non-negative integer in paise');
  }
  return {
    amountInPaise: paise,
    currency: 'INR',
  };
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(rupees);
}

export type AnimalType = 'Dogs' | 'Cats' | 'Indie Dogs' | 'Large Animals' | 'Senior & Special Needs';

export type UrgencyLevel = 'normal' | 'urgent' | 'critical';

export type ShelterStatus = 'pending' | 'active' | 'suspended' | 'removed';

export interface ShelterProof {
  id: string;
  shelterId: string;
  orderId?: string;
  batchId?: string;
  title: string;
  photoUrl: string;
  videoUrl?: string;
  description: string;
  timestamp: string; // ISO 8601
  mealCountFunded: number;
  dogNames?: string[];
}

export interface ShelterDocument {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  uploadedAt: string;
  verified: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  animalTypes: AnimalType[];
  verified: boolean;
  urgencyLevel: UrgencyLevel;
  avatarUrl: string;
  coverUrl: string;
  story: string;
  dogCount: number;
  catCount: number;
  mealsNeededDaily: number;
  mealsFundedTotal: number;
  proofHistory: ShelterProof[];
  status: ShelterStatus;
  documents: ShelterDocument[];
  bankDetailsMasked: string; // e.g. "HDFC Bank •••• 4821"
  contactPhone: string;
  contactEmail: string;
  createdAt: string;
}

export type GiftCategory = 'meal' | 'medical' | 'sponsorship' | 'comfort';

export interface Gift {
  id: string;
  title: string;
  category: GiftCategory;
  description: string;
  amountInPaise: number;
  iconName: string;
  unitLabel: string;
  shelterId?: string; // Optional: specific to shelter or general marketplace
  urgencyTag?: string;
  impactDescription: string;
  mealsEquivalent: number;
}

export type SpecialDateType = 'birthday' | 'anniversary' | 'memorial' | 'adoption';

export interface SpecialDate {
  id: string;
  title: string;
  month: number; // 1-12
  day: number;   // 1-31
  year?: number; // Optional birth/memorial year
  type: SpecialDateType;
  isMuted: boolean;
  lastGiftId?: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  specialDates: SpecialDate[];
}

export type OrderStatus =
  | 'PAID'
  | 'SHELTER_CONFIRMED'
  | 'FOOD_BOUGHT'
  | 'PROOF_UPLOADED'
  | 'CERTIFICATE_READY';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note?: string;
  completed: boolean;
}

export interface Dedication {
  honoreeName: string;
  occasion: string;
  message: string;
  familyMemberId?: string;
  isMemorial: boolean;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  userId: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  shelterId: string;
  shelterName: string;
  giftId: string;
  giftTitle: string;
  amountInPaise: number;
  quantity: number;
  dedication?: Dedication;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  certificateId: string;
  createdAt: string;
  proofId?: string;
  proofPhotoUrl?: string;
  paymentMethod: string;
}

export interface Certificate {
  id: string;
  orderId: string;
  certificateNumber: string;
  honoreeName: string;
  donorName: string;
  shelterName: string;
  giftDescription: string;
  impactStatement: string;
  themeId: string;
  issueDate: string;
  qrCodeHash: string;
}

export type MembershipStatus =
  | 'ACTIVE'
  | 'CANCELLED_PENDING_EXPIRY'
  | 'EXPIRED'
  | 'RENEWED';

export type BillingCycle = 'monthly' | 'yearly';

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
}

export interface MembershipPlanConfig {
  id: string;
  name: string;
  badgeTitle: string;
  tagline: string;
  monthlyPaise: number;
  yearlyPaise: number;
  discountPercentYearly: number;
  benefits: MembershipBenefit[];
  isPopular?: boolean;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  status: MembershipStatus;
  billingCycle: BillingCycle;
  pricePaidInPaise: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  autoRenew: boolean;
  updatedAt: string;
}

export interface Batch {
  id: string;
  name: string;
  code: string; // e.g. "Batch 07"
  description: string;
  shelterId: string;
  shelterName: string;
  city: string;
  targetPaise: number;
  raisedPaise: number;
  deadline: string;
  contributorCount: number;
  status: 'funding' | 'funded' | 'disbursed';
  urgencyTag: string;
}

export interface SponsoredDog {
  id: string;
  shelterId: string;
  shelterName: string;
  name: string;
  ageYears: number;
  breed: string;
  story: string;
  photoUrl: string;
  collarColor: string; // Hex code or named color
  namedByDonorName?: string;
  namedAt?: string;
  isSponsored: boolean;
}

export type ServiceAspect = 'support' | 'ease_of_use' | 'reminders' | 'trust';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface ServiceReview {
  id: string;
  authorName: string;
  authorCity: string;
  rating: number; // 1-5
  aspect: ServiceAspect;
  comment: string;
  createdAt: string;
  isVerifiedDonor: boolean;
  moderationStatus: ModerationStatus;
}

export type UserRole = 'donor' | 'shelter_rep' | 'admin';

export type AdminRole = 'Super Admin' | 'Verification' | 'Support' | 'Finance';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  adminRole?: AdminRole;
  shelterId?: string; // If shelter_rep
  avatarUrl?: string;
  optedOutFromLeaderboard: boolean;
  streakDays: number;
  totalMealsFunded: number;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetType: 'shelter' | 'moderation' | 'membership' | 'user' | 'system';
  targetId: string;
  details: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  city: string;
  mealsGiven: number;
  streakDays: number;
  rank: number;
  isAnonymous: boolean;
}

export interface ContentModerationItem {
  id: string;
  type: 'dog_name' | 'dedication' | 'service_review';
  content: string;
  submittedBy: string;
  submittedAt: string;
  status: ModerationStatus;
  rejectionReason?: string;
  targetRefId: string;
}
