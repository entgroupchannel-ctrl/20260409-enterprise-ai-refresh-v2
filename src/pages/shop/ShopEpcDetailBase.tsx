import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import SiteNavbar from '@/components/SiteNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { savePendingQuote } from '@/hooks/usePendingQuote';
import {
  ArrowLeft, Package, FileText, ShoppingCart, Sparkles, Check, ExternalLink, Phone,
  ShieldCheck, Settings2, Image as ImageIcon, Ruler, Cable, ListChecks, Download, Factory,
} from 'lucide-react';
import LineQRButton from '@/components/LineQRButton';
import ProductImageGalleryZoom from '@/components/shop/ProductImageGalleryZoom';
import { epcModelDetails, epcModelList, type EpcModelDetail } from '@/data/epcModelDetails';

interface Props {
  slug: keyof typeof epcModelDetails | string;
}

export default function ShopEpcDetailBase({ slug }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const detail: EpcModelDetail | undefined = epcModelDetails[slug];

  const related = useMemo(
    () => epcModelList.filter((d) => d.series === detail?.series && d.slug !== slug).slice(0, 4),
    [detail?.series, slug]
  );

  if (!detail) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNavbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <h1 className="text-2xl font-bold mb-2">ไม่พบรุ่นสินค้า</h1>
          <Button onClick={() => navigate('/shop')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้า Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const seriesParam = detail.series === 'EPC Panel PC' ? 'EPC+Panel+PC' : 'EPC+Box';

  const buildDescription = () =>
    `${detail.model} — ${detail.tagline}`;

  const handleQuickQuote = () => {
    savePendingQuote({
      customer_name: '', customer_email: user?.email ?? '', customer_phone: null, customer_company: null,
      notes: `รุ่น ${detail.model} (${detail.series}) — กรุณาระบุสเปก CPU/RAM/SSD ที่ต้องการ`,
      products: [{ model: detail.model, description: buildDescription(), qty, unit_price: 0, discount_percent: 0, line_total: 0 }],
    });
    toast({ title: 'พร้อมส่งคำขอใบเสนอราคา', description: `${detail.model} × ${qty} ชิ้น` });
    navigate('/request-quote?action=continue');
  };

  const handleAddToCart = async () => {
    if (!user) {
      savePendingQuote({
        customer_name: '', customer_email: '', customer_phone: null, customer_company: null,
        notes: `สนใจ ${detail.model} (${detail.series})`,
        products: [{ model: detail.model, description: buildDescription(), qty, unit_price: 0, discount_percent: 0, line_total: 0 }],
      });
      toast({ title: 'บันทึกรายการแล้ว', description: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มลงตะกร้า' });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setAdding(true);
    try {
      await addToCart({
        model: detail.model,
        name: `${detail.model} — ${detail.series}`,
        description: buildDescription(),
        quantity: qty,
        price: 0,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${detail.model} — ${detail.tagline} | ENT Group`}
        description={detail.intro.slice(0, 155)}
        path={`/shop/${detail.slug}`}
      />
      <SiteNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>›</span>
          <Link to={`/shop?series=${seriesParam}`} className="hover:text-primary">{detail.series}</Link>
          <span>›</span>
          <span className="text-foreground font-medium">{detail.model}</span>
          <div className="ml-auto flex gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
              <Link to={detail.landingHref}>
                <ExternalLink className="w-3.5 h-3.5" />
                หน้ารายละเอียดซีรีส์
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="container mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {(() => {
              const heroImages = (detail.heroImages && detail.heroImages.length > 0)
                ? detail.heroImages
                : [detail.image, ...(detail.productImages?.map((p) => p.src) ?? [])]
                    .filter((src, i, arr) => !!src && arr.indexOf(src) === i);
              return (
                <ProductImageGalleryZoom
                  images={heroImages}
                  alt={detail.model}
                  enableZoom
                />
              );
            })()}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{detail.series}</Badge>
              {detail.popular && <Badge className="bg-primary/10 text-primary border-primary/20">ยอดนิยม</Badge>}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{detail.model}</h1>
              <p className="text-lg text-muted-foreground mt-1">{detail.tagline}</p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">{detail.intro}</p>

            <ul className="grid grid-cols-2 gap-2">
              {detail.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <Separator />

            {/* RFQ CTA */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">ขอใบเสนอราคา (RFQ)</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  รุ่นนี้กำหนดสเปก CPU / RAM / Storage / I/O ได้ตามต้องการ — ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">จำนวน</label>
                  <input
                    type="number" min={1} value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                    className="w-20 h-9 px-2 rounded-md border border-border bg-background text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button onClick={handleQuickQuote} className="gap-2">
                    <FileText className="w-4 h-4" /> ขอใบเสนอราคา
                  </Button>
                  <Button onClick={handleAddToCart} variant="outline" disabled={adding} className="gap-2">
                    <ShoppingCart className="w-4 h-4" /> {adding ? 'กำลังเพิ่ม…' : 'เพิ่มลงตะกร้า'}
                  </Button>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button asChild size="sm" variant="ghost" className="gap-1.5 text-xs">
                    <a href="tel:+66818268468"><Phone className="w-3.5 h-3.5" /> 081-826-8468</a>
                  </Button>
                  <LineQRButton className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md hover:bg-muted">
                    💬 LINE
                  </LineQRButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications & Datasheet bar */}
      {(detail.certifications?.length || detail.datasheetUrl) && (
        <section className="container mx-auto px-4 pt-2 pb-4">
          <Card className="bg-muted/30">
            <CardContent className="p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              {detail.certifications && detail.certifications.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Certifications:</span>
                  </div>
                  {detail.certifications.map((c) => (
                    <Badge key={c.code} variant="outline" className="border-primary/30 text-foreground" title={c.description}>
                      {c.code}
                    </Badge>
                  ))}
                </div>
              )}
              {detail.datasheetUrl && (
                <Button asChild size="sm" variant="outline" className="ml-auto gap-1.5">
                  <a href={detail.datasheetUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-3.5 h-3.5" /> Datasheet (PDF)
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Product Images & Sizes */}
      {detail.productImages && detail.productImages.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Product Images & Sizes</h2>
              <p className="text-sm text-muted-foreground">มิติและตำแหน่ง I/O ของตัวเครื่องตามแบบโรงงาน</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {detail.productImages.map((img, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="bg-white p-4 flex items-center justify-center min-h-[200px]">
                  <img src={img.src} alt={img.alt} loading="lazy" className="max-w-full max-h-[280px] object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                {img.caption && (
                  <CardContent className="p-3 text-xs text-muted-foreground border-t border-border">{img.caption}</CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Specs */}
      <section className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Specifications</h2>
            <p className="text-sm text-muted-foreground">ข้อมูลตามสเปกโรงงาน — กำหนดได้ตามความต้องการ</p>
          </div>
        </div>

        {detail.specGroups && detail.specGroups.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {detail.specGroups.map((g) => (
              <Card key={g.title}>
                <CardContent className="p-0">
                  <div className="px-4 py-3 border-b border-border bg-muted/40">
                    <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                  </div>
                  <dl className="divide-y divide-border">
                    {g.rows.map((s) => (
                      <div key={s.label} className="grid grid-cols-3 gap-3 p-3 text-sm">
                        <dt className="text-muted-foreground col-span-1">{s.label}</dt>
                        <dd className="col-span-2 font-medium">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <dl className="divide-y divide-border">
                {detail.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-3 gap-3 p-3 text-sm">
                    <dt className="text-muted-foreground col-span-1">{s.label}</dt>
                    <dd className="col-span-2 font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Configurable Options */}
      {detail.options && detail.options.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">ตัวเลือกที่ปรับแต่งได้</h2>
              <p className="text-sm text-muted-foreground">เลือกสเปกที่ต้องการ แล้วระบุในใบขอใบเสนอราคา (RFQ)</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {detail.options.map((opt) => (
              <Card key={opt.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-foreground">{opt.label}</h3>
                    <Badge variant="secondary" className="text-[10px]">{opt.choices.length} ตัวเลือก</Badge>
                  </div>
                  {opt.note && <p className="text-xs text-muted-foreground mb-2">{opt.note}</p>}
                  <ul className="space-y-1.5">
                    {opt.choices.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <Check className="w-3.5 h-3.5 text-primary mt-1 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Selection Table */}
      {detail.selectionTable && detail.selectionTable.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Product Selection Guide</h2>
              <p className="text-sm text-muted-foreground">รหัสสินค้าตามรุ่น CPU — ใช้อ้างอิงเวลาขอใบเสนอราคา</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold w-10">#</th>
                    <th className="px-3 py-2 font-semibold">Model</th>
                    <th className="px-3 py-2 font-semibold">Part Number</th>
                    <th className="px-3 py-2 font-semibold">CPU</th>
                    <th className="px-3 py-2 font-semibold">RAM</th>
                    <th className="px-3 py-2 font-semibold">Storage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detail.selectionTable.map((r) => (
                    <tr key={r.partNumber} className="hover:bg-muted/30">
                      <td className="px-3 py-2 text-muted-foreground">{r.no}</td>
                      <td className="px-3 py-2 font-medium">{r.model}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.partNumber}</td>
                      <td className="px-3 py-2">{r.cpu}</td>
                      <td className="px-3 py-2">{r.memory}</td>
                      <td className="px-3 py-2">{r.storage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Applications */}
      {detail.applications && detail.applications.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Applications</h2>
              <p className="text-sm text-muted-foreground">อุตสาหกรรมและการใช้งานที่เหมาะสม</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {detail.applications.map((a) => (
              <Card key={a} className="p-3 flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{a}</span>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {detail.gallery && detail.gallery.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Gallery</h2>
              <p className="text-sm text-muted-foreground">ภาพสินค้าและการใช้งานจริงในอุตสาหกรรม</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {detail.gallery.map((g, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={g.src} alt={g.alt} loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                {g.caption && <CardContent className="p-2 text-xs text-muted-foreground">{g.caption}</CardContent>}
              </Card>
            ))}
          </div>
        </section>
      )}


      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">รุ่นอื่นใน {detail.series}</h2>
              <p className="text-sm text-muted-foreground">รุ่นในตระกูลเดียวกันที่อาจเหมาะกับคุณ</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((r) => (
              <Link key={r.slug} to={`/shop/${r.slug}`} className="group">
                <Card className="h-full hover:border-primary transition-all hover:shadow-md">
                  <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={r.image} alt={r.model}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/product-placeholder.svg'; }}
                    />
                  </div>
                  <CardContent className="p-3">
                    <p className="font-bold text-sm">{r.model}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.tagline}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
