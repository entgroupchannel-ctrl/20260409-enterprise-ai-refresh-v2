import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileArchive, Search, Download, Loader2, Info, Star, Lock, FileText,
} from 'lucide-react';
import SEOHead from '@/components/SEOHead';

interface CompanyDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  access_level: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  version: string | null;
  valid_until: string | null;
  is_featured: boolean;
  download_count: number;
}

const CATEGORY_META: Record<string, { label: string; icon: string; order: number }> = {
  company: { label: 'ข้อมูลบริษัท', icon: '🏢', order: 1 },
  tax: { label: 'ภาษี', icon: '💰', order: 2 },
  banking: { label: 'ธนาคาร', icon: '🏦', order: 3 },
  personnel: { label: 'บุคคล', icon: '👤', order: 4 },
  certification: { label: 'มาตรฐาน', icon: '📜', order: 5 },
  catalog: { label: 'แคตตาล็อก', icon: '📦', order: 6 },
  other: { label: 'อื่นๆ', icon: '📎', order: 99 },
};

export default function MyDocuments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    loadDocuments();
    checkUnlockStatus();
  }, [user?.id]);

  const checkUnlockStatus = async () => {
    if (!user?.id) {
      setUnlocked(false);
      setCheckingAccess(false);
      return;
    }
    setCheckingAccess(true);
    try {
      const UNLOCK_STATUSES = ['approved', 'quote_sent', 'po_approved', 'po_confirmed', 'completed'];
      const { count } = await (supabase as any)
        .from('quote_requests')
        .select('id', { count: 'exact', head: true })
        .eq('created_by', user.id)
        .in('status', UNLOCK_STATUSES);
      setUnlocked((count ?? 0) > 0);
    } catch {
      setUnlocked(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('company_documents')
        .select('id, title, description, category, access_level, file_path, file_name, file_size, file_type, version, valid_until, is_featured, download_count')
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out expired docs on client side
      const now = Date.now();
      const active = ((data as CompanyDocument[]) || []).filter((d) => {
        if (!d.valid_until) return true;
        return new Date(d.valid_until).getTime() >= now;
      });

      setDocuments(active);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc: CompanyDocument) => {
    if (!unlocked) {
      toast({
        title: 'ยังไม่สามารถดาวน์โหลดได้',
        description: 'เอกสารบริษัทจะปลดล็อกเมื่อใบเสนอราคาของคุณได้รับการอนุมัติครั้งแรก',
      });
      return;
    }
    setDownloading(doc.id);
    try {
      const { data: urlData, error } = await supabase.storage
        .from('company-documents')
        .createSignedUrl(doc.file_path, 3600);

      if (error || !urlData?.signedUrl) throw new Error('ไม่สามารถสร้างลิงก์ได้');

      await (supabase as any).rpc('log_document_download', {
        p_document_id: doc.id,
        p_user_agent: navigator.userAgent,
        p_source: 'direct',
      });

      window.open(urlData.signedUrl, '_blank');
    } catch (e: any) {
      toast({ title: 'ดาวน์โหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(null);
    }
  };

  const filtered = documents.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.title.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
  });

  const grouped = filtered.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, CompanyDocument[]>);

  const categoryOrder = Object.entries(CATEGORY_META)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key]) => key);

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <CustomerLayout title="เอกสารบริษัท ENT">
      <SEOHead title="เอกสารบริษัท ENT" description="ดาวน์โหลดเอกสารบริษัท" />
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">เอกสารบริษัท ENT</h1>
          <p className="text-xs text-muted-foreground">เอกสารสำหรับเปิดบัญชีลูกค้า / ทำธุรกรรม</p>
        </div>

          {/* Info banner */}
          <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
            <CardContent className="pt-4 pb-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 dark:text-blue-300 space-y-0.5">
                <p className="font-semibold">📄 เอกสารบริษัท อี เอ็น ที กรุ๊ป จำกัด</p>
                <p>ใช้สำหรับประกอบการเปิดบัญชีลูกค้า / ทำสัญญา / ยื่นใบสั่งซื้อ</p>
                <p>หากต้องการเอกสารเฉพาะหรือเวอร์ชั่นพิเศษ กรุณาติดต่อฝ่ายขาย</p>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="ค้นหาเอกสาร..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
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
                <FileArchive className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">{search ? 'ไม่พบเอกสาร' : 'ยังไม่มีเอกสารให้ดาวน์โหลด'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {categoryOrder.map((cat) => {
                const docs = grouped[cat];
                if (!docs || docs.length === 0) return null;
                const meta = CATEGORY_META[cat];

                return (
                  <Card key={cat}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{meta.icon} {meta.label} ({docs.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-3 p-3 rounded border hover:bg-muted/30 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-sm">{doc.title}</p>
                                {doc.is_featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                {doc.version && <Badge variant="outline" className="text-[10px]">{doc.version}</Badge>}
                              </div>
                              {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                <span>{formatSize(doc.file_size)}</span>
                                {doc.file_type?.includes('pdf') && <span>• PDF</span>}
                                {doc.file_type?.includes('image') && <span>• รูปภาพ</span>}
                              </div>
                            </div>
                            <Button size="sm" onClick={() => handleDownload(doc)} disabled={downloading === doc.id}>
                              {downloading === doc.id ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              ดาวน์โหลด
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
    </CustomerLayout>
  );
}
