import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  Copy,
  Eye,
  Download,
  Loader2,
  Link as LinkIcon,
  Ban,
  Plus,
  ExternalLink,
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
  note: string | null;
}

interface ShareQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string | null;
  quoteNumber: string | null;
}

const generateToken = () => {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 32);
};

export default function ShareQuoteDialog({
  open,
  onOpenChange,
  quoteId,
  quoteNumber,
}: ShareQuoteDialogProps) {
  const { toast } = useToast();
  const [links, setLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open && quoteId) loadLinks();
    if (!open) {
      setNote('');
      setDays(7);
    }
  }, [open, quoteId]);

  const loadLinks = async () => {
    if (!quoteId) return;
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('quote_share_links')
        .select('*')
        .eq('quote_id', quoteId)
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
    if (!quoteId) return;
    setCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const token = generateToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const { error } = await (supabase as any).from('quote_share_links').insert({
        quote_id: quoteId,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: userData.user?.id,
        note: note || null,
      });
      if (error) throw error;

      toast({ title: '✅ สร้างลิงก์สำเร็จ', description: `อายุ ${days} วัน` });
      setNote('');
      await loadLinks();
    } catch (e: any) {
      toast({ title: 'สร้างลิงก์ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('ยกเลิกลิงก์นี้? ลูกค้าจะเปิดไม่ได้อีก')) return;
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await (supabase as any)
        .from('quote_share_links')
        .update({ revoked_at: new Date().toISOString(), revoked_by: userData.user?.id })
        .eq('id', id);
      if (error) throw error;
      toast({ title: '🚫 ยกเลิกลิงก์แล้ว' });
      await loadLinks();
    } catch (e: any) {
      toast({ title: 'ยกเลิกไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const buildUrl = (token: string, action: 'view' | 'download' = 'view') => {
    const base = window.location.origin;
    return action === 'download'
      ? `${base}/q/share/${token}?download=1`
      : `${base}/q/share/${token}`;
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
            แชร์ใบเสนอราคา {quoteNumber}
          </DialogTitle>
          <DialogDescription>
            สร้างลิงก์ชั่วคราวเพื่อให้ลูกค้าเปิดดูหรือดาวน์โหลด PDF โดยไม่ต้องล็อกอิน
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
          <div className="font-medium text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> สร้างลิงก์ใหม่
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
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
            <div className="space-y-1.5">
              <Label className="text-xs">บันทึกย่อ (ไม่บังคับ)</Label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น: ส่งคุณสมชาย"
              />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating} className="w-full sm:w-auto">
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
                        {link.note && <span className="text-xs text-muted-foreground">• {link.note}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{link.view_count}</span>
                        <span className="flex items-center gap-1"><Download className="w-3 h-3" />{link.download_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input value={url} readOnly className="text-xs font-mono h-8" />
                    </div>
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
                        <Button size="sm" variant="ghost" onClick={() => handleRevoke(link.id)} className="text-destructive hover:text-destructive ml-auto">
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
    </Dialog>
  );
}
