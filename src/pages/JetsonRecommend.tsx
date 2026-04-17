import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Eye, Mic, Bot, Video, Brain, Wrench,
  ChevronRight, ChevronLeft, RotateCcw, ArrowRight, Cpu, Zap,
  CheckCircle2, Target, Wallet, Gauge, Factory, Shield, Car,
  Stethoscope, Plane, Building2, Package,
} from "lucide-react";

const NV = "#76B900";

/* ───────── Question Schema ───────── */
type Workload = "vision" | "speech" | "robotics" | "video" | "genai" | "edge-ipc";
type Industry = "manufacturing" | "surveillance" | "robotics" | "medical" | "smartcity" | "retail" | "general";
type Budget = "entry" | "mid" | "high" | "flagship";
type Form = "module" | "devkit" | "ipc" | "any";

interface Answers {
  workload?: Workload;
  industry?: Industry;
  perfTops?: number; // target TOPS bracket: 40 / 100 / 275 / 1000
  budget?: Budget;
  form?: Form;
}

/* ───────── Recommendation Catalog ───────── */
interface JetsonModel {
  id: string;
  name: string;
  series: "Orin Nano" | "Orin NX" | "AGX Orin" | "Thor";
  tops: number;
  ramGb: number;
  priceTHB: string;
  bestFor: Workload[];
  industries: Industry[];
  highlight: string;
  formFactor: ("module" | "devkit" | "ipc")[];
  href: string;
  badge?: string;
}

const MODELS: JetsonModel[] = [
  {
    id: "orin-nano-4gb",
    name: "Jetson Orin Nano 4GB",
    series: "Orin Nano",
    tops: 20,
    ramGb: 4,
    priceTHB: "เริ่ม 9,900",
    bestFor: ["vision", "edge-ipc"],
    industries: ["retail", "smartcity", "general"],
    highlight: "Entry-level Edge AI — เหมาะกล้องวิเคราะห์ 1-2 channel, IoT Gateway AI",
    formFactor: ["module", "devkit"],
    href: "/nvidia-jetson?cat=modules",
  },
  {
    id: "orin-nano-8gb",
    name: "Jetson Orin Nano 8GB Super",
    series: "Orin Nano",
    tops: 67,
    ramGb: 8,
    priceTHB: "เริ่ม 19,900",
    bestFor: ["vision", "edge-ipc", "genai"],
    industries: ["retail", "smartcity", "manufacturing", "general"],
    highlight: "67 TOPS รองรับ LLM ขนาดเล็ก (Llama 3.2-3B), Vision หลาย stream",
    formFactor: ["module", "devkit"],
    href: "/nvidia-jetson?cat=devkits",
    badge: "Best Value",
  },
  {
    id: "orin-nx-8gb",
    name: "Jetson Orin NX 8GB",
    series: "Orin NX",
    tops: 70,
    ramGb: 8,
    priceTHB: "เริ่ม 25,900",
    bestFor: ["vision", "video", "robotics"],
    industries: ["surveillance", "robotics", "manufacturing"],
    highlight: "Mid-range สำหรับ DeepStream 8-16 channels และหุ่นยนต์ขนาดกลาง",
    formFactor: ["module", "ipc"],
    href: "/nvidia-jetson?cat=embedded-systems",
  },
  {
    id: "orin-nx-16gb",
    name: "Jetson Orin NX 16GB",
    series: "Orin NX",
    tops: 100,
    ramGb: 16,
    priceTHB: "เริ่ม 35,900",
    bestFor: ["vision", "video", "robotics", "genai"],
    industries: ["surveillance", "manufacturing", "medical", "smartcity"],
    highlight: "100 TOPS เหมาะ Video Analytics ระดับโรงงาน + LLM 7B",
    formFactor: ["module", "ipc"],
    href: "/nvidia-jetson?cat=embedded-systems",
    badge: "Popular",
  },
  {
    id: "agx-orin-32gb",
    name: "Jetson AGX Orin 32GB",
    series: "AGX Orin",
    tops: 200,
    ramGb: 32,
    priceTHB: "เริ่ม 75,900",
    bestFor: ["robotics", "genai", "video", "vision"],
    industries: ["robotics", "medical", "manufacturing"],
    highlight: "Server-class Edge AI — Multi-modal AI, Autonomous Robot",
    formFactor: ["module", "devkit", "ipc"],
    href: "/nvidia-jetson?cat=modules",
  },
  {
    id: "agx-orin-64gb",
    name: "Jetson AGX Orin 64GB",
    series: "AGX Orin",
    tops: 275,
    ramGb: 64,
    priceTHB: "เริ่ม 99,900",
    bestFor: ["robotics", "genai", "video"],
    industries: ["robotics", "medical", "smartcity"],
    highlight: "Flagship Orin — Humanoid Robot, GenAI Agent, Multi-camera AI",
    formFactor: ["module", "devkit", "ipc"],
    href: "/nvidia-jetson?cat=devkits",
    badge: "Flagship",
  },
  {
    id: "thor",
    name: "Jetson Thor (T5000)",
    series: "Thor",
    tops: 2070,
    ramGb: 128,
    priceTHB: "ติดต่อ Sales",
    bestFor: ["robotics", "genai", "video"],
    industries: ["robotics", "medical"],
    highlight: "2070 TFLOPS — Physical AI, Humanoid, Foundation Models on-device",
    formFactor: ["module", "devkit"],
    href: "/nvidia-jetson?cat=modules",
    badge: "NEW 2025",
  },
];

/* ───────── Scoring ───────── */
function scoreModel(m: JetsonModel, a: Answers): number {
  let score = 0;
  if (a.workload && m.bestFor.includes(a.workload)) score += 40;
  if (a.industry && m.industries.includes(a.industry)) score += 20;
  if (a.perfTops) {
    const diff = Math.abs(m.tops - a.perfTops);
    score += Math.max(0, 30 - (diff / a.perfTops) * 30);
  }
  if (a.budget) {
    const tier = m.tops < 50 ? "entry" : m.tops < 110 ? "mid" : m.tops < 300 ? "high" : "flagship";
    if (tier === a.budget) score += 25;
    else if (
      (a.budget === "mid" && tier === "entry") ||
      (a.budget === "high" && tier === "mid") ||
      (a.budget === "flagship" && tier === "high")
    ) score += 10;
  }
  if (a.form && a.form !== "any" && !m.formFactor.includes(a.form)) score -= 15;
  return score;
}

/* ───────── UI Steps Data ───────── */
const WORKLOADS: { id: Workload; label: string; desc: string; icon: any }[] = [
  { id: "vision", label: "Computer Vision", desc: "ตรวจจับวัตถุ / นับคน / OCR / Quality Inspection", icon: Eye },
  { id: "video", label: "Video Analytics", desc: "วิเคราะห์ CCTV หลายช่อง (DeepStream)", icon: Video },
  { id: "robotics", label: "Robotics / Autonomous", desc: "หุ่นยนต์, AGV, AMR, Drone, รถยนต์ไร้คนขับ", icon: Bot },
  { id: "genai", label: "Generative AI / LLM", desc: "รัน LLM, VLM, Chatbot ที่ Edge", icon: Brain },
  { id: "speech", label: "Speech / Audio AI", desc: "ASR, TTS, Voice Assistant (Riva)", icon: Mic },
  { id: "edge-ipc", label: "Edge IoT Gateway", desc: "เก็บข้อมูล + Inference เบาๆ ที่หน้างาน", icon: Cpu },
];

const INDUSTRIES: { id: Industry; label: string; icon: any }[] = [
  { id: "manufacturing", label: "โรงงาน / Manufacturing", icon: Factory },
  { id: "surveillance", label: "CCTV / Security", icon: Shield },
  { id: "robotics", label: "Robotics / AGV / Drone", icon: Plane },
  { id: "medical", label: "Medical / Healthcare", icon: Stethoscope },
  { id: "smartcity", label: "Smart City / Traffic", icon: Building2 },
  { id: "retail", label: "Retail / Logistics", icon: Package },
  { id: "general", label: "อื่นๆ / R&D / POC", icon: Sparkles },
];

const PERF_OPTS = [
  { tops: 40, label: "เบา (≤40 TOPS)", desc: "1-2 stream, IoT" },
  { tops: 100, label: "กลาง (40-100 TOPS)", desc: "8-16 stream, LLM 7B" },
  { tops: 275, label: "สูง (100-300 TOPS)", desc: "Multi-modal, Robot" },
  { tops: 1000, label: "สุดยอด (300+ TOPS)", desc: "Humanoid, Foundation Model" },
];

const BUDGETS: { id: Budget; label: string; range: string }[] = [
  { id: "entry", label: "Entry", range: "< 25K" },
  { id: "mid", label: "Mid-range", range: "25-50K" },
  { id: "high", label: "High-end", range: "50-100K" },
  { id: "flagship", label: "Flagship", range: "100K+" },
];

const FORMS: { id: Form; label: string; desc: string }[] = [
  { id: "devkit", label: "Developer Kit", desc: "พร้อมใช้พัฒนา / POC" },
  { id: "module", label: "Module (SoM)", desc: "ฝังในเครื่องตัวเอง" },
  { id: "ipc", label: "Embedded IPC", desc: "เครื่องสำเร็จกันฝุ่น/สั่น" },
  { id: "any", label: "ยังไม่แน่ใจ", desc: "ให้แนะนำตามงาน" },
];

/* ───────── Page ───────── */
export default function JetsonRecommend() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});

  const totalSteps = 5; // 0..4 = questions, 5 = result
  const isResult = step >= totalSteps;
  const progress = Math.min(100, (step / totalSteps) * 100);

  const recommendations = useMemo(() => {
    return [...MODELS]
      .map((m) => ({ m, score: scoreModel(m, a) }))
      .sort((x, y) => y.score - x.score)
      .slice(0, 3);
  }, [a]);

  const reset = () => { setA({}); setStep(0); };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ตัวช่วยเลือก NVIDIA Jetson | Product Advisor — ENT Group</title>
        <meta name="description" content="Wizard ช่วยเลือกรุ่น NVIDIA Jetson ที่เหมาะกับงานของคุณ — ตอบ 5 ข้อ รับคำแนะนำพร้อมราคาและลิงก์สเปก" />
        <link rel="canonical" href="https://www.entgroup.co.th/nvidia-jetson/recommend" />
      </Helmet>

      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ background: `linear-gradient(135deg, ${NV}15 0%, hsl(var(--background)) 60%)` }}>
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link to="/nvidia-jetson" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" /> กลับ NVIDIA Jetson
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <Badge style={{ background: NV, color: "white" }} className="border-0">
              <Sparkles className="w-3 h-3 mr-1" /> Product Advisor
            </Badge>
            <Badge variant="outline">5 คำถาม · 1 นาที</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            ตัวช่วยเลือก <span style={{ color: NV }}>NVIDIA Jetson</span> ที่ใช่
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            ตอบคำถามสั้นๆ 5 ข้อเกี่ยวกับงานของคุณ ระบบจะแนะนำรุ่น Jetson ที่เหมาะที่สุด พร้อมเหตุผลและราคาประมาณการ
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="font-medium">{isResult ? "ผลลัพธ์" : `ขั้นที่ ${step + 1} / ${totalSteps}`}</span>
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> เริ่มใหม่
            </button>
          </div>
          <Progress value={isResult ? 100 : progress} className="h-2" />
        </div>

        {!isResult && (
          <Card>
            <CardContent className="p-6 md:p-8">
              {step === 0 && (
                <StepBlock icon={Target} title="งานหลักของคุณคืออะไร?" subtitle="เลือกประเภทงาน AI ที่ต้องการรัน">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {WORKLOADS.map((w) => (
                      <OptionCard
                        key={w.id} icon={w.icon} title={w.label} desc={w.desc}
                        active={a.workload === w.id}
                        onClick={() => { setA({ ...a, workload: w.id }); setStep(1); }}
                      />
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 1 && (
                <StepBlock icon={Factory} title="อยู่ในอุตสาหกรรมไหน?" subtitle="ช่วยเราแนะนำ Case Study และอุปกรณ์เสริมที่เกี่ยวข้อง">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {INDUSTRIES.map((i) => (
                      <OptionCard
                        key={i.id} icon={i.icon} title={i.label}
                        active={a.industry === i.id}
                        onClick={() => { setA({ ...a, industry: i.id }); setStep(2); }}
                      />
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 2 && (
                <StepBlock icon={Gauge} title="ต้องการประสิทธิภาพระดับไหน?" subtitle="ประเมินจากจำนวน stream / ขนาด model ที่จะรัน">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {PERF_OPTS.map((p) => (
                      <OptionCard
                        key={p.tops} icon={Zap} title={p.label} desc={p.desc}
                        active={a.perfTops === p.tops}
                        onClick={() => { setA({ ...a, perfTops: p.tops }); setStep(3); }}
                      />
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 3 && (
                <StepBlock icon={Wallet} title="งบประมาณต่อหน่วย (โดยประมาณ)" subtitle="เพื่อกรองรุ่นที่เหมาะกับงบ">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {BUDGETS.map((b) => (
                      <OptionCard
                        key={b.id} icon={Wallet} title={b.label} desc={`฿${b.range}`}
                        active={a.budget === b.id}
                        onClick={() => { setA({ ...a, budget: b.id }); setStep(4); }}
                      />
                    ))}
                  </div>
                </StepBlock>
              )}

              {step === 4 && (
                <StepBlock icon={Package} title="ต้องการ Form Factor แบบไหน?" subtitle="Devkit เหมาะ POC, Module เหมาะฝัง, IPC เหมาะหน้างาน">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {FORMS.map((f) => (
                      <OptionCard
                        key={f.id} icon={Package} title={f.label} desc={f.desc}
                        active={a.form === f.id}
                        onClick={() => { setA({ ...a, form: f.id }); setStep(5); }}
                      />
                    ))}
                  </div>
                </StepBlock>
              )}

              {/* Back button */}
              {step > 0 && (
                <div className="mt-6 pt-4 border-t flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
                  </Button>
                  <span className="text-xs text-muted-foreground self-center">เลือกตัวเลือกเพื่อไปต่อ</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {isResult && (
          <div className="space-y-6">
            <Card className="border-2" style={{ borderColor: NV }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5" style={{ color: NV }} />
                  <h2 className="text-xl font-bold">รุ่นที่แนะนำสำหรับคุณ</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  จาก: {WORKLOADS.find((w) => w.id === a.workload)?.label} ·
                  {" "}{INDUSTRIES.find((i) => i.id === a.industry)?.label} ·
                  {" "}~{a.perfTops} TOPS · {BUDGETS.find((b) => b.id === a.budget)?.label}
                </p>

                <div className="space-y-3">
                  {recommendations.map(({ m }, idx) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-lg border ${idx === 0 ? "bg-muted/50 border-2" : ""}`}
                      style={idx === 0 ? { borderColor: NV } : {}}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {idx === 0 && (
                              <Badge style={{ background: NV, color: "white" }} className="border-0 text-[10px]">
                                ★ TOP MATCH
                              </Badge>
                            )}
                            {m.badge && <Badge variant="outline" className="text-[10px]">{m.badge}</Badge>}
                            <Badge variant="secondary" className="text-[10px]">{m.series}</Badge>
                          </div>
                          <h3 className="font-bold text-base">{m.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">ราคาประมาณ</div>
                          <div className="font-bold text-sm" style={{ color: NV }}>฿{m.priceTHB}</div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{m.highlight}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                        <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3" /> {m.tops} TOPS</span>
                        <span className="inline-flex items-center gap-1"><Cpu className="w-3 h-3" /> {m.ramGb} GB RAM</span>
                        <span className="inline-flex items-center gap-1"><Package className="w-3 h-3" /> {m.formFactor.join(" / ")}</span>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" asChild style={idx === 0 ? { background: NV, color: "white" } : {}} variant={idx === 0 ? "default" : "outline"}>
                          <Link to={m.href}>ดูสเปก / สั่งซื้อ <ArrowRight className="w-3 h-3 ml-1" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link to="/contact">ขอ POC ฟรี</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next steps */}
            <div className="grid md:grid-cols-3 gap-3">
              <Link to="/nvidia-jetson/ai-ready" className="group">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <Brain className="w-5 h-5 mb-2" style={{ color: NV }} />
                    <h4 className="font-semibold text-sm mb-1">AI Models ที่รองรับ</h4>
                    <p className="text-xs text-muted-foreground">ดู NGC Models 25+ ตัว ฟรี</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/nvidia-jetson/case-studies" className="group">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <Wrench className="w-5 h-5 mb-2" style={{ color: NV }} />
                    <h4 className="font-semibold text-sm mb-1">Case Studies จริง</h4>
                    <p className="text-xs text-muted-foreground">ตัวอย่าง deployment ในไทย</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/nvidia-jetson/solutions" className="group">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <Factory className="w-5 h-5 mb-2" style={{ color: NV }} />
                    <h4 className="font-semibold text-sm mb-1">Solutions รายอุตสาหกรรม</h4>
                    <p className="text-xs text-muted-foreground">โซลูชันครบจบ</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" /> ทำแบบทดสอบใหม่
              </Button>
              <Button asChild style={{ background: NV, color: "white" }}>
                <Link to="/contact">ปรึกษาวิศวกร AI <ChevronRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

/* ───────── Sub-components ───────── */
function StepBlock({ icon: Icon, title, subtitle, children }: { icon: any; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-5 h-5" style={{ color: NV }} />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

function OptionCard({
  icon: Icon, title, desc, active, onClick,
}: { icon: any; title: string; desc?: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition-all hover:border-primary hover:shadow-sm ${
        active ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ background: `${NV}20` }}>
          <Icon className="w-4 h-4" style={{ color: NV }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
        </div>
        {active && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: NV }} />}
      </div>
    </button>
  );
}
