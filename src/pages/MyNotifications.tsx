import { useState, useEffect } from "react";
import {
  Bell, FileText, FolderOpen, Tag, Info, Wrench,
  CheckCheck, Loader2, Trash2, ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  quote_status: { icon: FileText, color: "text-purple-400" },
  document_ready: { icon: FolderOpen, color: "text-green-400" },
  promotion: { icon: Tag, color: "text-primary" },
  system: { icon: Info, color: "text-blue-400" },
  demo_status: { icon: Wrench, color: "text-orange-400" },
};

const MyNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await (supabase.from as any)("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setNotifications(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, [user]);

  // Realtime: auto-append new notifications
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("my-notifications-realtime")
      .on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          if (payload.new) {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAsRead = async (id: string) => {
    await (supabase.from as any)("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await (supabase.from as any)("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "อ่านทั้งหมดแล้ว" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatDate = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "เมื่อสักครู่";
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} วันที่แล้ว`;
    return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Bell size={20} className="text-primary" /> แจ้งเตือน
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <CheckCheck size={14} /> อ่านทั้งหมด
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="card-surface rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={32} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">ยังไม่มีแจ้งเตือน</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const config = typeConfig[n.type] || typeConfig.system;
              const Icon = config.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => { if (!n.read) markAsRead(n.id); }}
                  className={`flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer ${
                    n.read ? "opacity-60" : "bg-primary/[0.02] hover:bg-primary/5"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-primary/10"}`}>
                    <Icon size={14} className={n.read ? "text-muted-foreground" : config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{formatDate(n.created_at)}</p>
                  </div>
                  {n.link && (
                    <Link
                      to={n.link}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotifications;
