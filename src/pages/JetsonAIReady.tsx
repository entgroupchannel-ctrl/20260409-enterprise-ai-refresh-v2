import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Eye, Mic, Bot, Video, Sparkles, Wrench, ExternalLink, Phone,
  CheckCircle2, ArrowRight, Cpu, MessageCircle
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import banner from "@/assets/banner-solution.jpg";

const NV = "#76B900";

type JetsonChip = "Orin Nano" | "Orin NX" | "AGX Orin" | "Thor";
type Category = "Computer Vision" | "Speech AI" | "Robotics" | "Video Analytics" | "Generative AI" | "Tools & SDK";

interface AIModel {
  category: Category;
  name: string;
  desc: string;
  supports: JetsonChip[];
  products: string[];
  ngcUrl: string;
}

const categoryMeta: Record<Category, { icon: typeof Eye; color: string; gradient: string }> = {
  "Computer Vision":  { icon: Eye,       color: "from-emerald-500 to-green-600",  gradient: "from-emerald-500/10 to-green-600/10" },
  "Speech AI":        { icon: Mic,       color: "from-blue-500 to-cyan-600",      gradient: "from-blue-500/10 to-cyan-600/10" },
  "Robotics":         { icon: Bot,       color: "from-purple-500 to-pink-600",    gradient: "from-purple-500/10 to-pink-600/10" },
  "Video Analytics":  { icon: Video,     color: "from-orange-500 to-red-600",     gradient: "from-orange-500/10 to-red-600/10" },
  "Generative AI":    { icon: Sparkles,  color: "from-fuchsia-500 to-violet-600", gradient: "from-fuchsia-500/10 to-violet-600/10" },
  "Tools & SDK":      { icon: Wrench,    color: "from-amber-500 to-orange-600",   gradient: "from-amber-500/10 to-orange-600/10" },
};

const ALL_CHIPS: JetsonChip[] = ["Orin Nano", "Orin NX", "AGX Orin", "Thor"];

const models: AIModel[] = [
  // Computer Vision
  { category: "Computer Vision", name: "TAO PeopleNet", desc: "ตรวจจับคน ใบหน้า และกระเป๋า", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/peoplenet" },
  { category: "Computer Vision", name: "TAO TrafficCamNet", desc: "ตรวจจับรถบนถนน", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/trafficcamnet" },
  { category: "Computer Vision", name: "TAO DashCamNet", desc: "ตรวจจับวัตถุจากกล้องหน้ารถ", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/dashcamnet" },
  { category: "Computer Vision", name: "TAO LPRNet", desc: "อ่านป้ายทะเบียนรถ", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/lprnet" },
  { category: "Computer Vision", name: "TAO BodyPoseNet", desc: "วิเคราะห์ท่าทางร่างกาย", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/bodyposenet" },
  { category: "Computer Vision", name: "TAO ActionRecognitionNet", desc: "จำแนกพฤติกรรมในวิดีโอ", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/actionrecognitionnet" },
  { category: "Computer Vision", name: "TAO Object Detection", desc: "ตรวจจับวัตถุทั่วไป (YOLO, SSD, FasterRCNN)", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/resources/cv_samples" },
  { category: "Computer Vision", name: "TAO Image Classification", desc: "จำแนกประเภทภาพ (FasterViT, ResNet)", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/resources/cv_samples" },
  { category: "Computer Vision", name: "TAO Instance Segmentation", desc: "แยกขอบเขตวัตถุในภาพ (Mask-RCNN)", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/resources/cv_samples" },
  { category: "Computer Vision", name: "TAO Depth Estimation", desc: "ประมาณความลึกจากภาพ 2D", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/resources/cv_samples" },
  // Speech AI
  { category: "Speech AI", name: "Riva ASR", desc: "แปลงเสียงพูดเป็นข้อความ", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/riva/models/parakeet-rnnt-riva-1-1b-en-us" },
  { category: "Speech AI", name: "Riva TTS", desc: "แปลงข้อความเป็นเสียงพูด", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/models/speechtotext_en_us_conformer" },
  // Robotics
  { category: "Robotics", name: "Isaac ROS Perception", desc: "รับรู้สิ่งแวดล้อม 3D สำหรับหุ่นยนต์", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/isaac/containers/nova_developer_kit_bringup" },
  { category: "Robotics", name: "Isaac ROS Navigation", desc: "นำทางหุ่นยนต์อัตโนมัติ", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/containers/isaac-sim" },
  { category: "Robotics", name: "Isaac Manipulator", desc: "ควบคุมแขนหุ่นยนต์", supports: ["AGX Orin", "Thor"],
    products: ["AGX Orin Dev Kit", "IPC-28F1 (AGX Orin)", "Orin Super ระบบพัฒนา", "+3 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/containers/isaac-sim" },
  { category: "Robotics", name: "GR00T (Humanoid)", desc: "Foundation model สำหรับหุ่นยนต์ Humanoid", supports: ["Thor"],
    products: ["Thor Developer Kit", "DGX Spark", "Thor T4000 IPC"],
    ngcUrl: "https://developer.nvidia.com/isaac/gr00t" },
  // Video Analytics
  { category: "Video Analytics", name: "DeepStream SDK", desc: "Pipeline วิเคราะห์วิดีโอ AI แบบ Multi-stream", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/containers/deepstream-l4t" },
  { category: "Video Analytics", name: "Metropolis (VSS Blueprint)", desc: "ระบบ Video AI ครบวงจรระดับองค์กร", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://developer.nvidia.com/metropolis" },
  // Generative AI
  { category: "Generative AI", name: "Cosmos Reason2-2B", desc: "เข้าใจวิดีโอ + เหตุผลเชิงกายภาพ", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nim/teams/nvidia/containers/cosmos-reason2-2b" },
  { category: "Generative AI", name: "Nemotron (Chat/Instruct)", desc: "LLM สนทนาและตอบคำถาม", supports: ["AGX Orin", "Thor"],
    products: ["AGX Orin Dev Kit", "IPC-28F1 (AGX Orin)", "Orin Super ระบบพัฒนา", "+3 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/nemo/models/nemotron-4-340b-instruct" },
  { category: "Generative AI", name: "OpenClaw (AI Assistant)", desc: "ผู้ช่วย AI ส่วนตัวบน Edge", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/nemo/models/nemotron-3-8b-chat-4k-steerlm" },
  // Tools & SDK
  { category: "Tools & SDK", name: "TAO Toolkit", desc: "Fine-tune model ด้วยข้อมูลของตัวเอง ไม่ต้องเทรนจากศูนย์", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/teams/tao/resources" },
  { category: "Tools & SDK", name: "TensorRT", desc: "เร่งความเร็ว AI inference บน Jetson", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tensorrt" },
  { category: "Tools & SDK", name: "JetPack SDK", desc: "OS + driver + library ครบชุดสำหรับ Jetson", supports: ALL_CHIPS,
    products: ["Orin Nano Super Dev Kit", "T201S Orin Nano 4G", "T201S Orin Nano 8G", "+10 อื่นๆ"],
    ngcUrl: "https://developer.nvidia.com/embedded/jetpack" },
  { category: "Tools & SDK", name: "Triton Inference Server", desc: "Serve หลาย AI model พร้อมกัน", supports: ["Orin NX", "AGX Orin", "Thor"],
    products: ["IPC-18F1E1 (Orin NX)", "Y-C28 ระบบพัฒนา", "IPC-ONX-SYS-2016", "+6 อื่นๆ"],
    ngcUrl: "https://catalog.ngc.nvidia.com/orgs/nvidia/containers/tritonserver" },
];

const categories: ("all" | Category)[] = ["all", "Computer Vision", "Speech AI", "Robotics", "Video Analytics", "Generative AI", "Tools & SDK"];
const chips: ("all" | JetsonChip)[] = ["all", "Orin Nano", "Orin NX", "AGX Orin", "Thor"];

export default function JetsonAIReady() {
  const [cat, setCat] = useState<"all" | Category>("all");
  const [chip, setChip] = useState<"all" | JetsonChip>("all");

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (chip !== "all" && !m.supports.includes(chip)) return false;
      return true;
    });
  }, [cat, chip]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: models.length };
    models.forEach((m) => { map[m.category] = (map[m.category] || 0) + 1; });
    return map;
  }, []);

  return (
    <>
      <SEOHead
        title="AI Ready — ซื้อ Jetson ใช้ AI ได้ทันที | NVIDIA NGC Catalog"
        description="NVIDIA NGC Catalog รวม AI Model สำเร็จรูปกว่า 25+ ตัว ดาวน์โหลดฟรี รันบน Jetson ได้เลย — Computer Vision, Speech, Robotics, Video Analytics, GenAI"
        path="/nvidia-jetson/ai-ready"
      />
      <SiteNavbar />
      <PageBanner image={banner} title="ซื้อ Jetson ใช้ AI ได้ทันที"
        subtitle="NVIDIA NGC Catalog — AI Model สำเร็จรูปกว่า 100+ ตัว ดาวน์โหลดฟรี รันบน Jetson ได้เลย" />

      <main className="bg-background">
        {/* Hero stats */}
        <section className="py-10 border-b border-border bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: "AI Models พร้อมใช้", value: `${models.length}+`, icon: Sparkles },
                { label: "ฟรี / Open Source", value: "100%", icon: CheckCircle2 },
                { label: "หมวดหมู่งาน", value: "6", icon: Cpu },
                { label: "รุ่น Jetson รองรับ", value: "4", icon: Bot },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center p-4 rounded-xl bg-card border border-border">
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: NV }} />
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 py-4 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">ประเภทงาน</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => {
                  const active = cat === c;
                  const label = c === "all" ? "ทั้งหมด" : c;
                  const count = c === "all" ? counts.all : counts[c] || 0;
                  return (
                    <button key={c} onClick={() => setCat(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 ${
                        active ? "text-black border-transparent shadow" : "bg-card text-muted-foreground border-border hover:border-foreground/40"
                      }`}
                      style={active ? { backgroundColor: NV } : undefined}>
                      {label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-black/15" : "bg-muted"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Jetson ที่รองรับ</div>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => {
                  const active = chip === c;
                  return (
                    <button key={c} onClick={() => setChip(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        active ? "text-black border-transparent shadow" : "bg-card text-muted-foreground border-border hover:border-foreground/40"
                      }`}
                      style={active ? { backgroundColor: NV } : undefined}>
                      {c === "all" ? "ทุกรุ่น" : c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                พบ <span className="font-bold text-foreground">{filtered.length}</span> Model
              </div>
              {(cat !== "all" || chip !== "all") && (
                <button onClick={() => { setCat("all"); setChip("all"); }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground underline">
                  ล้างตัวกรอง
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">ไม่พบ Model ที่ตรงกับเงื่อนไข ลองเปลี่ยนตัวกรอง</p>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((m) => {
                  const meta = categoryMeta[m.category];
                  const Icon = meta.icon;
                  return (
                    <Card key={m.name} className="overflow-hidden group hover:shadow-2xl transition-all border-border/60 flex flex-col">
                      <div className={`h-1.5 bg-gradient-to-r ${meta.color}`} />
                      <div className={`p-5 flex flex-col flex-1 bg-gradient-to-br ${meta.gradient}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                            <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            {m.category}
                          </div>
                          <Badge variant="outline" className="text-[10px]" style={{ borderColor: NV, color: NV }}>ฟรี</Badge>
                        </div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{m.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>

                        <div className="mb-3">
                          <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1.5">รองรับ</div>
                          <div className="flex flex-wrap gap-1">
                            {ALL_CHIPS.map((c) => {
                              const supported = m.supports.includes(c);
                              return (
                                <span key={c}
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    supported ? "text-black" : "bg-muted text-muted-foreground/50 line-through"
                                  }`}
                                  style={supported ? { backgroundColor: NV } : undefined}>
                                  {c}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mb-4 flex-1">
                          <div className="text-[10px] uppercase font-semibold text-muted-foreground mb-1.5">ซื้อแล้วรันได้เลย</div>
                          <div className="flex flex-wrap gap-1">
                            {m.products.map((p) => (
                              <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-card border border-border text-foreground/80">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-auto pt-3 border-t border-border/60">
                          <Link to="/nvidia-jetson" className="flex-1">
                            <Button size="sm" className="w-full" style={{ backgroundColor: NV, color: "#000" }}>
                              ดูสินค้า <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                          <a href={m.ngcUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                            <Button size="sm" variant="outline">
                              NGC <ExternalLink className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              ไม่แน่ใจว่า Model ไหนเหมาะกับงานของคุณ?
            </h2>
            <p className="text-muted-foreground mb-6">
              ปรึกษาทีมวิศวกร ENT Group ฟรี — เราช่วยเลือก Jetson + AI Model ที่เหมาะกับงานคุณ
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="tel:020456104">
                <Button size="lg" style={{ backgroundColor: NV, color: "#000" }}>
                  <Phone className="w-4 h-4 mr-1" /> 02-045-6104
                </Button>
              </a>
              <a href="https://line.me/R/ti/p/@entgroup" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-1" /> LINE @entgroup
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline">ติดต่อเรา</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
