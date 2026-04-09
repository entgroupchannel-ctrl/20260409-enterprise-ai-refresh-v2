import { useParams, Link } from "react-router-dom";
import LineQRButton from "@/components/LineQRButton";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, ChevronRight, Cpu, HardDrive, Monitor, Shield,
  Battery, Camera, Wifi, Smartphone, FileText, Mail, Scan, Zap, Phone, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import FooterCompact from "@/components/FooterCompact";
import ProductGallery from "@/components/ProductGallery";
import { getHandheldProduct, getRelatedHandhelds } from "@/data/rugged-handheld-products";

/* ───── Related Product Card ───── */
const RelatedCard = ({ product, onQuote }: { product: ReturnType<typeof getHandheldProduct>; onQuote: (n: string) => void }) => {
  if (!product) return null;
  return (
    <Link to={`/handheld/${product.id}`} className="card-surface overflow-hidden group hover:border-primary/30 transition-all">
      <div className="bg-secondary/30 p-4 flex items-center justify-center h-48">
        <img src={product.image} alt={product.model} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-foreground text-sm">{product.model}</h3>
          <Badge variant="secondary" className="text-xs">{product.screenSize}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.nameTH}</p>
        <div className="flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>
          ))}
        </div>
        <Button size="sm" className="w-full mt-2" onClick={(e) => { e.preventDefault(); onQuote(product.model); }}>
          <FileText className="w-3.5 h-3.5 mr-1.5" /> ขอราคา
        </Button>
      </div>
    </Link>
  );
};

/* ───── Spec Row Helper ───── */
const specRows = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "os", label: "Operating System", icon: Monitor },
  { key: "ram", label: "Memory (RAM)", icon: HardDrive },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "display", label: "Display", icon: Monitor },
  { key: "battery", label: "Battery", icon: Battery },
  { key: "camera", label: "Camera", icon: Camera },
  { key: "scanner", label: "Scanner", icon: Scan },
  { key: "protection", label: "Protection Rating", icon: Shield },
  { key: "dimensions", label: "Dimensions", icon: Smartphone },
  { key: "weight", label: "Weight", icon: Smartphone },
];

/* ───── Main Component ───── */
const RuggedHandheldDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);  const product = id ? getHandheldProduct(id) : undefined;
  const related = id ? getRelatedHandhelds(id) : [];

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
          <Link to="/handheld"><Button>กลับหน้า Handheld & PDA</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — ${product.name}`}>
        description={`${product.nameTH} | ${product.specs.cpu} | ${product.specs.protection}`}
        path={`/handheld/${product.id}`}
      />
      <ProductJsonLd
        collectionName={product.name}
        collectionDescription={product.nameTH}
        collectionUrl={`/handheld/${product.id}`}
        products={[{ name: product.name, image: product.image, description: product.specs.cpu, category: "Rugged Handheld" }]}
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/products" },
        { name: "Handheld & PDA", path: "/handheld" },
        { name: product.model, path: `/handheld/${product.id}` },
      ]} />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/handheld" className="text-muted-foreground hover:text-foreground">Handheld & PDA</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.model}</span>
          </nav>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image + Badges */}
          <div className="space-y-4">
            <div className="relative">
              <ProductGallery images={product.gallery} alt={product.model} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.category === "windows" ? "Windows" : "Android"}</Badge>
              <Badge variant="outline">{product.screenSize}</Badge>
              {product.specs.scanner && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Scanner</Badge>}>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-mono text-primary font-semibold mb-2">Model: {product.model}</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.nameTH}</p>
            </div>

            {/* Highlight Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <Badge key={b} variant="default" className="text-sm px-3 py-1">{b}</Badge>
              ))}
            </div>

            {/* Price / Contact */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">ราคา</p>
              <p className="text-xl font-bold text-primary mb-3">สอบถามราคา</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => setQuoteProduct(product.model)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium cursor-pointer">
                  <Mail className="w-4 h-4" /> sales@entgroup.co.th
                </button>
                <a href="tel:020456104" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> 02-045-6104
                </a>
              </div>
            </div>

            {/* Selling Points — Golemi-style */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">
                เหตุผลที่ควรเลือก {product.model}
              </h3>
              <div className="space-y-2">
                {product.sellingPoints.map((sp) => (
                  <div key={sp.title} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{sp.title}</p>
                      <p className="text-xs text-muted-foreground">{sp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Specs */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-3 text-foreground text-sm">สเปกโดดเด่น / Key Specs</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Display</p>
                  <p className="font-medium text-foreground">{product.screenSize}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CPU</p>
                  <p className="font-medium text-foreground">{product.specs.cpu.split(" ").slice(0, 3).join(" ")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">RAM/Storage</p>
                  <p className="font-medium text-foreground">{product.specs.ram}/{product.specs.storage}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">OS</p>
                  <p className="font-medium text-foreground">{product.specs.os}</p>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm">การใช้งาน</h3>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((app) => (
                  <Badge key={app} variant="outline">{app}</Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button size="lg" variant="outline" onClick={() => setQuoteProduct(product.model)}>
                <FileText className="w-5 h-5 mr-2" /> ขอราคาด่วน
              </Button>
              <LineQRButton className="flex-1 h-11 text-base">
                <MessageSquare className="w-4 h-4" /> สอบถามราคาพิเศษ
              </LineQRButton>
            </div>
          </div>
        </div>

        {/* Full Specs Table */}
        <div className="mt-12">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" /> ข้อมูลจำเพาะเต็มรูปแบบ
          </h2>
          <div className="card-surface overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-1/3 font-semibold">รายการ</TableHead>
                  <TableHead className="font-semibold">ข้อมูลจำเพาะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specRows.map(({ key, label, icon: Icon }) => {
                  const value = product.specs[key as keyof typeof product.specs];
                  if (!value) return null;
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" /> {label}>
                        </div>
                      </TableCell>
                      <TableCell>{String(value)}</TableCell>
                    </TableRow>
                  );
                })}
                {/* Connectivity */}
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-primary" /> Connectivity
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.specs.connectivity.map((c) => (
                        <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> คุณสมบัติเด่น
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feat) => (
              <div key={feat} className="flex items-start gap-3 p-3 card-surface">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-display font-bold mb-6">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} onQuote={setQuoteProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
};

export default RuggedHandheldDetail;
