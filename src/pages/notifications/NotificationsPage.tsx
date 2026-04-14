import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell, ArrowLeft, CheckCheck, Search, Loader2, ExternalLink,
  Clock, Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  priority: "urgent" | "high" | "normal";
  action_url: string | null;
  action_label: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

type FilterTab = "all" | "unread" | "urgent";

const PRIORITY_BADGE: Record<string, string> = {
  urgent: "bg-red-50 text-red-700 border-red-300",
  high: "bg-orange-50 text-orange-700 border-orange-300",
  normal: "bg-gray-50 text-gray-700 border-gray-300",
};

const PRIORITY_LABEL: Record<string, string> = {
  urgent: "🔴 ด่วน",
  high: "🟡 สำคัญ",
  normal: "🟢 ทั่วไป",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications-page:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setNotifications((data as Notification[]) || []);
    } catch (e: any) {
      toast({
        title: "โหลดการแจ้งเตือนไม่สำเร็จ",
        description: e.message,
        variant: "destructive",
      });
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
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    setProcessing(true);
    try {
      const { error } = await (supabase as any)
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      toast({ title: "✅ ทำเครื่องหมายอ่านทั้งหมดแล้ว" });
    } catch (e: any) {
      toast({
        title: "ไม่สำเร็จ",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleClick = (n: Notification) => {
    if (!n.read && !n.read_at) markAsRead(n.id);
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
    return new Date(iso).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (iso: string) => {
    return new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter logic
  const filtered = notifications.filter((n) => {
    if (activeTab === "unread" && (n.read || n.read_at)) return false;
    if (activeTab === "urgent" && n.priority !== "urgent") return false;

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      return (
        n.title.toLowerCase().includes(s) ||
        (n.message || "").toLowerCase().includes(s)
      );
    }

    return true;
  });

  // Group by date
  const grouped = filtered.reduce((acc, n) => {
    const date = new Date(n.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let key: string;
    if (date >= today) key = "วันนี้";
    else if (date >= yesterday) key = "เมื่อวาน";
    else if (date >= weekAgo) key = "สัปดาห์นี้";
    else key = "เก่ากว่า";

    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ["วันนี้", "เมื่อวาน", "สัปดาห์นี้", "เก่ากว่า"];

  const unreadCount = notifications.filter((n) => !n.read && !n.read_at).length;
  const urgentCount = notifications.filter((n) => n.priority === "urgent").length;

  return (
    <>
      <SEOHead title="การแจ้งเตือน" description="ประวัติการแจ้งเตือนทั้งหมด" />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                กลับ
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary" />
                  การแจ้งเตือน
                </h1>
                <p className="text-xs text-muted-foreground">
                  รวม {notifications.length} รายการ • {unreadCount} ยังไม่อ่าน
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={processing}
              >
                <CheckCheck className="w-4 h-4 mr-1.5" />
                {processing ? "กำลังทำเครื่องหมาย..." : "อ่านทั้งหมด"}
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาการแจ้งเตือน..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all" className="gap-1.5">
                    ทั้งหมด
                    <Badge variant="secondary" className="ml-1">
                      {notifications.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="gap-1.5">
                    ยังไม่อ่าน
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="urgent" className="gap-1.5">
                    ด่วน
                    {urgentCount > 0 && (
                      <Badge variant="destructive" className="ml-1">
                        {urgentCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* List */}
          {loading ? (
            <Card>
              <CardContent className="py-16 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  {search ? "ไม่พบรายการที่ค้นหา" : "ไม่มีการแจ้งเตือน"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {groupOrder.map((groupKey) => {
                const items = grouped[groupKey];
                if (!items || items.length === 0) return null;

                return (
                  <div key={groupKey} className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pl-1">
                      {groupKey} ({items.length})
                    </h3>

                    <div className="space-y-2">
                      {items.map((n) => {
                        const isUnread = !n.read && !n.read_at;
                        return (
                          <Card
                            key={n.id}
                            className={cn(
                              "cursor-pointer hover:shadow-md transition-shadow",
                              isUnread && "border-primary/30 bg-primary/5"
                            )}
                            onClick={() => handleClick(n)}
                          >
                            <CardContent className="pt-4 pb-4">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-semibold text-sm">
                                      {n.title}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className={cn("text-[10px]", PRIORITY_BADGE[n.priority])}
                                    >
                                      {PRIORITY_LABEL[n.priority]}
                                    </Badge>
                                    {isUnread && (
                                      <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {n.message}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatRelative(n.created_at)}
                                    </span>
                                    <span className="text-[10px] hidden sm:inline">
                                      {formatFullDate(n.created_at)}
                                    </span>
                                  </div>
                                </div>

                                {n.action_label && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClick(n);
                                    }}
                                  >
                                    {n.action_label}
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
