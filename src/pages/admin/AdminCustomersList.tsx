import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, Search, Mail, Building2, Phone, Clock, Eye, Loader2,
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  company_name: string | null;
  company_tax_id: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
}

const formatDateTime = (s: string | null) => {
  if (!s) return 'ไม่เคย login';
  return new Date(s).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminCustomersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('customers')
        .select('id, email, full_name, phone, company, is_active, last_login, created_at, company_name, company_tax_id, contact_name, contact_phone, contact_email')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers((data as Customer[]) || []);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c => {
    if (filterStatus === 'active' && !c.is_active) return false;
    if (filterStatus === 'inactive' && c.is_active) return false;
    
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.email?.toLowerCase().includes(q) ||
      c.full_name?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.company_name?.toLowerCase().includes(q) ||
      c.company_tax_id?.includes(q) ||
      c.contact_name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.contact_phone?.includes(q)
    );
  });

  const displayName = (c: Customer) => 
    c.full_name || c.contact_name || c.email;
  
  const displayCompany = (c: Customer) => 
    c.company_name || c.company || '-';
  
  const displayPhone = (c: Customer) => 
    c.contact_phone || c.phone || '-';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              ลูกค้า (Members)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ลูกค้าที่สมัครสมาชิกและ login ได้ ({customers.length} ราย)
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา: email, ชื่อ, บริษัท, เลขผู้เสียภาษี, เบอร์โทร..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {search || filterStatus !== 'all' 
                ? 'ไม่พบลูกค้าตามเงื่อนไข'
                : 'ยังไม่มีลูกค้าในระบบ'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((customer) => (
              <Card 
                key={customer.id}
                className="hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/customers/${customer.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base truncate">
                          {displayName(customer)}
                        </h3>
                        {customer.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                            ใช้งาน
                          </Badge>
                        ) : (
                          <Badge variant="secondary">ปิดใช้งาน</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>

                      {displayCompany(customer) !== '-' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {displayCompany(customer)}
                            {customer.company_tax_id && (
                              <span className="ml-2 text-xs">
                                (เลขผู้เสียภาษี: {customer.company_tax_id})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {displayPhone(customer) !== '-' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{displayPhone(customer)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Login ล่าสุด: {formatDateTime(customer.last_login)}</span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/customers/${customer.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      ดูรายละเอียด
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
