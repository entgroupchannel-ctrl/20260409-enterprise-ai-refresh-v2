// src/pages/customer/QuoteRequestForm.tsx
// Auto-fills from user profile when logged in, compact layout

import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, Send, ArrowLeft, CheckCircle2, Building, User, Package, ScanLine, Loader2 } from 'lucide-react';
import ProductAutocomplete from '@/components/admin/ProductAutocomplete';
import type { ProductData } from '@/components/admin/ProductAutocomplete';
import { getPendingQuote, clearPendingQuote } from '@/hooks/usePendingQuote';
import { getAttributionFields, createAffiliateLead } from '@/lib/affiliate-attribution';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';

interface ProductItem {
  model: string;
  description: string;
  qty: number;
}

const CompactField = memo(({ label, value, onChange, type = 'text', placeholder = '', required = false, disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; disabled?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
    <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className="h-10 text-base" />
  </div>
));
CompactField.displayName = 'CompactField';

export default function QuoteRequestForm() {
  const { user, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const submitGuard = useRef(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // Anti-bot: honeypot + time-to-submit
  const [honeypot, setHoneypot] = useState('');
  const formLoadedAt = useRef<number>(Date.now());
  // Business-card scan
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_company: '',
    customer_address: '',
    customer_tax_id: '',
    customer_line: '',
    notes: '',
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { model: '', description: '', qty: 1 },
  ]);

  // Track campaign source (from /c/:slug "ขอใบเสนอราคา" button)
  const [campaignInfo, setCampaignInfo] = useState<{ id: string; slug: string; title: string } | null>(null);

  // Restore pending products after login redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (user && params.get('action') === 'continue') {
      const pending = getPendingQuote();
      if (pending && pending.products.length > 0) {
        setProducts(pending.products.map(p => ({
          model: p.model,
          description: p.description,
          qty: p.qty,
        })));
        clearPendingQuote();
        toast({
          title: 'ยินดีต้อนรับ!',
          description: `คุณมี ${pending.products.length} รายการรอดำเนินการ — เพิ่มสินค้าหรือส่งคำขอได้เลย`,
        });
        window.history.replaceState({}, '', location.pathname);
      }
    }
  }, [user, location.search]);

  // Pre-fill products from ?products=slug1,slug2 (from Shop wishlist/compare bulk RFQ)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slugsParam = params.get('products');
    if (!slugsParam) return;
    const slugs = slugsParam.split(',').map(s => s.trim()).filter(Boolean);
    if (slugs.length === 0) return;
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('slug, model, name, description, cpu, ram_gb, storage_gb, storage_type, has_wifi, has_4g, os')
        .in('slug', slugs)
        .eq('is_active', true);
      if (error || !data || data.length === 0) return;

      // Preserve original order from URL
      const bySlug = new Map(data.map((p: any) => [p.slug, p]));
      const ordered = slugs.map(s => bySlug.get(s)).filter(Boolean) as any[];

      const items: ProductItem[] = ordered.map((p) => {
        const specParts: string[] = [];
        if (p.cpu) specParts.push(`CPU: ${p.cpu}`);
        if (p.ram_gb) specParts.push(`RAM: ${p.ram_gb}GB`);
        if (p.storage_gb) specParts.push(`Storage: ${p.storage_gb}GB ${p.storage_type || ''}`.trim());
        if (p.has_wifi || p.has_4g) {
          const net: string[] = [];
          if (p.has_wifi) net.push('WiFi');
          if (p.has_4g) net.push('4G');
          specParts.push(`Network: ${net.join(' + ')}`);
        }
        if (p.os) specParts.push(`OS: ${p.os}`);
        return {
          model: p.name || p.model,
          description: specParts.join('\n') || p.description || '',
          qty: 1,
        };
      });

      setProducts(items);
      toast({
        title: '📦 นำเข้าสินค้าจากประวัติแล้ว',
        description: `${items.length} รายการ — ตรวจสอบและส่งคำขอได้เลย`,
      });
      // Clean URL so refresh doesn't re-import
      window.history.replaceState({}, '', location.pathname);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill products & notes from campaign (when arrived via ?campaign=<slug>)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('campaign');
    if (!slug) return;
    (async () => {
      const { data: c } = await (supabase.from as any)('affiliate_campaigns')
        .select('id, slug, title, promo_note')
        .eq('slug', slug)
        .maybeSingle();
      if (!c) return;
      setCampaignInfo({ id: c.id, slug: c.slug, title: c.title });

      const { data: rows } = await (supabase.from as any)('affiliate_campaign_items')
        .select('product_model, product_name, product_description, quantity, display_order')
        .eq('campaign_id', c.id)
        .order('display_order', { ascending: true });

      if (rows && rows.length > 0) {
        setProducts(rows.map((r: any) => ({
          model: r.product_name || r.product_model,
          description: r.product_description || r.product_model,
          qty: r.quantity || 1,
        })));
      }
      setFormData(prev => ({
        ...prev,
        notes: prev.notes
          ? prev.notes
          : `อ้างอิงแคมเปญ: ${c.title} (${c.slug})${c.promo_note ? ` — ${c.promo_note}` : ''}`,
      }));
      toast({
        title: '📦 โหลดสินค้าจากแคมเปญแล้ว',
        description: c.title,
      });
    })();
  }, [location.search]);

  // Auto-fill from user_profiles when logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: profile } = await (supabase.from as any)('user_profiles')
        .select('*').eq('user_id', user.id).maybeSingle();

      if (profile) {
        const billingParts = [
          profile.billing_address,
          profile.billing_district,
          profile.billing_city,
          profile.billing_province,
          profile.billing_postal_code,
        ].filter((s: string | null) => s && String(s).trim()).join(' ').trim();
        const composedAddress = billingParts || (profile.company_address || '').trim();

        setFormData({
          customer_name: profile.contact_name || authProfile?.full_name || '',
          customer_email: profile.contact_email || user.email || '',
          customer_phone: profile.contact_phone || profile.company_phone || '',
          customer_company: profile.company_name || '',
          customer_address: composedAddress,
          customer_tax_id: profile.company_tax_id || '',
          customer_line: profile.contact_line || '',
          notes: '',
        });
        setProfileLoaded(true);
      } else {
        setFormData(prev => ({
          ...prev,
          customer_name: authProfile?.full_name || '',
          customer_email: user.email || '',
          customer_phone: authProfile?.phone || '',
          customer_company: authProfile?.company || '',
        }));
      }
    })();
  }, [user, authProfile]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Scan business card → AI extract → autofill
  const handleScanCard = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'กรุณาเลือกไฟล์รูปภาพ', variant: 'destructive' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'ไฟล์ใหญ่เกินไป (สูงสุด 8MB)', variant: 'destructive' });
      return;
    }
    setScanning(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('scan-business-card', {
        body: { image: dataUrl },
      });
      if (error) throw error;
      // edge function returns { data: {...} } — supabase.invoke unwraps body, so payload sits at data.data
      const card = (data?.data || data?.card || data) as any;
      console.log('[scan-business-card] extracted:', card);
      if (!card || typeof card !== 'object') throw new Error('ไม่สามารถอ่านข้อมูลได้');

      const pick = (...keys: string[]): string => {
        for (const k of keys) {
          const v = card[k];
          if (v && typeof v === 'string' && v.trim()) return v.trim();
        }
        return '';
      };
      const name = pick('name', 'full_name', 'fullName', 'contact_name');
      const email = pick('email', 'e_mail');
      const phone = pick('phone', 'mobile', 'tel', 'telephone', 'mobile_phone');
      const company = pick('company', 'organization', 'company_name', 'org');
      const address = pick('address', 'company_address');
      const lineId = pick('lineId', 'line_id', 'line');

      setFormData(prev => ({
        ...prev,
        customer_name: name || prev.customer_name,
        customer_email: email || prev.customer_email,
        customer_phone: phone || prev.customer_phone,
        customer_company: company || prev.customer_company,
        customer_address: address || prev.customer_address,
        customer_line: lineId || prev.customer_line,
      }));

      const filled = [name && 'ชื่อ', company && 'บริษัท', email && 'อีเมล', phone && 'โทร'].filter(Boolean).join(', ');
      toast({
        title: '✅ สแกนนามบัตรสำเร็จ',
        description: filled ? `กรอกแล้ว: ${filled} — ตรวจสอบก่อนส่ง` : 'ไม่พบข้อมูลที่ชัดเจน — กรุณากรอกเอง',
      });
    } catch (err: any) {
      toast({
        title: 'สแกนนามบัตรไม่สำเร็จ',
        description: err?.message || 'กรุณาลองใหม่ หรือกรอกข้อมูลด้วยตนเอง',
        variant: 'destructive',
      });
    } finally {
      setScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProductChange = (index: number, field: keyof ProductItem, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleProductSelect = (index: number, product: ProductData) => {
    const specParts: string[] = [];
    if (product.cpu) specParts.push(`CPU: ${product.cpu}`);
    if (product.ram_gb) specParts.push(`RAM: ${product.ram_gb}GB`);
    if (product.storage_gb) {
      specParts.push(`Storage: ${product.storage_gb}GB ${product.storage_type || ''}`.trim());
    }
    if (product.has_wifi || product.has_4g) {
      const net: string[] = [];
      if (product.has_wifi) net.push('WiFi');
      if (product.has_4g) net.push('4G');
      specParts.push(`Network: ${net.join(' + ')}`);
    }
    if (product.os) specParts.push(`OS: ${product.os}`);

    const spec = specParts.join('\n');
    const updated = [...products];
    updated[index] = {
      ...updated[index],
      model: product.name,
      description: spec || product.description || '',
    };
    setProducts(updated);

    toast({
      title: '✅ เลือกสินค้าแล้ว',
      description: product.name,
    });
  };

  const addProduct = () => setProducts([...products, { model: '', description: '', qty: 1 }]);

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitGuard.current || submitting) return;
    if (!formData.customer_name || !formData.customer_email) {
      toast({ title: 'กรุณากรอกชื่อและอีเมล', variant: 'destructive' });
      return;
    }
    // Anti-bot checks
    if (honeypot.trim() !== '') {
      // Bot filled hidden field — silently fail
      toast({ title: 'ส่งคำขอสำเร็จ', description: 'ทีมงานจะติดต่อกลับโดยเร็ว' });
      return;
    }
    const elapsed = Date.now() - formLoadedAt.current;
    if (elapsed < 3000) {
      toast({ title: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่ง', variant: 'destructive' });
      return;
    }
    const validProducts = products.filter(p => p.model.trim());
    if (validProducts.length === 0) {
      toast({ title: 'กรุณาระบุสินค้าอย่างน้อย 1 รายการ', variant: 'destructive' });
      return;
    }

    submitGuard.current = true;
    setSubmitting(true);
    try {
      const insertPayload = {
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone || null,
          customer_company: formData.customer_company || null,
          customer_address: formData.customer_address || null,
          customer_tax_id: formData.customer_tax_id || null,
          customer_line: formData.customer_line || null,
          notes: formData.notes || null,
          products: validProducts.map(p => ({
            model: p.model, description: p.description, qty: p.qty,
            unit_price: 0, discount_percent: 0, line_total: 0,
          })),
          status: 'pending',
          subtotal: 0,
          vat_amount: 0,
          grand_total: 0,
          created_by: user?.id || null,
          // Campaign traceability — overrides attribution_source when present
          ...(campaignInfo
            ? { source: `campaign:${campaignInfo.slug}`, attribution_source: 'campaign' }
            : {}),
          // Affiliate attribution (cookie-based, 90-day window)
          ...getAttributionFields(),
        };
      const { data, error } = await (supabase.from('quote_requests') as any)
        .insert([insertPayload])
        .select().single();

      if (error) throw error;

      // Best-effort affiliate lead row (no-op if no attribution cookie)
      await createAffiliateLead({
        source_type: 'quote_request',
        source_id: data.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_company: formData.customer_company || null,
      });

      // 📧 Email + in-app notifications (fire-and-forget)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      import('@/lib/notifications').then(({ sendAutoReplyEmail, dispatchNotification }) => {
        // 1) Auto-reply ลูกค้า
        if (formData.customer_email) {
          sendAutoReplyEmail({
            type: 'quote-request',
            recipientEmail: formData.customer_email,
            recipientName: formData.customer_name,
            quoteRef: data.quote_number,
          });
        }
        // 2) แจ้งเตือนแอดมิน (in-app + email via unified dispatcher)
        dispatchNotification({
          eventKey: 'quote.requested',
          recipientRole: 'admin',
          title: `📩 คำขอใบเสนอราคาใหม่ ${data.quote_number}`,
          message: `${formData.customer_name}${formData.customer_company ? ' / ' + formData.customer_company : ''} — ${validProducts.length} รายการ`,
          priority: 'high',
          actionUrl: `/admin/quotes/${data.id}`,
          actionLabel: 'เปิดใบเสนอราคา',
          linkType: 'quote',
          linkId: data.id,
          entityType: 'quote',
          entityId: data.id,
          customerName: formData.customer_name,
          quoteNumber: data.quote_number,
          viewUrl: `${origin}/admin/quotes/${data.id}`,
          note: formData.notes || undefined,
        });
      });

      toast({ title: 'ส่งคำขอสำเร็จ', description: `เลขที่ ${data.quote_number}` });
      navigate(user ? '/my-quotes' : '/');
    } catch (error: any) {
      submitGuard.current = false;
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNavbar />
      {/* Sub header */}
      <div className="bg-card border-b border-border sticky top-14 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-semibold">ขอใบเสนอราคา/RFQ</h1>
          <div className="w-16" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-4">
        {campaignInfo && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
            <Package className="w-4 h-4 text-primary shrink-0" />
            <div className="text-sm">
              <span className="font-medium">โหลดสินค้าจากแคมเปญ:</span>{' '}
              <span className="text-primary">{campaignInfo.title}</span>
              <span className="text-xs text-muted-foreground ml-2">({campaignInfo.slug})</span>
            </div>
          </div>
        )}
        {/* Honeypot field — hidden from users, bots will fill it */}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden" tabIndex={-1}>
          <label>
            Website (leave blank)
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Customer info */}
          <div className="space-y-4">
            {/* Profile summary (logged in) */}
            {isLoggedIn && profileLoaded && (
              <div className="flex items-center gap-2 p-2.5 bg-primary/5 border border-primary/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-primary">ดึงข้อมูลจากโปรไฟล์แล้ว</span>
              </div>
            )}

            <Card>
              <CardContent className="pt-5 pb-4 space-y-4">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> ข้อมูลบริษัท
                </p>
                <CompactField label="บริษัท" value={formData.customer_company} onChange={v => handleFormChange('customer_company', v)} placeholder="บริษัท ABC จำกัด" />
                <CompactField label="ที่อยู่" value={formData.customer_address} onChange={v => handleFormChange('customer_address', v)} placeholder="123 ถ.สุขุมวิท..." />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User className="w-4 h-4" /> ผู้ติดต่อ
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> กำลังอ่าน...</>
                    ) : (
                      <><ScanLine className="w-3.5 h-3.5 mr-1" /> สแกนนามบัตร</>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleScanCard(f);
                    }}
                  />
                </div>
                <CompactField label="ชื่อ-นามสกุล" value={formData.customer_name} onChange={v => handleFormChange('customer_name', v)} placeholder="สมชาย ใจดี" required />
                <div className="grid grid-cols-2 gap-2">
                  <CompactField label="อีเมล" value={formData.customer_email} onChange={v => handleFormChange('customer_email', v)} type="email" placeholder="email@..." required />
                  <CompactField label="โทรศัพท์" value={formData.customer_phone} onChange={v => handleFormChange('customer_phone', v)} placeholder="081-XXX-XXXX" />
                </div>
                <CompactField label="LINE ID" value={formData.customer_line} onChange={v => handleFormChange('customer_line', v)} placeholder="@lineid" />
              </CardContent>
            </Card>
          </div>

          {/* Center + Right: Products + Notes + Submit */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Package className="w-4 h-4" /> รายการสินค้า
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={addProduct} className="h-9 text-sm">
                    <Plus className="w-4 h-4 mr-1" /> เพิ่ม
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground -mt-1 mb-3 px-1">
                  💡 ค้นหาสินค้าในระบบเพื่อ auto-fill รายละเอียด หรือพิมพ์รุ่นเองถ้าไม่เจอ
                </p>

                <div className="space-y-3">
                  {products.map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-background">
                      {/* Row 1: Index + Remove */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          รายการ #{index + 1}
                        </span>
                        {products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Row 2: Product picker (search) */}
                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">
                          สินค้า / รุ่น <span className="text-destructive">*</span>
                        </Label>
                        <ProductAutocomplete
                          value={product.model}
                          onChange={(v) => handleProductChange(index, 'model', v)}
                          onSelectProduct={(p) => handleProductSelect(index, p)}
                          placeholder="ค้นหาสินค้าในระบบ หรือพิมพ์รุ่นเอง..."
                        />
                      </div>

                      {/* Row 3: Description + Qty */}
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-9 space-y-1.5">
                          <Label className="text-sm text-muted-foreground">
                            รายละเอียด / สเปค
                          </Label>
                          <Textarea
                            value={product.description}
                            onChange={e => handleProductChange(index, 'description', e.target.value)}
                            placeholder="CPU, RAM, Storage หรือข้อมูลเพิ่มเติม..."
                            rows={3}
                            className="text-sm font-mono resize-y min-h-[80px]"
                          />
                        </div>
                        <div className="col-span-3 space-y-1.5">
                          <Label className="text-sm text-muted-foreground">
                            จำนวน <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            value={product.qty}
                            onChange={e => handleProductChange(index, 'qty', parseInt(e.target.value) || 1)}
                            className="h-10 text-base text-center"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="pt-5 pb-4 space-y-2">
                <Label className="text-sm text-muted-foreground">หมายเหตุเพิ่มเติม</Label>
                <Textarea
                  value={formData.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                  placeholder="งบประมาณ, ระยะเวลา, ความต้องการพิเศษ..."
                  rows={2}
                  className="text-base"
                />
              </CardContent>
            </Card>

            {/* Submit bar */}
            <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">
                {products.filter(p => p.model.trim()).length} รายการสินค้า
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={submitting}>ยกเลิก</Button>
                <Button type="submit" disabled={submitting}>
                  <Send className="w-4 h-4 mr-1.5" />
                  {submitting ? 'กำลังส่ง...' : 'ส่งคำขอใบเสนอราคา'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
