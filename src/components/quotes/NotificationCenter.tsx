import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority: "urgent" | "high" | "normal";
  action_url: string | null;
  action_label: string | null;
  link_type: string | null;
  link_id: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

const NotificationCenter = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      const items = (data as Notification[]) || [];
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.read && !n.read_at).length);
    } catch (e) {
      console.error("Failed to load notifications:", e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await (supabase as any)
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await (supabase as any)
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("read", false);

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  };

  const handleAction = (n: Notification) => {
    if (!n.read) markAsRead(n.id);
    if (n.action_url) navigate(n.action_url);
  };

  const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "เมื่อสักครู่";
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} วันที่แล้ว`;
    return new Date(iso).toLocaleDateString("th-TH");
  };

  const grouped = {
    urgent: notifications.filter((n) => n.priority === "urgent"),
    high: notifications.filter((n) => n.priority === "high"),
    normal: notifications.filter((n) => n.priority === "normal"),
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">การแจ้งเตือน</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} รายการใหม่` : "ไม่มีรายการใหม่"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              อ่านทั้งหมด
            </Button>
          )}
        </div>

        <div className="max-h-[480px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">กำลังโหลด...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              ไม่มีการแจ้งเตือน
            </div>
          ) : (
            (["urgent", "high", "normal"] as const).map((priority) => {
              const items = grouped[priority];
              if (items.length === 0) return null;

              const labels: Record<string, string> = {
                urgent: "🔴 ด่วน",
                high: "🟡 สำคัญ",
                normal: "🟢 ทั่วไป",
              };
              const bgColors: Record<string, string> = {
                urgent: "bg-destructive/10 text-destructive",
                high: "bg-orange-100 text-orange-700",
                normal: "bg-secondary text-muted-foreground",
              };

              return (
                <div key={priority} className="border-b border-border last:border-0">
                  <div className={cn("p-2 text-xs font-medium", bgColors[priority])}>
                    {labels[priority]} ({items.length})
                  </div>
                  {items.map((n) => {
                    const isUnread = !n.read && !n.read_at;
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "p-3 border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors",
                          isUnread && "bg-primary/5"
                        )}
                        onClick={() => handleAction(n)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">{n.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {n.message}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1">
                              {formatRelative(n.created_at)}
                            </div>
                          </div>
                          {isUnread && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                          )}
                        </div>
                        {n.action_label && (
                          <Button size="sm" variant="link" className="p-0 h-auto text-xs mt-1">
                            {n.action_label} →
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
