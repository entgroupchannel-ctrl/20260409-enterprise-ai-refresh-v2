import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Download, Check, FileText, Thermometer, Cpu, HardDrive,
  Monitor, Usb, Network, Zap, Shield, Mail, ChevronRight, Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";
import FooterCompact from "@/components/FooterCompact";
import ProductImageGallery from "@/components/ibox/ProductImageGallery";
import IBoxProductCard from "@/components/ibox/IBoxProductCard";
import { getIBoxProduct, getRelatedProducts } from "@/data/ibox-products";

const specItems = [
  { key: "cpu", label: "Processor", icon: Cpu },
  { key: "cpuGen", label: "CPU Generation", icon: Cpu },
  { key: "ram", label: "Memory (RAM)", icon: HardDrive },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "display", label: "Display", icon: Monitor },
  { key: "io", label: "I/O Ports", icon: Usb },
  { key: "temp", label: "Operating Temperature", icon: Thermometer },
];

const IBoxDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);

  const relatedProducts = id ? getRelatedProducts(id) : [];

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
          <Link to="/ibox-series">
            <Button>กลับหน้า iBox Series</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.id} — ${product.name}`}
        description={`${product.nameTH} | ${product.specs.cpu} | ${product.specs.ram}`}
        path={`/ibox-series/${product.id}`}
      />
      <ProductJsonLd
        collectionName={product.name}
        collectionDescription={product.nameTH}
        collectionUrl={`/ibox-series/${product.id}`}
        products={[{ name: product.name, image: product.image, description: product.specs.cpu, category: product.subcategory }]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "สินค้า", path: "/products" },
          { name: "iBox Series", path: "/ibox-series" },
          { name: product.id, path: `/ibox-series/${product.id}` },
        ]}
      />

      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md py-3 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground">หน้าหลัก</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link to="/ibox-series" className="text-muted-foreground hover:text-foreground">iBox Series</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.id}</span>
          </nav>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <ProductImageGallery
              mainImage={product.image}
              gallery={product.gallery}
              dimensionImage={product.dimensionImage}
              productName={product.nameTH}
              isNew={product.isNew}
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.subcategory}</Badge>
              {product.specs.poe && <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">PoE+ Support</Badge>}
              {product.specs.pcie && <Badge variant="outline">PCIe Expansion</Badge>}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-mono text-primary font-semibold mb-2">Model: {product.id}</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.nameTH}</p>
            </div>

            {/* Price / Contact */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">ราคา</p>
              <p className="text-xl font-bold text-primary mb-3">
                สอบถามราคา
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => setQuoteProduct(product.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> sales@entgroup.co.th
                </button>
                <a href="tel:020456104" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> 02-045-6104
                </a>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">CPU</span>
                </div>
                <p className="text-sm font-medium text-foreground">{product.specs.cpu}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">RAM</span>
                </div>
                <p className="text-sm font-medium text-foreground">{product.specs.ram}</p>
              </div>
              {product.specs.lanPorts !== undefined && product.specs.lanPorts > 0 && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Network className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">LAN</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{product.specs.lanPorts} Ports {product.specs.poe ? "(PoE)" : ""}</p>
                </div>
              )}
              {product.specs.comPorts !== undefined && product.specs.comPorts > 0 && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Usb className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">COM</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{product.specs.comPorts} Ports</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> คุณสมบัติเด่น
              </h3>
              <ul className="grid grid-cols-1 gap-2">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">การใช้งาน</h3>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((app) => (
                  <Badge key={app} variant="outline">{app}</Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button size="lg" variant="outline" onClick={() => setQuoteProduct(product.name)}>
                <FileText className="w-5 h-5 mr-2" /> ขอราคาด่วน
              </Button>
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
                {specItems.map(({ key, label, icon: Icon }) => {
                  const value = product.specs[key as keyof typeof product.specs];
                  if (!value || value === "N/A") return null;
                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" /> {label}
                        </div>
                      </TableCell>
                      <TableCell>{String(value)}</TableCell>
                    </TableRow>
                  );
                })}
                {product.specs.comPorts !== undefined && (
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2"><Usb className="w-4 h-4 text-primary" /> COM Ports</div>
                    </TableCell>
                    <TableCell>{product.specs.comPorts} ports</TableCell>
                  </TableRow>
                )}
                {product.specs.lanPorts !== undefined && (
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2"><Network className="w-4 h-4 text-primary" /> LAN Ports</div>
                    </TableCell>
                    <TableCell>{product.specs.lanPorts} ports{product.specs.poe && " (PoE+ Support)"}</TableCell>
                  </TableRow>
                )}
                {product.specs.usbPorts !== undefined && (
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2"><Usb className="w-4 h-4 text-primary" /> USB Ports</div>
                    </TableCell>
                    <TableCell>{product.specs.usbPorts} ports</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-display font-bold mb-6">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <IBoxProductCard
                  key={p.id}
                  product={p}
                  selectedProducts={selectedProducts}
                  toggleSelect={toggleSelect}
                  onQuote={setQuoteProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <FooterCompact />
    </div>
  );
};

export default IBoxDetail;
