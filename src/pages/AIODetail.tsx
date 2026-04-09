import { useParams, Link } from "react-router-dom";
import { icons } from "lucide-react";
import LineQRButton from "@/components/LineQRButton";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, ChevronRight, Cpu, FileText, Mail, Shield, Zap, Phone, MessageSquare, Sparkles,
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
import ProductGallery from "@/components/ProductGallery";
import { getAIOProduct, getRelatedAIO, categoryLabels, type AIOProduct } from "@/data/aio-products";

/* ── Related Card ── */
const RelatedCard = ({ p }: { p: AIOProduct }) => (
  <Link to={`/aio/${p.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
    <div className="bg-secondary/30 p-4 flex items-center justify-center h-44">
      <img src={p.image} alt={p.model} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
    </div>
    <div className="p-4 space-y-1.5">
      <div className="flex gap-1 flex-wrap">
        {p.os.map((o) => (
          <Badge key={o} variant="outline" className="text-[10px]">{o}</Badge>
        ))}
        <Badge variant="secondary" className="text-[10px]">{p.screenSize}</Badge>
      </div>
      <h3 className="text-sm font-bold line-clamp-2">{p.model}</h3>
      <p className="text-xs text-muted-foreground line-clamp-1">{p.title}</p>
      {p.price ? (
        <p className="text-primary font-bold text-sm">{p.price}</p>
      ) : (
        <p className="text-muted-foreground text-xs">สอบถามราคา</p>
      )}
    </div>
  </Link>
);

/* ══════════ Main Component ══════════ */
const AIODetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [tab, setTab] = useState("overview");  const product = id ? getAIOProduct(id) : undefined;
  const related = id ? getRelatedAIO(id) : [];

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
          <Link to="/aio"><Button>กลับหน้า All-in-One PC</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — ${product.title}`}
        description={`${product.titleTH} | ${product.cpu} | ${product.screenSize}`}
        path={`/aio/${product.id}`}
      />
      <ProductJsonLd
        collectionName={product.model}
        collectionDescription={product.titleTH}
        collectionUrl={`/aio/${product.id}`}
        products={[{ name: product.title, image: product.image, price: product.price?.replace(/[฿,]/g, ""), description: product.cpu, category: "All-in-One PC" }]}
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/" },
        { name: "All-in-One PC", path: "/aio" },
        { name: product.model, path: `/aio/${product.id}` },
      ]} />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/aio" className="text-muted-foreground hover:text-foreground">All-in-One PC</Link>
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
                item={{ id: product.id, name: product.model, category: "All-in-One PC", image: product.image, href: `/aio/${product.id}`, specs: product.titleTH }}
                className="absolute top-3 right-3 z-10"
              />
              <ProductGallery images={product.gallery} alt={product.model} />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.os.map((o) => (
                <Badge key={o} variant="secondary">{o}</Badge>
              ))}
              <Badge variant="outline">{product.screenSize}</Badge>
              <Badge variant="outline">{categoryLabels[product.category]}</Badge>
              {product.certifications.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-mono text-primary font-semibold mb-2">Model: {product.model}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.titleTH}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "CPU", value: product.cpu },
                { label: "RAM", value: product.ram },
                { label: "Storage", value: product.storage },
                { label: "Mount", value: product.mount },
              ].map((s) => (
                <div key={s.label} className="p-3 bg-card border border-border rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{s.label}</p>
                  <p className="text-sm font-medium text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Price / Contact */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">ราคา</p>
              {product.price ? (
                <p className="text-2xl font-extrabold text-primary mb-1">{product.price}</p>
              ) : (
                <p className="text-xl font-bold text-primary mb-1">สอบถามราคา</p>
              )}
              <p className="text-xs text-muted-foreground">{product.warranty.note}</p>
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
              <LineQRButton className="flex-1 h-11 text-base">
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
                  <Zap className="w-5 h-5 text-primary" /> จุดเด่นพิเศษ / Key Features
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

              {/* Story Sections */}
              {product.overviewSections.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> จุดเด่นของผลิตภัณฑ์
                  </h2>
                  {product.overviewSections.map((h, i) => (
                    <div
                      key={i}
                      className={`grid md:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
                    >
                      {h.image && (
                        <div className={`rounded-xl overflow-hidden bg-secondary/30 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                          <img src={h.image} alt={h.titleEN} className="w-full h-auto object-cover max-h-[300px]" loading="lazy" />
                        </div>
                      )}
                      <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                        <h3 className="text-lg font-bold mb-1">{h.titleTH}</h3>
                        <p className="text-xs text-primary font-medium mb-2">{h.titleEN}</p>
                        <p className="text-sm text-muted-foreground mb-1">{h.descTH}</p>
                        <p className="text-xs text-muted-foreground italic">{h.descEN}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Applications */}
              {product.applications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">การใช้งาน / Applications</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {product.applications.map((app) => (
                      <div key={app.titleEN} className="p-4 bg-card border border-border rounded-lg text-center">
                        {(() => { const Icon = icons[app.icon as keyof typeof icons]; return Icon ? <Icon className="w-6 h-6 mx-auto mb-2 text-primary" /> : <span className="text-2xl mb-2 block">{app.icon}</span>; })()}
                        <p className="font-bold text-sm">{app.titleTH}</p>
                        <p className="text-xs text-muted-foreground">{app.titleEN}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
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
                            <TableCell className="text-sm whitespace-pre-line">
                              {item.value}
                              {item.note && (
                                <span className="block text-xs text-primary mt-0.5"><Sparkles className="inline w-3 h-3 mr-0.5" /> {item.note}</span>
                              )}
                            </TableCell>
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
                    <h3 className="font-bold text-lg">รับประกัน {product.warranty.standard}</h3>
                    <p className="text-sm text-muted-foreground">{product.warranty.support}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-bold text-sm mb-3">มาตรฐานที่ผ่านการรับรอง</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-sm px-3 py-1">{c}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <h4 className="font-bold text-sm">หมายเหตุสำคัญ</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {product.warranty.note}</li>
                    <li>• สเปกสินค้าและตัวเลือก อาจปรับเปลี่ยนได้โดยไม่ต้องแจ้งล่วงหน้า</li>
                    <li>• มีราคาพิเศษสำหรับการสั่งซื้อจำนวนมาก (B2B)</li>
                    <li>• ติดต่อ LINE @entgroup เพื่อสอบถามส่วนลดเพิ่มเติม</li>
                  </ul>
                </div>

                <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                  <Button onClick={() => setQuoteOpen(true)}>
                    <FileText className="w-4 h-4 mr-2" /> ขอใบเสนอราคา
                  </Button>
                  <LineQRButton>
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
              {related.map((r) => <RelatedCard key={r.id} p={r} />)}
            </div>
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
};

export default AIODetail;
