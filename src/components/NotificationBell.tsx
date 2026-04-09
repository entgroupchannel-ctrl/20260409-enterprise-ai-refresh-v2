import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, AlertCircle, UserPlus, Clock, AlertTriangle, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link_type: string | null;
  link_id: string | null;
  metadata: any;
  read_at: string | null;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string }> = {
  contact_assigned:       { icon: UserPlus,      color: "text-blue-500" },
  contact_followup_due:   { icon: Clock,         color: "text-cyan-500" },
  contact_sla_warning:    { icon: AlertCircle,   color: "text-orange-500" },
  contact_sla_breached:   { icon: AlertTriangle, color: "text-red-500" },
  contact_status_change:  { icon: FileText,      color: "text-purple-500" },
  quote_assigned:         { icon: FileText,      color: "text-blue-500" },
  quote_status_change:    { icon: FileText,      color: "text-purple-500" },
  quote_approved:         { icon: Check,         color: "text-green-500" },
  order_created:          { icon: FileText,      color: "text-green-500" },
  payment_received:       { icon: Check,         color: "text-green-500" },
  system:                 { icon: Bell,          color: "text-muted-foreground" },
};

const fmtRelative = (s: string) => {
  const diff = Date.now() - new Date(s).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "เมื่อสักครู่";
  if (mins < 60) return `${mins} นาที`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ชม.`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} วัน`;
  return new Date(s).toLocaleDateString("th-TH");
};

interface NotificationBellProps {
  onNavigate?: (linkType: string, linkId: string) => void;
}

const NotificationBell = ({ onNavigate }: NotificationBellProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<number | null>(null);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.rpc("get_unread_notification_count");
      if (typeof data === "number") setUnreadCount(data);
    } catch {
      // ignore
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await (supabase.from as any)("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications((data || []) as Notification[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase.rpc("mark_notifications_read", { _ids: [id] });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await supabase.rpc("mark_notifications_read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const handleClick = (n: Notification) => {
    if (!n.read_at) markAsRead(n.id);
    if (n.link_type && n.link_id && onNavigate) {
      onNavigate(n.link_type, n.link_id);
      setOpen(false);
    }
  };

  // Initial load + polling every 60 sec
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    pollingRef.current = window.setInterval(fetchUnreadCount, 60000);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
  }, [user?.id]);

  // Fetch full list when dropdown opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] bg-card border border-border rounded-xl shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bell size={14} /> การแจ้งเตือน
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground font-bold">
                  {unreadCount}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-primary hover:underline px-2 py-1"
                >
                  อ่านทั้งหมด
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-xs text-muted-foreground">กำลังโหลด...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <Bell size={20} className="mx-auto mb-2 opacity-30" />
                ยังไม่มีการแจ้งเตือน
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = cfg.icon;
                const isUnread = !n.read_at;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent/50 transition-colors flex gap-2.5 ${
                      isUnread ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`shrink-0 mt-0.5 ${cfg.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${isUnread ? "font-bold text-foreground" : "text-foreground/80"}`}>
                          {n.title}
                        </p>
                        {isUnread && (
                          <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-primary"></span>
                        )}
                      </div>
                      {n.message && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      )}
                      <p className="text-[9px] text-muted-foreground/60 mt-1">
                        {fmtRelative(n.created_at)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
