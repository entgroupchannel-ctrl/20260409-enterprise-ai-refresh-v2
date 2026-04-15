import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Mail, Phone, Building2, MapPin, Clock,
  FileText, Receipt, Loader2, User,
} from 'lucide-react';

const formatDate = (s: string | null) => {
  if (!s) return '-';
  return new Date(s).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const formatDateTime = (s: string | null) => {
  if (!s) return 'ไม่เคย login';
  return new Date(s).toLocaleString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(n);

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const { data: cust, error: custErr } = await (supabase as any)
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (custErr) throw custErr;
      if (!cust) {
        toast({ title: 'ไม่พบลูกค้า', variant: 'destructive' });
        navigate('/admin/customers');
        return;
      }
      setCustomer(cust);

      const { data: quotesData } = await supabase
        .from('quote_requests')
        .select('id, quote_number, status, grand_total, created_at')
        .eq('customer_email', cust.email)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setQuotes(quotesData || []);

      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('id, invoice_number, status, grand_total, created_at')
        .eq('customer_email', cust.email)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setInvoices(invoicesData || []);
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!customer) return null;

  const displayName = customer.full_name || customer.contact_name || customer.email;
  const totalQuotes = quotes.length;
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + Number(inv.grand_total || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/customers')}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            ย้อนกลับ
          </Button>
        </div>

        {/* Customer header card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {customer.is_active ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      ใช้งาน
                    </Badge>
                  ) : (
                    <Badge variant="secondary">ปิดใช้งาน</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {customer.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ใบเสนอราคา</p>
                  <p className="text-2xl font-bold">{totalQuotes}</p>
                </div>
                <FileText className="w-8 h-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ใบวางบิล</p>
                  <p className="text-2xl font-bold">{totalInvoices}</p>
                </div>
                <Receipt className="w-8 h-8 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ยอดรวม</p>
                  <p className="text-2xl font-bold">฿{formatCurrency(totalRevenue)}</p>
                </div>
                <span className="text-2xl text-muted-foreground/50">฿</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Account info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                ข้อมูลบัญชี
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ชื่อ:</span>
                <span>{customer.full_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-xs">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เบอร์โทร:</span>
                <span>{customer.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">สมัครเมื่อ:</span>
                <span>{formatDate(customer.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Login ล่าสุด:</span>
                <span className="text-xs">{formatDateTime(customer.last_login)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Company info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                ข้อมูลบริษัท
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">บริษัท:</span>
                <span>{customer.company_name || customer.company || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เลขผู้เสียภาษี:</span>
                <span className="font-mono text-xs">{customer.company_tax_id || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เบอร์บริษัท:</span>
                <span>{customer.company_phone || '-'}</span>
              </div>
              {customer.company_address && (
                <div>
                  <p className="text-muted-foreground mb-1">ที่อยู่:</p>
                  <p className="text-xs">{customer.company_address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact person */}
          {(customer.contact_name || customer.contact_phone || customer.contact_email) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  ผู้ติดต่อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ชื่อ:</span>
                  <span>{customer.contact_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ตำแหน่ง:</span>
                  <span>{customer.contact_position || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เบอร์:</span>
                  <span>{customer.contact_phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-xs">{customer.contact_email || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Line:</span>
                  <span>{customer.contact_line || '-'}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping/billing */}
          {(customer.shipping_address || customer.billing_address) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ที่อยู่
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {customer.billing_address && (
                  <div>
                    <p className="text-muted-foreground mb-1">วางบิล:</p>
                    <p className="text-xs">{customer.billing_address}</p>
                  </div>
                )}
                {customer.shipping_address && (
                  <div>
                    <p className="text-muted-foreground mb-1">จัดส่ง:</p>
                    <p className="text-xs">{customer.shipping_address}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment terms:</span>
                  <span>{customer.payment_terms || '-'}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent quotes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" />
              ใบเสนอราคาล่าสุด ({quotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                ยังไม่มีใบเสนอราคา
              </p>
            ) : (
              <div className="space-y-2">
                {quotes.slice(0, 10).map((q: any) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer"
                    onClick={() => navigate(`/admin/quotes/${q.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-sm font-medium">{q.quote_number}</span>
                      <Badge variant="outline" className="text-xs">{q.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground text-xs">
                        {formatDate(q.created_at)}
                      </span>
                      <span className="font-mono">฿{formatCurrency(Number(q.grand_total || 0))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              ใบวางบิลล่าสุด ({invoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                ยังไม่มีใบวางบิล
              </p>
            ) : (
              <div className="space-y-2">
                {invoices.slice(0, 10).map((inv: any) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer"
                    onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-sm font-medium">{inv.invoice_number}</span>
                      <Badge variant="outline" className="text-xs">{inv.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground text-xs">
                        {formatDate(inv.created_at)}
                      </span>
                      <span className="font-mono">฿{formatCurrency(Number(inv.grand_total || 0))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
