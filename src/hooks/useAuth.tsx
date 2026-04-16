import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import type { UserRole } from '@/types/auth';
import * as perms from '@/lib/permissions';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string; // UserRole but keep string for backward compat
  phone: string | null;
  company: string | null;
  is_active: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data as unknown as UserProfile);
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } else {
      // Fallback: create profile from auth metadata if trigger didn't fire
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const meta = authUser.user_metadata || {};
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: meta.full_name || '',
          phone: meta.phone || null,
          company: meta.company || null,
          role: 'member',
          is_active: true,
        };
        const { error: insertErr } = await supabase.from('users').insert(newProfile);
        if (!insertErr) {
          setProfile(newProfile as UserProfile);
        }
      }
    }

    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    // Redirect based on role
    const staffRoles = ['super_admin', 'admin', 'sales', 'accountant', 'warehouse', 'viewer'];
    if (userData?.role && staffRoles.includes(userData.role)) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }

    return data;
  };

  const signUp = async (
    email: string,
    password: string,
    full_name: string,
    phone?: string,
    company?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone: phone || null,
          company: company || null,
        },
      },
    });

    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  const permCtx = { role: profile?.role, isActive: profile?.is_active };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    
    // Legacy role checks (keep for backward compat)
    isAdmin: profile?.role === 'admin' || profile?.role === 'super_admin',
    isSales: profile?.role === 'sales',
    isMember: profile?.role === 'member',
    
    // NEW: Specific role checks
    isSuperAdmin: profile?.role === 'super_admin',
    isAccountant: profile?.role === 'accountant',
    isWarehouse: profile?.role === 'warehouse',
    isViewer: profile?.role === 'viewer',
    isStaff: perms.isStaff(permCtx),
    
    // NEW: Module access (read)
    canAccessBilling: perms.canAccessBilling(permCtx),
    canAccessInventory: perms.canAccessInventory(permCtx),
    canAccessReports: perms.canAccessReports(permCtx),
    canAccessSettings: perms.canAccessSettings(permCtx),
    
    // NEW: Module management (write)
    canManageQuotes: perms.canManageQuotes(permCtx),
    canManageInvoices: perms.canManageInvoices(permCtx),
    canManageTaxInvoices: perms.canManageTaxInvoices(permCtx),
    canManageReceipts: perms.canManageReceipts(permCtx),
    canManageProducts: perms.canManageProducts(permCtx),
    canManageContacts: perms.canManageContacts(permCtx),
    
    // NEW: Admin-only actions
    canDeleteRecords: perms.canDeleteRecords(permCtx),
    canAccessTrash: perms.canAccessTrash(permCtx),
    canEmptyTrash: perms.canEmptyTrash(permCtx),
    canManagePermissions: perms.canManagePermissions(permCtx),
    canManageCompanySettings: perms.canManageCompanySettings(permCtx),
  };
};
