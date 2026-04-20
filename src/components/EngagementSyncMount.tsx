import { useEngagementSync } from '@/hooks/useEngagementTracking';

/**
 * Mount-only component that runs the wishlist sync hook.
 * Placed inside <BrowserRouter> so useAuth (which uses useNavigate) works.
 */
const EngagementSyncMount = () => {
  useEngagementSync();
  return null;
};

export default EngagementSyncMount;
