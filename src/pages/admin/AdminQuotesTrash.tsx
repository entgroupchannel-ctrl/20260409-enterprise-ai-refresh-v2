import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Trash2, ArrowLeft, RotateCcw, AlertTriangle, Search,
  Building2, Calendar, User,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/format';

interface DeletedQuote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  grand_total: number;
  status: string;
  created_at: string;
  deleted_at: string;
  deleted_by: string | null;
  delete_reason: string | null;
}

export default function AdminQuotesTrash() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'admin';

  const [quotes, setQuotes] = useState<DeletedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<DeletedQuote | null>(null);
  const [showEmptyTrash, setShowEmptyTrash] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadTrash(); }, []);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('id, quote_number, customer_name, customer_email, customer_company, grand_total, status, created_at, deleted_at, deleted_by, delete_reason')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      setQuotes((data as DeletedQuote[]) || []);
    } catch (error: any) {
      toast({ title: 'โหลดถังขยะไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (quoteId: string, quoteNumber: string) => {
    setRestoringId(quoteId);
    try {
      const { data, error } = await supabase.rpc('restore_quote' as any, { p_quote_id: quoteId });
      if (error) throw error;
      toast({
        title: '↩️ กู้คืนสำเร็จ',
        description: (data as any)?.message || `${quoteNumber} ถูกกู้คืนแล้ว`,
      });
      await loadTrash();
    } catch (error: any) {
      toast({ title: 'กู้คืนไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('permanent_delete_quote' as any, {
        p_quote_id: permanentDeleteTarget.id,
      });
      if (error) throw error;
      toast({ title: '🗑️ ลบถาวรแล้ว', description: (data as any)?.message });
      setPermanentDeleteTarget(null);
      await loadTrash();
    } catch (error: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleEmptyTrash = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.rpc('empty_quote_trash' as any);
      if (error) throw error;
      toast({ title: '✅ ล้างถังขยะแล้ว', description: (data as any)?.message });
      setShowEmptyTrash(false);
      await loadTrash();
    } catch (error: any) {
      toast({ title: 'ล้างไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const filtered = quotes.filter((q) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      q.quote_number.toLowerCase().includes(s) ||
      q.customer_name.toLowerCase().includes(s) ||
      (q.customer_company || '').toLowerCase().includes(s) ||
      q.customer_email.toLowerCase().includes(s)
    );
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(n);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link
              to="/admin/quotes"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> กลับไป ใบเสนอราคา
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-muted-foreground" />
              ถังขยะ
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ใบเสนอราคาที่ถูกลบ — สามารถกู้คืนได้
            </p>
          </div>

          {isSuperAdmin && quotes.length > 0 && (
            <Button variant="destructive" onClick={() => setShowEmptyTrash(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              ล้างถังขยะทั้งหมด
            </Button>
          )}
        </div>

        {/* Stats card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quotes.length}</p>
                <p className="text-sm text-muted-foreground">รายการในถังขยะ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        {quotes.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา: เลขที่ / ชื่อลูกค้า / บริษัท..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              <Trash2 className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">
                {search ? 'ไม่พบรายการที่ค้นหา' : 'ถังขยะว่างเปล่า'}
              </p>
              <p className="text-sm mt-1">
                {search ? 'ลองเปลี่ยนคำค้นหา' : 'ใบเสนอราคาที่ลบจะมาแสดงที่นี่'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((quote) => (
              <Card key={quote.id} className="border-muted-foreground/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-muted-foreground line-through">
                          {quote.quote_number}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {quote.status}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-0.5">
                        <p className="flex items-center gap-1.5 text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5" />
                          {quote.customer_company || quote.customer_name}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          {quote.customer_email}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          สร้าง: {formatRelativeTime(quote.created_at)}
                        </span>
                        <span className="flex items-center gap-1 text-destructive">
                          <Trash2 className="w-3 h-3" />
                          ลบเมื่อ: {formatRelativeTime(quote.deleted_at)}
                        </span>
                      </div>

                      {quote.delete_reason && (
                        <div className="text-xs bg-muted/50 rounded p-2 mt-2 italic">
                          💬 เหตุผล: {quote.delete_reason}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">ยอดรวม</p>
                        <p className="text-lg font-bold text-muted-foreground">
                          {formatCurrency(quote.grand_total || 0)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(quote.id, quote.quote_number)}
                          disabled={restoringId === quote.id}
                        >
                          {restoringId === quote.id ? (
                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1.5" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          กู้คืน
                        </Button>

                        {isSuperAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setPermanentDeleteTarget(quote)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Permanent Delete Dialog */}
      <AlertDialog
        open={!!permanentDeleteTarget}
        onOpenChange={(v) => !v && setPermanentDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ลบถาวร — ไม่สามารถย้อนกลับได้!
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  คุณกำลังจะลบ <strong>{permanentDeleteTarget?.quote_number}</strong> ถาวร
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg space-y-1 text-sm">
                  <p className="font-medium text-destructive">⚠️ จะลบข้อมูลต่อไปนี้ถาวร:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li>ใบเสนอราคา + revisions ทั้งหมด</li>
                    <li>ข้อความ chat / negotiations</li>
                    <li>ไฟล์แนบ (PO, attachments)</li>
                    <li>Activity log ทั้งหมด</li>
                  </ul>
                  <p className="text-xs mt-2 text-destructive font-medium">
                    การกระทำนี้ไม่สามารถ undo ได้
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังลบ...' : '🗑️ ลบถาวร'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Dialog */}
      <AlertDialog open={showEmptyTrash} onOpenChange={setShowEmptyTrash}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ล้างถังขยะทั้งหมด?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p>
                  จะลบ <strong>{quotes.length}</strong> ใบเสนอราคาในถังขยะถาวร
                </p>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive">
                    ⚠️ ข้อมูลทั้งหมดจะหายไปถาวร — รวม revisions, messages, files
                    <br />ไม่สามารถย้อนกลับได้
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              disabled={processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processing ? 'กำลังล้าง...' : '🗑️ ล้างถังขยะ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
