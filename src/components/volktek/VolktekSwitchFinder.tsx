import { useMemo, useState } from "react";
import {
  Building2,
  Factory,
  Sun,
  Anchor,
  Thermometer,
  Snowflake,
  Plug,
  Zap,
  Layers,
  Cable,
  Settings2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Search,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import VolktekProductDialog from "@/components/volktek/VolktekProductDialog";
import {
  volktekCatalog,
  type VolktekProduct,
  type VolktekSubCategory,
} from "@/data/volktek-products";

/**
 * Volktek Switch Finder — wizard ช่วยลูกค้าเลือกสวิตช์ที่เหมาะสม
 * 4 ขั้นตอน: สภาพแวดล้อม → อุณหภูมิ → จำนวนพอร์ต+PoE → ฟีเจอร์พิเศษ
 *
 * ใช้ scoring แบบ soft match: ทุกตัวเลือกได้คะแนน ไม่ตัดทิ้งทันที
 * (ถ้าไม่มีรุ่นตรง 100% จะแสดงรุ่นที่ใกล้เคียงที่สุด)
 */

type Choice<T extends string> = {
  id: T;
  label: string;
  desc: string;
  icon: LucideIcon;
};

type EnvType = "office" | "factory" | "outdoor" | "marine" | "any";
type TempType = "standard" | "industrial" | "any";
type PortType = "p4_5" | "p8" | "p16" | "p24plus" | "any";
type PoeType = "yes" | "no" | "any";
type FeatureType = "l3" | "fiber" | "managed" | "highpower" | "compact" | "any";

const ENV_CHOICES: Choice<EnvType>[] = [
  { id: "office", label: "สำนักงาน / IT Room", desc: "ติดตั้งในห้องคอม อุณหภูมิควบคุม", icon: Building2 },
  { id: "factory", label: "โรงงาน / DIN-Rail", desc: "ฝุ่น สั่นสะเทือน อุณหภูมิสูง ติด DIN-rail ในตู้คอนโทรล", icon: Factory },
  { id: "outdoor", label: "Outdoor / Smart City", desc: "กลางแจ้ง ตู้ outdoor cabinet IP30+ ทนสภาพอากาศ", icon: Sun },
  { id: "marine", label: "ทางทะเล / รถไฟ", desc: "งาน Marine, Railway ที่ต้องการ DNV/LR/EN50155", icon: Anchor },
];

const TEMP_CHOICES: Choice<TempType>[] = [
  { id: "standard", label: "อุณหภูมิปกติ", desc: "0°C ~ 50°C — ใช้ในที่ร่มมีแอร์", icon: Thermometer },
  { id: "industrial", label: "อุณหภูมิสุดขั้ว", desc: "-40°C ~ 75°C — โรงงาน outdoor หรือพื้นที่ไม่มีแอร์", icon: Snowflake },
  { id: "any", label: "ไม่จำกัด", desc: "ไม่ใช่เงื่อนไขสำคัญ", icon: Sparkles },
];

const PORT_CHOICES: Choice<PortType>[] = [
  { id: "p4_5", label: "4-5 พอร์ต", desc: "Edge devices, จุดเชื่อมต่อเล็ก", icon: Plug },
  { id: "p8", label: "6-10 พอร์ต", desc: "ตู้คอนโทรลขนาดกลาง", icon: Plug },
  { id: "p16", label: "12-20 พอร์ต", desc: "Rack switch ขนาดกลาง", icon: Plug },
  { id: "p24plus", label: "24+ พอร์ต", desc: "Aggregation, Core switch", icon: Plug },
];

const POE_CHOICES: Choice<PoeType>[] = [
  { id: "yes", label: "ต้องการ PoE", desc: "จ่ายไฟผ่านสาย LAN ให้กล้อง IP, AP, IoT", icon: Zap },
  { id: "no", label: "ไม่ต้องการ", desc: "Switch ธรรมดา ไม่จ่ายไฟ", icon: Plug },
  { id: "any", label: "ไม่จำกัด", desc: "เลือกอะไรก็ได้", icon: Sparkles },
];

const FEATURE_CHOICES: Choice<FeatureType>[] = [
  { id: "l3", label: "Layer 3 Routing", desc: "ทำ inter-VLAN routing, static/dynamic routing", icon: Layers },
  { id: "fiber", label: "Fiber / SFP", desc: "เชื่อมไฟเบอร์ระยะไกล ผ่าน SFP slot", icon: Cable },
  { id: "managed", label: "Managed", desc: "Web UI, VLAN, QoS, SNMP, RSTP", icon: Settings2 },
  { id: "highpower", label: "High-Power PoE (60W+)", desc: "PoE++ / btPoE สำหรับ PTZ camera, AP Wi-Fi 6/7", icon: Zap },
  { id: "compact", label: "Compact / 5-port", desc: "ขนาดเล็ก เหมาะกับพื้นที่จำกัด", icon: Plug },
  { id: "any", label: "ไม่จำกัด", desc: "ดูทุกฟีเจอร์", icon: Sparkles },
];

type Answers = {
  env: EnvType;
  temp: TempType;
  port: PortType;
  poe: PoeType;
  feature: FeatureType;
};

type FlatProduct = {
  product: VolktekProduct;
  sub: VolktekSubCategory;
  catTitle: string;
  searchText: string;
};

/* ---------- Flatten catalog ---------- */
function flattenCatalog(): FlatProduct[] {
  const out: FlatProduct[] = [];
  for (const cat of volktekCatalog) {
    for (const sub of cat.subCategories) {
      for (const product of sub.products) {
        const featStr = product.features.join(" ").toLowerCase();
        const envHousing = product.details?.environment?.housing?.toLowerCase() ?? "";
        const envTemp = product.details?.environment?.tempOperating?.toLowerCase() ?? "";
        const portStr = product.details?.ports?.join(" ").toLowerCase() ?? "";
        const searchText = [
          product.model,
          product.description,
          featStr,
          envHousing,
          envTemp,
          portStr,
          cat.title,
          sub.title,
        ]
          .join(" ")
          .toLowerCase();

        out.push({ product, sub, catTitle: cat.title, searchText });
      }
    }
  }
  return out;
}

/* ---------- Helpers ---------- */
function extractPortCount(text: string): number {
  // จับ "8 x", "24-port", "12 ports", "5-port" ฯลฯ
  const matches = Array.from(text.matchAll(/(\d+)\s*[-x]?\s*port|(\d+)\s*x\s*\d/gi));
  let max = 0;
  for (const m of matches) {
    const n = parseInt(m[1] ?? m[2] ?? "0", 10);
    if (n > max && n < 100) max = n;
  }
  return max;
}

function tempLow(text: string): number {
  // หาค่า low temp เช่น "-40°C ~ 75°C" → -40
  const m = text.match(/(-?\d+)\s*°?c\s*[~–-]/i);
  return m ? parseInt(m[1], 10) : 0;
}

/* ---------- Scoring ---------- */
function scoreProduct(fp: FlatProduct, a: Answers): number {
  let score = 0;
  const t = fp.searchText;
  const features = fp.product.features.map((f) => f.toLowerCase());
  const housing = fp.product.details?.environment?.housing?.toLowerCase() ?? "";
  const temp = fp.product.details?.environment?.tempOperating ?? "";
  const portsText = fp.product.details?.ports?.join(" ") ?? fp.product.description;
  const portCount = extractPortCount(portsText);
  const lowTemp = tempLow(temp);

  // Environment
  if (a.env !== "any") {
    if (a.env === "office") {
      if (lowTemp >= 0 || housing.includes("metal") === false) score += 2;
      if (fp.catTitle.toLowerCase().includes("metro")) score += 2;
      if (housing.includes("ip30") || housing.includes("ip40")) score -= 1;
    }
    if (a.env === "factory") {
      if (housing.includes("ip30") || housing.includes("ip40") || housing.includes("din")) score += 4;
      if (fp.catTitle.toLowerCase().includes("industrial")) score += 3;
      if (lowTemp <= -20) score += 1;
    }
    if (a.env === "outdoor") {
      if (housing.includes("ip30") || housing.includes("ip40")) score += 4;
      if (lowTemp <= -30) score += 2;
      if (housing.includes("metal")) score += 1;
    }
    if (a.env === "marine") {
      if (t.includes("dnv") || t.includes("lr") || t.includes("en50155") || t.includes("marine") || t.includes("railway")) score += 5;
      if (fp.catTitle.toLowerCase().includes("industrial")) score += 1;
    }
  }

  // Temperature
  if (a.temp === "industrial" && lowTemp <= -20) score += 3;
  if (a.temp === "industrial" && lowTemp > -20) score -= 2;
  if (a.temp === "standard" && lowTemp >= 0) score += 2;
  if (a.temp === "standard" && lowTemp < -20) score -= 1;

  // Port count
  if (a.port !== "any" && portCount > 0) {
    const ranges: Record<Exclude<PortType, "any">, [number, number]> = {
      p4_5: [4, 5],
      p8: [6, 10],
      p16: [12, 20],
      p24plus: [24, 99],
    };
    const [min, max] = ranges[a.port];
    if (portCount >= min && portCount <= max) score += 4;
    else if (Math.abs(portCount - (min + max) / 2) <= 4) score += 1;
  }

  // PoE
  const hasPoe = features.some((f) => f.includes("poe")) || t.includes("poe");
  if (a.poe === "yes" && hasPoe) score += 3;
  if (a.poe === "yes" && !hasPoe) score -= 5;
  if (a.poe === "no" && !hasPoe) score += 2;
  if (a.poe === "no" && hasPoe) score -= 2;

  // Feature
  if (a.feature === "l3" && (features.some((f) => f === "l3" || f.includes("layer 3")) || t.includes(" l3 "))) score += 4;
  if (a.feature === "fiber" && (t.includes("sfp") || t.includes("fiber") || features.some((f) => f.includes("sfp") || f.includes("fiber")))) score += 3;
  if (a.feature === "managed" && (features.some((f) => f.includes("managed")) || t.includes("managed"))) score += 3;
  if (a.feature === "highpower" && (t.includes("btpoe") || t.includes("90w") || t.includes("60w") || t.includes("poe++"))) score += 4;
  if (a.feature === "compact" && portCount > 0 && portCount <= 5) score += 3;

  return score;
}

/* ---------- Step UI ---------- */
type StepKey = "env" | "temp" | "port" | "poe" | "feature";
const STEPS: { key: StepKey; title: string; question: string; choices: Choice<string>[] }[] = [
  { key: "env", title: "สภาพแวดล้อม", question: "สวิตช์จะติดตั้งที่ไหน?", choices: ENV_CHOICES as Choice<string>[] },
  { key: "temp", title: "อุณหภูมิ", question: "ต้องทนอุณหภูมิแค่ไหน?", choices: TEMP_CHOICES as Choice<string>[] },
  { key: "port", title: "จำนวนพอร์ต", question: "ต้องการกี่พอร์ต?", choices: PORT_CHOICES as Choice<string>[] },
  { key: "poe", title: "PoE", question: "ต้องการจ่ายไฟผ่านสาย LAN (PoE) ไหม?", choices: POE_CHOICES as Choice<string>[] },
  { key: "feature", title: "ฟีเจอร์พิเศษ", question: "มีฟีเจอร์อะไรที่ต้องการเป็นพิเศษ?", choices: FEATURE_CHOICES as Choice<string>[] },
];

const VolktekSwitchFinder = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<{
    product: VolktekProduct;
    sub: VolktekSubCategory;
    catTitle: string;
  } | null>(null);

  const allProducts = useMemo(flattenCatalog, []);

  const ranked = useMemo(() => {
    if (!showResults) return [];
    const a: Answers = {
      env: (answers.env as EnvType) ?? "any",
      temp: (answers.temp as TempType) ?? "any",
      port: (answers.port as PortType) ?? "any",
      poe: (answers.poe as PoeType) ?? "any",
      feature: (answers.feature as FeatureType) ?? "any",
    };
    return allProducts
      .map((fp) => ({ fp, score: scoreProduct(fp, a) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 12);
  }, [allProducts, answers, showResults]);

  const currentStep = STEPS[stepIdx];
  const currentValue = answers[currentStep.key];
  const isLastStep = stepIdx === STEPS.length - 1;

  const handleSelect = (id: string) => {
    setAnswers({ ...answers, [currentStep.key]: id });
  };

  const handleNext = () => {
    if (isLastStep) setShowResults(true);
    else setStepIdx(stepIdx + 1);
  };

  const handleBack = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setStepIdx(0);
    setShowResults(false);
  };

  /* ---------- Render Results ---------- */
  if (showResults) {
    const topScore = ranked[0]?.score ?? 0;
    const hasMatch = topScore > 0;

    return (
      <section id="finder" className="scroll-mt-24">
        <div className="card-surface p-5 md:p-7">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5 pb-5 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight">
                  รุ่นที่แนะนำสำหรับคุณ
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  {hasMatch
                    ? `จัดอันดับ ${ranked.length} รุ่นที่ตรงกับความต้องการมากที่สุด`
                    : "ไม่พบรุ่นที่ตรงเงื่อนไขทั้งหมด แสดงรุ่นที่ใกล้เคียง"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> เริ่มใหม่
            </Button>
          </div>

          {/* Selected criteria summary */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {STEPS.map((s) => {
              const v = answers[s.key];
              if (!v) return null;
              const choice = s.choices.find((c) => c.id === v);
              if (!choice) return null;
              return (
                <span
                  key={s.key}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  <choice.icon className="w-3 h-3" /> {choice.label}
                </span>
              );
            })}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ranked.map(({ fp, score }, i) => (
              <div
                key={fp.product.model}
                className="rounded-xl border border-border bg-background/40 overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all group flex flex-col relative"
              >
                {i < 3 && score > 0 && (
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary text-primary-foreground shadow-sm">
                    Top {i + 1}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelected({ product: fp.product, sub: fp.sub, catTitle: fp.catTitle })}
                  className="text-left flex-1 flex flex-col cursor-pointer"
                  aria-label={`ดูรายละเอียด ${fp.product.model}`}
                >
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={fp.product.image}
                      alt={fp.product.model}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                    {fp.product.details && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-foreground/80 text-background shadow-sm">
                        <Eye className="w-2.5 h-2.5" /> Spec
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">
                      {fp.catTitle.replace("Volktek ", "")}
                    </div>
                    <div className="font-mono text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {fp.product.model}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed line-clamp-2">
                      {fp.product.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {fp.product.features.slice(0, 3).map((f) => (
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
                <div className="flex gap-1.5 px-3 pb-3 pt-2 border-t border-border">
                  <AddToCartButton
                    productModel={fp.product.model}
                    productName={`Volktek ${fp.product.model}`}
                    productDescription={fp.product.description}
                    size="sm"
                    variant="outline"
                    iconOnly
                  />
                  <QuoteRequestButton
                    productModel={fp.product.model}
                    productName={`Volktek ${fp.product.model}`}
                    size="sm"
                    variant="outline"
                    iconOnly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <VolktekProductDialog
          product={selected?.product ?? null}
          subCategory={selected?.sub ?? null}
          categoryTitle={selected?.catTitle ?? ""}
          onClose={() => setSelected(null)}
          onSelect={(p) => selected && setSelected({ ...selected, product: p })}
        />
      </section>
    );
  }

  /* ---------- Render Wizard ---------- */
  return (
    <section id="finder" className="scroll-mt-24">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          <Search className="w-3.5 h-3.5" /> Switch Finder
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          ค้นหาสวิตช์ <span className="text-gradient">Volktek ที่ใช่</span> ใน 5 ขั้นตอน
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          ตอบคำถามสั้นๆ เกี่ยวกับสภาพการใช้งาน — ระบบจะแนะนำรุ่นที่เหมาะที่สุดจาก 70+ รุ่นในแคตตาล็อก
        </p>
      </div>

      <div className="card-surface p-5 md:p-7">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">
              ขั้นตอนที่ {stepIdx + 1} / {STEPS.length}
              <span className="text-muted-foreground font-normal ml-1.5">— {currentStep.title}</span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round(((stepIdx + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex gap-1 mt-3 justify-center">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => answers[s.key] && setStepIdx(i)}
                disabled={!answers[s.key] && i !== stepIdx}
                aria-label={`ไปขั้นตอน ${s.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === stepIdx
                    ? "w-8 bg-primary"
                    : answers[s.key]
                    ? "w-3 bg-primary/50 hover:bg-primary/70 cursor-pointer"
                    : "w-3 bg-border cursor-not-allowed"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-4 text-center">
          {currentStep.question}
        </h3>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {currentStep.choices.map((c) => {
            const isSelected = currentValue === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c.id)}
                aria-pressed={isSelected}
                className={`group relative rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-background/40 hover:border-primary/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary border border-primary/30 group-hover:bg-primary/20"
                  }`}
                >
                  <c.icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-foreground mb-1 leading-tight">{c.label}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={handleBack} disabled={stepIdx === 0}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> ย้อนกลับ
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> เริ่มใหม่
            </Button>
            <Button size="sm" onClick={handleNext} disabled={!currentValue}>
              {isLastStep ? (
                <>
                  ดูรุ่นที่แนะนำ <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                </>
              ) : (
                <>
                  ถัดไป <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolktekSwitchFinder;
