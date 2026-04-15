import { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Users, Building2, User, Search, Plus, Pencil, Trash2, Loader2,
} from 'lucide-react';
import ContactFormDialog from '@/components/admin/ContactFormDialog';
import ContactSubmissionsList from '@/components/admin/ContactSubmissionsList';

interface Contact {
  id: string;
  contact_type: 'customer' | 'supplier' | 'both';
  entity_type: 'individual' | 'juristic';
  company_name: string;
  contact_code: string | null;
  business_location: string | null;
  address: string | null;
  postal_code: string | null;
  tax_id: string | null;
  branch_code: string | null;
  branch_type: string | null;
  branch_name: string | null;
  contact_name: string | null;
  contact_position: string | null;
  email: string | null;
  mobile_phone: string | null;
  office_phone: string | null;
  fax: string | null;
  line_id: string | null;
  credit_days: number;
  is_active: boolean;
  created_at: string;
}

const PAGE_SIZE = 50;

export default function AdminContacts() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const isAdmin = profile?.role === 'admin';
  const [viewTab, setViewTab] = useState<'contacts' | 'submissions'>('contacts');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [stats, setStats] = useState({ total: 0, customer: 0, supplier: 0, both: 0 });

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'customer' | 'supplier' | 'both'>('all');
  const [entityFilter, setEntityFilter] = useState<'all' | 'individual' | 'juristic'>('all');
  const [page, setPage] = useState(1);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [typeFilter, entityFilter]);
  useEffect(() => { loadContacts(); }, [debouncedSearch, typeFilter, entityFilter, page]);
  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [totalRes, customerRes, supplierRes, bothRes] = await Promise.all([
        (supabase as any).from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        (supabase as any).from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('contact_type', 'customer'),
        (supabase as any).from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('contact_type', 'supplier'),
        (supabase as any).from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('contact_type', 'both'),
      ]);

      setStats({
        total: totalRes.count || 0,
        customer: customerRes.count || 0,
        supplier: supplierRes.count || 0,
        both: bothRes.count || 0,
      });
    } catch (e) {
      console.error('loadStats error:', e);
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      let query = (supabase as any).from('contacts')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      if (typeFilter !== 'all') {
        if (typeFilter === 'customer') {
          query = query.in('contact_type', ['customer', 'both']);
        } else if (typeFilter === 'supplier') {
          query = query.in('contact_type', ['supplier', 'both']);
        } else {
          query = query.eq('contact_type', typeFilter);
        }
      }

      if (entityFilter !== 'all') {
        query = query.eq('entity_type', entityFilter);
      }

      if (debouncedSearch) {
        query = query.or(
          `company_name.ilike.%${debouncedSearch}%,contact_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%,tax_id.ilike.%${debouncedSearch}%,mobile_phone.ilike.%${debouncedSearch}%`
        );
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query
        .order('company_name', { ascending: true })
        .range(from, to);

      if (error) throw error;

      setContacts((data as Contact[]) || []);
      setTotalCount(count || 0);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingContact || !isAdmin) return;
    try {
      const { error } = await (supabase as any).from('contacts')
        .delete()
        .eq('id', deletingContact.id);
      if (error) throw error;
      toast({ title: '✅ ลบเรียบร้อย', description: deletingContact.company_name });
      setDeletingContact(null);
      loadContacts();
      loadStats();
    } catch (e: any) {
      toast({ title: 'ลบไม่สำเร็จ', description: e.message, variant: 'destructive' });
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AdminLayout>
      <AdminPageLayout
        title="สมุดรายชื่อ"
        description={`ลูกค้าและผู้จำหน่าย ${stats.total.toLocaleString()} รายการ`}
        actionButton={{
          label: 'เพิ่มรายชื่อใหม่',
          icon: <Plus className="w-4 h-4 mr-1.5" />,
          onClick: () => setShowAddDialog(true),
        }}
      >
        {/* Main Tab Switcher */}
        <Tabs value={viewTab} onValueChange={(v: any) => setViewTab(v)} className="mb-4">
          <TabsList>
            <TabsTrigger value="contacts">📒 สมุดรายชื่อ</TabsTrigger>
            <TabsTrigger value="submissions">📩 ข้อความจากลูกค้า</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">ทั้งหมด</p>
                      <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">ลูกค้า</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.customer.toLocaleString()}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-600 opacity-30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">ผู้จำหน่าย</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.supplier.toLocaleString()}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-orange-600 opacity-30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">ลูกค้า+ผู้จำหน่าย</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.both.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600 opacity-30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-3 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหา: ชื่อบริษัท / ผู้ติดต่อ / อีเมล / Tax ID / เบอร์โทร"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={entityFilter} onValueChange={(v: any) => setEntityFilter(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภท</SelectItem>
                      <SelectItem value="juristic">นิติบุคคล</SelectItem>
                      <SelectItem value="individual">บุคคลธรรมดา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Tabs value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
                  <TabsList>
                    <TabsTrigger value="all">ทั้งหมด ({stats.total})</TabsTrigger>
                    <TabsTrigger value="customer">ลูกค้า ({stats.customer})</TabsTrigger>
                    <TabsTrigger value="supplier">ผู้จำหน่าย ({stats.supplier})</TabsTrigger>
                    <TabsTrigger value="both">ทั้งคู่ ({stats.both})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>ไม่พบรายชื่อ</p>
                    <p className="text-xs mt-1">
                      {search ? 'ลองเปลี่ยนคำค้นหา' : 'เพิ่มลูกค้าใหม่หรือ import จาก Excel'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อบริษัท / ชื่อ</TableHead>
                        <TableHead>ผู้ติดต่อ</TableHead>
                        <TableHead>อีเมล</TableHead>
                        <TableHead>เบอร์โทร</TableHead>
                        <TableHead>Tax ID</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <div className="flex items-start gap-2">
                              {c.entity_type === 'juristic' ? (
                                <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              ) : (
                                <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate max-w-[280px]">{c.company_name}</p>
                                {c.branch_type === 'branch' && c.branch_name && (
                                  <p className="text-xs text-muted-foreground">สาขา: {c.branch_name}</p>
                                )}
                                {c.branch_type === 'head_office' && (
                                  <p className="text-xs text-muted-foreground">สำนักงานใหญ่</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {c.contact_name || <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell className="text-xs">
                            {c.email ? (
                              <a href={`mailto:${c.email}`} className="text-primary hover:underline">{c.email}</a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {c.mobile_phone || c.office_phone || <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell className="text-xs font-mono">
                            {c.tax_id || <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell>
                            {c.contact_type === 'customer' && <Badge variant="outline" className="text-xs">ลูกค้า</Badge>}
                            {c.contact_type === 'supplier' && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">ผู้จำหน่าย</Badge>
                            )}
                            {c.contact_type === 'both' && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">ทั้งคู่</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingContact(c)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              {isAdmin && (
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeletingContact(c)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  หน้า {page} / {totalPages} • รวม {totalCount.toLocaleString()} รายการ
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={pageNum === page}
                            onClick={() => setPage(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="mt-4">
            <ContactSubmissionsList />
          </TabsContent>
        </Tabs>

      <ContactFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => { loadContacts(); loadStats(); }}
      />

      {editingContact && (
        <ContactFormDialog
          open={!!editingContact}
          onOpenChange={(v) => !v && setEditingContact(null)}
          contact={editingContact}
          onSuccess={() => { setEditingContact(null); loadContacts(); }}
        />
      )}

      <AlertDialog open={!!deletingContact} onOpenChange={(v) => !v && setDeletingContact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจว่าต้องการลบ <strong>{deletingContact?.company_name}</strong>?
              <br />การลบนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              ลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
