// src/components/admin/QuoteShareActivity.tsx
// Activity timeline for shared quote links — shows views/downloads per link.
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Download, Link2, Clock, ShieldOff, RefreshCw, Activity } from 'lucide-react';
import { formatShortDateTime, formatRelativeTime } from '@/lib/format';

interface ShareLink {
  id: string;
  token: string;
  expires_at: string;
  revoked_at: string | null;
  view_count: number;
  download_count: number;
  last_accessed_at: string | null;
  created_at: string;
}

interface AccessLog {
  id: string;
  share_link_id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  accessed_at: string;
}

interface Props {
  quoteId: string;
}

export default function QuoteShareActivity({ quoteId }: Props) {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const { data: linkData } = await supabase
      .from('quote_share_links' as any)
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false });

    const linkRows = (linkData ?? []) as unknown as ShareLink[];
    setLinks(linkRows);

    if (linkRows.length > 0) {
      const ids = linkRows.map((l) => l.id);
      const { data: logData } = await supabase
        .from('quote_share_access_log' as any)
        .select('*')
        .in('share_link_id', ids)
        .order('accessed_at', { ascending: false })
        .limit(100);
      setLogs(((logData ?? []) as unknown) as AccessLog[]);
    } else {
      setLogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [quoteId]);

  const totalViews = links.reduce((s, l) => s + (l.view_count || 0), 0);
  const totalDownloads = links.reduce((s, l) => s + (l.download_count || 0), 0);
  const activeLinks = links.filter((l) => !l.revoked_at && new Date(l.expires_at) > new Date()).length;

  const linkLabel = (id: string) => {
    const idx = links.findIndex((l) => l.id === id);
    if (idx < 0) return 'ลิงก์';
    return `ลิงก์ #${links.length - idx}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          การเข้าถึงลิงก์แชร์
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            ยังไม่มีลิงก์แชร์ — กดปุ่ม "แชร์" ในรายการใบเสนอราคาเพื่อสร้างลิงก์
          </p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-primary">{totalViews}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Eye className="h-3 w-3" /> เปิดดู
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-primary">{totalDownloads}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Download className="h-3 w-3" /> ดาวน์โหลด
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{activeLinks}<span className="text-sm text-muted-foreground">/{links.length}</span></div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Link2 className="h-3 w-3" /> ลิงก์ใช้งานได้
                </div>
              </div>
            </div>

            {/* Links list */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ลิงก์ที่สร้าง</p>
              {links.map((link, i) => {
                const expired = new Date(link.expires_at) < new Date();
                const revoked = !!link.revoked_at;
                const status = revoked ? 'revoked' : expired ? 'expired' : 'active';
                return (
                  <div key={link.id} className="rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">ลิงก์ #{links.length - i}</span>
                      {status === 'active' && <Badge variant="default">ใช้งานได้</Badge>}
                      {status === 'expired' && <Badge variant="secondary">หมดอายุ</Badge>}
                      {status === 'revoked' && <Badge variant="destructive"><ShieldOff className="h-3 w-3 mr-1" />ยกเลิก</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>สร้าง: {formatShortDateTime(link.created_at)}</span>
                      <span>หมดอายุ: {formatShortDateTime(link.expires_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{link.view_count}</span>
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{link.download_count}</span>
                      {link.last_accessed_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />ล่าสุด {formatRelativeTime(link.last_accessed_at)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity log */}
            {logs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  ประวัติการเข้าถึง ({logs.length})
                </p>
                <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 text-xs border-l-2 border-primary/30 pl-3 py-1">
                      <div className="mt-0.5">
                        {log.action === 'download' ? (
                          <Download className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            {log.action === 'download' ? 'ดาวน์โหลด PDF' : 'เปิดดูใบเสนอราคา'}
                          </span>
                          <span className="text-muted-foreground">· {linkLabel(log.share_link_id)}</span>
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex flex-wrap gap-x-2">
                          <span>{formatShortDateTime(log.accessed_at)}</span>
                          {log.ip_address && <span>· IP {log.ip_address}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
