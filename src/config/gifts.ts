/**
 * Standard Gift Catalog for Pawfect Giving Marketplace
 * Prices in integer paise (e.g. ₹250 = 25000 paise).
 * Open/Closed: extensible via new item registration.
 */

import type { Gift } from '../domain/types';

export const GIFTS_CATALOG: Gift[] = [
  {
    id: 'gift_feed_5_dogs',
    title: 'Feed 5 Indie Dogs for a Day',
    category: 'meal',
    description: 'Provides 5 warm nutritious rice, broth, and chicken/egg bowls for street and shelter rescues.',
    amountInPaise: 25000, // ₹250
    iconName: 'Bowl',
    unitLabel: '5 dog meals',
    urgencyTag: 'Daily Essential',
    impactDescription: '5 bowls of nutritious fresh food served hot at noon.',
    mealsEquivalent: 5,
  },
  {
    id: 'gift_feed_20_dogs',
    title: 'Feed 20 Dogs for a Day',
    category: 'meal',
    description: 'Fills the lunch bowls of an entire shelter recovery ward with balanced proteins and vitamins.',
    amountInPaise: 95000, // ₹950
    iconName: 'Utensils',
    unitLabel: '20 dog meals',
    urgencyTag: 'Most Popular',
    impactDescription: 'Feeds 20 recovering rescues for a full day.',
    mealsEquivalent: 20,
  },
  {
    id: 'gift_feed_50_dogs',
    title: 'Feed 50 Dogs for a Day',
    category: 'meal',
    description: 'A generous feast covering breakfast and supper for 50 dogs across the recovery wards.',
    amountInPaise: 220000, // ₹2,200
    iconName: 'Sparkles',
    unitLabel: '50 dog meals',
    urgencyTag: 'Community Favorite',
    impactDescription: 'Supports half a shelter facility pantry for 24 hours.',
    mealsEquivalent: 50,
  },
  {
    id: 'gift_feed_shelter_100',
    title: 'Grand Shelter Feast (100 Dogs)',
    category: 'meal',
    description: 'Full facility sponsorship covering 100 shelter residents with wholesome nutrition.',
    amountInPaise: 420000, // ₹4,200
    iconName: 'HeartHandshake',
    unitLabel: '100 dog meals',
    urgencyTag: 'Milestone Gift',
    impactDescription: '100 happy bellies; full shelter photo proof included.',
    mealsEquivalent: 100,
  },
  {
    id: 'gift_feed_10_cats',
    title: 'Feed 10 Rescued Cats & Kittens',
    category: 'meal',
    description: 'High-protein wet and dry cat food tailored for vulnerable neonatal kittens and nursing queens.',
    amountInPaise: 45000, // ₹450
    iconName: 'Cat',
    unitLabel: '10 cat meals',
    urgencyTag: 'Kitten Season',
    impactDescription: 'Nutrient-rich kitten mousse and cat meals for 10 felines.',
    mealsEquivalent: 10,
  },
  {
    id: 'gift_feed_cow_calf',
    title: 'Green Fodder & Feed for Rescued Calves',
    category: 'meal',
    description: 'Fresh alfalfa grass, bran mash, and mineral supplements for rescued cows and young calves.',
    amountInPaise: 65000, // ₹650
    iconName: 'Wheat',
    unitLabel: 'Fodder bale & mash',
    impactDescription: 'Supplies green fodder for 3 rescued dairy survivors.',
    mealsEquivalent: 15,
  },
  {
    id: 'gift_vaccinate_1_puppy',
    title: 'Vaccinate 1 Rescued Puppy (DHPPi + Rabies)',
    category: 'medical',
    description: 'Essential 9-in-1 vaccination dose protecting an indie pup against Parvovirus, Distemper, and Rabies.',
    amountInPaise: 50000, // ₹500
    iconName: 'Syringe',
    unitLabel: '1 puppy full dose',
    urgencyTag: 'Life Saving',
    impactDescription: 'Permanent disease immunity certificate logged in health card.',
    mealsEquivalent: 8,
  },
  {
    id: 'gift_vaccinate_5_puppies',
    title: 'Vaccinate a Litter of 5 Puppies',
    category: 'medical',
    description: 'Full course immunization pack shielding an entire rescued litter from deadly monsoon outbreaks.',
    amountInPaise: 240000, // ₹2,400
    iconName: 'ShieldCheck',
    unitLabel: '5 puppy immunizations',
    urgencyTag: 'High Priority',
    impactDescription: 'Safeguards all 5 siblings through adoption readiness.',
    mealsEquivalent: 40,
  },
  {
    id: 'gift_deworming_pack',
    title: 'Comprehensive Deworming & Tick Treatment (15 Dogs)',
    category: 'medical',
    description: 'Broad-spectrum deworming oral pastes and spot-on anti-tick drops for 15 newly admitted strays.',
    amountInPaise: 75000, // ₹750
    iconName: 'ShieldPlus',
    unitLabel: '15 treatments',
    impactDescription: 'Eradicates parasites and relieves severe itch/anemia.',
    mealsEquivalent: 12,
  },
  {
    id: 'gift_wound_maggot_care',
    title: 'Emergency Maggot Wound & Antiseptic Kit',
    category: 'medical',
    description: 'Sterile surgical gauze, Lorexane spray, betadine, bandages, and analgesics for trauma rescue.',
    amountInPaise: 110000, // ₹1,100
    iconName: 'Bandage',
    unitLabel: '1 trauma trauma kit',
    urgencyTag: 'Emergency Need',
    impactDescription: 'Treats severe road-accident lacerations and rescues dogs from sepsis.',
    mealsEquivalent: 18,
  },
  {
    id: 'gift_senior_dog_arthritis',
    title: 'Senior Dog Mobility & Arthritis Relief Pack',
    category: 'medical',
    description: 'Glucosamine-chondroitin chews, pain-relief anti-inflammatory meds, and orthopaedic bedding fleece.',
    amountInPaise: 160000, // ₹1,600
    iconName: 'Activity',
    unitLabel: '1 monthly senior pack',
    urgencyTag: 'Senior Care',
    impactDescription: 'Enables an elderly dog to stand and walk without chronic joint ache.',
    mealsEquivalent: 22,
  },
  {
    id: 'gift_paralysis_cart_wheelchair',
    title: 'Custom Two-Wheel Cart for Paralyzed Dog',
    category: 'sponsorship',
    description: 'Lightweight aluminium mobility wheels measured and custom-built for a spine-injured rescue dog.',
    amountInPaise: 480000, // ₹4,800
    iconName: 'Navigation',
    unitLabel: '1 mobility cart',
    urgencyTag: 'Life Transforming',
    impactDescription: 'Gives a disabled rescue dog back the thrill of running outdoors.',
    mealsEquivalent: 60,
  },
  {
    id: 'gift_name_sponsor_dog_month',
    title: 'Sponsor & Name a Shelter Dog for 1 Month',
    category: 'sponsorship',
    description: 'Name an unsponsored shelter resident, choose their collar colour, and fund their monthly upkeep.',
    amountInPaise: 300000, // ₹3,000
    iconName: 'Tag',
    unitLabel: '1 month sponsorship',
    urgencyTag: 'Named Certificate',
    impactDescription: 'You give them an identity and full care; shelter video update provided.',
    mealsEquivalent: 50,
  },
  {
    id: 'gift_cozy_blanket_bed',
    title: 'Winter Warmth: 4 Thermal Fleece Mats & Beds',
    category: 'comfort',
    description: 'Washable high-density thermal fleece bedding to keep fragile puppies and seniors off cold concrete.',
    amountInPaise: 80000, // ₹800
    iconName: 'Moon',
    unitLabel: '4 thermal mats',
    impactDescription: 'Warm, dry sanctuary during chilly winter or heavy rain.',
    mealsEquivalent: 14,
  },
  {
    id: 'gift_puppy_milk_formula',
    title: 'Mother-Replacer Puppy Milk Formula (2 Tins)',
    category: 'meal',
    description: 'Specialised Royal Canin/Beaphar puppy milk formula for orphaned neonates fed via silicone dropper.',
    amountInPaise: 180000, // ₹1,800
    iconName: 'Milk',
    unitLabel: '2 formula tins',
    urgencyTag: 'Neonatal Urgent',
    impactDescription: 'Saves maternal-deprived newborn puppies under 3 weeks old.',
    mealsEquivalent: 25,
  },
  {
    id: 'gift_distemper_serum',
    title: 'Distemper Canine Hyperimmune Serum Dose',
    category: 'medical',
    description: 'Critical immunoglobulin dose giving a fighting chance against neurological canine distemper.',
    amountInPaise: 350000, // ₹3,500
    iconName: 'Zap',
    unitLabel: '1 serum vial course',
    urgencyTag: 'ICU Critical',
    impactDescription: 'Direct antibody infusion for puppies in isolation ward.',
    mealsEquivalent: 45,
  },
  {
    id: 'gift_neuter_spay_surgery',
    title: 'ABC Spay/Neuter Surgery & Post-Op Recovery',
    category: 'medical',
    description: 'Humane surgical sterilization, anti-rabies vaccination, and 4-day recovery boarding with food.',
    amountInPaise: 195000, // ₹1,950
    iconName: 'CheckCircle2',
    unitLabel: '1 ABC surgery',
    impactDescription: 'Prevents homelessness for generations while improving stray health.',
    mealsEquivalent: 30,
  },
  {
    id: 'gift_clean_water_trough',
    title: 'Stainless Steel Fresh Water Station',
    category: 'comfort',
    description: 'Durable, rust-proof 20-litre water dispenser installed in the shelter play compound.',
    amountInPaise: 125000, // ₹1,250
    iconName: 'Droplet',
    unitLabel: '1 steel trough',
    impactDescription: 'Provides clean hydration 24/7 for 30+ pack residents.',
    mealsEquivalent: 15,
  },
  {
    id: 'gift_chew_toys_enrichment',
    title: 'Shelter Mental Enrichment & Chew Toy Box',
    category: 'comfort',
    description: 'Durable rubber chew toys, rope tugs, and puzzle licks to reduce shelter kennel stress and pacing.',
    amountInPaise: 60000, // ₹600
    iconName: 'Smile',
    unitLabel: '1 toy pack',
    impactDescription: 'Brings genuine playtime joy to shelter recovery yards.',
    mealsEquivalent: 10,
  },
  {
    id: 'gift_emergency_fuel_ambulance',
    title: 'Animal Rescue Ambulance Fuel & Tolls',
    category: 'medical',
    description: 'Funds 100km of rescue travel to dispatch emergency ambulance teams for stranded accident cases.',
    amountInPaise: 150000, // ₹1,500
    iconName: 'Truck',
    unitLabel: '100km ambulance run',
    urgencyTag: 'First Responder',
    impactDescription: 'Ensures the rescue van never stalls when an emergency SOS call rings.',
    mealsEquivalent: 20,
  },
];
