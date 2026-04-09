import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Check, ChevronRight, Cpu, FileText, Mail, Shield, Zap, Phone, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableRow,
} from "@/components/ui/table";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import FooterCompact from "@/components/FooterCompact";
import LineQRButton from "@/components/LineQRButton";
import ProductGallery from "@/components/ProductGallery";
import { getTabletProduct, getRelatedTablets, type TabletDetailProduct } from "@/data/rugged-tablet-products";

/* ───── Related Card ───── */
const RelatedCard = ({ product }: { product: TabletDetailProduct }) => (
  <Link to={`/rugged-tablet/${product.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
    <div className="bg-secondary/30 p-4 flex items-center justify-center h-44">
      <img src={product.image} alt={product.model} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
    </div>
    <div className="p-4 space-y-1.5">
      <p className="font-mono text-xs text-muted-foreground">{product.model}</p>
      <h3 className="text-sm font-bold line-clamp-2">{product.nameTH}</h3>
      <div className="flex flex-wrap gap-1">
        {product.badges.slice(0, 2).map((b) => <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>)}
      </div>
      {product.price ? (
        <p className="text-primary font-bold text-sm">{product.price}</p>
      ) : (
        <p className="text-muted-foreground text-xs">สอบถามราคา</p>
      )}
    </div>
  </Link>
);

/* ───── Main Component ───── */
const RuggedTabletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [tab, setTab] = useState("overview");  const product = getTabletProduct(id || "");
  const related = getRelatedTablets(id || "");

  // ── Engagement Tracking: product view ──
  useEffect(() => {
    if (product) {
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
          <Link to="/rugged-tablet"><Button>กลับหน้า Rugged Tablet</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${product.model} — ${product.name}`} description={`${product.nameTH} — ${product.keyFeatures.slice(0, 3).join(", ")}`} path={`/rugged-tablet/${product.id}`} />
      <BreadcrumbJsonLd items={[{ name: "สินค้า", path: "/" }, { name: "Rugged Tablet", path: "/rugged-tablet" }, { name: product.model, path: `/rugged-tablet/${product.id}` }]} />
      <ProductJsonLd collectionName={product.name} collectionDescription={product.nameTH} collectionUrl={`/rugged-tablet/${product.id}`} products={[{ name: product.name, price: product.price, category: "Rugged Tablet" }]} />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/rugged-tablet" className="text-muted-foreground hover:text-foreground">Rugged Tablet</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.model}</span>
          </nav>
        </div>
      </div>

      {/* Hero: Gallery + Info */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <WishlistHeart
                item={{ id: product.id, name: product.name, category: "Rugged Tablet", image: product.image, href: `/rugged-tablet/${product.id}`, specs: product.keyFeatures[0] }}
                className="absolute top-3 right-3 z-10"
              />
              <ProductGallery images={product.gallery} alt={product.model} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.os}</Badge>
              <Badge variant="outline">{product.screenSize}</Badge>
              {product.badges.map((b) => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-mono text-primary font-semibold mb-2">Model: {product.model}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.nameTH}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2">
              {product.quickSpecs.map((qs) => (
                <div key={qs.label} className="bg-secondary/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">{qs.label}</p>
                  <p className="text-xs font-bold text-foreground">{qs.value}</p>
                </div>
              ))}
            </div>

            {/* Config selector */}
            {product.configs && product.configs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold">เลือกคอนฟิกูเรชั่น</h3>
                {product.configs.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{c.label}</p>
                        {c.inStock && <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px]">พร้อมส่ง</Badge>}
                      </div>
                      <span className="text-primary font-extrabold text-lg">{c.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>RAM: {c.ram}</span>
                      <span>Storage: {c.storage}</span>
                      <span>Network: {c.network}</span>
                    </div>
                    {c.note && <p className="text-[10px] text-primary mt-1">{c.note}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Price / Contact */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">ราคา</p>
              {product.price ? (
                <p className="text-2xl font-extrabold text-primary mb-1">{product.price}</p>
              ) : (
                <p className="text-xl font-bold text-primary mb-1">สอบถามราคา</p>
              )}
              <p className="text-xs text-muted-foreground">จัดส่ง: {product.delivery}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setQuoteOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> sales@entgroup.co.th
                </button>
                <a href="tel:020456104" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm">
                  <Phone className="w-3.5 h-3.5" /> 02-045-6104
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button size="lg" variant="outline" onClick={() => setQuoteOpen(true)}>
                <FileText className="w-5 h-5 mr-2" /> ขอราคาด่วน
              </Button>
              <LineQRButton className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-foreground font-medium text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                <MessageSquare className="w-4 h-4" /> สอบถามทาง LINE
              </LineQRButton>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="mt-12">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-muted/50 w-full justify-start h-12 rounded-xl p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 font-bold">
                ภาพรวมผลิตภัณฑ์
              </TabsTrigger>
              <TabsTrigger value="specs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 font-bold">
                ข้อมูลจำเพาะ
              </TabsTrigger>
              <TabsTrigger value="warranty" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-6 font-bold">
                การรับประกัน
              </TabsTrigger>
            </TabsList>

            {/* ── Overview ── */}
            <TabsContent value="overview" className="mt-6 space-y-10">
              {/* Key Features */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> จุดเด่นพิเศษ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.keyFeatures.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overview Sections (story) */}
              {product.overviewSections.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> จุดเด่นของผลิตภัณฑ์
                  </h2>
                  {product.overviewSections.map((sec, i) => (
                    <div key={i} className={`grid md:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                      {sec.image && (
                        <div className={`rounded-xl overflow-hidden bg-secondary/30 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                          <img src={sec.image} alt={sec.titleTH} className="w-full h-auto object-cover max-h-[300px]" loading="lazy" />
                        </div>
                      )}
                      <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                        <h3 className="text-lg font-bold mb-1">{sec.titleTH}</h3>
                        {sec.titleEN && <p className="text-xs text-primary font-medium mb-2">{sec.titleEN}</p>}
                        <p className="text-sm text-muted-foreground mb-2">{sec.descTH}</p>
                        {sec.stats && (
                          <div className="flex flex-wrap gap-3">
                            {sec.stats.map((s) => (
                              <div key={s.label} className="bg-secondary/50 rounded-lg px-3 py-2 text-center">
                                <p className="font-bold text-primary text-sm">{s.value}</p>
                                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {sec.bullets && (
                          <ul className="space-y-1 mt-2">
                            {sec.bullets.map((b) => (
                              <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Zap className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Applications */}
              {product.applications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">เหมาะสำหรับ</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((a) => (
                      <Badge key={a} variant="secondary" className="text-sm px-3 py-1">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">มาตรฐานและการรับรอง</h2>
                  <div className="flex flex-wrap gap-3">
                    {product.certifications.map((c) => (
                      <div key={c} className="px-4 py-3 bg-card border border-border rounded-lg text-center min-w-[100px]">
                        <Shield className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="font-bold text-sm">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessories */}
              {product.accessories && product.accessories.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">อุปกรณ์เสริม</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {product.accessories.map((acc) => (
                      <div key={acc.nameEN} className="bg-card border border-border rounded-lg p-3 text-center">
                        {acc.image && <img src={acc.image} alt={acc.name} className="w-full h-24 object-contain mb-2" loading="lazy" />}
                        <p className="text-xs font-bold text-foreground">{acc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{acc.nameEN}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{acc.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Specifications ── */}
            <TabsContent value="specs" className="mt-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" /> ข้อมูลจำเพาะทางเทคนิค
              </h2>
              <div className="space-y-6">
                {product.specGroups.map((group) => (
                  <div key={group.groupName} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/50 px-4 py-2.5">
                      <h3 className="font-bold text-sm">{group.groupName}</h3>
                    </div>
                    <Table>
                      <TableBody>
                        {group.items.map((item) => (
                          <TableRow key={item.label}>
                            <TableCell className="font-medium w-1/3 text-sm">{item.label}</TableCell>
                            <TableCell className="text-sm whitespace-pre-line">{item.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── Warranty ── */}
            <TabsContent value="warranty" className="mt-6">
              <h2 className="text-xl font-bold mb-6">การรับประกันและบริการ</h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">รับประกัน 1 ปี</h3>
                    <p className="text-sm text-muted-foreground">รับประกันสินค้า 1 ปีเต็ม ครอบคลุมความเสียหายจากการผลิต พร้อมบริการหลังการขายจากทีมผู้เชี่ยวชาญ</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-bold text-sm mb-3">บริการที่ได้รับ</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "จัดส่งทั่วไทย", desc: "จัดส่งทั่วประเทศไทย เช็คสต๊อกทุกครั้งกับพนักงานขาย" },
                      { title: "สนับสนุนทางเทคนิค", desc: "ทีมวิศวกรพร้อมให้คำปรึกษาตลอดอายุสินค้า" },
                      { title: "อะไหล่แท้", desc: "บริการอะไหล่แท้จากโรงงาน พร้อมศูนย์ซ่อมบำรุง" },
                    ].map((s) => (
                      <div key={s.title} className="flex items-start gap-2 p-3 bg-secondary/30 rounded-lg">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-sm">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <h4 className="font-bold text-sm">เงื่อนไขการรับประกัน</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ครอบคลุมความเสียหายจากการผลิตเท่านั้น</li>
                    <li>• ไม่ครอบคลุมความเสียหายจากการใช้งานผิดวิธี อุบัติเหตุ หรือภัยธรรมชาติ</li>
                    <li>• ต้องแสดงหลักฐานการซื้อเพื่อรับบริการรับประกัน</li>
                    <li>• มีราคาพิเศษสำหรับการสั่งซื้อจำนวนมาก (B2B)</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                  <Button onClick={() => setQuoteOpen(true)}>
                    <FileText className="w-4 h-4 mr-2" /> ขอใบเสนอราคา
                  </Button>
                  <LineQRButton className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-foreground font-medium text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                    <MessageSquare className="w-4 h-4" /> ติดต่อ LINE @entgroup
                  </LineQRButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => <RelatedCard key={r.id} product={r} />)}
            </div>
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
};

export default RuggedTabletDetail;
