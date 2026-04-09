import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function DebugTest() {
  const { user, loading: authLoading } = useAuth();
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastVisible, setLastVisible] = useState<Date | null>(null);

  // Simple query - just count quotes
  const { data: quoteCount, isLoading: quotesLoading, error } = useQuery({
    queryKey: ['quote-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      console.log('[DebugTest] Fetching quote count...');
      const { count, error } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('[DebugTest] Query error:', error);
        throw error;
      }
      
      console.log('[DebugTest] Quote count:', count);
      return count || 0;
    },
    enabled: !!user,
    staleTime: 30000,
  });

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[DebugTest] Tab hidden');
      } else {
        console.log('[DebugTest] Tab visible');
        setLastVisible(new Date());
        setTabSwitchCount(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading auth...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Please login first</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-foreground">🧪 Debug Test Page</h1>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Email:</span>
              <span className="font-mono text-foreground">{user.email}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-xs text-foreground">{user.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tab Switches:</span>
              <span className="font-bold text-foreground">{tabSwitchCount}</span>
            </div>
            
            {lastVisible && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Visible:</span>
                <span className="text-foreground">{lastVisible.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-foreground">Query Status</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auth Loading:</span>
              <span className={authLoading ? 'text-yellow-500' : 'text-green-500'}>
                {authLoading ? '⏳ Loading' : '✅ Ready'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quotes Loading:</span>
              <span className={quotesLoading ? 'text-yellow-500' : 'text-green-500'}>
                {quotesLoading ? '⏳ Loading' : '✅ Ready'}
              </span>
            </div>
            
            {error && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Error:</span>
                <span className="text-red-500">❌ {String(error)}</span>
              </div>
            )}
            
            {!quotesLoading && !error && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quote Count:</span>
                <span className="font-bold text-foreground">{quoteCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2 text-foreground">📋 Test Instructions</h2>
          <ol className="text-sm space-y-2 list-decimal list-inside text-foreground">
            <li>Open DevTools Console (F12)</li>
            <li>Switch to another tab</li>
            <li>Wait 35 seconds</li>
            <li>Switch back to this tab</li>
            <li>Check if page still responds</li>
            <li>Check Console for errors</li>
          </ol>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2 text-foreground">✅ Success Criteria</h2>
          <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
            <li>Tab Switches counter increases</li>
            <li>Last Visible time updates</li>
            <li>Quote Count stays visible (not stuck loading)</li>
            <li>No errors in Console</li>
          </ul>
        </div>

        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-2 text-foreground">❌ Failure Signs</h2>
          <ul className="text-sm space-y-1 list-disc list-inside text-foreground">
            <li>Page frozen (can't click anything)</li>
            <li>Tab Switches counter doesn't increase</li>
            <li>Quote Count stuck on "⏳ Loading"</li>
            <li>Console shows errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
