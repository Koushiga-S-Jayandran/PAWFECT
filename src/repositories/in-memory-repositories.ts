/**
 * In-Memory Concrete Implementations of Domain Repositories
 * Strictly adheres to Liskov Substitution Principle and Dependency Inversion.
 */

import type {
  ShelterReader,
  ShelterWriter,
  GiftRepository,
  OrderRepository,
  FamilyMemberRepository,
  MembershipRepository,
  CommunityRepository,
  AuditLogger,
  ContentModerationRepository,
  UserRepository,
} from '../domain/interfaces';
import type {
  Shelter,
  ShelterProof,
  ShelterStatus,
  Gift,
  Order,
  OrderStatus,
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
} from '../domain/types';
import {
  INITIAL_SHELTERS,
  INITIAL_BATCHES,
  INITIAL_DOGS,
  INITIAL_SERVICE_REVIEWS,
  INITIAL_USER,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_ORDERS,
} from './mock-data';
import { GIFTS_CATALOG } from '../config/gifts';
import { OrderStateMachine } from '../state-machines/order-fsm';
import { ShelterApprovalStateMachine } from '../state-machines/shelter-approval-fsm';

export class InMemoryShelterRepository implements ShelterReader, ShelterWriter {
  private shelters: Map<string, Shelter> = new Map();

  constructor(initialData: Shelter[] = INITIAL_SHELTERS) {
    for (const sh of initialData) {
      this.shelters.set(sh.id, { ...sh, proofHistory: [...sh.proofHistory] });
    }
  }

  async getAll(): Promise<Shelter[]> {
    // Only return non-removed shelters for public listing
    return Array.from(this.shelters.values()).filter(s => s.status !== 'removed');
  }

  async getAllIncludingArchived(): Promise<Shelter[]> {
    return Array.from(this.shelters.values());
  }

  async getById(id: string): Promise<Shelter | null> {
    const s = this.shelters.get(id);
    return s ? { ...s } : null;
  }

  async getByCity(city: string): Promise<Shelter[]> {
    return (await this.getAll()).filter(
      s => s.city.toLowerCase() === city.toLowerCase()
    );
  }

  async search(query: string): Promise<Shelter[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();
    return (await this.getAll()).filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.animalTypes.some(t => t.toLowerCase().includes(q))
    );
  }

  async register(
    shelterData: Omit<Shelter, 'id' | 'createdAt' | 'mealsFundedTotal' | 'proofHistory' | 'status'>
  ): Promise<Shelter> {
    const id = `sh_reg_${Date.now()}`;
    const newShelter: Shelter = {
      ...shelterData,
      id,
      status: 'pending',
      mealsFundedTotal: 0,
      proofHistory: [],
      createdAt: new Date().toISOString(),
    };
    this.shelters.set(id, newShelter);
    return newShelter;
  }

  async updateStatus(id: string, status: ShelterStatus, _reason?: string): Promise<void> {
    const shelter = this.shelters.get(id);
    if (!shelter) throw new Error(`Shelter with ID '${id}' not found.`);

    // Enforce FSM transitions
    const validNextStatus = ShelterApprovalStateMachine.transition(shelter.status, status);
    shelter.status = validNextStatus;
    this.shelters.set(id, shelter);
  }

  async addProof(
    shelterId: string,
    proofData: Omit<ShelterProof, 'id' | 'timestamp'>
  ): Promise<ShelterProof> {
    const shelter = this.shelters.get(shelterId);
    if (!shelter) throw new Error(`Shelter with ID '${shelterId}' not found.`);

    const proof: ShelterProof = {
      ...proofData,
      id: `proof_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    shelter.proofHistory.unshift(proof);
    shelter.mealsFundedTotal += proof.mealCountFunded || 0;
    this.shelters.set(shelterId, shelter);
    return proof;
  }

  async updateShelterDetails(id: string, updates: Partial<Shelter>): Promise<Shelter> {
    const shelter = this.shelters.get(id);
    if (!shelter) throw new Error(`Shelter with ID '${id}' not found.`);

    const updated = { ...shelter, ...updates };
    this.shelters.set(id, updated);
    return updated;
  }
}

export class InMemoryGiftRepository implements GiftRepository {
  private gifts: Map<string, Gift> = new Map();

  constructor(initialData: Gift[] = GIFTS_CATALOG) {
    for (const g of initialData) {
      this.gifts.set(g.id, { ...g });
    }
  }

  async getAll(): Promise<Gift[]> {
    return Array.from(this.gifts.values());
  }

  async getById(id: string): Promise<Gift | null> {
    const g = this.gifts.get(id);
    return g ? { ...g } : null;
  }

  async getByShelterId(shelterId: string): Promise<Gift[]> {
    return (await this.getAll()).filter(
      g => !g.shelterId || g.shelterId === shelterId
    );
  }
}

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  constructor(initialData: Order[] = INITIAL_ORDERS) {
    for (const ord of initialData) {
      this.orders.set(ord.id, { ...ord });
    }
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const o = this.orders.get(orderId);
    return o ? { ...o } : null;
  }

  async getOrderByCertificateId(certId: string): Promise<Order | null> {
    for (const ord of this.orders.values()) {
      if (ord.certificateId === certId) return { ...ord };
    }
    return null;
  }

  async listUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(
    orderData: Omit<Order, 'id' | 'createdAt' | 'timeline' | 'certificateId' | 'status'>
  ): Promise<Order> {
    const id = `ord_${Math.floor(10000 + Math.random() * 90000)}`;
    const certId = `cert_${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const order: Order = {
      ...orderData,
      id,
      certificateId: certId,
      status: 'PAID',
      createdAt: now,
      timeline: [
        { status: 'PAID', label: 'Payment Received', timestamp: now, completed: true },
        { status: 'SHELTER_CONFIRMED', label: 'Shelter Confirmed', timestamp: '', completed: false },
        { status: 'FOOD_BOUGHT', label: 'Supplies Procured', timestamp: '', completed: false },
        { status: 'PROOF_UPLOADED', label: 'Photo Proof Upload', timestamp: '', completed: false },
        { status: 'CERTIFICATE_READY', label: 'Certificate Issued', timestamp: '', completed: false },
      ],
    };

    this.orders.set(id, order);
    return order;
  }

  async advanceOrderStatus(orderId: string, nextStatus: OrderStatus, note?: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    // Enforce FSM
    OrderStateMachine.transition(order.status, nextStatus);

    order.status = nextStatus;
    const now = new Date().toISOString();

    // Mark current timeline event
    const event = order.timeline.find(t => t.status === nextStatus);
    if (event) {
      event.completed = true;
      event.timestamp = now;
      if (note) event.note = note;
    }

    this.orders.set(orderId, order);
    return order;
  }

  async attachProof(orderId: string, proofPhotoUrl: string, note: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    order.proofPhotoUrl = proofPhotoUrl;
    order.proofId = `proof_ord_${orderId}`;
    await this.advanceOrderStatus(orderId, 'PROOF_UPLOADED', note);
    await this.advanceOrderStatus(orderId, 'CERTIFICATE_READY', 'Certificate issued with shelter proof photo.');

    return order;
  }
}

export class InMemoryFamilyMemberRepository implements FamilyMemberRepository {
  private members: Map<string, FamilyMember[]> = new Map();

  constructor(initialData: FamilyMember[] = INITIAL_FAMILY_MEMBERS) {
    this.members.set('usr_donor_me', [...initialData]);
  }

  async getByUserId(userId: string): Promise<FamilyMember[]> {
    return this.members.get(userId) || [];
  }

  async addMember(
    userId: string,
    memberData: Omit<FamilyMember, 'id' | 'userId'>
  ): Promise<FamilyMember> {
    const list = this.members.get(userId) || [];
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam_${Date.now()}`,
      userId,
    };
    list.push(newMember);
    this.members.set(userId, list);
    return newMember;
  }

  async updateMember(
    userId: string,
    memberId: string,
    updates: Partial<Omit<FamilyMember, 'id' | 'userId'>>
  ): Promise<FamilyMember> {
    const list = this.members.get(userId) || [];
    const index = list.findIndex(m => m.id === memberId);
    if (index === -1) throw new Error('Family member not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    this.members.set(userId, list);
    return updated;
  }

  async deleteMember(userId: string, memberId: string): Promise<void> {
    const list = this.members.get(userId) || [];
    this.members.set(userId, list.filter(m => m.id !== memberId));
  }

  async addSpecialDate(
    userId: string,
    memberId: string,
    dateData: Omit<SpecialDate, 'id'>
  ): Promise<SpecialDate> {
    const list = this.members.get(userId) || [];
    const member = list.find(m => m.id === memberId);
    if (!member) throw new Error('Family member not found');

    const newDate: SpecialDate = {
      ...dateData,
      id: `date_${Date.now()}`,
    };
    member.specialDates.push(newDate);
    this.members.set(userId, list);
    return newDate;
  }

  async updateSpecialDate(
    userId: string,
    memberId: string,
    dateId: string,
    updates: Partial<SpecialDate>
  ): Promise<SpecialDate> {
    const list = this.members.get(userId) || [];
    const member = list.find(m => m.id === memberId);
    if (!member) throw new Error('Family member not found');

    const dateIndex = member.specialDates.findIndex(d => d.id === dateId);
    if (dateIndex === -1) throw new Error('Special date not found');

    const updated = { ...member.specialDates[dateIndex], ...updates };
    member.specialDates[dateIndex] = updated;
    this.members.set(userId, list);
    return updated;
  }

  async deleteSpecialDate(userId: string, memberId: string, dateId: string): Promise<void> {
    const list = this.members.get(userId) || [];
    const member = list.find(m => m.id === memberId);
    if (!member) throw new Error('Family member not found');

    member.specialDates = member.specialDates.filter(d => d.id !== dateId);
    this.members.set(userId, list);
  }

  async toggleMute(userId: string, memberId: string, dateId: string): Promise<boolean> {
    const list = this.members.get(userId) || [];
    const member = list.find(m => m.id === memberId);
    if (!member) throw new Error('Family member not found');

    const targetDate = member.specialDates.find(d => d.id === dateId);
    if (!targetDate) throw new Error('Special date not found');

    targetDate.isMuted = !targetDate.isMuted;
    this.members.set(userId, list);
    return targetDate.isMuted;
  }

  async deleteUserData(userId: string): Promise<void> {
    this.members.delete(userId);
  }
}

export class InMemoryMembershipRepository implements MembershipRepository {
  private memberships: Map<string, Membership> = new Map();

  async getByUserId(userId: string): Promise<Membership | null> {
    const m = this.memberships.get(userId);
    return m ? { ...m } : null;
  }

  async saveMembership(membership: Membership): Promise<void> {
    this.memberships.set(membership.userId, { ...membership });
  }
}

export class InMemoryCommunityRepository implements CommunityRepository {
  private batches: Map<string, Batch> = new Map();
  private dogs: Map<string, SponsoredDog> = new Map();
  private reviews: ServiceReview[] = [];

  constructor(
    batches: Batch[] = INITIAL_BATCHES,
    dogs: SponsoredDog[] = INITIAL_DOGS,
    reviews: ServiceReview[] = INITIAL_SERVICE_REVIEWS
  ) {
    for (const b of batches) this.batches.set(b.id, { ...b });
    for (const d of dogs) this.dogs.set(d.id, { ...d });
    this.reviews = [...reviews];
  }

  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async getBatchById(id: string): Promise<Batch | null> {
    const b = this.batches.get(id);
    return b ? { ...b } : null;
  }

  async contributeToBatch(batchId: string, paise: number): Promise<Batch> {
    const b = this.batches.get(batchId);
    if (!b) throw new Error('Batch not found');

    b.raisedPaise += paise;
    b.contributorCount += 1;
    if (b.raisedPaise >= b.targetPaise) {
      b.status = 'funded';
    }
    this.batches.set(batchId, b);
    return { ...b };
  }

  async getDogs(): Promise<SponsoredDog[]> {
    return Array.from(this.dogs.values());
  }

  async getDogById(id: string): Promise<SponsoredDog | null> {
    const d = this.dogs.get(id);
    return d ? { ...d } : null;
  }

  async nameAndSponsorDog(
    dogId: string,
    name: string,
    collarColor: string,
    donorName: string
  ): Promise<SponsoredDog> {
    const dog = this.dogs.get(dogId);
    if (!dog) throw new Error('Dog not found');

    dog.name = name;
    dog.collarColor = collarColor;
    dog.isSponsored = true;
    dog.namedByDonorName = donorName;
    dog.namedAt = new Date().toISOString();

    this.dogs.set(dogId, dog);
    return { ...dog };
  }

  async getReviews(): Promise<ServiceReview[]> {
    // Only return approved reviews
    return this.reviews.filter(r => r.moderationStatus === 'approved');
  }

  async addReview(
    reviewData: Omit<ServiceReview, 'id' | 'createdAt' | 'moderationStatus'>
  ): Promise<ServiceReview> {
    const newReview: ServiceReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved',
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  async getLeaderboard(metric: 'meals' | 'streak' | 'city'): Promise<LeaderboardEntry[]> {
    // Seed leaderboard donors across Indian cities
    const rawDonors = [
      { userId: 'u1', name: 'Ananya Deshmukh', city: 'Bengaluru', mealsGiven: 85, streakDays: 14, isAnonymous: false },
      { userId: 'u2', name: 'Vikram & Priya Singhania', city: 'Mumbai', mealsGiven: 320, streakDays: 28, isAnonymous: false },
      { userId: 'u3', name: 'Kavita Menon', city: 'Chennai', mealsGiven: 190, streakDays: 19, isAnonymous: false },
      { userId: 'u4', name: 'Deepak & Sneha Roy', city: 'Delhi-NCR', mealsGiven: 240, streakDays: 22, isAnonymous: false },
      { userId: 'u5', name: 'Anonymous Kind Soul', city: 'Pune', mealsGiven: 175, streakDays: 10, isAnonymous: true },
      { userId: 'u6', name: 'Arjun Nambiar', city: 'Bengaluru', mealsGiven: 150, streakDays: 31, isAnonymous: false },
      { userId: 'u7', name: 'Dr. Shruti Patil', city: 'Pune', mealsGiven: 110, streakDays: 12, isAnonymous: false },
      { userId: 'u8', name: 'Rohan Mehra', city: 'Mumbai', mealsGiven: 95, streakDays: 9, isAnonymous: false },
    ];

    let sorted = [...rawDonors];
    if (metric === 'meals') {
      sorted.sort((a, b) => b.mealsGiven - a.mealsGiven);
    } else if (metric === 'streak') {
      sorted.sort((a, b) => b.streakDays - a.streakDays);
    } else if (metric === 'city') {
      sorted.sort((a, b) => a.city.localeCompare(b.city) || b.mealsGiven - a.mealsGiven);
    }

    return sorted.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }
}

export class InMemoryAuditLogger implements AuditLogger {
  private logs: AdminAuditLog[] = [
    {
      id: 'log_seed_1',
      timestamp: '2024-10-25T10:00:00Z',
      adminEmail: 'admin@pawfect.org',
      adminRole: 'Super Admin',
      action: 'SHELTER_VERIFIED',
      targetType: 'shelter',
      targetId: 'sh_bengaluru_chhaya',
      details: 'Reviewed and confirmed 80G Trust deed registration documents.',
    },
    {
      id: 'log_seed_2',
      timestamp: '2024-10-25T11:30:00Z',
      adminEmail: 'compliance@pawfect.org',
      adminRole: 'Verification',
      action: 'PROOF_AUDITED',
      targetType: 'shelter',
      targetId: 'proof_chhaya_1',
      details: 'Verified bowl feeding timestamp and vendor invoice match.',
    },
  ];

  async log(entry: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<void> {
    const logItem: AdminAuditLog = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(logItem);
  }

  async getLogs(limit: number = 50): Promise<AdminAuditLog[]> {
    return this.logs.slice(0, limit);
  }
}

export class InMemoryContentModerationRepository implements ContentModerationRepository {
  private items: ContentModerationItem[] = [
    {
      id: 'mod_1',
      type: 'dog_name',
      content: 'Sher Khan the Fearless',
      submittedBy: 'Aarav Patel',
      submittedAt: '2024-10-26T12:00:00Z',
      status: 'pending',
      targetRefId: 'dog_1',
    },
    {
      id: 'mod_2',
      type: 'dedication',
      content: 'Celebrating Chintu’s passing with flying colors in 10th ICSE boards! 50 meals for furry buddies.',
      submittedBy: 'Neha Sharma',
      submittedAt: '2024-10-26T13:40:00Z',
      status: 'pending',
      targetRefId: 'ord_10822',
    },
  ];

  async getAllPending(): Promise<ContentModerationItem[]> {
    return this.items.filter(i => i.status === 'pending');
  }

  async submit(
    itemData: Omit<ContentModerationItem, 'id' | 'submittedAt' | 'status'>
  ): Promise<ContentModerationItem> {
    const item: ContentModerationItem = {
      ...itemData,
      id: `mod_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    this.items.push(item);
    return item;
  }

  async review(id: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
    const item = this.items.find(i => i.id === id);
    if (!item) throw new Error('Moderation item not found');

    item.status = status;
    if (reason) item.rejectionReason = reason;
  }
}

export class InMemoryUserRepository implements UserRepository {
  private currentUser: User = { ...INITIAL_USER };

  getCurrentUser(): User {
    return { ...this.currentUser };
  }

  async switchUserRole(role: User['role'], adminRole?: User['adminRole'], shelterId?: string): Promise<User> {
    this.currentUser.role = role;
    this.currentUser.adminRole = adminRole;
    this.currentUser.shelterId = shelterId;
    return { ...this.currentUser };
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    this.currentUser = { ...this.currentUser, ...updates };
    return { ...this.currentUser };
  }

  async toggleLeaderboardOptOut(_userId: string): Promise<boolean> {
    this.currentUser.optedOutFromLeaderboard = !this.currentUser.optedOutFromLeaderboard;
    return this.currentUser.optedOutFromLeaderboard;
  }
}
