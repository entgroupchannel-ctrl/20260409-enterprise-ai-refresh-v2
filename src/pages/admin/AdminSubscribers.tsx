import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Search, Mail, UserCheck, UserX, Download, RefreshCw, Eye, Upload,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, Loader2,
} from 'lucide-react';
import SubscribersImportDialog from '@/components/admin/SubscribersImportDialog';

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
  is_active: boolean;
  unsubscribed_at: string | null;
  notes: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  phone_secondary?: string | null;
  company?: string | null;
  position?: string | null;
  labels?: string | null;
  language?: string | null;
  address?: string | null;
  city?: string | null;
  state_region?: string | null;
  zip?: string | null;
  country?: string | null;
  website?: string | null;
  company_tax_id?: string | null;
  branch?: string | null;
  customer_type?: string | null;
  email_subscriber_status?: string | null;
  sms_subscriber_status?: string | null;
  last_activity?: string | null;
  last_activity_at?: string | null;
  imported_from?: string | null;
  imported_at?: string | null;
  extra_data?: any;
}

type FilterStatus = 'all' | 'active' | 'inactive';

const AdminSubscribers = () => {
  const { toast } = useToast();

  // data + pagination state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // search + filter
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  // selection / bulk
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);

  // detail dialog
  const [selected, setSelected] = useState<Subscriber | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  // import dialog
  const [importOpen, setImportOpen] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCounts = useCallback(async () => {
    const [{ count: total }, { count: active }] = await Promise.all([
      supabase.from('subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('subscribers').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);
    setTotalCount(total || 0);
    setActiveCount(active || 0);
    setInactiveCount((total || 0) - (active || 0));
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('subscribers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filter === 'active') query = query.eq('is_active', true);
    else if (filter === 'inactive') query = query.eq('is_active', false);

    if (search) {
      // Escape commas/parentheses for PostgREST or() filter
      const safe = search.replace(/[,()]/g, ' ');
      const like = `%${safe}%`;
      query = query.or(
        [
          `email.ilike.${like}`,
          `first_name.ilike.${like}`,
          `last_name.ilike.${like}`,
          `company.ilike.${like}`,
          `phone.ilike.${like}`,
          `company_tax_id.ilike.${like}`,
        ].join(','),
      );
    }

    const { data, error, count } = await query;
    if (error) {
      toast({ title: 'โหลดข้อมูลล้มเหลว', description: error.message, variant: 'destructive' });
    } else {
      setSubscribers((data || []) as Subscriber[]);
      if (typeof count === 'number') {
        // when filter/search applied, count reflects filtered result;
        // we still keep stat counts from fetchCounts() for the cards
        setTotalCount((prev) => (filter === 'all' && !search ? count : prev));
      }
    }
    setLoading(false);
  }, [page, pageSize, filter, search, toast]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  // reset selection when page/filter changes
  useEffect(() => { setSelectedIds(new Set()); }, [page, pageSize, filter, search]);

  const refreshAll = () => { fetchCounts(); fetchSubscribers(); };

  const totalPages = Math.max(1, Math.ceil(
    (filter === 'all' && !search ? totalCount : (subscribers.length === pageSize ? page + 1 : page)) / pageSize,
  ));
  // For filtered queries we use a simpler "next page exists?" heuristic; for unfiltered we use totalCount.
  const hasNext = filter === 'all' && !search
    ? page < Math.ceil(totalCount / pageSize)
    : subscribers.length === pageSize;

  const toggleStatus = async (sub: Subscriber) => {
    const newActive = !sub.is_active;
    const { error } = await supabase
      .from('subscribers')
      .update({
        is_active: newActive,
        unsubscribed_at: newActive ? null : new Date().toISOString(),
      } as any)
      .eq('id', sub.id);
    if (error) {
      toast({ title: 'เกิดข้อผิดพลาด', variant: 'destructive' });
    } else {
      toast({ title: newActive ? 'เปิดใช้งานแล้ว' : 'ยกเลิกการสมัครแล้ว' });
      refreshAll();
      if (selected?.id === sub.id) setSelected({ ...sub, is_active: newActive });
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('subscribers')
      .update({ notes: noteText } as any)
      .eq('id', selected.id);
    if (!error) {
      toast({ title: 'บันทึกโน้ตสำเร็จ' });
      fetchSubscribers();
      setSelected({ ...selected, notes: noteText });
    }
    setSaving(false);
  };

  // ---------- Bulk actions ----------
  const allOnPageSelected = subscribers.length > 0 && subscribers.every(s => selectedIds.has(s.id));
  const someOnPageSelected = subscribers.some(s => selectedIds.has(s.id));
  const togglePageSelect = (checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) subscribers.forEach(s => next.add(s.id));
    else subscribers.forEach(s => next.delete(s.id));
    setSelectedIds(next);
  };
  const toggleRowSelect = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) next.add(id); else next.delete(id);
    setSelectedIds(next);
  };

  const runBulk = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setBulkRunning(true);
    const ids = Array.from(selectedIds);
    const CHUNK = 200;
    let ok = 0; let fail = 0;
    for (let i = 0; i < ids.length; i += CHUNK) {
      const chunk = ids.slice(i, i + CHUNK);
      let q;
      if (bulkAction === 'delete') {
        q = supabase.from('subscribers').delete().in('id', chunk);
      } else {
        const newActive = bulkAction === 'activate';
        q = supabase.from('subscribers').update({
          is_active: newActive,
          unsubscribed_at: newActive ? null : new Date().toISOString(),
        } as any).in('id', chunk);
      }
      const { error } = await q;
      if (error) fail += chunk.length; else ok += chunk.length;
    }
    setBulkRunning(false);
    setBulkAction(null);
    setSelectedIds(new Set());
    toast({
      title: '✅ ดำเนินการสำเร็จ',
      description: `สำเร็จ ${ok} รายการ${fail ? ` • ผิดพลาด ${fail}` : ''}`,
    });
    refreshAll();
  };

  // ---------- Export (current page or all filtered) ----------
  const exportCSV = async (mode: 'page' | 'all') => {
    const esc = (v: any) => {
      const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const headers = [
      'Email','First Name','Last Name','Phone','Phone 2','Company','Position',
      'Address','City','State/Region','Zip','Country','Website',
      'CompanyTaxId','Branch','Cus_type','Labels','Language',
      'Source','Status','Notes',
      'Email Subscriber Status','SMS Subscriber Status','Last Activity','Last Activity Date',
      'Subscribed At','Unsubscribed At','Imported From','Imported At','Extra Data',
    ];
    let rows: Subscriber[] = subscribers;
    if (mode === 'all') {
      const all: Subscriber[] = [];
      const PAGE = 1000;
      for (let i = 0 ; ; i += PAGE) {
        let q = supabase.from('subscribers').select('*').order('created_at', { ascending: false }).range(i, i + PAGE - 1);
        if (filter === 'active') q = q.eq('is_active', true);
        else if (filter === 'inactive') q = q.eq('is_active', false);
        if (search) {
          const safe = search.replace(/[,()]/g, ' ');
          const like = `%${safe}%`;
          q = q.or([
            `email.ilike.${like}`,`first_name.ilike.${like}`,`last_name.ilike.${like}`,
            `company.ilike.${like}`,`phone.ilike.${like}`,`company_tax_id.ilike.${like}`,
          ].join(','));
        }
        const { data } = await q;
        const batch = (data || []) as Subscriber[];
        all.push(...batch);
        if (batch.length < PAGE) break;
        if (all.length > 200000) break; // safety
      }
      rows = all;
    }
    const lines = [headers.join(',')];
    rows.forEach((s) => {
      lines.push([
        s.email, s.first_name, s.last_name, s.phone, s.phone_secondary, s.company, s.position,
        s.address, s.city, s.state_region, s.zip, s.country, s.website,
        s.company_tax_id, s.branch, s.customer_type, s.labels, s.language,
        s.source, s.is_active ? 'Active' : 'Inactive', s.notes,
        s.email_subscriber_status, s.sms_subscriber_status, s.last_activity, s.last_activity_at,
        s.created_at, s.unsubscribed_at, s.imported_from, s.imported_at, s.extra_data,
      ].map(esc).join(','));
    });
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${mode}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fromIdx = (page - 1) * pageSize + 1;
  const toIdx = (page - 1) * pageSize + subscribers.length;

  return (
    <AdminLayout>
      <AdminPageLayout title="📧 สมาชิกรับข่าวสาร" description="จัดการรายชื่ออีเมลที่สมัครรับข่าวสาร (รองรับข้อมูลหลักหมื่น)">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className={`cursor-pointer transition-colors ${filter === 'all' ? 'border-primary' : 'hover:border-primary'}`} onClick={() => { setFilter('all'); setPage(1); }}>
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">ทั้งหมด</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-colors ${filter === 'active' ? 'border-green-500' : 'hover:border-green-500'}`} onClick={() => { setFilter('active'); setPage(1); }}>
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{activeCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">สมาชิกที่ใช้งาน</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-colors ${filter === 'inactive' ? 'border-red-500' : 'hover:border-red-500'}`} onClick={() => { setFilter('inactive'); setPage(1); }}>
          <CardContent className="p-4 flex items-center gap-3">
            <UserX className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{inactiveCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">ยกเลิกแล้ว</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="mb-4">
        <CardContent className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา: อีเมล / ชื่อ / นามสกุล / บริษัท / เบอร์ / เลขผู้เสียภาษี..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 / หน้า</SelectItem>
                <SelectItem value="50">50 / หน้า</SelectItem>
                <SelectItem value="100">100 / หน้า</SelectItem>
                <SelectItem value="200">200 / หน้า</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refreshAll}>
              <RefreshCw className="w-4 h-4 mr-1" /> รีเฟรช
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV('page')}>
              <Download className="w-4 h-4 mr-1" /> Export หน้านี้
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCSV('all')}>
              <Download className="w-4 h-4 mr-1" /> Export ทั้งหมด
            </Button>
            <Button size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 mr-1" /> Import CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <Card className="mb-4 border-primary">
          <CardContent className="p-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">
              เลือก <span className="text-primary">{selectedIds.size.toLocaleString()}</span> รายการ
            </span>
            <Button size="sm" variant="outline" onClick={() => setBulkAction('activate')}>
              <UserCheck className="w-4 h-4 mr-1" /> เปิดใช้งาน
            </Button>
            <Button size="sm" variant="outline" onClick={() => setBulkAction('deactivate')}>
              <UserX className="w-4 h-4 mr-1" /> ยกเลิกรับข่าว
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setBulkAction('delete')}>
              <Trash2 className="w-4 h-4 mr-1" /> ลบ
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              ล้างการเลือก
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                    onCheckedChange={(c) => togglePageSelect(!!c)}
                    aria-label="เลือกทั้งหน้า"
                  />
                </TableHead>
                <TableHead>อีเมล / ชื่อ</TableHead>
                <TableHead className="hidden md:table-cell">บริษัท</TableHead>
                <TableHead className="hidden lg:table-cell">โทรศัพท์</TableHead>
                <TableHead className="hidden xl:table-cell">แหล่งที่มา</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="hidden md:table-cell">วันที่สมัคร</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((sub) => {
                  const checked = selectedIds.has(sub.id);
                  const fullName = [sub.first_name, sub.last_name].filter(Boolean).join(' ');
                  return (
                    <TableRow
                      key={sub.id}
                      data-state={checked ? 'selected' : undefined}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => { setSelected(sub); setNoteText(sub.notes || ''); }}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => toggleRowSelect(sub.id, !!c)}
                          aria-label="เลือกแถว"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{sub.email}</div>
                        {fullName && <div className="text-xs text-muted-foreground">{fullName}</div>}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {sub.company || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {sub.phone || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="outline" className="text-xs">{sub.source || 'website'}</Badge>
                      </TableCell>
                      <TableCell>
                        {sub.is_active ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => { setSelected(sub); setNoteText(sub.notes || ''); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-4 border-t">
          <p className="text-xs text-muted-foreground">
            {subscribers.length > 0
              ? `แสดง ${fromIdx.toLocaleString()}–${toIdx.toLocaleString()}${filter === 'all' && !search ? ` จาก ${totalCount.toLocaleString()}` : ''}`
              : 'ไม่มีข้อมูลในหน้านี้'}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(1)} disabled={page === 1 || loading}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 text-sm">
              หน้า <strong>{page}</strong>
              {filter === 'all' && !search && totalCount > 0 && ` / ${Math.max(1, Math.ceil(totalCount / pageSize)).toLocaleString()}`}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => p + 1)} disabled={!hasNext || loading}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            {filter === 'all' && !search && (
              <Button
                variant="outline" size="icon" className="h-8 w-8"
                onClick={() => setPage(Math.max(1, Math.ceil(totalCount / pageSize)))}
                disabled={!hasNext || loading}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดสมาชิก</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">อีเมล</p>
                <p className="font-medium break-all">{selected.email}</p>
              </div>
              {(selected.first_name || selected.last_name) && (
                <div>
                  <p className="text-sm text-muted-foreground">ชื่อ-นามสกุล</p>
                  <p className="text-sm">{[selected.first_name, selected.last_name].filter(Boolean).join(' ')}</p>
                </div>
              )}
              {selected.company && (
                <div>
                  <p className="text-sm text-muted-foreground">บริษัท</p>
                  <p className="text-sm">{selected.company}{selected.position ? ` — ${selected.position}` : ''}</p>
                </div>
              )}
              {(selected.phone || selected.phone_secondary) && (
                <div>
                  <p className="text-sm text-muted-foreground">โทรศัพท์</p>
                  <p className="text-sm">{[selected.phone, selected.phone_secondary].filter(Boolean).join(' / ')}</p>
                </div>
              )}
              {(selected.address || selected.city || selected.country) && (
                <div>
                  <p className="text-sm text-muted-foreground">ที่อยู่</p>
                  <p className="text-sm">{[selected.address, selected.city, selected.state_region, selected.zip, selected.country].filter(Boolean).join(', ')}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">แหล่งที่มา</p>
                  <p className="text-sm">{selected.source || 'website'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">สถานะ</p>
                  {selected.is_active ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">วันที่สมัคร</p>
                <p className="text-sm">{new Date(selected.created_at).toLocaleString('th-TH')}</p>
              </div>
              {selected.unsubscribed_at && (
                <div>
                  <p className="text-sm text-muted-foreground">วันที่ยกเลิก</p>
                  <p className="text-sm text-red-500">{new Date(selected.unsubscribed_at).toLocaleString('th-TH')}</p>
                </div>
              )}
              {selected.imported_from && (
                <div>
                  <p className="text-sm text-muted-foreground">นำเข้าจากไฟล์</p>
                  <p className="text-xs font-mono break-all">{selected.imported_from}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">บันทึก (Notes)</p>
                <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="เพิ่มบันทึกเกี่ยวกับสมาชิก..." rows={3} />
              </div>
              {selected.extra_data && Object.keys(selected.extra_data).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ข้อมูลเพิ่มเติม (extra_data)</p>
                  <pre className="text-xs bg-muted p-2 rounded max-h-40 overflow-auto">{JSON.stringify(selected.extra_data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2">
            {selected && (
              <>
                <Button variant={selected.is_active ? 'destructive' : 'default'} size="sm" onClick={() => toggleStatus(selected)}>
                  {selected.is_active ? <><UserX className="w-4 h-4 mr-1" /> ยกเลิก</> : <><UserCheck className="w-4 h-4 mr-1" /> เปิดใช้งาน</>}
                </Button>
                <Button size="sm" onClick={saveNotes} disabled={saving}>
                  บันทึกโน้ต
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk action confirm */}
      <AlertDialog open={!!bulkAction} onOpenChange={(o) => { if (!o && !bulkRunning) setBulkAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'delete' && '🗑️ ลบสมาชิกที่เลือก?'}
              {bulkAction === 'activate' && '✅ เปิดใช้งานสมาชิกที่เลือก?'}
              {bulkAction === 'deactivate' && '⛔ ยกเลิกการรับข่าวสมาชิกที่เลือก?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              จะดำเนินการกับ <strong>{selectedIds.size.toLocaleString()}</strong> รายการ
              {bulkAction === 'delete' && ' — การลบไม่สามารถย้อนกลับได้'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkRunning}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); runBulk(); }} disabled={bulkRunning}>
              {bulkRunning ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> กำลังดำเนินการ...</> : 'ยืนยัน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SubscribersImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={refreshAll}
      />
    </AdminPageLayout>
    </AdminLayout>
  );
};

export default AdminSubscribers;
