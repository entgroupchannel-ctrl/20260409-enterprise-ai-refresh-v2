import { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContext {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext>({
  user: null, session: null, isAdmin: false, isSuperAdmin: false, loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const initDoneRef = useRef(false);
  const checkingRolesRef = useRef(false);

  const checkRoles = useCallback(async (userId: string) => {
    if (checkingRolesRef.current) return;
    checkingRolesRef.current = true;
    try {
      const [adminRes, superRes] = await Promise.all([
        supabase.rpc("is_admin", { _user_id: userId }).then(
          (r) => r,
          () => ({ data: null })
        ),
        supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" }).then(
          (r) => r,
          () => ({ data: null })
        ),
      ]);
      if (adminRes.data !== null) setIsAdmin(adminRes.data === true);
      if (superRes.data !== null) setIsSuperAdmin(superRes.data === true);
    } catch {
      // On error preserve existing state - don't reset to false
    }
    checkingRolesRef.current = false;
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkRoles(session.user.id);
        }
      } catch (e) {
        console.error("useAuth init error:", e);
      } finally {
        if (mounted) {
          initDoneRef.current = true;
          setLoading(false);
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      if (!initDoneRef.current) return;

      const newUserId = newSession?.user?.id ?? null;

      // CRITICAL FIX: On TOKEN_REFRESHED, preserve session reference if user is the same.
      // Updating session ref on every token refresh causes downstream re-render cascades.
      if (event === "TOKEN_REFRESHED") {
        setSession((prev) => {
          const prevId = prev?.user?.id ?? null;
          if (prevId === newUserId) {
            // Same user — keep the same session reference to prevent re-renders
            return prev;
          }
          return newSession;
        });
        // No role re-check on token refresh
        return;
      }

      // For SIGNED_IN, SIGNED_OUT, USER_UPDATED — actually update session
      setSession(newSession);

      // Only update user state if user.id actually changed
      setUser((prev) => {
        const prevId = prev?.id ?? null;
        if (prevId === newUserId) {
          return prev;
        }
        return newSession?.user ?? null;
      });

      if (event === "SIGNED_OUT") {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return;
      }

      if (newSession?.user) {
        if (event === "SIGNED_IN") {
          await checkRoles(newSession.user.id);
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkRoles]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
    window.location.replace(window.location.origin + "/admin-login");
  }, []);

  // CRITICAL FIX: Memoize context value to prevent creating new object on every render.
  // Without this, ALL consumers of useAuth() re-render whenever AuthProvider re-renders,
  // even if all the values are unchanged.
  const contextValue = useMemo<AuthContext>(
    () => ({ user, session, isAdmin, isSuperAdmin, loading, signOut }),
    [user, session, isAdmin, isSuperAdmin, loading, signOut]
  );

  return (
    <AuthCtx.Provider value={contextValue}>
      {children}
    </AuthCtx.Provider>
  );
};
