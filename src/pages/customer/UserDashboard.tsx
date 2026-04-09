// src/pages/customer/UserDashboard.tsx
// Unified single-page dashboard — Quotes, Cart, Profile, Chat all in one view
// Matches admin layout style with 3-column quote detail, chat, files

import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteTimelineBadge } from '@/components/rfq/QuoteTimeline';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import POUploadDialog from '@/components/quotes/POUploadDialog';
import {
  FileText, ShoppingCart, User, Building, MapPin, Truck,
  Plus, Search, Clock, Eye, Download, Printer,
  ArrowLeft, Save, Trash2, Minus, Home, LogOut,
  ChevronRight, Package, Phone, Mail, Upload, Send,
  Paperclip, Calendar, MessageSquare, Pencil, X, Building2,
} from 'lucide-react';
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
  customer_line: string | null;
  notes: string;
  subtotal: number;
  vat_amount: number;
  discount_amount: number;
  payment_terms: string;
  delivery_terms: string;
  warranty_terms: string;
}

interface QuoteFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  category: string;
  uploaded_at: string;
}

interface QuoteMessage {
  id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
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

// Memoized field
const ProfileField = memo(({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) => (
  <div className="space-y-1">
    <Label className="text-[11px] text-muted-foreground">{label}</Label>
    <Input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-8 text-sm" />
  </div>
));
ProfileField.displayName = 'ProfileField';

// ─── Helpers ───
const formatCurrency = (amount: number) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
};

const getStatusLabel = (status: string) => {
  const m: Record<string, string> = { pending: 'รอใบเสนอราคา', quote_sent: 'ได้รับราคาแล้ว', po_uploaded: 'ส่ง PO แล้ว', po_approved: 'อนุมัติแล้ว', completed: 'เสร็จสิ้น', rejected: 'ไม่อนุมัติ' };
  return m[status] || status;
};

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function UserDashboard() {
  const { user, profile: authProfile, signOut } = useAuth();
  const { items, count, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

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

  // ─── Quote detail extras ───
  const [quoteFiles, setQuoteFiles] = useState<QuoteFile[]>([]);
  const [quoteMessages, setQuoteMessages] = useState<QuoteMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ─── Profile state ───
  const [profileForm, setProfileForm] = useState<ProfileData>(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Cart submission ───
  const [submitting, setSubmitting] = useState(false);
  const [showPOUpload, setShowPOUpload] = useState(false);

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

  // Load quote detail + files + messages when quoteId changes
  useEffect(() => {
    if (quoteId) {
      const found = quotes.find(q => q.id === quoteId);
      if (found) setSelectedQuote(found);
      else loadQuoteDetail(quoteId);
      loadQuoteFiles(quoteId);
      loadQuoteMessages(quoteId);
    } else {
      setSelectedQuote(null);
      setQuoteFiles([]);
      setQuoteMessages([]);
      setEditingCustomer(false);
    }
  }, [quoteId, quotes]);

  // Realtime subscription for chat messages (separate effect with cleanup)
  useEffect(() => {
    if (!quoteId) return;
    const channel = supabase
      .channel(`quote_msgs_${quoteId}_${Date.now()}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quote_messages', filter: `quote_id=eq.${quoteId}` }, (payload) => {
        setQuoteMessages(prev => {
          const newMsg = payload.new as any;
          if (prev.some((m: any) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [quoteId]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [quoteMessages]);

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
    if (data) setSelectedQuote({ ...data, products: (data.products as any) || [] } as any);
  };

  const loadQuoteFiles = async (id: string) => {
    const { data } = await supabase.from('quote_files').select('*').eq('quote_id', id).order('uploaded_at', { ascending: false });
    setQuoteFiles((data as any[]) || []);
  };

  const loadQuoteMessages = async (id: string) => {
    const { data } = await supabase.from('quote_messages').select('*').eq('quote_id', id).order('created_at', { ascending: true });
    setQuoteMessages((data as any[]) || []);
  };


  const handleSendMessage = async () => {
    if (!messageText.trim() || !quoteId) return;
    setSendingMessage(true);
    try {
      const newMsg = {
        quote_id: quoteId,
        sender_id: user?.id || null,
        sender_name: authProfile?.full_name || user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: messageText,
        message_type: 'text',
      };
      const { data, error } = await supabase.from('quote_messages').insert(newMsg).select().single();
      if (error) throw error;
      // Optimistic: add to local state immediately if realtime hasn't delivered it
      if (data) {
        setQuoteMessages(prev => {
          if (prev.some((m: any) => m.id === (data as any).id)) return prev;
          return [...prev, data as any];
        });
      }
      setMessageText('');
    } catch (err: any) {
      toast({ title: 'ส่งไม่สำเร็จ', description: err.message, variant: 'destructive' });
    } finally {
      setSendingMessage(false);
    }
  };

  const openQuote = (id: string) => setSearchParams({ id });

  // ─── Edit customer info ───
  const startEditCustomer = () => {
    if (!selectedQuote) return;
    setEditForm({
      customer_name: selectedQuote.customer_name || '',
      customer_email: selectedQuote.customer_email || '',
      customer_phone: selectedQuote.customer_phone || '',
      customer_company: selectedQuote.customer_company || '',
      customer_address: selectedQuote.customer_address || '',
      customer_tax_id: selectedQuote.customer_tax_id || '',
      customer_line: selectedQuote.customer_line || '',
    });
    setEditingCustomer(true);
  };

  const saveCustomerEdit = async () => {
    if (!quoteId) return;
    try {
      const { error } = await supabase.from('quote_requests').update(editForm as any).eq('id', quoteId);
      if (error) throw error;
      setSelectedQuote(prev => prev ? { ...prev, ...editForm } as any : null);
      setEditingCustomer(false);
      toast({ title: 'บันทึกสำเร็จ' });
    } catch (err: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    }
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

  const poFiles = quoteFiles.filter(f => f.category === 'customer_po');
  const pdfFiles = quoteFiles.filter(f => f.category === 'quote_pdf');

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

        <div className="flex flex-col flex-1">
          {/* Desktop tab bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === item.key || (item.key === 'quotes' && activeSection === 'quote-detail')
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">{item.badge}</Badge>
                )}
              </button>
            ))}
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={() => navigate('/request-quote')}>
              <Plus className="w-4 h-4 mr-1" /> ขอใบเสนอราคา
            </Button>
          </div>

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

              {/* ═══ QUOTES LIST ═══ */}
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

              {/* ═══ QUOTE DETAIL — Admin-matching layout ═══ */}
              {activeSection === 'quote-detail' && selectedQuote && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => setSearchParams({})}>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <h2 className="text-xl font-bold">{selectedQuote.quote_number}</h2>
                        <p className="text-xs text-muted-foreground">
                          สร้างเมื่อ {format(new Date(selectedQuote.created_at), 'dd MMMM yyyy HH:mm', { locale: th })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <QuoteTimelineBadge currentStatus={selectedQuote.status} />
                    </div>
                  </div>

                  {/* Timeline */}
                  <Card><CardContent className="py-4"><QuoteTimeline currentStatus={selectedQuote.status} size="lg" /></CardContent></Card>

                  {/* 3-column grid matching admin */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: Customer + Products + Files */}
                    <div className="lg:col-span-2 space-y-4">

                      {/* Customer Info */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <User className="w-4 h-4" /> ข้อมูลลูกค้า
                            </CardTitle>
                            {!editingCustomer ? (
                              <Button variant="ghost" size="sm" onClick={startEditCustomer}>
                                <Pencil className="w-3 h-3 mr-1" /> แก้ไข
                              </Button>
                            ) : (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(false)}>
                                  <X className="w-3 h-3 mr-1" /> ยกเลิก
                                </Button>
                                <Button size="sm" onClick={saveCustomerEdit}>
                                  <Save className="w-3 h-3 mr-1" /> บันทึก
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {editingCustomer ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">ชื่อลูกค้า</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_name} onChange={e => setEditForm(p => ({ ...p, customer_name: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">บริษัท</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_company} onChange={e => setEditForm(p => ({ ...p, customer_company: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">อีเมล</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_email} onChange={e => setEditForm(p => ({ ...p, customer_email: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">โทรศัพท์</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_phone} onChange={e => setEditForm(p => ({ ...p, customer_phone: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">LINE ID</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_line} onChange={e => setEditForm(p => ({ ...p, customer_line: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">เลขผู้เสียภาษี</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_tax_id} onChange={e => setEditForm(p => ({ ...p, customer_tax_id: e.target.value }))} />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <Label className="text-xs text-muted-foreground">ที่อยู่</Label>
                                <Input className="h-8 text-sm" value={editForm.customer_address} onChange={e => setEditForm(p => ({ ...p, customer_address: e.target.value }))} />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">ชื่อลูกค้า</Label>
                                <p className="font-medium text-sm">{selectedQuote.customer_name}</p>
                              </div>
                              {selectedQuote.customer_company && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">บริษัท</Label>
                                  <p className="font-medium text-sm flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                    {selectedQuote.customer_company}
                                  </p>
                                </div>
                              )}
                              <div>
                                <Label className="text-xs text-muted-foreground">อีเมล</Label>
                                <p className="text-sm flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                  {selectedQuote.customer_email}
                                </p>
                              </div>
                              {selectedQuote.customer_phone && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">โทรศัพท์</Label>
                                  <p className="text-sm flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                    {selectedQuote.customer_phone}
                                  </p>
                                </div>
                              )}
                              {selectedQuote.customer_line && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">LINE</Label>
                                  <p className="text-sm">{selectedQuote.customer_line}</p>
                                </div>
                              )}
                              {selectedQuote.customer_tax_id && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">เลขผู้เสียภาษี</Label>
                                  <p className="text-sm">{selectedQuote.customer_tax_id}</p>
                                </div>
                              )}
                              {selectedQuote.customer_address && (
                                <div className="md:col-span-2">
                                  <Label className="text-xs text-muted-foreground">ที่อยู่</Label>
                                  <p className="text-sm">{selectedQuote.customer_address}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Products table */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">รายการสินค้า</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedQuote.products?.length > 0 ? (
                              selectedQuote.products.map((p: any, i: number) => (
                                <div key={i} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm">{p.model || 'N/A'}</h4>
                                      {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                                    </div>
                                    <span className="font-semibold text-sm text-primary ml-4">
                                      {formatCurrency(p.line_total || 0)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>จำนวน: {p.qty || 0}</span>
                                    <span>ราคา/หน่วย: {formatCurrency(p.unit_price || 0)}</span>
                                    {p.discount_percent > 0 && (
                                      <span className="text-green-600">ส่วนลด {p.discount_percent}%</span>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground text-center py-6 text-sm">ไม่มีรายการสินค้า</p>
                            )}
                          </div>

                          {selectedQuote.grand_total > 0 && (
                            <>
                              <Separator className="my-4" />
                              <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">ยอดรวม</span><span>{formatCurrency(selectedQuote.subtotal)}</span></div>
                                {selectedQuote.discount_amount > 0 && (
                                  <div className="flex justify-between text-green-600"><span>ส่วนลด</span><span>-{formatCurrency(selectedQuote.discount_amount)}</span></div>
                                )}
                                <div className="flex justify-between"><span className="text-muted-foreground">VAT 7%</span><span>{formatCurrency(selectedQuote.vat_amount)}</span></div>
                                <Separator />
                                <div className="flex justify-between text-base font-bold pt-1">
                                  <span>ยอดรวมทั้งสิ้น</span>
                                  <span className="text-primary">{formatCurrency(selectedQuote.grand_total)}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Files */}
                      {quoteFiles.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Paperclip className="w-4 h-4" /> ไฟล์แนบ
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {poFiles.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">PO จากลูกค้า</p>
                                {poFiles.map(file => (
                                  <div key={file.id} className="flex items-center justify-between p-2.5 border border-border rounded-lg hover:bg-muted/30">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-6 h-6 text-primary" />
                                      <div>
                                        <p className="text-sm font-medium">{file.file_name}</p>
                                        <p className="text-[10px] text-muted-foreground">{format(new Date(file.uploaded_at), 'dd MMM yyyy HH:mm', { locale: th })}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                        <Eye className="w-3 h-3 mr-1" /> ดู
                                      </a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {pdfFiles.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-2">ใบเสนอราคา PDF</p>
                                {pdfFiles.map(file => (
                                  <div key={file.id} className="flex items-center justify-between p-2.5 border border-border rounded-lg hover:bg-muted/30">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-6 h-6 text-green-600" />
                                      <div>
                                        <p className="text-sm font-medium">{file.file_name}</p>
                                        <p className="text-[10px] text-muted-foreground">{format(new Date(file.uploaded_at), 'dd MMM yyyy HH:mm', { locale: th })}</p>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={file.file_url} download><Download className="w-3 h-3 mr-1" /> ดาวน์โหลด</a>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right: Chat + Info */}
                    <div className="space-y-4">
                      {/* Chat — matching admin */}
                      <Card className="flex flex-col">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> สนทนา
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1">
                          <div className="space-y-2 max-h-[350px] overflow-y-auto mb-3 pr-1">
                            {quoteMessages.length > 0 ? (
                              quoteMessages.map(msg => (
                                <div
                                  key={msg.id}
                                  className={`p-2.5 rounded-lg text-sm ${
                                    msg.sender_role === 'customer'
                                      ? 'bg-primary/10 ml-4'
                                      : msg.sender_role === 'system'
                                      ? 'bg-muted text-muted-foreground'
                                      : 'bg-muted/50 mr-4'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[11px] font-semibold">
                                      {msg.sender_role === 'customer' ? 'คุณ' : msg.sender_role === 'system' ? 'ระบบ' : msg.sender_name}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: th })}
                                    </span>
                                  </div>
                                  <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">ยังไม่มีข้อความ</p>
                                <p className="text-[10px] text-muted-foreground">ส่งข้อความถึงทีมขายได้เลย</p>
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>

                          <div className="space-y-2">
                            <Textarea
                              placeholder="พิมพ์ข้อความถึงทีมขาย..."
                              value={messageText}
                              onChange={e => setMessageText(e.target.value)}
                              rows={2}
                              className="text-sm resize-none"
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button onClick={handleSendMessage} disabled={sendingMessage || !messageText.trim()} className="w-full" size="sm">
                              <Send className="w-3.5 h-3.5 mr-1.5" />
                              {sendingMessage ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quote info */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">ข้อมูลเพิ่มเติม</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          {selectedQuote.valid_until && (
                            <div>
                              <Label className="text-xs text-muted-foreground">ใช้ได้ถึง</Label>
                              <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" />{format(new Date(selectedQuote.valid_until), 'dd MMMM yyyy', { locale: th })}</p>
                            </div>
                          )}
                          {selectedQuote.payment_terms && (
                            <div>
                              <Label className="text-xs text-muted-foreground">เงื่อนไขการชำระเงิน</Label>
                              <p>{selectedQuote.payment_terms}</p>
                            </div>
                          )}
                          {selectedQuote.delivery_terms && (
                            <div>
                              <Label className="text-xs text-muted-foreground">เงื่อนไขการจัดส่ง</Label>
                              <p>{selectedQuote.delivery_terms}</p>
                            </div>
                          )}
                          {selectedQuote.warranty_terms && (
                            <div>
                              <Label className="text-xs text-muted-foreground">การรับประกัน</Label>
                              <p>{selectedQuote.warranty_terms}</p>
                            </div>
                          )}
                          {selectedQuote.notes && (
                            <div>
                              <Label className="text-xs text-muted-foreground">หมายเหตุ</Label>
                              <p className="text-muted-foreground">{selectedQuote.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Action: Upload PO */}
                      {selectedQuote.status === 'quote_sent' && (
                        <Card className="border-primary/30 bg-primary/5">
                          <CardContent className="pt-4 pb-3 text-center space-y-2">
                            <p className="text-sm font-medium">พร้อมส่ง PO?</p>
                            <p className="text-xs text-muted-foreground">อัปโหลด PO เพื่อดำเนินการสั่งซื้อ</p>
                            <Button size="sm" className="w-full" onClick={() => setShowPOUpload(true)}>
                              <Upload className="w-3.5 h-3.5 mr-1" /> อัปโหลด PO
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ CART ═══ */}
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

              {/* ═══ PROFILE ═══ */}
              {activeSection === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">👤 โปรไฟล์ของฉัน</h2>
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      <Save size={14} className="mr-1" />{saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="pt-4 pb-3 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Building className="w-3 h-3" /> ข้อมูลบริษัท</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ProfileField label="ชื่อบริษัท *" value={profileForm.company_name} onChange={v => updateField('company_name', v)} placeholder="บริษัท ABC จำกัด" />
                            <ProfileField label="เลขผู้เสียภาษี" value={profileForm.company_tax_id} onChange={v => updateField('company_tax_id', v)} placeholder="0105XXXXXXXXX" />
                          </div>
                          <ProfileField label="ที่อยู่บริษัท" value={profileForm.company_address} onChange={v => updateField('company_address', v)} placeholder="123 ถ.สุขุมวิท..." />
                          <ProfileField label="โทรศัพท์" value={profileForm.company_phone} onChange={v => updateField('company_phone', v)} placeholder="02-XXX-XXXX" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-3 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> ผู้ติดต่อ</p>
                          <div className="grid grid-cols-2 gap-2">
                            <ProfileField label="ชื่อ-นามสกุล" value={profileForm.contact_name} onChange={v => updateField('contact_name', v)} placeholder="สมชาย ใจดี" />
                            <ProfileField label="ตำแหน่ง" value={profileForm.contact_position} onChange={v => updateField('contact_position', v)} placeholder="ผู้จัดการฝ่ายจัดซื้อ" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <ProfileField label="โทรศัพท์" value={profileForm.contact_phone} onChange={v => updateField('contact_phone', v)} placeholder="081-XXX-XXXX" />
                            <ProfileField label="อีเมล" value={profileForm.contact_email} onChange={v => updateField('contact_email', v)} type="email" placeholder="example@email.com" />
                            <ProfileField label="LINE ID" value={profileForm.contact_line} onChange={v => updateField('contact_line', v)} placeholder="@lineid" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="pt-4 pb-3 space-y-3">
                          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> ที่อยู่ออกใบกำกับภาษี</p>
                          <ProfileField label="ที่อยู่" value={profileForm.billing_address} onChange={v => updateField('billing_address', v)} placeholder="123 ถ.สุขุมวิท..." />
                          <div className="grid grid-cols-2 gap-2">
                            <ProfileField label="แขวง/ตำบล" value={profileForm.billing_district} onChange={v => updateField('billing_district', v)} />
                            <ProfileField label="เขต/อำเภอ" value={profileForm.billing_city} onChange={v => updateField('billing_city', v)} />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <ProfileField label="จังหวัด" value={profileForm.billing_province} onChange={v => updateField('billing_province', v)} />
                            <ProfileField label="รหัสไปรษณีย์" value={profileForm.billing_postal_code} onChange={v => updateField('billing_postal_code', v)} />
                            <ProfileField label="ประเทศ" value={profileForm.billing_country} onChange={v => updateField('billing_country', v)} />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4 pb-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Truck className="w-3 h-3" /> ที่อยู่จัดส่ง</p>
                            <div className="flex items-center gap-1.5">
                              <Label className="text-[10px] font-normal text-muted-foreground">เหมือนที่อยู่ออกบิล</Label>
                              <Switch checked={profileForm.shipping_same_as_billing} onCheckedChange={v => updateField('shipping_same_as_billing', v)} />
                            </div>
                          </div>
                          {!profileForm.shipping_same_as_billing && (
                            <>
                              <ProfileField label="ที่อยู่จัดส่ง" value={profileForm.shipping_address} onChange={v => updateField('shipping_address', v)} />
                              <div className="grid grid-cols-2 gap-2">
                                <ProfileField label="แขวง/ตำบล" value={profileForm.shipping_district} onChange={v => updateField('shipping_district', v)} />
                                <ProfileField label="เขต/อำเภอ" value={profileForm.shipping_city} onChange={v => updateField('shipping_city', v)} />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <ProfileField label="จังหวัด" value={profileForm.shipping_province} onChange={v => updateField('shipping_province', v)} />
                                <ProfileField label="รหัสไปรษณีย์" value={profileForm.shipping_postal_code} onChange={v => updateField('shipping_postal_code', v)} />
                                <ProfileField label="ประเทศ" value={profileForm.shipping_country} onChange={v => updateField('shipping_country', v)} />
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      {selectedQuote && (
        <POUploadDialog
          open={showPOUpload}
          onOpenChange={setShowPOUpload}
          quoteId={selectedQuote.id}
          quoteNumber={selectedQuote.quote_number}
          customerName={selectedQuote.customer_name}
          onSuccess={() => { loadQuotes(); loadQuoteDetail(selectedQuote.id); }}
        />
      )}
    </>
  );
}
