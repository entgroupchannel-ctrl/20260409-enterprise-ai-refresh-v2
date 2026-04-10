import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSales?: boolean;
  requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSales = false,
  requireSuperAdmin = false,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!requireSuperAdmin || !user) {
      setIsSuperAdmin(null);
      return;
    }
    const check = async () => {
      // Check if user has admin role in users table (super_admin is admin with extra permissions)
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      // For now, super_admin = admin role user (can be refined later with admin_permissions)
      setIsSuperAdmin(data?.role === 'admin');
    };
    check();
  }, [user, requireSuperAdmin]);

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireSales && profile?.role !== 'admin' && profile?.role !== 'sales') {
    return <Navigate to="/" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
