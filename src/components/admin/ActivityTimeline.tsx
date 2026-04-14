import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield, LogIn, UserX, UserCheck, KeyRound,
  AlertCircle, CheckCircle2, Clock, Loader2, Monitor,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  target_user_id: string | null;
  target_email: string | null;
  old_value: any;
  new_value: any;
  created_at: string;
}

interface LoginEntry {
  id: string;
  success: boolean;
  failure_reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Props {
  userId: string;
  limit?: number;
}

const ACTION_META: Record<string, { icon: any; label: string; color: string }> = {
  role_changed: { icon: Shield, label: 'เปลี่ยน Role', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  user_activated: { icon: UserCheck, label: 'เปิดใช้งาน', color: 'text-green-600 bg-green-50 border-green-200' },
  user_deactivated: { icon: UserX, label: 'ปิดใช้งาน', color: 'text-red-600 bg-red-50 border-red-200' },
  permission_override_added: { icon: KeyRound, label: 'เพิ่ม Override', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  permission_override_updated: { icon: KeyRound, label: 'เปลี่ยน Override', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  permission_override_removed: { icon: KeyRound, label: 'ลบ Override', color: 'text-gray-600 bg-gray-50 border-gray-200' },
  login_success: { icon: LogIn, label: 'เข้าสู่ระบบ', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  login_failed: { icon: AlertCircle, label: 'เข้าสู่ระบบล้มเหลว', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function ActivityTimeline({ userId, limit = 20 }: Props) {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [logins, setLogins] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [auditRes, loginRes] = await Promise.all([
        (supabase as any).rpc('get_user_audit_logs', { p_user_id: userId, p_limit: limit }),
        (supabase as any).rpc('get_user_login_history', { p_user_id: userId, p_limit: limit }),
      ]);
      if (auditRes.data) setAudits(auditRes.data);
      if (loginRes.data) setLogins(loginRes.data);
    } catch (e) {
      console.error('Failed to load activity:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'เมื่อสักครู่';
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} วันที่แล้ว`;
    return new Date(iso).toLocaleDateString('th-TH');
  };

  const formatFullDate = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const renderAuditDetail = (entry: AuditEntry) => {
    if (entry.action === 'role_changed') {
      return (
        <span className="text-xs text-muted-foreground">
          {entry.old_value?.role} → <strong>{entry.new_value?.role}</strong>
        </span>
      );
    }
    if (entry.action.startsWith('permission_override')) {
      const val = entry.new_value || entry.old_value;
      return (
        <span className="text-xs text-muted-foreground">
          {val?.module}: <strong>{val?.permission}</strong>
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            ประวัติการเข้าสู่ระบบ ({logins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logins.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">ยังไม่มีประวัติการเข้าสู่ระบบ</p>
          ) : (
            <div className="space-y-2">
              {logins.map((l) => (
                <div key={l.id} className={cn(
                  "flex items-start gap-3 p-2 rounded border",
                  l.success ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
                )}>
                  {l.success ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">
                        {l.success ? 'สำเร็จ' : 'ล้มเหลว'}
                        {l.failure_reason && <span className="text-red-600 ml-1">— {l.failure_reason}</span>}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(l.created_at)}</span>
                    </div>
                    {(l.ip_address || l.user_agent) && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                        {l.ip_address && <>IP: {l.ip_address}</>}
                        {l.user_agent && <> • {l.user_agent.slice(0, 60)}</>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            ประวัติการเปลี่ยนแปลง ({audits.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audits.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">ยังไม่มีประวัติการเปลี่ยนแปลง</p>
          ) : (
            <div className="space-y-2">
              {audits.map((a) => {
                const meta = ACTION_META[a.action] || { icon: Clock, label: a.action, color: 'text-gray-600 bg-gray-50 border-gray-200' };
                const Icon = meta.icon;
                return (
                  <div key={a.id} className={cn("flex items-start gap-3 p-2 rounded border", meta.color)}>
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-xs font-medium">{meta.label}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0" title={formatFullDate(a.created_at)}>
                          {formatDate(a.created_at)}
                        </span>
                      </div>
                      <div className="mt-0.5">{renderAuditDetail(a)}</div>
                      {a.actor_email && a.actor_id !== userId && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">โดย: {a.actor_email} ({a.actor_role})</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
