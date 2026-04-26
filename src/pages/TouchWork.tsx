import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Monitor, Cpu, Smartphone, Filter, ArrowRight, Tag,
  Maximize, ShieldCheck, Zap, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import PriceDisclaimer from "@/components/PriceDisclaimer";
import UseCasesSection from "@/components/touchwork/UseCasesSection";


import B2BMarketingShowcase from "@/components/B2BMarketingShowcase";
import {
  touchworkProducts,
  archOptions,
  type TouchWorkArch,
} from "@/data/touchwork-products";
import archMonitorImg from "@/assets/touchwork/arch-monitor.jpg";
import archArmImg from "@/assets/touchwork/arch-arm.jpg";
import archX86Img from "@/assets/touchwork/arch-x86.jpg";

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

const sizeBuckets = [
  { label: "8″ – 10″", min: 0, max: 10.4 },
  { label: "12″ – 15″", min: 10.5, max: 15.5 },
  { label: "15.6″ – 19″", min: 15.6, max: 19 },
  { label: "21.5″+", min: 19.1, max: 99 },
];

type SeriesKey = "DM" | "GD" | "JD";
const seriesMeta: Record<SeriesKey, { label: string; desc: string; color: string }> = {
  DM: {
    label: "DM Series",
    desc: "Mainstream — รุ่นมาตรฐานครบทุกขนาด 8″–21.5″",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  GD: {
    label: "GD Series",
    desc: "Slim & Wall-mount — ดีไซน์บาง ติดผนัง โรงแรม/ออฟฟิศ",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  JD: {
    label: "JD Series",
    desc: "Industrial Grade แบบ Entry — ราคาประหยัด เน้นใช้งาน POS / Signage",
    color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
};
const getSeries = (model: string): SeriesKey =>
  (model.startsWith("GD") ? "GD" : model.startsWith("JD") ? "JD" : "DM");

type PanelType = "IPS" | "TN";
const getPanelType = (model: string): PanelType =>
  (model.startsWith("GD") || model.startsWith("JD")) ? "IPS" : "TN";

const panelMeta: Record<PanelType, { label: string; desc: string; color: string }> = {
  IPS: {
    label: "IPS",
    desc: "มุมมองกว้าง 175°/178° — สีสวย เหมาะกับงาน Premium / Hospitality",
    color: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  },
  TN: {
    label: "TN (a-Si)",
    desc: "มุมมอง 85° — ตอบสนองไว ทนทาน เหมาะกับ HMI / Industrial",
    color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
  },
};

export default function TouchWork() {
  const [selectedSeries, setSelectedSeries] = useState<SeriesKey[]>([]);
  const [selectedArchs, setSelectedArchs] = useState<TouchWorkArch[]>([]);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [selectedPanels, setSelectedPanels] = useState<PanelType[]>([]);

  const toggleSeries = (s: SeriesKey) =>
    setSelectedSeries((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  const toggleArch = (a: TouchWorkArch) =>
    setSelectedArchs((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  const toggleBucket = (b: string) =>
    setSelectedBuckets((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));
  const togglePanel = (pt: PanelType) =>
    setSelectedPanels((p) => (p.includes(pt) ? p.filter((x) => x !== pt) : [...p, pt]));

  // Counts per series for chip badges
  const seriesCounts = useMemo(() => {
    const c: Record<SeriesKey, number> = { DM: 0, GD: 0, JD: 0 };
    touchworkProducts.forEach((p) => { c[getSeries(p.model)]++; });
    return c;
  }, []);

  const panelCounts = useMemo(() => {
    const c: Record<PanelType, number> = { IPS: 0, TN: 0 };
    touchworkProducts.forEach((p) => { c[getPanelType(p.model)]++; });
    return c;
  }, []);

  const filtered = useMemo(() => {
    return touchworkProducts.filter((p) => {
      if (selectedSeries.length > 0 && !selectedSeries.includes(getSeries(p.model))) return false;
      if (selectedPanels.length > 0 && !selectedPanels.includes(getPanelType(p.model))) return false;
      if (selectedArchs.length > 0) {
        const archs = p.variants.map((v) => v.arch);
        if (!selectedArchs.every((a) => archs.includes(a))) return false;
      }
      if (selectedBuckets.length > 0) {
        const inBucket = sizeBuckets
          .filter((b) => selectedBuckets.includes(b.label))
          .some((b) => p.size >= b.min && p.size <= b.max);
        if (!inBucket) return false;
      }
      return true;
    });
  }, [selectedSeries, selectedArchs, selectedBuckets, selectedPanels]);

  // Group filtered products by series for the grid
  const groupedFiltered = useMemo(() => {
    const groups: Record<SeriesKey, typeof filtered> = { DM: [], GD: [], JD: [] };
    filtered.forEach((p) => groups[getSeries(p.model)].push(p));
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TouchWork Series — จอสัมผัสอุตสาหกรรม Indoor Display 8″–21.5″"
        description="TouchWork Series จอสัมผัส Indoor Display 12 รุ่นหลัก ขนาด 8″–21.5″ พร้อมตัวเลือก Monitor / Android (ARM) / Windows (X86) ราคาประหยัด เหมาะกับ Kiosk, POS, HMI"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "หน้าแรก", path: "/" },
          { name: "TouchWork Series", path: "/touchwork" },
        ]}
      />

      <MiniNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container max-w-7xl mx-auto px-6 py-12 md:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> กลับหน้าแรก
          </Link>

          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-3">
              Indoor Touch Display • Partner Series
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              TouchWork Series
              <span className="block text-primary mt-1">
                จอสัมผัสอุตสาหกรรม คุ้มค่า ครบทุกขนาด
              </span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-6">
              จอสัมผัส Indoor 12 รุ่นหลัก ขนาด <strong>8″ ถึง 21.5″</strong> เลือกได้ทั้งแบบ
              Monitor (เชื่อมต่อ PC), ARM (Android พร้อมใช้) และ X86 (Windows) — เหมาะสำหรับ
              Kiosk, POS, Self-Order, Digital Signage และระบบ HMI ในโรงงาน
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-3">
                <div className="text-2xl font-bold text-primary">16</div>
                <div className="text-xs text-muted-foreground">รุ่นหลัก</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-3">
                <div className="text-2xl font-bold text-primary">46</div>
                <div className="text-xs text-muted-foreground">SKU ทั้งหมด</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-3">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Architecture</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-3">
                <div className="text-2xl font-bold text-primary">IP65</div>
                <div className="text-xs text-muted-foreground">หน้าจอกันฝุ่น/น้ำ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture explainer */}
      <section className="container max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            เลือก Architecture ที่เหมาะกับงานของคุณ
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            TouchWork ทุกรุ่นเลือกได้ 3 แบบสถาปัตยกรรม — แต่ละแบบเหมาะกับการใช้งานต่างกัน
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(["Monitor", "ARM", "X86"] as TouchWorkArch[]).map((a) => {
            const Icon = archIcon[a];
            const meta = {
              Monitor: {
                title: "Monitor",
                sub: "จอสัมผัสล้วน",
                desc: "ต่อกับ PC/Mini PC ผ่าน HDMI/VGA — ใช้เป็นหน้าจอแสดงผลพร้อมระบบสัมผัส",
                use: "เหมาะกับ: ระบบที่มี PC อยู่แล้ว, จอเสริม, หน้าจอควบคุม",
                image: archMonitorImg,
                glow: "from-sky-500/20 via-sky-400/5 to-transparent",
                ring: "group-hover:ring-sky-500/40",
              },
              ARM: {
                title: "ARM (Android)",
                sub: "Touch PC พร้อมใช้",
                desc: "มาพร้อม Android 11/13 ในตัว ประหยัดไฟ ใช้แอป Kiosk และ Self-Order ได้ทันที",
                use: "เหมาะกับ: Self-Order, Queue, Digital Menu, ตู้ถ่ายรูป",
                image: archArmImg,
                glow: "from-emerald-500/20 via-emerald-400/5 to-transparent",
                ring: "group-hover:ring-emerald-500/40",
              },
              X86: {
                title: "X86 (Windows)",
                sub: "Touch PC ระดับ Workstation",
                desc: "Intel CPU รองรับ Windows 10/11 — ใช้กับโปรแกรมสำเร็จรูป POS, ERP, MES ได้",
                use: "เหมาะกับ: POS ร้านอาหาร, ERP, MES โรงงาน, ระบบจัดการคลัง",
                image: archX86Img,
                glow: "from-violet-500/20 via-violet-400/5 to-transparent",
                ring: "group-hover:ring-violet-500/40",
              },
            }[a];
            return (
              <div
                key={a}
                className={`group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ring-1 ring-transparent ${meta.ring} transition-all duration-300`}
              >
                {/* Hero image with overlay */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={meta.image}
                    alt={meta.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark gradient at bottom for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  {/* Color glow accent */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${meta.glow} mix-blend-screen pointer-events-none`} />
                  {/* Floating badge on image */}
                  <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md backdrop-blur-md text-xs font-semibold border ${archColor[a]} shadow-lg`}>
                      <Icon className="h-3.5 w-3.5" />
                      {meta.title}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="relative p-5 -mt-2">
                  <div className="text-lg font-bold mb-1.5 tracking-tight">{meta.sub}</div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{meta.desc}</p>
                  <div className="text-xs text-foreground/80 border-t border-border/60 pt-3 leading-relaxed">
                    <span className="font-semibold text-foreground">✓ </span>
                    {meta.use}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Real-world Use Cases — แรงบันดาลใจก่อนเลือกสเปก */}
      <UseCasesSection />

      {/* Filter Bar */}
      <section className="border-y border-border/40 bg-muted/30 sticky top-0 z-30 backdrop-blur">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" /> ตัวกรอง:
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center mr-1">ตระกูล:</span>
              {(["DM", "GD", "JD"] as SeriesKey[]).map((s) => {
                const active = selectedSeries.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSeries(s)}
                    title={seriesMeta[s].desc}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : `${seriesMeta[s].color} hover:opacity-80`
                    }`}
                  >
                    {s}
                    <span className={`text-[10px] px-1 rounded ${active ? "bg-primary-foreground/20" : "bg-foreground/10"}`}>
                      {seriesCounts[s]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center mr-1">ระบบ:</span>
              {archOptions.map((a) => {
                const active = selectedArchs.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleArch(a)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center mr-1">Panel:</span>
              {(["IPS", "TN"] as PanelType[]).map((pt) => {
                const active = selectedPanels.includes(pt);
                return (
                  <button
                    key={pt}
                    onClick={() => togglePanel(pt)}
                    title={panelMeta[pt].desc}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : `${panelMeta[pt].color} hover:opacity-80`
                    }`}
                  >
                    {panelMeta[pt].label}
                    <span className={`text-[10px] px-1 rounded ${active ? "bg-primary-foreground/20" : "bg-foreground/10"}`}>
                      {panelCounts[pt]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-muted-foreground self-center mr-1">ขนาด:</span>
              {sizeBuckets.map((b) => {
                const active = selectedBuckets.includes(b.label);
                return (
                  <button
                    key={b.label}
                    onClick={() => toggleBucket(b.label)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>

            {(selectedSeries.length > 0 || selectedArchs.length > 0 || selectedBuckets.length > 0 || selectedPanels.length > 0) && (
              <button
                onClick={() => {
                  setSelectedSeries([]);
                  setSelectedArchs([]);
                  setSelectedBuckets([]);
                  setSelectedPanels([]);
                }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
              >
                ล้างตัวกรอง
              </button>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              พบ <strong className="text-foreground">{filtered.length}</strong> รุ่น
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            ไม่พบรุ่นที่ตรงกับเงื่อนไข — ลองปรับตัวกรอง
          </div>
        ) : (
          <div className="space-y-12">
            {(["DM", "GD", "JD"] as SeriesKey[]).map((s) => {
              const items = groupedFiltered[s];
              if (items.length === 0) return null;
              return (
                <div key={s}>
                  {/* Series header */}
                  <div className="flex items-end justify-between mb-4 pb-3 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${seriesMeta[s].color}`}>
                        {s}
                      </span>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold tracking-tight">{seriesMeta[s].label}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{seriesMeta[s].desc}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {items.length} รุ่น
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((p) => {
                      const cover =
                        p.variants.find((v) => v.arch === "Monitor")?.image ||
                        p.variants[0]?.image;
                      return (
                        <Link
                          key={p.model}
                          to={`/touchwork/${p.model.toLowerCase()}`}
                          className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/40 to-muted overflow-hidden">
                            <img
                              src={cover}
                              alt={`TouchWork ${p.model} ${p.size}″`}
                              loading="lazy"
                              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                              {p.variants.map((v) => {
                                const Icon = archIcon[v.arch];
                                return (
                                  <span
                                    key={v.arch}
                                    className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium border ${archColor[v.arch]}`}
                                  >
                                    <Icon className="h-2 w-2" />
                                    {v.arch}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-foreground/90 text-background text-[11px] font-bold">
                                <Maximize className="h-2.5 w-2.5" />
                                {p.size}″
                              </span>
                              {(() => {
                                const pt = getPanelType(p.model);
                                return (
                                  <span
                                    title={panelMeta[pt].desc}
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur ${panelMeta[pt].color}`}
                                  >
                                    {panelMeta[pt].label}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">
                                {p.model}
                              </h3>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">
                                {p.ratio}
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground mb-2.5 space-y-0.5">
                              <div>• {p.resolution}</div>
                              <div>• {p.touch}</div>
                              <div>• {p.brightness}</div>
                            </div>
                            {(() => {
                              const prices = p.variants.map((v) => v.priceTHB).filter((x): x is number => !!x);
                              const minPrice = prices.length ? Math.min(...prices) : null;
                              return minPrice ? (
                                <div className="mb-2 -mt-1">
                                  <span className="text-[10px] text-muted-foreground">เริ่มต้น </span>
                                  <span className="text-sm font-bold text-primary">฿{minPrice.toLocaleString("en-US")}</span>
                                </div>
                              ) : null;
                            })()}
                            <div className="flex items-center justify-between border-t border-border/50 pt-2">
                              <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                                <Tag className="h-2.5 w-2.5" />
                                {p.variants.length} ตัวเลือก
                              </span>
                              <span className="text-xs font-medium text-primary inline-flex items-center gap-0.5 group-hover:gap-1 transition-all">
                                ดูเพิ่ม <ArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <PriceDisclaimer />
        </div>
      </section>

      {/* Why TouchWork */}
      <section className="container max-w-7xl mx-auto px-6 py-10 border-t border-border/40">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Tag,
              title: "ราคาประหยัด คุ้มค่า",
              desc: "เหมาะกับลูกค้างบจำกัด เน้นใช้งาน Indoor ทั่วไป — ราคาถูกกว่ารุ่น Premium 30-50%",
            },
            {
              icon: ShieldCheck,
              title: "ทนทาน Industrial Grade แบบ Entry",
              desc: "หน้าจอ IP65 กันฝุ่นและน้ำกระเซ็น โครงโลหะ ทนต่อการใช้งานต่อเนื่อง 24/7",
            },
            {
              icon: Zap,
              title: "พร้อมใช้งานทันที",
              desc: "เลือกได้ทั้ง Monitor, Android และ Windows — สั่งครั้งเดียว ใช้งานได้ทันที ไม่ต้องประกอบเอง",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-3">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* B2B Marketing Showcase — สื่อสารคุณค่าก่อนปิดการขาย */}
      <B2BMarketingShowcase variant="muted" />

      {/* CTA — ปิดท้ายด้วย Call-to-Action เฉพาะ TouchWork */}
      <section className="container max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            ต้องการคำแนะนำเลือกรุ่นที่เหมาะกับคุณ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            ทีมขายของเราพร้อมให้คำปรึกษา เลือกขนาดและระบบที่เหมาะกับการใช้งานของคุณ
            พร้อมเสนอราคาขายส่งสำหรับ Project ขนาดใหญ่
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/contact-us">ติดต่อทีมขาย</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/quote-request">ขอใบเสนอราคา</Link>
            </Button>
          </div>
          <div className="mt-5 inline-flex items-start gap-2 text-xs text-muted-foreground max-w-xl mx-auto">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>
              TouchWork เป็นผลิตภัณฑ์จาก Partner ของเรา — รับประกันคุณภาพและบริการหลังการขายโดย ENT Group
            </span>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
}
