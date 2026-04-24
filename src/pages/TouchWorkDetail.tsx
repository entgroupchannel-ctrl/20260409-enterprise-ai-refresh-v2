import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  ArrowLeft, Monitor, Cpu, Smartphone, ArrowRight, Maximize,
  ShieldCheck, CheckCircle2, Layers, Sun, Box, Tag, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

      {/* Breadcrumb back link */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          to="/touchwork"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้า TouchWork Series
        </Link>
      </div>

      {/* Hero — image + info */}
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-muted/30 via-background to-muted/20 border border-border overflow-hidden">
              <img
                src={variant.image}
                alt={productName}
                className="w-full h-full object-contain p-8 transition-all duration-300"
              />
            </div>
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/90 text-background text-sm font-bold">
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
            </div>

            <div className="mt-4">
              <PriceDisclaimer />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Mounting */}
      <section className="container mx-auto px-4 py-8 border-t border-border/40">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              จุดเด่น
            </h2>
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
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              รูปแบบการติดตั้ง
            </h2>
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
      </section>

      {/* All variants gallery */}
      <section className="container mx-auto px-4 py-8 border-t border-border/40">
        <h2 className="text-xl font-bold mb-4">ทุกตัวเลือกของ {product.model}</h2>
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
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 py-10 border-t border-border/40">
          <h2 className="text-xl font-bold mb-4">รุ่นใกล้เคียง</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((p) => {
              const cover = p.variants.find((v) => v.arch === "Monitor")?.image || p.variants[0]?.image;
              return (
                <Link
                  key={p.model}
                  to={`/touchwork/${p.model.toLowerCase()}`}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-muted/30">
                    <img src={cover} alt={p.model} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold">{p.model}</div>
                      <span className="text-xs text-muted-foreground">{p.size}″</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{p.resolution} • {p.touch}</div>
                  </div>
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
