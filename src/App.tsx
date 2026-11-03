/**
 * Pawfect: Animal Shelter Giving Marketplace
 * Composition Root & Application Shell
 */

import React, { useState, useEffect, useCallback } from 'react';
import { appContainer } from './app/container';
import type {
  Shelter,
  Gift,
  Order,
  FamilyMember,
  Batch,
  SponsoredDog,
  ServiceReview,
  User,
  Membership,
  AdminAuditLog,
  ContentModerationItem,
  BillingCycle,
  AdminRole,
  ShelterStatus,
} from './domain/types';
import { Navbar } from './ui/components/Navbar';
import { Footer } from './ui/components/Footer';
import { FeatureErrorBoundary } from './ui/components/ErrorBoundary';
import { CursorCompanions } from './ui/mascots/CursorCompanions';
import { ShelterBrowser } from './ui/features/donor/ShelterBrowser';
import { ShelterProfileModal } from './ui/features/donor/ShelterProfileModal';
import { GiftCatalogView } from './ui/features/donor/GiftCatalogView';
import { CheckoutModal } from './ui/features/donor/CheckoutModal';
import { ReminderCenter } from './ui/features/donor/ReminderCenter';
import { FamilyImpactView } from './ui/features/donor/FamilyImpactView';
import { BatchesView } from './ui/features/community/BatchesView';
import { NameADogView } from './ui/features/community/NameADogView';
import { ServiceReviewsView } from './ui/features/community/ServiceReviewsView';
import { MembershipView } from './ui/features/membership/MembershipView';
import { ShelterDashboard } from './ui/features/shelter/ShelterDashboard';
import { AdminPanel } from './ui/features/admin/AdminPanel';
import { AdminLoginModal } from './ui/components/AdminLoginModal';
import { RoleSwitcherModal } from './ui/components/RoleSwitcherModal';
import { PrivacyModal } from './ui/components/PrivacyModal';
import { GIFTS_CATALOG } from './config/gifts';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() =>
    appContainer.userRepository.getCurrentUser()
  );
  const [activeTab, setActiveTab] = useState<string>('shelters');

  // Domain data states
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [gifts, setGifts] = useState<Gift[]>(GIFTS_CATALOG);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [dogs, setDogs] = useState<SponsoredDog[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [pendingModeration, setPendingModeration] = useState<ContentModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & Interactive Overlays
  const [viewingShelter, setViewingShelter] = useState<Shelter | null>(null);
  const [checkoutTarget, setCheckoutTarget] = useState<{ gift: Gift; shelter?: Shelter } | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  // Load initial state through domain repositories
  const refreshData = useCallback(async () => {
    try {
      const [
        loadedShelters,
        loadedGifts,
        loadedBatches,
        loadedDogs,
        loadedReviews,
        loadedFamily,
        loadedOrders,
        loadedMembership,
        loadedLogs,
        loadedMod,
      ] = await Promise.all([
        appContainer.shelterReader.getAll(),
        appContainer.giftRepository.getAll(),
        appContainer.communityRepository.getBatches(),
        appContainer.communityRepository.getDogs(),
        appContainer.communityRepository.getReviews(),
        appContainer.familyMemberRepository.getByUserId(currentUser.id),
        appContainer.orderTracker.listUserOrders(currentUser.id),
        appContainer.membershipService.getActiveMembership(currentUser.id),
        appContainer.auditLogger.getLogs(),
        appContainer.contentModerationRepository.getAllPending(),
      ]);

      setShelters(loadedShelters);
      setGifts(loadedGifts);
      setBatches(loadedBatches);
      setDogs(loadedDogs);
      setReviews(loadedReviews);
      setFamilyMembers(loadedFamily);
      setOrders(loadedOrders);
      setActiveMembership(loadedMembership);
      setAuditLogs(loadedLogs);
      setPendingModeration(loadedMod);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handlers for donor flow
  const handleQuickGift = (shelter: Shelter) => {
    const popularGift = gifts.find(g => g.id === 'gift_feed_20_dogs') || gifts[0];
    setCheckoutTarget({ gift: popularGift, shelter });
  };

  const handleProcessOrderPayment = async (data: {
    gift: Gift;
    shelter: Shelter;
    quantity: number;
    dedication?: {
      honoreeName: string;
      occasion: string;
      message: string;
      isMemorial: boolean;
    };
    paymentMethod: string;
    idempotencyKey: string;
  }): Promise<Order> => {
    const order = await appContainer.checkoutService.processCheckout({
      idempotencyKey: data.idempotencyKey,
      userId: currentUser.id,
      donorName: currentUser.name,
      donorPhone: currentUser.phone,
      donorEmail: currentUser.email,
      shelterId: data.shelter.id,
      shelterName: data.shelter.name,
      giftId: data.gift.id,
      giftTitle: data.gift.title,
      amountInPaise: data.gift.amountInPaise,
      quantity: data.quantity,
      dedication: data.dedication,
      paymentMethod: data.paymentMethod,
    });

    // Advance order to shelter confirmed and food bought for interactive preview
    await appContainer.orderRepository.advanceOrderStatus(
      order.id,
      'SHELTER_CONFIRMED',
      `Sanctuary staff allocated ${data.gift.mealsEquivalent * data.quantity} meals in kitchen pantry.`
    );

    await appContainer.auditLogger.log({
      adminEmail: 'system@pawfect.org',
      adminRole: 'Support',
      action: 'ORDER_PLACED',
      targetType: 'user',
      targetId: order.id,
      details: `New order ${order.id} placed for ${order.shelterName} (${order.giftTitle})`,
    });

    await refreshData();
    return order;
  };

  // Community handlers
  const handleContributeBatch = async (batchId: string, amountPaise: number) => {
    await appContainer.communityRepository.contributeToBatch(batchId, amountPaise);
    await refreshData();
  };

  const handleNameDog = async (
    dogId: string,
    name: string,
    collarColor: string,
    donorName: string
  ) => {
    await appContainer.communityRepository.nameAndSponsorDog(
      dogId,
      name,
      collarColor,
      donorName
    );
    await appContainer.auditLogger.log({
      adminEmail: 'moderation@pawfect.org',
      adminRole: 'Support',
      action: 'DOG_NAMED',
      targetType: 'system',
      targetId: dogId,
      details: `Dog ID ${dogId} named "${name}" with collar ${collarColor}`,
    });
    await refreshData();
  };

  const handleAddReview = async (review: Omit<ServiceReview, 'id' | 'createdAt' | 'moderationStatus'>) => {
    await appContainer.communityRepository.addReview(review);
    await refreshData();
  };

  // Family Members & Dates
  const handleAddMember = async (member: Omit<FamilyMember, 'id' | 'userId'>) => {
    await appContainer.familyMemberRepository.addMember(currentUser.id, member);
    await refreshData();
  };

  const handleDeleteMember = async (memberId: string) => {
    await appContainer.familyMemberRepository.deleteMember(currentUser.id, memberId);
    await refreshData();
  };

  const handleAddSpecialDate = async (memberId: string, date: Omit<FamilyMember['specialDates'][0], 'id'>) => {
    await appContainer.familyMemberRepository.addSpecialDate(currentUser.id, memberId, date);
    await refreshData();
  };

  const handleToggleMuteDate = async (memberId: string, dateId: string) => {
    await appContainer.familyMemberRepository.toggleMute(currentUser.id, memberId, dateId);
    await refreshData();
  };

  const handleDeleteDate = async (memberId: string, dateId: string) => {
    await appContainer.familyMemberRepository.deleteSpecialDate(currentUser.id, memberId, dateId);
    await refreshData();
  };

  const handleOneTapReorder = (
    gift: Gift,
    shelter: Shelter,
    honoreeName: string,
    occasion: string
  ) => {
    setCheckoutTarget({ gift, shelter });
  };

  // Membership Handlers
  const handleSubscribeMembership = async (planId: string, cycle: BillingCycle) => {
    await appContainer.membershipService.subscribe(currentUser.id, planId, cycle);
    await refreshData();
  };

  const handleCancelMembership = async () => {
    await appContainer.membershipService.requestCancellationAtPeriodEnd(currentUser.id);
    await refreshData();
  };

  const handleReactivateMembership = async () => {
    await appContainer.membershipService.reactivateMembership(currentUser.id);
    await refreshData();
  };

  // Shelter Rep actions
  const handleUploadProof = async (
    shelterId: string,
    proofData: Omit<Shelter['proofHistory'][0], 'id' | 'timestamp'>
  ) => {
    await appContainer.shelterWriter.addProof(shelterId, proofData);

    // If an order matches this shelter, attach proof and mark complete
    const matchingOrder = orders.find(o => o.shelterId === shelterId && o.status !== 'CERTIFICATE_READY');
    if (matchingOrder) {
      await appContainer.orderRepository.attachProof(
        matchingOrder.id,
        proofData.photoUrl,
        proofData.description
      );
    }

    await appContainer.auditLogger.log({
      adminEmail: 'shelter_rep@chhaya.org',
      adminRole: 'Verification',
      action: 'PROOF_UPLOADED',
      targetType: 'shelter',
      targetId: shelterId,
      details: `Proof uploaded: "${proofData.title}" (${proofData.mealCountFunded} meals)`,
    });

    await refreshData();
  };

  // Admin Actions
  const handleUpdateShelterStatus = async (shelterId: string, status: ShelterStatus, reason?: string) => {
    await appContainer.shelterWriter.updateStatus(shelterId, status, reason);
    await appContainer.auditLogger.log({
      adminEmail: currentUser.email,
      adminRole: currentUser.adminRole || 'Super Admin',
      action: `SHELTER_STATUS_${status.toUpperCase()}`,
      targetType: 'shelter',
      targetId: shelterId,
      details: reason || `Updated shelter status to ${status}`,
    });
    await refreshData();
  };

  const handleReviewModerationItem = async (itemId: string, status: 'approved' | 'rejected', reason?: string) => {
    await appContainer.contentModerationRepository.review(itemId, status, reason);
    await appContainer.auditLogger.log({
      adminEmail: currentUser.email,
      adminRole: currentUser.adminRole || 'Support',
      action: `MODERATION_${status.toUpperCase()}`,
      targetType: 'moderation',
      targetId: itemId,
      details: reason || `Content item ${status}`,
    });
    await refreshData();
  };

  const handleSwitchAdminRole = (role: AdminRole) => {
    setCurrentUser(prev => ({ ...prev, adminRole: role }));
  };

  const handleSelectRole = async (role: User['role'], adminRole?: AdminRole, shelterId?: string) => {
    const updated = await appContainer.userRepository.switchUserRole(role, adminRole, shelterId);
    setCurrentUser(updated);
    if (role === 'shelter_rep') setActiveTab('shelter_portal');
    else if (role === 'admin') setActiveTab('admin_panel');
    else setActiveTab('shelters');
  };

  const handleToggleLeaderboardOptOut = async () => {
    await appContainer.userRepository.toggleLeaderboardOptOut(currentUser.id);
    setCurrentUser(appContainer.userRepository.getCurrentUser());
  };

  const handleDeleteMyData = async () => {
    await appContainer.familyMemberRepository.deleteUserData(currentUser.id);
    await refreshData();
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'CERTIFICATE_READY').length;
  const upcomingRemindersCount = familyMembers.reduce((acc, m) => acc + m.specialDates.length, 0);

  // Shelter Rep targeted shelter
  const activeShelterForPortal =
    shelters.find(s => s.id === currentUser.shelterId) || shelters[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F6] text-[#3A2530]">
      {/* Mascot Cursor Companions */}
      <CursorCompanions />

      {/* Main Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onNavigate={tab => {
          // Role guard: if donor clicks shelter or admin tabs without role, route to login/switcher
          if ((tab === 'shelter_portal' && currentUser.role !== 'shelter_rep') ||
              (tab === 'admin_panel' && currentUser.role !== 'admin')) {
            setShowRoleSwitcher(true);
            return;
          }
          setActiveTab(tab);
        }}
        onOpenRoleSwitcher={() => setShowRoleSwitcher(true)}
        activeOrderCount={activeOrdersCount}
        upcomingRemindersCount={upcomingRemindersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeatureErrorBoundary fallbackTitle="Unable to display this section right now">
          {activeTab === 'shelters' && (
            <ShelterBrowser
              shelters={shelters}
              onSelectShelter={shelter => setViewingShelter(shelter)}
              onQuickGift={shelter => handleQuickGift(shelter)}
            />
          )}

          {activeTab === 'gifts' && (
            <GiftCatalogView
              shelters={shelters}
              onSelectGiftForCheckout={(gift, shelter) =>
                setCheckoutTarget({ gift, shelter })
              }
            />
          )}

          {activeTab === 'batches' && (
            <BatchesView
              batches={batches}
              onContribute={handleContributeBatch}
            />
          )}

          {activeTab === 'name-a-dog' && (
            <NameADogView
              dogs={dogs}
              currentUser={currentUser}
              moderationService={appContainer.moderationService}
              onNameDog={handleNameDog}
            />
          )}

          {activeTab === 'membership' && (
            <MembershipView
              currentUser={currentUser}
              activeMembership={activeMembership}
              onSubscribe={handleSubscribeMembership}
              onCancelAtPeriodEnd={handleCancelMembership}
              onReactivate={handleReactivateMembership}
            />
          )}

          {activeTab === 'reminders' && (
            <ReminderCenter
              familyMembers={familyMembers}
              shelters={shelters}
              onAddMember={handleAddMember}
              onDeleteMember={handleDeleteMember}
              onAddSpecialDate={handleAddSpecialDate}
              onToggleMuteDate={handleToggleMuteDate}
              onDeleteDate={handleDeleteDate}
              onOneTapReorder={handleOneTapReorder}
            />
          )}

          {activeTab === 'impact' && (
            <FamilyImpactView
              currentUser={currentUser}
              orders={orders}
              shelters={shelters}
              onToggleLeaderboardOptOut={handleToggleLeaderboardOptOut}
            />
          )}

          {activeTab === 'reviews' && (
            <ServiceReviewsView
              reviews={reviews}
              currentUser={currentUser}
              onAddReview={handleAddReview}
            />
          )}

          {/* Shelter Dashboard View */}
          {activeTab === 'shelter_portal' && (
            <ShelterDashboard
              shelter={activeShelterForPortal}
              dogs={dogs}
              gifts={gifts}
              onUploadProof={handleUploadProof}
            />
          )}

          {/* Admin Panel View */}
          {activeTab === 'admin_panel' && (
            <AdminPanel
              currentUser={currentUser}
              shelters={shelters}
              pendingModeration={pendingModeration}
              auditLogs={auditLogs}
              onUpdateShelterStatus={handleUpdateShelterStatus}
              onReviewModerationItem={handleReviewModerationItem}
              onSwitchAdminRole={handleSwitchAdminRole}
            />
          )}
        </FeatureErrorBoundary>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenPrivacyModal={() => setShowPrivacyModal(true)}
        onNavigate={tab => setActiveTab(tab)}
      />

      {/* MODAL 1: Shelter Profile Modal */}
      {viewingShelter && (
        <ShelterProfileModal
          shelter={viewingShelter}
          onClose={() => setViewingShelter(null)}
          onSelectGift={shelter => {
            setViewingShelter(null);
            handleQuickGift(shelter);
          }}
        />
      )}

      {/* MODAL 2: Step-by-Step Checkout Modal */}
      {checkoutTarget && (
        <CheckoutModal
          gift={checkoutTarget.gift}
          shelter={checkoutTarget.shelter}
          shelters={shelters}
          currentUser={currentUser}
          familyMembers={familyMembers}
          onClose={() => setCheckoutTarget(null)}
          onProcessPayment={handleProcessOrderPayment}
          onOrderCompleted={_order => {
            refreshData();
          }}
        />
      )}

      {/* MODAL 3: Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal
          authService={appContainer.adminAuthService}
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={user => {
            setCurrentUser(user);
            setActiveTab('admin_panel');
          }}
        />
      )}

      {/* MODAL 4: Role Switcher Modal */}
      {showRoleSwitcher && (
        <RoleSwitcherModal
          currentUser={currentUser}
          onClose={() => setShowRoleSwitcher(false)}
          onSelectRole={handleSelectRole}
        />
      )}

      {/* MODAL 5: Privacy & Delete My Data Modal */}
      {showPrivacyModal && (
        <PrivacyModal
          onClose={() => setShowPrivacyModal(false)}
          onDeleteMyData={handleDeleteMyData}
        />
      )}
    </div>
  );
}
