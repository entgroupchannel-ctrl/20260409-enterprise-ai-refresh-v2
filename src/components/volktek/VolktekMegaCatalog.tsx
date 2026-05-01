import { useState } from "react";
import { ExternalLink, Layers, Network, Zap, Globe, Cable, Activity, Radio, Wifi, Shield, Cpu, ArrowRight, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VolktekProductDialog from "@/components/volktek/VolktekProductDialog";
import {
  volktekLayer3,
  volktekIndustrialPoe,
  volktekIndustrialEthernet,
  volktekMetroEthernet,
  volktekMediaConverter,
  volktekEmsNms,
  volktekSfp,
  type VolktekCategory,
  type VolktekProduct,
  type VolktekSubCategory,
} from "@/data/volktek-products";
import catLayer3 from "@/assets/volktek/cat-layer3.jpg";
import catIndustrialEthernet from "@/assets/volktek/cat-industrial-ethernet.jpg";
import catIndustrialPoe from "@/assets/volktek/cat-industrial-poe.jpg";
import catMetroEthernet from "@/assets/volktek/cat-metro-ethernet.jpg";
import catMediaConverter from "@/assets/volktek/cat-media-converter.jpg";
import catEmsNms from "@/assets/volktek/cat-ems-nms.png";
import catSfp from "@/assets/volktek/cat-sfp.jpg";
import catPoeInjector from "@/assets/volktek/cat-poe-injector.jpg";
import catFirewall from "@/assets/volktek/cat-firewall.jpg";
import catAccessories from "@/assets/volktek/cat-accessories.jpg";

type TabMeta = {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  desc: string;
  image: string;
  category?: VolktekCategory;
  externalHref: string;
};

const TABS: TabMeta[] = [
  {
    id: "layer3",
    title: "Layer 3 Industrial Switches",
    shortTitle: "Layer 3",
    icon: Layers,
    desc: "L3 Managed Switches รองรับ Routing, TSN สำหรับเครือข่ายอุตสาหกรรมขั้นสูง",
    image: catLayer3,
    category: volktekLayer3,
    externalHref: "https://www.volktek.com/product_en.php?id=663",
  },
  {
    id: "industrial-ethernet",
    title: "Industrial Ethernet Switches",
    shortTitle: "Industrial Ethernet",
    icon: Network,
    desc: "Unmanaged, Lite Managed, Managed และ DNV/LR Certified สำหรับงานทางทะเล",
    image: catIndustrialEthernet,
    category: volktekIndustrialEthernet,
    externalHref: "https://www.volktek.com/product_en.php?id=52",
  },
  {
    id: "industrial-poe",
    title: "Industrial PoE Switches",
    shortTitle: "Industrial PoE",
    icon: Zap,
    desc: "PoE+, PoE++, BT PoE — จ่ายไฟผ่านสาย LAN ให้กล้อง IP, AP, IoT",
    image: catIndustrialPoe,
    category: volktekIndustrialPoe,
    externalHref: "https://www.volktek.com/product_en.php?id=51",
  },
  {
    id: "metro-ethernet",
    title: "Metro Ethernet Switches",
    shortTitle: "Metro Ethernet",
    icon: Globe,
    desc: "1G / 10G Aggregation และ Access Switches สำหรับ Service Provider",
    image: catMetroEthernet,
    category: volktekMetroEthernet,
    externalHref: "https://www.volktek.com/product_en.php?id=50",
  },
  {
    id: "media-converter",
    title: "Media Converters",
    shortTitle: "Media Converter",
    icon: Cable,
    desc: "แปลง Copper ↔ Fiber, Serial ↔ Fiber, SPE Converters พร้อมรุ่น PoE+",
    image: catMediaConverter,
    category: volktekMediaConverter,
    externalHref: "https://www.volktek.com/product_en.php?id=56",
  },
  {
    id: "ems-nms",
    title: "EMS / NMS Software",
    shortTitle: "EMS / NMS",
    icon: Activity,
    desc: "LAMUNGAN และ INDY — แพลตฟอร์มจัดการอุปกรณ์เครือข่ายแบบรวมศูนย์",
    image: catEmsNms,
    category: volktekEmsNms,
    externalHref: "https://www.volktek.com/product_en.php?id=609",
  },
  {
    id: "sfp",
    title: "SFP Modules",
    shortTitle: "SFP Modules",
    icon: Radio,
    desc: "100BASE, Gigabit, 10G SFP+ ทั้ง Standard และ Bi-Di รองรับหลายระยะ",
    image: catSfp,
    category: volktekSfp,
    externalHref: "https://www.volktek.com/product_en.php?id=73",
  },
  {
    id: "poe-injector",
    title: "PoE Injectors / Splitters",
    shortTitle: "PoE Injectors",
    icon: Wifi,
    desc: "PoE Injector เพิ่มความสามารถจ่ายไฟ และ Splitter สำหรับอุปกรณ์ที่ไม่รองรับ PoE",
    image: catPoeInjector,
    externalHref: "https://www.volktek.com/product_en.php?id=108",
  },
  {
    id: "firewall",
    title: "Network Security Appliances",
    shortTitle: "Security",
    icon: Shield,
    desc: "Industrial Firewall — ปกป้องเครือข่าย OT/ICS จากภัยคุกคามไซเบอร์",
    image: catFirewall,
    externalHref: "https://www.volktek.com/product_en.php?id=672",
  },
  {
    id: "accessories",
    title: "Accessories",
    shortTitle: "Accessories",
    icon: Cpu,
    desc: "Industrial Power Supply DIN-Rail และอุปกรณ์เสริมสำหรับติดตั้ง",
    image: catAccessories,
    externalHref: "https://www.volktek.com/product_en.php?id=100",
  },
];

const totalModels = (cat?: VolktekCategory) =>
  cat ? cat.subCategories.reduce((n, s) => n + s.products.length, 0) : 0;

const VolktekMegaCatalog = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [activeSub, setActiveSub] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<{
    product: VolktekProduct;
    sub: VolktekSubCategory;
    catTitle: string;
  } | null>(null);

  const openProduct = (product: VolktekProduct, sub: VolktekSubCategory, catTitle: string) =>
    setSelected({ product, sub, catTitle });

  return (
    <section id="catalog" className="scroll-mt-24">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
          Product Catalog
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          เลือกหมวด <span className="text-gradient">Volktek</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          10 หมวดผลิตภัณฑ์ครอบคลุมทุกความต้องการของเครือข่ายอุตสาหกรรม
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab strip — scrollable, icons + counts */}
        <TabsList className="h-auto flex-wrap gap-1.5 bg-secondary/40 p-1.5 mb-6 justify-start w-full">
          {TABS.map((t) => {
            const count = totalModels(t.category);
            return (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <t.icon className="w-3.5 h-3.5" />
                <span>{t.shortTitle}</span>
                {count > 0 && (
                  <span className="text-[10px] opacity-70 font-mono">({count})</span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((t) => {
          const cat = t.category;
          const subActive = activeSub[t.id] ?? cat?.subCategories[0]?.id;

          return (
            <TabsContent key={t.id} value={t.id} className="mt-0">
              <div className="card-surface p-5 md:p-7">
                {/* Category header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-5 border-b border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <t.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
                        {t.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="shrink-0 self-start md:self-auto">
                    <a href={t.externalHref} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      ดูที่ volktek.com
                    </a>
                  </Button>
                </div>

                {/* Body */}
                {cat ? (
                  <div>
                    {/* Sub-category tabs */}
                    {cat.subCategories.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSub({ ...activeSub, [t.id]: sub.id })}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                              subActive === sub.id
                                ? "bg-primary/10 border-primary/40 text-primary"
                                : "bg-secondary/40 border-border text-foreground/70 hover:border-primary/30"
                            }`}
                          >
                            {sub.title}
                            <span className="ml-1.5 text-[10px] opacity-70 font-mono">
                              ({sub.products.length})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {cat.subCategories.map((sub) =>
                      sub.id === subActive ? (
                        <div key={sub.id}>
                          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                            {sub.blurb}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {sub.products.map((p) => (
                              <div
                                key={p.model}
                                className="rounded-xl border border-border bg-background/40 overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all group flex flex-col"
                              >
                                <button
                                  type="button"
                                  onClick={() => openProduct(p, sub, t.title)}
                                  className="text-left flex-1 flex flex-col cursor-pointer"
                                  aria-label={`ดูรายละเอียด ${p.model}`}
                                >
                                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden relative">
                                    <img
                                      src={p.image}
                                      alt={p.model}
                                      loading="lazy"
                                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {p.details && (
                                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground shadow-sm">
                                        <Eye className="w-2.5 h-2.5" /> Detail
                                      </span>
                                    )}
                                  </div>
                                  <div className="p-4 flex-1 flex flex-col">
                                    <div className="font-mono text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                                      {p.model}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                                      {p.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                                      {p.features.map((f) => (
                                        <span
                                          key={f}
                                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
                                        >
                                          {f}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </button>

                                <div className="flex gap-1.5 px-4 pb-4 pt-3 border-t border-border">
                                  <AddToCartButton
                                    productModel={p.model}
                                    productName={`Volktek ${p.model}`}
                                    productDescription={p.description}
                                    size="sm"
                                    variant="outline"
                                    iconOnly
                                  />
                                  <QuoteRequestButton
                                    productModel={p.model}
                                    productName={`Volktek ${p.model}`}
                                    size="sm"
                                    variant="outline"
                                    iconOnly
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openProduct(p, sub, t.title)}
                                    className="ml-auto text-xs h-8"
                                  >
                                    ดูรายละเอียด <ArrowRight className="w-3 h-3 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  // Coming soon placeholder
                  <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-background/30">
                    <t.icon className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                    <h4 className="text-base font-semibold text-foreground mb-1.5">
                      รายละเอียดรุ่นกำลังจะมา
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4 leading-relaxed">
                      ทีมงานกำลังเตรียมข้อมูลรุ่นในหมวดนี้ ระหว่างนี้สามารถดูรายการรุ่นทั้งหมดได้จากเว็บโรงงาน
                      หรือสอบถามราคาทีมเราได้ทันที
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={t.externalHref} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          ดูที่ volktek.com
                        </a>
                      </Button>
                      <QuoteRequestButton
                        productModel={t.title}
                        productName={`Volktek ${t.title}`}
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Product Detail Dialog */}
      <VolktekProductDialog
        product={selected?.product ?? null}
        subCategory={selected?.sub ?? null}
        categoryTitle={selected?.catTitle ?? ""}
        onClose={() => setSelected(null)}
        onSelect={(p) =>
          selected && setSelected({ ...selected, product: p })
        }
      />
    </section>
  );
};

export default VolktekMegaCatalog;
