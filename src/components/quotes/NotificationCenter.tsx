import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: "urgent" | "high" | "normal";
  action_url: string;
  action_label: string;
  read: boolean;
  created_at: string;
}

const NotificationCenter = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [userId]);

  const loadNotifications = async () => {
    const { data } = await (supabase.from as any)("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifications(data || []);
    setUnreadCount(data?.filter((n: Notification) => !n.read).length || 0);
  };

  const markAsRead = async (id: string) => {
    await (supabase.from as any)("notifications").update({ read: true, read_at: new Date().toISOString() }).eq("id", id);
    loadNotifications();
  };

  const handleAction = (n: Notification) => {
    markAsRead(n.id);
    if (n.action_url) navigate(n.action_url);
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
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0" variant="destructive">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">การแจ้งเตือน</h3>
          <p className="text-sm text-muted-foreground">{unreadCount} รายการใหม่</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {(["urgent", "high", "normal"] as const).map((priority) => {
            const items = grouped[priority];
            if (items.length === 0) return null;
            const labels = { urgent: "🔴 ด่วน", high: "🟡 สำคัญ", normal: "🟢 ทั่วไป" };
            const bgColors = { urgent: "bg-destructive/10 text-destructive", high: "bg-orange-100 text-orange-700", normal: "bg-secondary text-muted-foreground" };
            return (
              <div key={priority} className="border-b border-border last:border-0">
                <div className={cn("p-2 text-xs font-medium", bgColors[priority])}>
                  {labels[priority]} ({items.length})
                </div>
                {items.map((n) => (
                  <div
                    key={n.id}
                    className={cn("p-3 border-b border-border/50 hover:bg-secondary/50 cursor-pointer", !n.read && "bg-primary/5")}
                    onClick={() => handleAction(n)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">{n.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{n.message}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString("th-TH")}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1" />}
                    </div>
                    {n.action_label && (
                      <Button size="sm" variant="link" className="p-0 h-auto text-xs mt-1">{n.action_label} →</Button>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">ไม่มีการแจ้งเตือน</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
