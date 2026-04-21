import { useEffect, useState } from "react";
import CustomerLayout from "@/layouts/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Lock, Loader2 } from "lucide-react";

interface NotificationEvent {
  event_key: string;
  display_name: string;
  description: string | null;
  category: string;
  is_critical: boolean;
  notify_customer_in_app: boolean;
  notify_customer_email: boolean;
}

interface PreferenceRow {
  event_key: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  quote: "ใบเสนอราคา",
  invoice: "ใบแจ้งหนี้",
  tax_invoice: "ใบกำกับภาษี",
  credit_note: "ใบลดหนี้",
  receipt: "ใบเสร็จรับเงิน",
  payment: "การชำระเงิน",
  po: "ใบสั่งซื้อ (PO)",
  so: "ใบสั่งขาย / การจัดส่ง",
  repair: "การแจ้งซ่อม",
  cart: "ตะกร้าสินค้า",
  affiliate: "Affiliate",
  partner: "Partner",
  contact: "ข้อความติดต่อ",
  auth: "บัญชีผู้ใช้",
};

export default function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [prefs, setPrefs] = useState<Record<string, PreferenceRow>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      // Only events the customer can opt out of (customer-facing channels enabled at registry)
      const { data: ev } = await (supabase as any)
        .from("notification_events")
        .select(
          "event_key, display_name, description, category, is_critical, notify_customer_in_app, notify_customer_email"
        )
        .eq("is_active", true)
        .or("notify_customer_in_app.eq.true,notify_customer_email.eq.true")
        .order("category")
        .order("event_key");

      const { data: pr } = await (supabase as any)
        .from("user_notification_preferences")
        .select("event_key, email_enabled, in_app_enabled")
        .eq("user_id", user.id);

      const map: Record<string, PreferenceRow> = {};
      (pr || []).forEach((p: PreferenceRow) => (map[p.event_key] = p));
      setEvents(ev || []);
      setPrefs(map);
      setLoading(false);
    })();
  }, [user]);

  const getPref = (eventKey: string, channel: "email" | "in_app"): boolean => {
    const p = prefs[eventKey];
    if (!p) return true; // default on
    return channel === "email" ? p.email_enabled : p.in_app_enabled;
  };

  const togglePref = async (
    eventKey: string,
    channel: "email" | "in_app",
    next: boolean
  ) => {
    if (!user) return;
    const key = `${eventKey}:${channel}`;
    setSaving(key);
    const current = prefs[eventKey] || {
      event_key: eventKey,
      email_enabled: true,
      in_app_enabled: true,
    };
    const updated: PreferenceRow = {
      ...current,
      [channel === "email" ? "email_enabled" : "in_app_enabled"]: next,
    };
    setPrefs((m) => ({ ...m, [eventKey]: updated }));
    const { error } = await (supabase as any)
      .from("user_notification_preferences")
      .upsert(
        {
          user_id: user.id,
          event_key: eventKey,
          email_enabled: updated.email_enabled,
          in_app_enabled: updated.in_app_enabled,
        },
        { onConflict: "user_id,event_key" }
      );
    setSaving(null);
    if (error) {
      // rollback
      setPrefs((m) => ({ ...m, [eventKey]: current }));
      toast({
        title: "บันทึกไม่สำเร็จ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const grouped = events.reduce<Record<string, NotificationEvent[]>>((acc, e) => {
    (acc[e.category] = acc[e.category] || []).push(e);
    return acc;
  }, {});

  return (
    <CustomerLayout title="ตั้งค่าการแจ้งเตือน">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">ตั้งค่าการแจ้งเตือน</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          เลือกได้ว่าจะรับการแจ้งเตือนผ่านช่องทางใดบ้าง
          การแจ้งเตือนสำคัญ (เช่น สถานะการชำระเงิน, การยืนยันบัญชี)
          จะส่งให้คุณเสมอเพื่อความปลอดภัย
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              ไม่มี event ที่เปิดให้ตั้งค่า
            </CardContent>
          </Card>
        ) : (
          Object.entries(grouped).map(([category, list]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-base">
                  {CATEGORY_LABELS[category] || category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {list.map((e) => {
                  const emailKey = `${e.event_key}:email`;
                  const inAppKey = `${e.event_key}:in_app`;
                  return (
                    <div
                      key={e.event_key}
                      className="flex items-start justify-between gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">
                            {e.display_name}
                          </span>
                          {e.is_critical && (
                            <Badge variant="secondary" className="gap-1">
                              <Lock className="w-3 h-3" />
                              สำคัญ
                            </Badge>
                          )}
                        </div>
                        {e.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {e.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {e.notify_customer_in_app && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Bell className="w-3 h-3" /> In-app
                            </div>
                            {saving === inAppKey ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Switch
                                checked={getPref(e.event_key, "in_app")}
                                onCheckedChange={(v) =>
                                  togglePref(e.event_key, "in_app", v)
                                }
                                disabled={e.is_critical}
                              />
                            )}
                          </div>
                        )}
                        {e.notify_customer_email && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" /> Email
                            </div>
                            {saving === emailKey ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Switch
                                checked={getPref(e.event_key, "email")}
                                onCheckedChange={(v) =>
                                  togglePref(e.event_key, "email", v)
                                }
                                disabled={e.is_critical}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </CustomerLayout>
  );
}
