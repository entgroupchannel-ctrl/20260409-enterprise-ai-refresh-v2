import { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Share2, Copy, Eye, Download, Loader2, Link as LinkIcon, Ban, Plus, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptId: string | null;
  receiptNumber: string | null;
}

const generateToken = () => {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 32);
};

export default function ShareReceiptDialog({ open, onOpenChange, receiptId, receiptNumber }: Props) {
  const { toast } = useToast();
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => {
    if (open && receiptId) loadLinks();
    if (!open) setDays(7);
  }, [open, receiptId]);

  const loadLinks = async () => {
    if (!receiptId) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('receipt_share_links')
        .select('*')
        .eq('receipt_id', receiptId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLinks(data || []);
    } catch (e: any) {
      toast({ title: 'โหลดลิงก์ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!receiptId) return;
    setCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const { error } = await (supabase as any).from('receipt_share_links').insert({
        receipt_id: receiptId,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: userData.user?.id,
      });
      if (error) throw error;

      toast({ title: '✅ สร้างลิงก์สำเร็จ', description: `อายุ ${days} วัน` });
      await loadLinks();
    } catch (e: any) {
      toast({ title: 'สร้างลิงก์ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await (supabase as any)
        .from('receipt_share_links')
        .update({ revoked_at: new Date().toISOString(), revoked_by: userData.user?.id })
        .eq('id', id);
      if (error) throw error;
      toast({ title: '🚫 ยกเลิกลิงก์แล้ว' });
      await loadLinks();
    } catch (e: any) {
      toast({ title: 'ยกเลิกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setRevokingId(null);
    }
  };

  const buildUrl = (token: string, action: 'view' | 'download' = 'view') => {
    const base = 'https://www.entgroup.co.th';
    return action === 'download' ? `${base}/rcp/share/${token}?download=1` : `${base}/rcp/share/${token}`;
  };

  const handleCopy = async (token: string, action: 'view' | 'download' = 'view') => {
    const url = buildUrl(token, action);
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: '📋 คัดลอกลิงก์แล้ว', description: url });
    } catch {
      toast({ title: 'คัดลอกไม่สำเร็จ', variant: 'destructive' });
    }
  };

  const getStatus = (link: ShareLink) => {
    if (link.revoked_at) return { label: 'ยกเลิก', variant: 'destructive' as const };
    if (new Date(link.expires_at) < new Date()) return { label: 'หมดอายุ', variant: 'secondary' as const };
    return { label: 'ใช้งานได้', variant: 'default' as const };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            แชร์ใบเสร็จรับเงิน {receiptNumber}
          </DialogTitle>
          <DialogDescription>
            สร้างลิงก์ชั่วคราวเพื่อให้ลูกค้าเปิดดูหรือดาวน์โหลด PDF โดยไม่ต้องล็อกอิน
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
          <div className="font-medium text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> สร้างลิงก์ใหม่
          </div>
          <div className="space-y-1.5 max-w-xs">
            <Label className="text-xs">อายุลิงก์</Label>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 7].map((d) => (
                  <SelectItem key={d} value={String(d)}>{d} วัน</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-2" />}
            {creating ? 'กำลังสร้าง...' : 'สร้างลิงก์'}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="font-medium text-sm">ลิงก์ที่สร้างไว้ ({links.length})</div>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : links.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-6 border rounded-lg">
              ยังไม่มีลิงก์ที่แชร์
            </div>
          ) : (
            <div className="space-y-2">
              {links.map((link) => {
                const status = getStatus(link);
                const url = buildUrl(link.token);
                const active = !link.revoked_at && new Date(link.expires_at) >= new Date();
                return (
                  <div key={link.id} className="border rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <span className="text-muted-foreground text-xs">
                          หมดอายุ: {format(new Date(link.expires_at), 'd MMM yyyy HH:mm', { locale: th })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{link.view_count}</span>
                        <span className="flex items-center gap-1"><Download className="w-3 h-3" />{link.download_count}</span>
                      </div>
                    </div>
                    <Input value={url} readOnly className="text-xs font-mono h-8" />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCopy(link.token, 'view')} disabled={!active}>
                        <Copy className="w-3 h-3 mr-1" /> คัดลอกลิงก์ดู
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleCopy(link.token, 'download')} disabled={!active}>
                        <Download className="w-3 h-3 mr-1" /> คัดลอกลิงก์ดาวน์โหลด
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(url, '_blank')} disabled={!active}>
                        <ExternalLink className="w-3 h-3 mr-1" /> เปิดดู
                      </Button>
                      {active && (
                        <Button size="sm" variant="ghost" onClick={() => setRevokingId(link.id)} className="text-destructive hover:text-destructive ml-auto">
                          <Ban className="w-3 h-3 mr-1" /> ยกเลิก
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>

      <AlertDialog open={!!revokingId} onOpenChange={(o) => !o && setRevokingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ยกเลิกลิงก์แชร์นี้?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 pt-2">
              <span className="block">หลังยกเลิกแล้ว ลูกค้าจะ<strong className="text-destructive"> เปิดลิงก์นี้ไม่ได้อีก</strong> ทันที</span>
              <span className="block text-xs text-muted-foreground">
                สถิติการเข้าชม/ดาวน์โหลดที่บันทึกไว้จะยังคงอยู่ในระบบเพื่อตรวจสอบย้อนหลัง
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => revokingId && handleRevoke(revokingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Ban className="w-4 h-4 mr-1.5" />
              ยืนยันยกเลิกลิงก์
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
