/**
 * Admin and User Roles Configuration and Capabilities Matrix
 */

import type { AdminRole, UserRole } from '../domain/types';

export interface RoleCapability {
  canApproveShelters: boolean;
  canSuspendShelters: boolean;
  canModerateContent: boolean;
  canViewFinancials: boolean;
  canManageMemberships: boolean;
  canViewAuditLogs: boolean;
}

export const ADMIN_ROLE_CAPABILITIES: Record<AdminRole, RoleCapability> = {
  'Super Admin': {
    canApproveShelters: true,
    canSuspendShelters: true,
    canModerateContent: true,
    canViewFinancials: true,
    canManageMemberships: true,
    canViewAuditLogs: true,
  },
  'Verification': {
    canApproveShelters: true,
    canSuspendShelters: true,
    canModerateContent: true,
    canViewFinancials: false,
    canManageMemberships: false,
    canViewAuditLogs: true,
  },
  'Support': {
    canApproveShelters: false,
    canSuspendShelters: false,
    canModerateContent: true,
    canViewFinancials: false,
    canManageMemberships: true,
    canViewAuditLogs: true,
  },
  'Finance': {
    canApproveShelters: false,
    canSuspendShelters: false,
    canModerateContent: false,
    canViewFinancials: true,
    canManageMemberships: true,
    canViewAuditLogs: true,
  },
};

export const COLLAR_COLORS = [
  { id: 'rose', name: 'Pawfect Rose', hex: '#E27AA1' },
  { id: 'berry', name: 'Dark Berry', hex: '#B0285F' },
  { id: 'sunshine', name: 'Marigold Yellow', hex: '#E6A23C' },
  { id: 'sage', name: 'Sage Green', hex: '#4E8752' },
  { id: 'sky', name: 'Monsoon Blue', hex: '#4A90E2' },
  { id: 'lavender', name: 'Soft Lavender', hex: '#8E7CC3' },
  { id: 'terracotta', name: 'Terracotta Red', hex: '#C2593F' },
  { id: 'cocoa', name: 'Warm Cocoa', hex: '#634832' },
];

export const CERTIFICATE_THEMES = [
  { id: 'classic_rose', name: 'Classic Rose & Cream', primaryColor: '#B0285F', bgColor: '#FFF8F6' },
  { id: 'botanical_cream', name: 'Olive Botanical', primaryColor: '#3F7A59', bgColor: '#F6FAF7' },
  { id: 'celebration_confetti', name: 'Festive Celebration', primaryColor: '#B86B1E', bgColor: '#FFF9F0' },
  { id: 'memorial_peace', name: 'Rainbow Memorial', primaryColor: '#6B5280', bgColor: '#F9F6FC' },
  { id: 'indie_love', name: 'Desi Paws Hand-Pressed', primaryColor: '#8C3D29', bgColor: '#FDF7F4' },
];
