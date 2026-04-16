// Phase 6.0: Client-side permission helpers
// Centralized logic — use throughout codebase instead of direct role checks

import type { UserRole } from '@/types/auth';

export interface PermissionContext {
  role: string | null | undefined;
  isActive?: boolean;
}

// =====================================================
// Basic role checks
// =====================================================

export const isSuperAdmin = (ctx: PermissionContext): boolean =>
  ctx.role === 'super_admin' && ctx.isActive !== false;

export const isAdminOrAbove = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin'].includes(ctx.role || '') && ctx.isActive !== false;

export const isSalesOrAbove = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales'].includes(ctx.role || '') && ctx.isActive !== false;

export const isStaff = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales', 'accountant', 'warehouse', 'viewer']
    .includes(ctx.role || '') && ctx.isActive !== false;

// =====================================================
// Module access (read)
// =====================================================

export const canAccessBilling = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales', 'accountant', 'viewer']
    .includes(ctx.role || '') && ctx.isActive !== false;

export const canAccessInventory = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales', 'warehouse', 'viewer']
    .includes(ctx.role || '') && ctx.isActive !== false;

export const canAccessReports = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales', 'accountant', 'warehouse', 'viewer']
    .includes(ctx.role || '') && ctx.isActive !== false;

export const canAccessSettings = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin'].includes(ctx.role || '') && ctx.isActive !== false;

// =====================================================
// Module management (write)
// =====================================================

export const canManageQuotes = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales'].includes(ctx.role || '') && ctx.isActive !== false;

export const canManageInvoices = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales', 'accountant'].includes(ctx.role || '') && ctx.isActive !== false;

export const canManageTaxInvoices = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'accountant'].includes(ctx.role || '') && ctx.isActive !== false;

export const canManageReceipts = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'accountant'].includes(ctx.role || '') && ctx.isActive !== false;

export const canManageProducts = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'warehouse'].includes(ctx.role || '') && ctx.isActive !== false;

export const canManageContacts = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin', 'sales'].includes(ctx.role || '') && ctx.isActive !== false;

// =====================================================
// Admin-only actions
// =====================================================

export const canDeleteRecords = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin'].includes(ctx.role || '') && ctx.isActive !== false;

export const canAccessTrash = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin'].includes(ctx.role || '') && ctx.isActive !== false;

export const canEmptyTrash = (ctx: PermissionContext): boolean =>
  ctx.role === 'super_admin' && ctx.isActive !== false;

export const canManagePermissions = (ctx: PermissionContext): boolean =>
  ctx.role === 'super_admin' && ctx.isActive !== false;

export const canManageCompanySettings = (ctx: PermissionContext): boolean =>
  ['super_admin', 'admin'].includes(ctx.role || '') && ctx.isActive !== false;

// =====================================================
// Helper: check against array
// =====================================================

export const hasAnyRole = (
  ctx: PermissionContext, 
  allowedRoles: UserRole[]
): boolean => {
  if (!ctx.role || ctx.isActive === false) return false;
  return allowedRoles.includes(ctx.role as UserRole);
};
