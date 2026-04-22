import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  // Legacy props (backward compat)
  requireAdmin?: boolean;
  requireSales?: boolean;
  requireSuperAdmin?: boolean;
  // NEW: Granular role gates
  allowedRoles?: UserRole[];
  // NEW: Redirect path on denial
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSales = false,
  requireSuperAdmin = false,
  allowedRoles,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!requireSuperAdmin || !user) {
      setIsSuperAdmin(null);
      return;
    }
    const check = async () => {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      // Phase 6.0: super_admin is its own role now
      setIsSuperAdmin(data?.role === 'super_admin' || data?.role === 'admin');
    };
    check();
  }, [user, requireSuperAdmin]);

  // Loading state
  if (loading || (requireSuperAdmin && isSuperAdmin === null && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Not logged in — preserve intended destination so we can return after login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check user is active
  if (profile && profile.is_active === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // NEW: allowedRoles check (granular gates)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = profile?.role || '';
    if (!allowedRoles.includes(userRole as UserRole)) {
      return <Navigate to={redirectTo} replace />;
    }
    // If allowedRoles passed, skip legacy checks
    return <>{children}</>;
  }

  // Legacy: requireAdmin
  if (requireAdmin && profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return <Navigate to={redirectTo} replace />;
  }

  // Legacy: requireSales (admin or sales)
  if (requireSales && 
      profile?.role !== 'admin' && 
      profile?.role !== 'super_admin' &&
      profile?.role !== 'sales') {
    return <Navigate to={redirectTo} replace />;
  }

  // Legacy: requireSuperAdmin
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
