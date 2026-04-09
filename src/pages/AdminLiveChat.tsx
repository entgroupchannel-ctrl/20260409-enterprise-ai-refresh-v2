import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Headphones, Loader2 } from "lucide-react";

const AdminLiveChatComponent = lazy(() => import("@/components/AdminLiveChat"));

const AdminLiveChatPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <Headphones size={18} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">Live Chat</h1>
          </div>
        </div>
      </div>

      {/* Chat Component - Full Height */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="text-center py-12 text-muted-foreground text-sm">กำลังโหลด...</div>}>
          <AdminLiveChatComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default AdminLiveChatPage;
