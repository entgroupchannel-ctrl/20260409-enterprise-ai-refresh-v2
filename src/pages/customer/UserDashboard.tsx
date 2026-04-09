// src/pages/customer/UserDashboard.tsx
// Unified single-page dashboard — Quotes, Cart, Profile all in one view

import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteTimelineBadge } from '@/components/rfq/QuoteTimeline';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import {
  FileText, ShoppingCart, User, Building, MapPin, Truck,
  Plus, Search, Clock, Eye, MoreVertical, Download, Printer,
  Share2, ArrowLeft, Save, Trash2, Minus, Home, LogOut,
  ChevronRight, Package, Phone, Mail, Upload,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow, format } from 'date-fns';
import { th } from 'date-fns/locale';

// ─── Types ───
interface Quote {
  id: string;
  quote_number: string;
  status: string;
  grand_total: number;
  created_at: string;
  sent_at: string | null;
  valid_until: string | null;
  products: any[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  customer_address: string;
  customer_tax_id: string;
  notes: string;
  subtotal: number;
  vat_amount: number;
  payment_terms: string;
  delivery_terms: string;
  warranty_terms: string;
}

interface ProfileData {
  company_name: string; company_tax_id: string; company_address: string; company_phone: string;
  contact_name: string; contact_position: string; contact_phone: string; contact_email: string; contact_line: string;
  billing_address: string; billing_district: string; billing_city: string; billing_province: string; billing_postal_code: string; billing_country: string;
  shipping_same_as_billing: boolean;
  shipping_address: string; shipping_district: string; shipping_city: string; shipping_province: string; shipping_postal_code: string; shipping_country: string;
  payment_terms: string; delivery_method: string; notes: string;
}

const emptyProfile: ProfileData = {
  company_name: '', company_tax_id: '', company_address: '', company_phone: '',
  contact_name: '', contact_position: '', contact_phone: '', contact_email: '', contact_line: '',
  billing_address: '', billing_district: '', billing_city: '', billing_province: '', billing_postal_code: '', billing_country: 'ไทย',
  shipping_same_as_billing: true,
  shipping_address: '', shipping_district: '', shipping_city: '', shipping_province: '', shipping_postal_code: '', shipping_country: 'ไทย',
  payment_terms: '', delivery_method: '', notes: '',
};

type Section = 'quotes' | 'quote-detail' | 'cart' | 'profile';

export default function UserDashboard() {
  const { user, profile: authProfile, signOut } = useAuth();
  const { items, count, loading: cartLoading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active section from URL
  const sectionParam = (searchParams.get('tab') || 'quotes') as Section;
  const quoteId = searchParams.get('id');
  const activeSection = quoteId ? 'quote-detail' : sectionParam;

  const setSection = (s: Section) => {
    if (s === 'quotes') setSearchParams({});
    else setSearchParams({ tab: s });
  };

  // ─── Quotes state ───
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // ─── Profile state ───
  const [profileForm, setProfileForm] = useState<ProfileData>(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Cart submission ───
  const [submitting, setSubmitting] = useState(false);

  // Load quotes
  useEffect(() => {
    if (!user) return;
    loadQuotes();
    const channel = supabase
      .channel('user_quote_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setQuotes(prev => prev.map(q => q.id === (payload.new as any).id ? { ...q, ...payload.new } : q));
        }
      })
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user]);

  // Load profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase.from as any)('user_profiles')
        .select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setProfileForm(prev => {
          const merged = { ...prev };
          Object.keys(prev).forEach(k => { if (data[k] != null) (merged as any)[k] = data[k]; });
          return merged;
        });
      } else {
        setProfileForm(prev => ({
          ...prev,
          contact_name: authProfile?.full_name || '',
          contact_email: user.email || '',
          contact_phone: authProfile?.phone || '',
          company_name: authProfile?.company || '',
        }));
      }
      setProfileLoading(false);
    })();
  }, [user, authProfile]);

  // Load quote detail when id changes
  useEffect(() => {
    if (quoteId) {
      const found = quotes.find(q => q.id === quoteId);
      if (found) setSelectedQuote(found);
      else loadQuoteDetail(quoteId);
    } else {
      setSelectedQuote(null);
    }
  }, [quoteId, quotes]);

  // Filter quotes
  useEffect(() => {
    let filtered = quotes;
    if (searchQuery) {
      filtered = filtered.filter(q =>
        q.quote_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.products?.some((p: any) => p.model?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (statusFilter !== 'all') filtered = filtered.filter(q => q.status === statusFilter);
    setFilteredQuotes(filtered);
  }, [quotes, searchQuery, statusFilter]);

  const loadQuotes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data, error } = await supabase
        .from('quote_requests').select('*')
        .eq('customer_email', userData.user.email!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setQuotes((data as any[]) || []);
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setQuotesLoading(false);
    }
  };

  const loadQuoteDetail = async (id: string) => {
    const { data } = await supabase.from('quote_requests').select('*').eq('id', id).maybeSingle();
    if (data) setSelectedQuote(data as any);
  };

  const openQuote = (id: string) => setSearchParams({ id });

  const formatCurrency = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const m: Record<string, string> = { pending: 'รอใบเสนอราคา', quote_sent: 'ได้รับราคาแล้ว', po_uploaded: 'ส่ง PO แล้ว', po_approved: 'อนุมัติแล้ว', completed: 'เสร็จสิ้น', rejected: 'ไม่อนุมัติ' };
    return m[status] || status;
  };

  // ─── Profile save ───
  const updateField = (f: keyof ProfileData, v: any) => setProfileForm(prev => ({ ...prev, [f]: v }));
  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await (supabase.from as any)('user_profiles')
        .upsert({ user_id: user.id, ...profileForm, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
        .select().single();
      if (error) throw error;
      toast({ title: 'บันทึกสำเร็จ' });
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // ─── Cart → Quote ───
  const handleCreateQuote = async () => {
    if (!user || items.length === 0) return;
    const { data: profile } = await (supabase.from as any)('user_profiles')
      .select('*').eq('user_id', user.id).maybeSingle();
    if (!profile || !profile.company_name) {
      toast({ title: 'กรุณากรอกข้อมูลโปรไฟล์ก่อน', description: 'ระบบต้องการข้อมูลบริษัท' });
      setSection('profile');
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await (supabase.from as any)('quote_requests')
        .insert({
          quote_number: '',
          customer_name: profile.contact_name || user.email,
          customer_email: profile.contact_email || user.email,
          customer_phone: profile.contact_phone || null,
          customer_company: profile.company_name || null,
          customer_address: profile.billing_address || null,
          customer_tax_id: profile.company_tax_id || null,
          customer_line: profile.contact_line || null,
          products: items.map(item => ({
            model: item.product_model,
            description: item.product_description || item.product_name || '',
            qty: item.quantity,
            unit_price: item.estimated_price || 0,
            discount_percent: 0,
            line_total: (item.estimated_price || 0) * item.quantity,
          })),
          status: 'pending', subtotal: 0, vat_amount: 0, grand_total: 0, created_by: user.id,
        }).select().single();
      if (error) throw error;
      await clearCart();
      toast({ title: 'สร้างใบเสนอราคาสำเร็จ', description: `เลขที่ ${data.quote_number}` });
      loadQuotes();
      setSection('quotes');
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Sidebar menu items ───
  const menuItems = [
    { key: 'quotes' as Section, label: 'ใบเสนอราคา', icon: FileText, badge: quotes.length },
    { key: 'cart' as Section, label: 'ตะกร้าสินค้า', icon: ShoppingCart, badge: count },
    { key: 'profile' as Section, label: 'โปรไฟล์', icon: User, badge: 0 },
  ];

  const Field = ({ label, field, type = 'text', placeholder = '' }: { label: string; field: keyof ProfileData; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={(profileForm[field] as string) || ''} onChange={e => updateField(field, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <>
      <SEOHead title="แดชบอร์ดของฉัน | ENT Group" description="จัดการใบเสนอราคา ตะกร้า และโปรไฟล์" />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top bar */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />หน้าแรก
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-sm font-semibold hidden sm:block">แดชบอร์ดของฉัน</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-1" /> ออกจากระบบ
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 border-r border-border bg-card hidden md:block">
            <nav className="p-3 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeSection === item.key || (item.key === 'quotes' && activeSection === 'quote-detail')
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">{item.badge}</Badge>
                  )}
                </button>
              ))}
            </nav>

            <Separator className="mx-3" />
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/request-quote')}>
                <Plus className="w-4 h-4 mr-1" /> ขอใบเสนอราคา
              </Button>
            </div>
          </aside>

          {/* Mobile bottom nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20 flex">
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                  activeSection === item.key || (item.key === 'quotes' && activeSection === 'quote-detail')
                    ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{item.badge}</span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">

              {/* ─── QUOTES LIST ─── */}
              {activeSection === 'quotes' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">📋 ใบเสนอราคาของฉัน</h2>
                      <p className="text-sm text-muted-foreground mt-1">ติดตามสถานะและจัดการใบเสนอราคา</p>
                    </div>
                    <Button onClick={() => navigate('/request-quote')}>
                      <Plus className="w-4 h-4 mr-2" />สร้างใบขอราคาใหม่
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'ทั้งหมด', value: quotes.length, color: 'text-primary', filter: 'all' },
                      { label: 'รอใบเสนอราคา', value: quotes.filter(q => q.status === 'pending').length, color: 'text-yellow-600', filter: 'pending' },
                      { label: 'ได้รับราคา', value: quotes.filter(q => q.status === 'quote_sent').length, color: 'text-blue-600', filter: 'quote_sent' },
                      { label: 'เสร็จสิ้น', value: quotes.filter(q => ['po_approved', 'completed'].includes(q.status)).length, color: 'text-green-600', filter: 'completed' },
                    ].map(s => (
                      <Card key={s.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(s.filter)}>
                        <CardContent className="pt-5 pb-4 text-center">
                          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Filter */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="ค้นหาเลขที่, รุ่นสินค้า..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                        <SelectItem value="pending">รอใบเสนอราคา</SelectItem>
                        <SelectItem value="quote_sent">ได้รับราคาแล้ว</SelectItem>
                        <SelectItem value="po_uploaded">ส่ง PO แล้ว</SelectItem>
                        <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* List */}
                  {quotesLoading ? (
                    <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                  ) : filteredQuotes.length === 0 ? (
                    <Card><CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">ไม่มีใบเสนอราคา</p>
                    </CardContent></Card>
                  ) : (
                    <div className="space-y-3">
                      {filteredQuotes.map(q => (
                        <Card key={q.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openQuote(q.id)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{q.quote_number}</span>
                                  <QuoteTimelineBadge currentStatus={q.status} />
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span><Clock className="w-3 h-3 inline mr-1" />{formatDistanceToNow(new Date(q.created_at), { addSuffix: true, locale: th })}</span>
                                  <span>{q.products?.length || 0} รายการ</span>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                {q.grand_total > 0 && <span className="font-bold text-primary">{formatCurrency(q.grand_total)}</span>}
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── QUOTE DETAIL ─── */}
              {activeSection === 'quote-detail' && selectedQuote && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => setSearchParams({})}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
                    </Button>
                    <div>
                      <h2 className="text-xl font-bold">{selectedQuote.quote_number}</h2>
                      <p className="text-xs text-muted-foreground">
                        สร้างเมื่อ {format(new Date(selectedQuote.created_at), 'd MMM yyyy HH:mm', { locale: th })}
                      </p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <Card><CardContent className="py-6"><QuoteTimeline currentStatus={selectedQuote.status} size="lg" /></CardContent></Card>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Items */}
                    <div className="lg:col-span-2 space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4" /> รายการสินค้า</CardTitle></CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead><tr className="border-b text-xs text-muted-foreground">
                                <th className="text-left py-2 pr-2">#</th>
                                <th className="text-left py-2">รุ่น / รายละเอียด</th>
                                <th className="text-right py-2 px-2">จำนวน</th>
                                <th className="text-right py-2 px-2">ราคา/หน่วย</th>
                                <th className="text-right py-2">รวม</th>
                              </tr></thead>
                              <tbody>
                                {selectedQuote.products?.map((p: any, i: number) => (
                                  <tr key={i} className="border-b last:border-0">
                                    <td className="py-2 pr-2 text-muted-foreground">{i + 1}</td>
                                    <td className="py-2">
                                      <p className="font-medium">{p.model}</p>
                                      {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                    </td>
                                    <td className="text-right py-2 px-2">{p.qty}</td>
                                    <td className="text-right py-2 px-2">{formatCurrency(p.unit_price)}</td>
                                    <td className="text-right py-2 font-medium">{formatCurrency(p.line_total || p.unit_price * p.qty)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {selectedQuote.grand_total > 0 && (
                            <>
                              <Separator className="my-3" />
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">ราคาก่อน VAT</span><span>{formatCurrency(selectedQuote.subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">VAT 7%</span><span>{formatCurrency(selectedQuote.vat_amount)}</span></div>
                                <div className="flex justify-between font-bold text-base pt-1"><span>ยอดรวมสุทธิ</span><span className="text-primary">{formatCurrency(selectedQuote.grand_total)}</span></div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="w-4 h-4" /> ข้อมูลลูกค้า</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-2">
                          <p className="font-medium">{selectedQuote.customer_company || selectedQuote.customer_name}</p>
                          {selectedQuote.customer_tax_id && <p className="text-muted-foreground">Tax ID: {selectedQuote.customer_tax_id}</p>}
                          <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3 h-3" />{selectedQuote.customer_email}</div>
                          {selectedQuote.customer_phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3 h-3" />{selectedQuote.customer_phone}</div>}
                          {selectedQuote.customer_address && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3 h-3" />{selectedQuote.customer_address}</div>}
                        </CardContent>
                      </Card>

                      {(selectedQuote.payment_terms || selectedQuote.delivery_terms || selectedQuote.warranty_terms) && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">เงื่อนไข</CardTitle></CardHeader>
                          <CardContent className="text-sm space-y-2">
                            {selectedQuote.payment_terms && <div><span className="text-muted-foreground">การชำระ:</span> {selectedQuote.payment_terms}</div>}
                            {selectedQuote.delivery_terms && <div><span className="text-muted-foreground">การจัดส่ง:</span> {selectedQuote.delivery_terms}</div>}
                            {selectedQuote.warranty_terms && <div><span className="text-muted-foreground">รับประกัน:</span> {selectedQuote.warranty_terms}</div>}
                            {selectedQuote.valid_until && <div><span className="text-muted-foreground">ใช้ได้ถึง:</span> {format(new Date(selectedQuote.valid_until), 'd MMM yyyy', { locale: th })}</div>}
                          </CardContent>
                        </Card>
                      )}

                      {selectedQuote.notes && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">หมายเหตุ</CardTitle></CardHeader>
                          <CardContent className="text-sm text-muted-foreground">{selectedQuote.notes}</CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── CART ─── */}
              {activeSection === 'cart' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart className="w-6 h-6" /> ตะกร้าสินค้า</h2>
                    <p className="text-sm text-muted-foreground mt-1">เลือกสินค้าแล้วสร้างใบขอราคาได้ในคลิกเดียว</p>
                  </div>

                  {items.length === 0 ? (
                    <Card><CardContent className="flex flex-col items-center gap-4 py-16">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
                      <p className="text-muted-foreground">ยังไม่มีสินค้าในตะกร้า</p>
                      <Button onClick={() => navigate('/gt-series')}>เลือกสินค้า</Button>
                    </CardContent></Card>
                  ) : (
                    <div className="space-y-3">
                      {items.map(item => (
                        <Card key={item.id}>
                          <CardContent className="flex items-center gap-4 py-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{item.product_model}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.product_name || item.product_description || '-'}</p>
                              {item.estimated_price && <p className="text-xs text-primary mt-1">฿{item.estimated_price.toLocaleString()}</p>}
                            </div>
                            <div className="flex items-center border border-border rounded-md">
                              <button className="px-2 py-1 hover:bg-muted" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                              <span className="px-3 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                              <button className="px-2 py-1 hover:bg-muted" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}><Trash2 size={16} /></Button>
                          </CardContent>
                        </Card>
                      ))}

                      <Card className="bg-muted/50">
                        <CardContent className="py-4">
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span>รวม {items.length} รายการ ({count} ชิ้น)</span>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>ล้างตะกร้า</Button>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => navigate('/gt-series')}>เลือกสินค้าเพิ่ม</Button>
                            <Button className="flex-1" onClick={handleCreateQuote} disabled={submitting}>
                              <FileText size={16} className="mr-2" />{submitting ? 'กำลังสร้าง...' : 'สร้างใบเสนอราคา'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {/* ─── PROFILE ─── */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">👤 โปรไฟล์ของฉัน</h2>
                      <p className="text-sm text-muted-foreground mt-1">ข้อมูลบริษัทและที่อยู่สำหรับออกเอกสาร</p>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      <Save size={16} className="mr-2" />{saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                  </div>

                  {/* Company */}
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building className="w-4 h-4" /> ข้อมูลบริษัท</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="ชื่อบริษัท *" field="company_name" placeholder="บริษัท ABC จำกัด" />
                        <Field label="เลขผู้เสียภาษี" field="company_tax_id" placeholder="0105XXXXXXXXX" />
                      </div>
                      <Field label="ที่อยู่บริษัท" field="company_address" placeholder="123 ถ.สุขุมวิท..." />
                      <Field label="โทรศัพท์บริษัท" field="company_phone" placeholder="02-XXX-XXXX" />
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> ข้อมูลผู้ติดต่อ</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="ชื่อ-นามสกุล" field="contact_name" placeholder="สมชาย ใจดี" />
                        <Field label="ตำแหน่ง" field="contact_position" placeholder="ผู้จัดการฝ่ายจัดซื้อ" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="โทรศัพท์" field="contact_phone" placeholder="081-XXX-XXXX" />
                        <Field label="อีเมล" field="contact_email" type="email" placeholder="example@email.com" />
                        <Field label="LINE ID" field="contact_line" placeholder="@lineid" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing */}
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" /> ที่อยู่ออกใบกำกับภาษี</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <Field label="ที่อยู่" field="billing_address" placeholder="123 ถ.สุขุมวิท..." />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Field label="แขวง/ตำบล" field="billing_district" />
                        <Field label="เขต/อำเภอ" field="billing_city" />
                        <Field label="จังหวัด" field="billing_province" />
                        <Field label="รหัสไปรษณีย์" field="billing_postal_code" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> ที่อยู่จัดส่ง</span>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs font-normal">เหมือนที่อยู่ออกบิล</Label>
                          <Switch checked={profileForm.shipping_same_as_billing} onCheckedChange={v => updateField('shipping_same_as_billing', v)} />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {!profileForm.shipping_same_as_billing && (
                      <CardContent className="space-y-4">
                        <Field label="ที่อยู่จัดส่ง" field="shipping_address" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="แขวง/ตำบล" field="shipping_district" />
                          <Field label="เขต/อำเภอ" field="shipping_city" />
                          <Field label="จังหวัด" field="shipping_province" />
                          <Field label="รหัสไปรษณีย์" field="shipping_postal_code" />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
