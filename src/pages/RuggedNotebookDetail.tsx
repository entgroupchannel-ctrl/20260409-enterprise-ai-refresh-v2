import { useParams, Link } from "react-router-dom";
import LineQRButton from "@/components/LineQRButton";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, ChevronRight, Cpu, FileText, Mail, Shield, Zap, Phone, MessageSquare, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import FooterCompact from "@/components/FooterCompact";
import ProductGallery from "@/components/ProductGallery";
import { getNotebook, getRelatedNotebooks, type RuggedNotebook } from "@/data/rugged-notebook-products";

/* ───── Related Card ───── */
const RelatedCard = ({ nb }: { nb: RuggedNotebook }) => (
  <Link to={`/rugged-notebook/${nb.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all">
    <div className="bg-secondary/30 p-4 flex items-center justify-center h-44">
      <img src={nb.image} alt={nb.model} className="max-h-full object-contain group-hover:scale-105 transition-transform" loading="lazy" />
    </div>
    <div className="p-4 space-y-1.5">
      <p className="font-mono text-xs text-muted-foreground">{nb.model}</p>
      <h3 className="text-sm font-bold line-clamp-2">{nb.title}</h3>
      <div className="flex flex-wrap gap-1">
        {nb.badges.slice(0, 2).map((b) => <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>)}
      </div>
      {nb.priceStart ? (
        <p className="text-primary font-bold text-sm">{nb.priceStart}</p>
      ) : (
        <p className="text-muted-foreground text-xs">สอบถามราคา</p>
      )}
    </div>
  </Link>
);

/* ───── Main Component ───── */
const RuggedNotebookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [tab, setTab] = useState("overview");  const nb = id ? getNotebook(id) : undefined;
  const related = id ? getRelatedNotebooks(id) : [];

  // ── Engagement Tracking: product view ──
  useEffect(() => {
    if (nb) {
    }
  }, [nb?.id]);

  if (!nb) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
          <Link to="/rugged-notebook"><Button>กลับหน้า Rugged Notebook</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${nb.model} — ${nb.title}`}
        description={`${nb.titleTH} | ${nb.cpu} | ${nb.protection}`}
        path={`/rugged-notebook/${nb.id}`}
      />
      <ProductJsonLd
        collectionName={nb.model}
        collectionDescription={nb.titleTH}
        collectionUrl={`/rugged-notebook/${nb.id}`}
        products={[{ name: nb.title, image: nb.image, price: nb.priceStart?.replace(/[฿,]/g, ""), description: nb.cpu, category: "Rugged Notebook" }]}
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/" },
        { name: "Rugged Notebook", path: "/rugged-notebook" },
        { name: nb.model, path: `/rugged-notebook/${nb.id}` },
      ]} />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/rugged-notebook" className="text-muted-foreground hover:text-foreground">Rugged Notebook</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{nb.model}</span>
          </nav>
        </div>
      </div>

      {/* Hero: Gallery + Info */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <ProductGallery images={nb.gallery} alt={nb.model} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{nb.os}</Badge>
              <Badge variant="outline">{nb.screenSize}</Badge>
              {nb.badges.map((b) => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-mono text-primary font-semibold mb-2">Model: {nb.model}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{nb.title}</h1>
              <p className="text-lg text-muted-foreground">{nb.titleTH}</p>
              <p className="text-sm text-muted-foreground mt-1">{nb.subtitle}</p>
            </div>

            {/* Config selector */}
            {nb.configs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold">เลือกคอนฟิกูเรชั่น</h3>
                {nb.configs.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{c.label}</p>
                        <p className="text-xs text-muted-foreground">{c.cpu}</p>
                        <p className="text-xs text-muted-foreground">{c.ram}</p>
                      </div>
                      <span className="text-primary font-extrabold text-lg">{c.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Price / Contact */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">ราคาเริ่มต้น</p>
              {nb.priceStart ? (
                <p className="text-2xl font-extrabold text-primary mb-1">{nb.priceStart}</p>
              ) : (
                <p className="text-xl font-bold text-primary mb-1">สอบถามราคา</p>
              )}
              <p className="text-xs text-muted-foreground">{nb.warranty.note}</p>
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

        {/* ─── Tabs: Overview / Specs / Warranty ─── */}
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
                  {nb.keyFeatures.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights (story sections) */}
              {nb.highlights.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> จุดเด่นของผลิตภัณฑ์
                  </h2>
                  {nb.highlights.map((h, i) => (
                    <div
                      key={i}
                      className={`grid md:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
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

              {/* Certifications */}
              <div>
                <h2 className="text-xl font-bold mb-4">มาตรฐานและการรับรอง</h2>
                <div className="flex flex-wrap gap-3">
                  {nb.certifications.map((c) => (
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
                {nb.specGroups.map((group) => (
                  <div key={group.groupName} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="bg-secondary/50 px-4 py-2.5">
                      <h3 className="font-bold text-sm">{group.groupName}</h3>
                    </div>
                    <Table>
                      <TableBody>
                        {group.items.map((item) => (
                          <TableRow key={item.label}>
                            <TableCell className="font-medium w-1/3 text-sm">{item.label}</TableCell>
                            <TableCell className="text-sm">
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
                    <h3 className="font-bold text-lg">รับประกัน {nb.warranty.standard}</h3>
                    <p className="text-sm text-muted-foreground">{nb.warranty.support}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-bold text-sm mb-3">มาตรฐานที่ผ่านการรับรอง</h4>
                  <div className="flex flex-wrap gap-2">
                    {nb.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-sm px-3 py-1">{c}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <h4 className="font-bold text-sm">หมายเหตุสำคัญ</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {nb.warranty.note}</li>
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
              {related.map((r) => <RelatedCard key={r.id} nb={r} />)}
            </div>
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
};

export default RuggedNotebookDetail;
