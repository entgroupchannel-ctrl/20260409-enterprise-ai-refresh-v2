import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  FileArchive, Plus, Search, Download, Pencil, Trash2,
  AlertCircle, Calendar, Loader2, EyeOff, Star,
} from 'lucide-react';
import UploadCompanyDocumentDialog from '@/components/admin/UploadCompanyDocumentDialog';
import EditCompanyDocumentDialog from '@/components/admin/EditCompanyDocumentDialog';

interface CompanyDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  access_level: string;
  file_url: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  version: string | null;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  is_featured: boolean;
  download_count: number;
  last_downloaded_at: string | null;
  created_at: string;
  created_by: string | null;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  company: { label: 'ข้อมูลบริษัท', icon: '🏢' },
  tax: { label: 'ภาษี', icon: '💰' },
  banking: { label: 'ธนาคาร', icon: '🏦' },
  personnel: { label: 'บุคคล', icon: '👤' },
  certification: { label: 'มาตรฐาน', icon: '📜' },
  catalog: { label: 'แคตตาล็อก', icon: '📦' },
  other: { label: 'อื่นๆ', icon: '📎' },
};

const ACCESS_META: Record<string, { label: string; color: string }> = {
  public: { label: 'Public', color: 'bg-green-50 text-green-700 border-green-300' },
  authenticated: { label: 'Authenticated', color: 'bg-blue-50 text-blue-700 border-blue-300' },
  customer_active: { label: 'Customer Active', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  internal: { label: 'Internal', color: 'bg-purple-50 text-purple-700 border-purple-300' },
};

export default function AdminDocuments() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, downloads: 0, expiring: 0 });

  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState<CompanyDocument | null>(null);
  const [deleting, setDeleting] = useState<CompanyDocument | null>(null);

  const isAdminOrAbove = profile?.role === 'admin' || profile?.role === 'super_admin';

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('company_documents')
        .select('*')
        .is('deleted_at', null)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data as CompanyDocument[]) || []);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await (supabase as any).rpc('get_company_docs_stats');
      if (data && data[0]) {
        setStats({
          total: data[0].total_documents || 0,
          downloads: data[0].total_downloads || 0,
          expiring: data[0].expiring_soon || 0,
        });
      }
    } catch (e) {
      console.error('Stats failed:', e);
    }
  };

  const handleDownload = async (doc: CompanyDocument) => {
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
      setTimeout(() => { loadStats(); loadDocuments(); }, 500);
    } catch (e: any) {
      toast({ title: 'ดาวน์โหลดไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const { error } = await (supabase as any)
        .from('company_documents')
        .update({ deleted_at: new Date().toISOString(), deleted_by: profile?.id })
        .eq('id', deleting.id);

      if (error) throw error;

      toast({ title: '✅ ลบแล้ว', description: deleting.title });
      setDeleting(null);
      loadDocuments();
      loadStats();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = documents.filter((d) => {
    const matchCategory = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDate = (s: string | null) => {
    if (!s) return '-';
    return new Date(s).toLocaleDateString('th-TH');
  };

  const isExpiringSoon = (validUntil: string | null) => {
    if (!validUntil) return false;
    const days = (new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil).getTime() < Date.now();
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileArchive className="w-6 h-6 text-primary" />
              เอกสารบริษัท
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              จัดการเอกสารสำหรับให้ลูกค้าดาวน์โหลด (หนังสือรับรอง, ภ.พ., ธนาคาร)
            </p>
          </div>
          {isAdminOrAbove && (
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              อัปโหลดเอกสาร
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">เอกสารทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl font-bold text-primary">{stats.downloads}</div>
              <div className="text-xs text-muted-foreground">ดาวน์โหลดทั้งหมด</div>
            </CardContent>
          </Card>
          <Card className={stats.expiring > 0 ? 'border-amber-300 bg-amber-50' : ''}>
            <CardContent className="pt-4 pb-4">
              <div className={`text-2xl font-bold ${stats.expiring > 0 ? 'text-amber-700' : ''}`}>
                {stats.expiring}
              </div>
              <div className="text-xs text-muted-foreground">หมดอายุใน 30 วัน</div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Categories */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหาเอกสาร..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap h-auto">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <TabsTrigger key={key} value={key}>{meta.icon} {meta.label}</TabsTrigger>
                ))}
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
              <FileArchive className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">ไม่พบเอกสาร</p>
              {isAdminOrAbove && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowUpload(true)}>
                  <Plus className="w-4 h-4 mr-1.5" /> อัปโหลดเอกสารแรก
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((doc) => {
              const catMeta = CATEGORY_META[doc.category];
              const accessMeta = ACCESS_META[doc.access_level];
              const expired = isExpired(doc.valid_until);
              const expiringSoon = isExpiringSoon(doc.valid_until);

              return (
                <Card key={doc.id} className={`hover:shadow-sm transition-shadow ${!doc.is_active ? 'opacity-60' : ''}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-2xl">{catMeta?.icon}</span>
                          <h3 className="font-semibold text-sm">{doc.title}</h3>
                          {doc.is_featured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          {!doc.is_active && (
                            <Badge variant="outline" className="text-[10px] bg-gray-100">
                              <EyeOff className="w-2.5 h-2.5 mr-1" /> ปิดใช้งาน
                            </Badge>
                          )}
                          {doc.version && <Badge variant="outline" className="text-[10px]">{doc.version}</Badge>}
                          <Badge variant="outline" className={`text-[10px] ${accessMeta?.color}`}>{accessMeta?.label}</Badge>
                          {expired && (
                            <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-300">
                              <AlertCircle className="w-2.5 h-2.5 mr-1" /> หมดอายุ
                            </Badge>
                          )}
                          {expiringSoon && !expired && (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-300">
                              <Calendar className="w-2.5 h-2.5 mr-1" /> ใกล้หมดอายุ
                            </Badge>
                          )}
                        </div>

                        {doc.description && <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span>{doc.file_name}</span>
                          <span>•</span>
                          <span>{formatSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>📥 {doc.download_count} downloads</span>
                          {doc.valid_until && (
                            <><span>•</span><span>หมดอายุ: {formatDate(doc.valid_until)}</span></>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} title="ดาวน์โหลด">
                          <Download className="w-4 h-4" />
                        </Button>
                        {isAdminOrAbove && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => setEditing(doc)} title="แก้ไข">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleting(doc)} title="ลบ">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <UploadCompanyDocumentDialog open={showUpload} onOpenChange={setShowUpload} onSuccess={() => { loadDocuments(); loadStats(); }} />

      {editing && (
        <EditCompanyDocumentDialog
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
          document={editing}
          onSuccess={() => { loadDocuments(); loadStats(); }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบเอกสาร?</AlertDialogTitle>
            <AlertDialogDescription>
              เอกสาร "<strong>{deleting?.title}</strong>" จะถูกลบ ลูกค้าจะไม่เห็นเอกสารนี้อีก สามารถกู้คืนได้จากถังขยะภายหลัง
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
