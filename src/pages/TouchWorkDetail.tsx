import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, Monitor, Cpu, Smartphone, ArrowRight, Maximize,
  ShieldCheck, CheckCircle2, Layers, Sun, Box, Tag, Info,
  Ruler, Thermometer, Plug, Package, MonitorSmartphone, Hand,
  Link2, Download, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import {
  getTouchworkProduct,
  touchworkProducts,
  type TouchWorkArch,
} from "@/data/touchwork-products";
import ioPortsImg from "@/assets/touchwork/shared/io-ports.png";
import installWallImg from "@/assets/touchwork/shared/install-wall.png";
import installDeskImg from "@/assets/touchwork/shared/install-desk.png";
import installEmbedImg from "@/assets/touchwork/shared/install-embed.png";
import ProductGallery from "@/components/ProductGallery";
import ImageLightbox, { ZoomHintBadge } from "@/components/ImageLightbox";
import { getTouchWorkProductImages, getTouchWorkDimensionImages } from "@/data/touchwork-gallery";

// ---- Helpers (declared before default export for HMR safety) -------------

const SpecTable = ({ rows }: { rows: { label: string; value: string }[] }) => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <dl className="divide-y divide-border/60">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-4 py-3 hover:bg-muted/30 transition-colors">
          <dt className="text-sm font-medium text-muted-foreground sm:col-span-1">{r.label}</dt>
          <dd className="text-sm font-semibold sm:col-span-2">{r.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

interface CpuOpt { cpu: string; gpu: string; memory: string; storage: string; network: string; os: string }

const CpuTable = ({ title, color, options }: { title: string; color: "emerald" | "violet"; options: CpuOpt[] }) => {
  const headerColor =
    color === "emerald"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30";
  const fields: { key: keyof CpuOpt; label: string }[] = [
    { key: "cpu", label: "CPU" },
    { key: "gpu", label: "Graphics" },
    { key: "memory", label: "Memory" },
    { key: "storage", label: "Storage" },
    { key: "network", label: "Network" },
    { key: "os", label: "OS" },
  ];
  return (
    <div>
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold mb-3 ${headerColor}`}>
        <Cpu className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-4 py-2.5 font-semibold w-32">รายการ</th>
              {options.map((_, i) => (
                <th key={i} className="text-left px-4 py-2.5 font-semibold">ตัวเลือก {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {fields.map((f) => (
              <tr key={f.key} className="hover:bg-muted/20">
                <td className="px-4 py-2.5 text-muted-foreground font-medium">{f.label}</td>
                {options.map((o, i) => (
                  <td key={i} className="px-4 py-2.5">{o[f.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const archIcon: Record<TouchWorkArch, typeof Monitor> = {
  Monitor: Monitor,
  ARM: Smartphone,
  X86: Cpu,
};

const archColor: Record<TouchWorkArch, string> = {
  Monitor: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
  ARM: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  X86: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
};

export default function TouchWorkDetail() {
  const { model } = useParams<{ model: string }>();
  const product = getTouchworkProduct(model || "");
  const [selectedArch, setSelectedArch] = useState<TouchWorkArch>(
    product?.variants[0]?.arch || "Monitor"
  );

  const related = useMemo(() => {
    if (!product) return [];
    return touchworkProducts
      .filter((p) => p.model !== product.model)
      .sort((a, b) => Math.abs(a.size - product.size) - Math.abs(b.size - product.size))
      .slice(0, 3);
  }, [product]);

  if (!product) return <Navigate to="/touchwork" replace />;

  const variant = product.variants.find((v) => v.arch === selectedArch) || product.variants[0];
  const sku = `${product.model}-${variant.arch}`;
  const productName = `TouchWork ${product.model} ${product.size}″ ${variant.arch}`;
  

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${product.model} — TouchWork ${product.size}″ Touch Display | ENT Group`}
        description={`TouchWork ${product.model} จอสัมผัส ${product.size}″ ${product.resolution} ${product.touch} เลือกได้ ${product.variants.length} รุ่น (${product.variants.map(v => v.arch).join(", ")})`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "หน้าแรก", path: "/" },
          { name: "TouchWork Series", path: "/touchwork" },
          { name: product.model, path: `/touchwork/${product.model.toLowerCase()}` },
        ]}
      />

      <MiniNavbar />

      {/* Breadcrumb + Series Nav */}
      <section className="border-b border-border">
        <div className="container max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition">หน้าหลัก</Link>
            <span>/</span>
            <Link to="/touchwork" className="hover:text-primary transition">TouchWork Series</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.model}</span>
          </div>
          <Link
            to="/touchwork"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-bold"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            ดูรุ่นอื่นใน TouchWork Series ทั้งหมด
            <Monitor size={14} className="opacity-60" />
          </Link>
        </div>
      </section>

      {/* Hero — image + info */}
      <section className="container max-w-7xl mx-auto px-6 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-muted/30 via-background to-muted/20 border border-border overflow-hidden p-6">
              {(() => {
                const gallery = getTouchWorkProductImages(product.model, variant.arch);
                const images = gallery.length > 0 ? gallery : [variant.image];
                return (
                  <ImageLightbox
                    images={images}
                    alt={productName}
                    downloadPrefix={`${product.model}-${variant.arch}`}
                  >
                    {(open) => (
                      <div className="relative group">
                        <ProductGallery images={images} alt={productName} onImageClick={open} />
                        <ZoomHintBadge />
                      </div>
                    )}
                  </ImageLightbox>
                );
              })()}
            </div>
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/90 text-background text-sm font-bold z-10">
              <Maximize className="h-3.5 w-3.5" /> {product.size}″
            </div>
          </div>

          {/* Info */}
          <div>
            <Badge variant="secondary" className="mb-3">TouchWork Series • Indoor Display</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {product.model}
            </h1>
            <p className="text-lg text-muted-foreground mb-5">
              จอสัมผัสอุตสาหกรรม {product.size}″ — {product.resolution} ({product.ratio})
            </p>

            {/* Variant Switcher — KEY UX */}
            <div className="rounded-2xl border border-border bg-card p-4 mb-5">
              <div className="text-xs font-medium text-muted-foreground mb-2.5 uppercase tracking-wide">
                เลือก Architecture
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["Monitor", "ARM", "X86"] as TouchWorkArch[]).map((a) => {
                  const available = product.variants.some((v) => v.arch === a);
                  const active = selectedArch === a;
                  const Icon = archIcon[a];
                  return (
                    <button
                      key={a}
                      disabled={!available}
                      onClick={() => setSelectedArch(a)}
                      className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5"
                          : available
                          ? "border-border hover:border-primary/50"
                          : "border-border/30 opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border mb-1.5 ${archColor[a]}`}>
                        <Icon className="h-3 w-3" />
                        {a}
                      </div>
                      <div className="text-xs font-semibold">
                        {a === "Monitor" ? "จอเปล่า" : a === "ARM" ? "Android" : "Windows"}
                      </div>
                      {!available && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">ไม่มีรุ่นนี้</div>
                      )}
                      {active && (
                        <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-3 border-t border-border/50 text-sm">
                <div className="font-medium mb-1">{variant.os}</div>
                <div className="text-xs text-muted-foreground mb-1.5">{variant.cpuHint}</div>
                <p className="text-xs text-foreground/70">{variant.description}</p>
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: "ความละเอียด", value: product.resolution, icon: Layers },
                { label: "อัตราส่วน", value: product.ratio, icon: Box },
                { label: "ระบบสัมผัส", value: product.touch, icon: Maximize },
                { label: "ความสว่าง", value: product.brightness, icon: Sun },
                { label: "มาตรฐาน", value: product.ipRating, icon: ShieldCheck },
                { label: "SKU", value: sku, icon: Tag },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-card/50 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    <s.icon className="h-3 w-3" /> {s.label}
                  </div>
                  <div className="text-sm font-semibold">{s.value}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2">
              <AddToCartButton
                productModel={sku}
                productName={productName}
                size="lg"
              />
              <QuoteRequestButton
                productModel={sku}
                productName={productName}
                size="lg"
                variant="outline"
              />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <a
                  href={`/datasheets/${product.model}-Datasheet-ENTGroup.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  download={`${product.model}-Datasheet-ENTGroup.pdf`}
                >
                  <Download className="h-4 w-4" /> Datasheet (PDF)
                </a>
              </Button>
            </div>

            <div className="mt-4">
              <PriceDisclaimer />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Tabs */}
      <section className="container max-w-7xl mx-auto px-6 py-8 border-t border-border/40">
        <h2 className="text-2xl font-bold mb-1">รายละเอียดสินค้า</h2>
        <p className="text-sm text-muted-foreground mb-5">
          ข้อมูลเทคนิคครบถ้วน — เลือกแท็บเพื่อดูสเปกแต่ละหมวด
        </p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-1.5"><Info className="h-3.5 w-3.5"/>ภาพรวม</TabsTrigger>
            <TabsTrigger value="lcd" className="gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5"/>หน้าจอ LCD</TabsTrigger>
            <TabsTrigger value="touch" className="gap-1.5"><Hand className="h-3.5 w-3.5"/>ระบบสัมผัส</TabsTrigger>
            <TabsTrigger value="dimension" className="gap-1.5"><Ruler className="h-3.5 w-3.5"/>ขนาด/น้ำหนัก</TabsTrigger>
            <TabsTrigger value="environment" className="gap-1.5"><Thermometer className="h-3.5 w-3.5"/>สภาพแวดล้อม</TabsTrigger>
            <TabsTrigger value="power" className="gap-1.5"><Plug className="h-3.5 w-3.5"/>พลังงาน</TabsTrigger>
            <TabsTrigger value="io" className="gap-1.5"><Link2 className="h-3.5 w-3.5"/>I/O และการติดตั้ง</TabsTrigger>
            {(product.specs.androidOptions || product.specs.windowsOptions) && (
              <TabsTrigger value="cpu" className="gap-1.5"><Cpu className="h-3.5 w-3.5"/>CPU/OS</TabsTrigger>
            )}
            <TabsTrigger value="certification" className="gap-1.5"><Award className="h-3.5 w-3.5"/>มาตรฐาน/ประกัน</TabsTrigger>
            <TabsTrigger value="delivery" className="gap-1.5"><Package className="h-3.5 w-3.5"/>ในกล่อง</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  จุดเด่น
                </h3>
                <ul className="space-y-2">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Box className="h-5 w-5 text-primary" />
                  รูปแบบการติดตั้ง
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.mounting.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm"
                    >
                      <Box className="h-3.5 w-3.5 text-muted-foreground" /> {m}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>รองรับการสั่งทำพิเศษ — ติดต่อทีมขายเพื่อสอบถามอุปกรณ์ติดตั้งเสริม</span>
                </div>
              </div>
            </div>

            {/* All variants gallery */}
            <div className="mt-8 pt-6 border-t border-border/40">
              <h3 className="text-lg font-bold mb-4">ทุกตัวเลือกของ {product.model}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.variants.map((v) => {
                  const Icon = archIcon[v.arch];
                  const active = selectedArch === v.arch;
                  return (
                    <button
                      key={v.arch}
                      onClick={() => setSelectedArch(v.arch)}
                      className={`text-left rounded-xl border bg-card overflow-hidden hover:border-primary/50 transition ${
                        active ? "border-primary ring-2 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div className="aspect-square bg-muted/30">
                        <img src={v.image} alt={`${product.model} ${v.arch}`} className="w-full h-full object-contain p-3" loading="lazy" />
                      </div>
                      <div className="p-3">
                        <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${archColor[v.arch]} mb-1`}>
                          <Icon className="h-3 w-3" /> {v.arch}
                        </div>
                        <div className="text-sm font-semibold">{v.os}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lcd" className="mt-6"><SpecTable rows={product.specs.lcd} /></TabsContent>
          <TabsContent value="touch" className="mt-6"><SpecTable rows={product.specs.touch} /></TabsContent>
          <TabsContent value="dimension" className="mt-6 space-y-6">
            <SpecTable rows={product.specs.dimension} />
            {(() => {
              const dims = getTouchWorkDimensionImages(product.model, variant.arch);
              if (dims.length === 0) return null;
              return (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-base">แบบทางเทคนิค (Mechanical Drawings)</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    คลิกที่ภาพเพื่อขยาย และดาวน์โหลดเป็นไฟล์อ้างอิงสำหรับงานติดตั้ง
                  </p>
                  <ImageLightbox
                    images={dims}
                    alt={`${productName} - แบบทางเทคนิค`}
                    downloadPrefix={`${product.model}-${variant.arch}-dimension`}
                  >
                    {(open) => (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {dims.map((src, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => open(i)}
                            className="relative group rounded-xl border border-border bg-card hover:border-primary/60 hover:shadow-lg transition-all overflow-hidden cursor-zoom-in"
                          >
                            <img
                              src={src}
                              alt={`${productName} dimension drawing ${i + 1}`}
                              className="w-full aspect-square object-contain bg-white p-4"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/95 to-transparent px-3 py-2 text-xs font-medium text-left">
                              {i === 0 ? "มุมมองด้านหน้า / Front View" : "มุมมองด้านหลัง / Rear & Mounting"}
                            </div>
                            <ZoomHintBadge />
                          </button>
                        ))}
                      </div>
                    )}
                  </ImageLightbox>
                </div>
              );
            })()}
          </TabsContent>
          <TabsContent value="environment" className="mt-6"><SpecTable rows={product.specs.environment} /></TabsContent>
          <TabsContent value="power" className="mt-6"><SpecTable rows={product.specs.power} /></TabsContent>

          {(product.specs.androidOptions || product.specs.windowsOptions) && (
            <TabsContent value="cpu" className="mt-6 space-y-8">
              {product.specs.androidOptions && (
                <CpuTable
                  title="ตัวเลือก Android (ARM)"
                  color="emerald"
                  options={product.specs.androidOptions}
                />
              )}
              {product.specs.windowsOptions && (
                <CpuTable
                  title="ตัวเลือก Windows (X86)"
                  color="violet"
                  options={product.specs.windowsOptions}
                />
              )}
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>ตัวเลือก CPU/OS เป็นค่ามาตรฐานจากผู้ผลิต — สามารถสั่งทำพิเศษได้ ติดต่อทีมขายเพื่อยืนยันสเปกที่ต้องการ</span>
              </p>
            </TabsContent>
          )}

          {/* I/O & Installation — รูปจากผู้ผลิต TouchWo (เป็น generic diagram ใช้ได้ทุกรุ่น) */}
          <TabsContent value="io" className="mt-6 space-y-8">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <h3 className="font-bold">พอร์ตเชื่อมต่อ (Interface I/O)</h3>
              </div>
              <div className="p-5 bg-gradient-to-br from-muted/20 to-background">
                <img
                  src={ioPortsImg}
                  alt={`${product.model} interface I/O ports diagram`}
                  className="w-full max-w-3xl mx-auto object-contain"
                  loading="lazy"
                />
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  * แผนผังพอร์ตอ้างอิงจากผู้ผลิต — รายละเอียดจริงตามรุ่นและ Architecture ที่เลือก ติดต่อทีมขายเพื่อยืนยันก่อนสั่งซื้อ
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Box className="h-4 w-4 text-primary" />
                <h3 className="font-bold">รูปแบบการติดตั้ง (Versatile Installation)</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                รองรับการติดตั้งหลากหลายรูปแบบเพื่อความยืดหยุ่นในการใช้งาน
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: installWallImg, label: "ติดผนัง (Wall Mount)", desc: "ใช้พื้นที่น้อย เหมาะกับ Kiosk และจุดบริการตนเอง" },
                  { img: installDeskImg, label: "ตั้งโต๊ะ (Desktop)", desc: "เคลื่อนย้ายสะดวก ใช้กับ POS, Reception" },
                  { img: installEmbedImg, label: "ฝัง (Embedded)", desc: "ฝังในตู้/แผงควบคุม HMI โรงงาน" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-muted/30 to-background p-4">
                      <img src={m.img} alt={m.label} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="p-3 border-t border-border/60">
                      <div className="text-sm font-semibold mb-1">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certification" className="mt-6">
            <div className="grid md:grid-cols-3 gap-3 mb-5">
              {[
                { label: "CE", desc: "European Conformity" },
                { label: "FCC", desc: "Class B (USA)" },
                { label: "RoHS 2.0", desc: "Hazardous Substances" },
              ].map((b) => (
                <div key={b.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">{b.label}</div>
                    <div className="text-xs text-muted-foreground">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <SpecTable rows={product.specs.certification} />
            <p className="mt-3 text-xs text-muted-foreground flex items-start gap-2">
              <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>ระยะเวลารับประกันมาตรฐาน 1 ปี (Carry-in) ขยายได้สูงสุด 3 ปี — ติดต่อทีมขายเพื่อรับใบเสนอราคาประกันเพิ่มเติม</span>
            </p>
          </TabsContent>

          <TabsContent value="delivery" className="mt-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> สิ่งที่อยู่ในกล่อง
              </h3>
              <ul className="space-y-2">
                {product.specs.delivery.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related — compact list (ลดความเด่น ไม่ให้แข่งกับสินค้าหลัก) */}
      {related.length > 0 && (
        <section className="container max-w-7xl mx-auto px-6 py-8 border-t border-border/40">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              รุ่นใกล้เคียงในซีรีส์
            </h2>
            <Link
              to="/touchwork"
              className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              ดูทั้งหมด <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {related.map((p) => {
              const cover = p.variants.find((v) => v.arch === "Monitor")?.image || p.variants[0]?.image;
              return (
                <Link
                  key={p.model}
                  to={`/touchwork/${p.model.toLowerCase()}`}
                  className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/50 p-2.5 hover:border-border hover:bg-card transition"
                >
                  <div className="w-14 h-14 rounded-md bg-muted/40 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={cover}
                      alt={p.model}
                      className="w-full h-full object-contain p-1.5"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold truncate">{p.model}</span>
                      <span className="text-[11px] text-muted-foreground">{p.size}″</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {p.resolution}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <FooterCompact />
    </div>
  );
}
