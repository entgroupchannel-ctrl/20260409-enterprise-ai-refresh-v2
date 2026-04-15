import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WarrantyStatusBadge from '@/components/admin/WarrantyStatusBadge';
import RegisterProductDialog from '@/components/admin/RegisterProductDialog';

type WarrantyStatus = 'all' | 'active' | 'expiring' | 'expired' | 'void' | 'pending_verification';

function computeWarrantyStatus(endDate: string | null, status: string): 'active' | 'expiring' | 'expired' | 'void' | 'pending_verification' {
  if (status === 'void') return 'void';
  if (status === 'pending_verification') return 'pending_verification';
  if (!endDate) return 'active';
  const days = Math.floor((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}

function daysRemaining(endDate: string | null): number | undefined {
  if (!endDate) return undefined;
  return Math.floor((new Date(endDate).getTime() - Date.now()) / 86400000);
}

export default function AdminRegisteredProductsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<WarrantyStatus>('all');
  const [registerOpen, setRegisterOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('registered_products')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(500);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') {
      list = list.filter(i => computeWarrantyStatus(i.warranty_end_date, i.status) === tab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.serial_number?.toLowerCase().includes(q) ||
        i.customer_name?.toLowerCase().includes(q) ||
        i.product_name_snapshot?.toLowerCase().includes(q) ||
        i.registration_number?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, tab, search]);

  const counts = useMemo(() => {
    const c = { all: items.length, active: 0, expiring: 0, expired: 0, void: 0, pending_verification: 0 };
    items.forEach(i => { const s = computeWarrantyStatus(i.warranty_end_date, i.status); c[s]++; });
    return c;
  }, [items]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> ลงทะเบียนสินค้า</h1>
            <p className="text-muted-foreground text-sm mt-1">จัดการ Serial Number และการรับประกัน</p>
          </div>
          <Button onClick={() => setRegisterOpen(true)}><Plus className="w-4 h-4 mr-1.5" /> ลงทะเบียนใหม่</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="ค้นหา SN, ชื่อลูกค้า, สินค้า..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <Tabs value={tab} onValueChange={v => setTab(v as WarrantyStatus)}>
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด ({counts.all})</TabsTrigger>
            <TabsTrigger value="active">ในประกัน ({counts.active})</TabsTrigger>
            <TabsTrigger value="expiring">ใกล้หมด ({counts.expiring})</TabsTrigger>
            <TabsTrigger value="expired">หมดแล้ว ({counts.expired})</TabsTrigger>
            <TabsTrigger value="pending_verification">รออนุมัติ ({counts.pending_verification})</TabsTrigger>
            <TabsTrigger value="void">ยกเลิก ({counts.void})</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">ไม่พบรายการ</div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขทะเบียน</TableHead>
                  <TableHead>สินค้า</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>หมดประกัน</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(item => {
                  const ws = computeWarrantyStatus(item.warranty_end_date, item.status);
                  const dr = daysRemaining(item.warranty_end_date);
                  return (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/registered-products/${item.id}`)}>
                      <TableCell className="font-mono text-xs">{item.registration_number}</TableCell>
                      <TableCell className="font-medium">{item.product_name_snapshot}</TableCell>
                      <TableCell className="font-mono text-sm">{item.serial_number}</TableCell>
                      <TableCell>
                        <div>{item.customer_name}</div>
                        {item.customer_company && <div className="text-xs text-muted-foreground">{item.customer_company}</div>}
                      </TableCell>
                      <TableCell className="text-sm">{item.warranty_end_date ? new Date(item.warranty_end_date).toLocaleDateString('th-TH') : '-'}</TableCell>
                      <TableCell><WarrantyStatusBadge status={ws} daysRemaining={dr} size="sm" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <RegisterProductDialog open={registerOpen} onOpenChange={setRegisterOpen} onSuccess={loadData} />
    </AdminLayout>
  );
}
