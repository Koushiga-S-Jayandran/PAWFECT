/**
 * Membership Plans Configuration & Strategy Registry
 * Note: Pricing is not final. All prices and discounts are configurable examples.
 * Every UI element displaying these prices MUST display a visible "Example" badge.
 */

import type { MembershipPlanConfig, BillingCycle } from '../domain/types';

export interface MembershipBenefitStrategy {
  hasReminderAutomation(planId: string): boolean;
  getAllowedCertificateThemes(planId: string): string[];
  hasMemberBadge(planId: string): boolean;
  hasEarlyBatchAccess(planId: string): boolean;
  hasQuarterlyImpactReport(planId: string): boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlanConfig[] = [
  {
    id: 'plan_guardian_monthly',
    name: 'Paw Guardian',
    badgeTitle: 'Guardian',
    tagline: 'Sponsor daily bowls and keep shelter pantries stocked reliably.',
    monthlyPaise: 49900, // ₹499/mo (Example)
    yearlyPaise: 499000, // ₹4,990/yr (2 months free example)
    discountPercentYearly: 16,
    isPopular: false,
    benefits: [
      { id: 'b1', title: 'Automated Giving Reminders', description: 'Smart SMS & WhatsApp alerts 7 days & 1 day before family milestones.' },
      { id: 'b2', title: 'Guardian Member Badge', description: 'Warm bronze paw badge on community batches and leaderboards.' },
      { id: 'b3', title: 'Standard Certificate Themes', description: 'Unlock 3 pastel dedication certificate stationery designs.' },
      { id: 'b4', title: 'Shelter Thank-You Wall', description: 'Your family name listed on verified shelter support records.' },
    ],
  },
  {
    id: 'plan_champion_annual',
    name: 'Pack Champion',
    badgeTitle: 'Champion',
    tagline: 'Our most loved tier. Fuels rescue medical funds and emergency response.',
    monthlyPaise: 99900,  // ₹999/mo (Example)
    yearlyPaise: 999000,  // ₹9,990/yr (Example)
    discountPercentYearly: 17,
    isPopular: true,
    benefits: [
      { id: 'b1', title: 'All Guardian Benefits', description: 'Complete automated reminders and directory recognition.' },
      { id: 'b5', title: 'Early Access to Urgent Batches', description: '24-hour priority funding window for critical emergency rescue drives.' },
      { id: 'b6', title: 'All Premium Certificate Themes', description: 'Full access to 8 handcrafted watercolor stationery certificate themes.' },
      { id: 'b7', title: 'Quarterly Verified Impact Report', description: 'Personalised digital photo booklet of every shelter you touched.' },
      { id: 'b8', title: 'Champion Gold Member Badge', description: 'Shining rose gold paw mark on your profile and public certificates.' },
    ],
  },
  {
    id: 'plan_patron_annual',
    name: 'Patron of Paws',
    badgeTitle: 'Patron',
    tagline: 'Transformational support for senior dogs, paralysis carts, and lifetime care.',
    monthlyPaise: 249900,  // ₹2,499/mo (Example)
    yearlyPaise: 2499000, // ₹24,990/yr (Example)
    discountPercentYearly: 17,
    isPopular: false,
    benefits: [
      { id: 'b9', title: 'All Pack Champion Benefits', description: 'Full early access, high-res certificates, and priority alerts.' },
      { id: 'b10', title: 'Direct Shelter Video Greetings', description: 'Quarterly video update from shelter founders mentioning your dedication.' },
      { id: 'b11', title: 'Physical Handmade Plaque Option', description: 'Handcrafted wooden paw certificate shipped to your Indian address.' },
      { id: 'b12', title: 'VIP Shelter Liaison', description: 'Dedicated WhatsApp point-of-contact for shelter visits and rescue coordination.' },
    ],
  },
];

class DefaultMembershipBenefitStrategy implements MembershipBenefitStrategy {
  hasReminderAutomation(_planId: string): boolean {
    return true; // All members have automation
  }

  getAllowedCertificateThemes(planId: string): string[] {
    if (planId === 'plan_patron_annual' || planId === 'plan_champion_annual') {
      return ['classic_rose', 'botanical_cream', 'celebration_confetti', 'memorial_peace', 'festive_marigold', 'indie_love'];
    }
    return ['classic_rose', 'botanical_cream', 'memorial_peace'];
  }

  hasMemberBadge(_planId: string): boolean {
    return true;
  }

  hasEarlyBatchAccess(planId: string): boolean {
    return planId === 'plan_champion_annual' || planId === 'plan_patron_annual';
  }

  hasQuarterlyImpactReport(planId: string): boolean {
    return planId === 'plan_champion_annual' || planId === 'plan_patron_annual';
  }
}

export const membershipBenefitStrategy: MembershipBenefitStrategy = new DefaultMembershipBenefitStrategy();

export function getPlanConfig(planId: string): MembershipPlanConfig | undefined {
  return MEMBERSHIP_PLANS.find(p => p.id === planId);
}

export function calculatePlanPrice(plan: MembershipPlanConfig, cycle: BillingCycle): number {
  return cycle === 'monthly' ? plan.monthlyPaise : plan.yearlyPaise;
}
