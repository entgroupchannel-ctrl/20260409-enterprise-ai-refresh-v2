import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SupplierStatusBadge from '@/components/admin/SupplierStatusBadge';
import SupplierApprovalList from '@/components/admin/SupplierApprovalList';
import SupplierRegistrationForm from '@/components/admin/SupplierRegistrationForm';
import SupplierDocumentForm from '@/components/admin/SupplierDocumentForm';
import SupplierPaymentHistory from '@/components/admin/SupplierPaymentHistory';
import {
  Building2, Clock, CheckCircle, XCircle, FileEdit, Star, Award,
  Search, RefreshCw, Loader2, Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Supplier {
  id: string;
  supplier_code: string | null;
  company_name: string;
  company_name_en: string | null;
  country: string | null;
  main_products: string[] | null;
  status: string;
  quality_rating: number | null;
  is_preferred: boolean | null;
  created_at: string;
}

export default function AdminSupplierManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('list');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, draft: 0, preferred: 0, highRating: 0 });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('id, supplier_code, company_name, company_name_en, country, main_products, status, quality_rating, is_preferred, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    const list = (data as Supplier[]) || [];
    setSuppliers(list);
    setStats({
      total: list.length,
      pending: list.filter(s => s.status === 'pending').length,
      approved: list.filter(s => s.status === 'approved').length,
      rejected: list.filter(s => s.status === 'rejected').length,
      draft: list.filter(s => s.status === 'draft').length,
      preferred: list.filter(s => s.is_preferred).length,
      highRating: list.filter(s => (s.quality_rating || 0) >= 4).length,
    });
    setLoading(false);
  };

  const filtered = suppliers.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.company_name.toLowerCase().includes(q) ||
        (s.supplier_code || '').toLowerCase().includes(q) ||
        (s.country || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const softDelete = async (id: string) => {
    await supabase.from('suppliers').update({ deleted_at: new Date().toISOString() } as any).eq('id', id);
    load();
  };

  const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
          <Icon className={`w-6 h-6 ${color} opacity-40`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">จัดการ Supplier</h1>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> รีเฟรช
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="ทั้งหมด" value={stats.total} icon={Building2} color="text-foreground" />
          <StatCard label="รออนุมัติ" value={stats.pending} icon={Clock} color="text-yellow-500" />
          <StatCard label="อนุมัติ" value={stats.approved} icon={CheckCircle} color="text-green-500" />
          <StatCard label="ปฏิเสธ" value={stats.rejected} icon={XCircle} color="text-red-500" />
          <StatCard label="ร่าง" value={stats.draft} icon={FileEdit} color="text-muted-foreground" />
          <StatCard label="Preferred" value={stats.preferred} icon={Star} color="text-amber-500" />
          <StatCard label="คะแนน ≥4" value={stats.highRating} icon={Award} color="text-purple-500" />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="approval" className="text-xs">รออนุมัติ{stats.pending > 0 && ` (${stats.pending})`}</TabsTrigger>
            <TabsTrigger value="list" className="text-xs">รายการ</TabsTrigger>
            <TabsTrigger value="register" className="text-xs">ลงทะเบียน</TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">เอกสาร</TabsTrigger>
            <TabsTrigger value="payments" className="text-xs">ประวัติจ่าย</TabsTrigger>
            <TabsTrigger value="transfers" className="text-xs">โอนเงิน</TabsTrigger>
          </TabsList>

          <TabsContent value="approval">
            <SupplierApprovalList />
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="ค้นหาชื่อ, รหัส, ประเทศ..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสถานะ</SelectItem>
                      <SelectItem value="draft">ร่าง</SelectItem>
                      <SelectItem value="pending">รออนุมัติ</SelectItem>
                      <SelectItem value="approved">อนุมัติ</SelectItem>
                      <SelectItem value="rejected">ปฏิเสธ</SelectItem>
                      <SelectItem value="suspended">ระงับ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>บริษัท</TableHead>
                        <TableHead>ประเทศ</TableHead>
                        <TableHead>สินค้า</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>คะแนน</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล</TableCell></TableRow>
                      ) : filtered.map(s => (
                        <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-mono text-xs">{s.supplier_code}</TableCell>
                          <TableCell>
                            <div className="font-medium">{s.company_name}</div>
                            {s.company_name_en && <div className="text-xs text-muted-foreground">{s.company_name_en}</div>}
                          </TableCell>
                          <TableCell>{s.country || '-'}</TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{s.main_products?.join(', ') || '-'}</TableCell>
                          <TableCell><SupplierStatusBadge status={s.status} /></TableCell>
                          <TableCell>
                            {s.quality_rating != null ? (
                              <span className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                {s.quality_rating}
                              </span>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => softDelete(s.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <SupplierRegistrationForm onSaved={() => { load(); setTab('list'); }} />
          </TabsContent>

          <TabsContent value="documents">
            <SupplierDocumentForm />
          </TabsContent>

          <TabsContent value="payments">
            <SupplierPaymentHistory />
          </TabsContent>

          <TabsContent value="transfers">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold">การโอนเงินต่างประเทศ</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">ไปที่หน้าจัดการโอนเงินต่างประเทศ</p>
                <Button onClick={() => navigate('/admin/international-transfer')}>เปิดหน้าโอนเงิน</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
