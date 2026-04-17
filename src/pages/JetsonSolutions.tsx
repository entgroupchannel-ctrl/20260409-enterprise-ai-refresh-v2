import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight, Shield, Plane, Stethoscope, Building2, Factory, Cpu,
  CheckCircle2, Sparkles, GraduationCap, Handshake, Brain, Server,
  Eye, Mic, Bot, Video, Wrench
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import bgGov from "@/assets/jetson-banner-government.jpg";
import bgEdu from "@/assets/jetson-banner-education.jpg";
import bgInt from "@/assets/jetson-banner-integrator.jpg";
import bgFac from "@/assets/jetson-banner-factory.jpg";
import bgGen from "@/assets/jetson-banner-genai.jpg";
import imgSecurity from "@/assets/jetson-sol-security.jpg";
import imgDrone from "@/assets/jetson-sol-drone.jpg";
import imgMedical from "@/assets/jetson-sol-medical.jpg";
import imgSmartCity from "@/assets/jetson-sol-smartcity.jpg";
import imgForklift from "@/assets/jetson-sol-forklift.jpg";
import imgFactory from "@/assets/jetson-banner-factory.jpg";
import imgGpuServer from "@/assets/jetson-sol-gpuserver.jpg";
import banner from "@/assets/banner-solution.jpg";

/* ───── Industry Hero (5 personas) ───── */
const personas = [
  { tag: "หน่วยงานราชการ", image: bgGov, title: "AI Server สำหรับหน่วยงานราชการ",
    desc: "ประมวลผลในประเทศ ไม่ต้องส่งข้อมูลขึ้น Cloud — รองรับ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    chips: ["DGX Spark — 1 PFLOP, 128GB", "Jetson AGX Thor — 2,070 TFLOPS", "Jetson AGX Orin 64GB", "IPC Rack-mount"],
    cta: "ขอใบเสนอราคา" },
  { tag: "การศึกษา", image: bgEdu, title: "เริ่มต้นสอน AI ในห้องเรียน",
    desc: "Dev Kit พร้อมใช้ เปิดกล่องเขียน AI ได้เลย — เหมาะสำหรับโครงงาน, Senior Project, วิจัย",
    chips: ["Orin Nano 4GB — ฿22,900", "Orin Nano 8GB — ฿25,900", "Y-C18-DEV — ฿38,900"],
    cta: "สั่งซื้อสำหรับห้องเรียน" },
  { tag: "ผู้รับเหมาระบบ (SI)", image: bgInt, title: "เพิ่มมูลค่าโซลูชันของคุณ",
    desc: "ฝัง AI เข้าไปในผลิตภัณฑ์และโครงการของคุณ — ราคาพิเศษสำหรับ SI/Reseller สั่งซื้อจำนวนมาก",
    chips: ["Orin NX 16GB — Module", "IPC 18F1E1 — ฿46,900", "Carrier Y-C18 — Custom", "T201S Edge AI"],
    cta: "สมัครเป็นพาร์ทเนอร์" },
  { tag: "โรงงานอัจฉริยะ", image: bgFac, title: "ตรวจสอบคุณภาพด้วย AI",
    desc: "AI Vision ตรวจจับชิ้นงานเสียบนสายพานได้ทันที — Fanless, ทนฝุ่น, ติดตั้งง่ายบน DIN Rail",
    chips: ["IPC 18F1E1 — ฿46,900", "T201S 4GB — ฿42,900", "Orin NX + Y-C18 Bundle", "IPC 17F1 Multi-cam"],
    cta: "ปรึกษาทีมวิศวกรฟรี" },
  { tag: "Generative AI", image: bgGen, title: "รัน LLM บนโต๊ะทำงาน",
    desc: "Jetson AGX Thor รัน Qwen3 32B, Cosmos ได้บนเครื่องเดียว — 128 GB, 2,070 TFLOPS, Blackwell",
    chips: ["DGX Spark — Desktop AI", "AGX Thor Dev Kit — Physical AI", "Orin Nano Super — GenAI Entry"],
    cta: "สั่งจอง" },
];

const industryTabs = [
  { id: "all", label: "ทั้งหมด" },
  { id: "security", label: "ความปลอดภัย" },
  { id: "industrial", label: "อุตสาหกรรม" },
  { id: "drone", label: "โดรน & UAV" },
  { id: "medical", label: "การแพทย์" },
  { id: "smartcity", label: "เมืองอัจฉริยะ" },
];

const useCases = [
  { id: "security", category: "ระบบรักษาความปลอดภัย", icon: Shield, image: imgSecurity,
    title: "ระบบรักษาความปลอดภัยอัจฉริยะ",
    desc: "ระบบเฝ้าระวังที่ต้องการความเสถียรสูง ประสิทธิภาพประมวลผลแรง พื้นที่จัดเก็บข้อมูลขนาดใหญ่ และอินเทอร์เฟซหลากหลาย",
    features: ["หุ่นยนต์ลาดตระเวนอัตโนมัติ", "ระบบตรวจจับใบหน้า", "กล้องวงจรปิดอัจฉริยะ", "เตือนภัยแบบ Real-time"],
    products: ["IPC 18F1E1", "IPC 11F1E2", "IPC 8F5E2"] },
  { id: "industrial", category: "ระบบอัตโนมัติอุตสาหกรรม", icon: Factory, image: imgForklift,
    title: "ระบบ AI สำหรับรถโฟล์คลิฟท์และเครน",
    desc: "รถโฟล์คลิฟท์มีข้อจำกัดด้านมุมบอด — ระบบ AI 360° ช่วยเตือนก่อนเกิดอุบัติเหตุและตรวจสอบสถานะคนขับ",
    features: ["ตรวจจับคนในจุดบอด 360°", "เตือนขับเร็วเกิน", "ตรวจสอบสถานะคนขับ", "บันทึกข้อมูลส่งคลาวด์"],
    products: ["IPC 11F1E2", "NX-SYS-2006"] },
  { id: "industrial", category: "ระบบอัตโนมัติอุตสาหกรรม", icon: Factory, image: imgFactory,
    title: "ระบบอัตโนมัติในโรงงาน",
    desc: "ควบคุมกระบวนการผลิต ตรวจสอบคุณภาพด้วย Machine Vision และจัดการสายการผลิตแบบอัตโนมัติ",
    features: ["ตรวจ QC ด้วย Vision AI", "ควบคุมสายการผลิต", "นับจำนวนสินค้าอัตโนมัติ", "ตรวจจับของเสีย"],
    products: ["IPC 18F1E1", "IPC 11F1E2", "T201S Orin Nano Super"] },
  { id: "drone", category: "โดรนและ UAV", icon: Plane, image: imgDrone,
    title: "โดรนตรวจสอบสายไฟฟ้า",
    desc: "ตรวจสอบสายส่งไฟฟ้าและเสาไฟ ตรวจจับความเสียหาย รอยร้าว จุดร้อน แทนการส่งคนปีนเสา",
    features: ["ตรวจสอบสายส่งไฟฟ้า", "ตรวจจับจุดร้อน (Thermal)", "ถ่ายภาพ 3D เสาไฟ", "รายงานอัตโนมัติ"],
    products: ["Carrier Board Y-C17", "IPC 17F1 สำหรับโดรน"] },
  { id: "drone", category: "โดรนและ UAV", icon: Plane, image: imgDrone,
    title: "โดรนทำแผนที่และวางแผนเส้นทาง",
    desc: "ทำแผนที่ภูมิประเทศ 3D วางแผนเส้นทางบินอัตโนมัติ สำรวจพื้นที่เกษตร ก่อสร้าง และพื้นที่ประสบภัย",
    features: ["ทำแผนที่ภูมิประเทศ 3D", "วางแผนเส้นทางบินอัตโนมัติ", "สำรวจพื้นที่เกษตร", "สำรวจพื้นที่ก่อสร้าง"],
    products: ["Carrier Y-C17", "IPC 17F1"] },
  { id: "drone", category: "โดรนและ UAV", icon: Plane, image: imgDrone,
    title: "ระบบควบคุมการบินและนำทาง",
    desc: "ระบบควบคุมการบินอัจฉริยะ ใช้ AI ประมวลผลข้อมูลจากเซ็นเซอร์หลายตัว เพื่อบินอัตโนมัติและหลบสิ่งกีดขวาง",
    features: ["บินอัตโนมัติ", "หลบหลีกสิ่งกีดขวาง", "ลงจอดแม่นยำ", "ติดตามเป้าหมาย"],
    products: ["IPC 17F1", "NX16-7F4"] },
  { id: "medical", category: "การแพทย์", icon: Stethoscope, image: imgMedical,
    title: "กล้องส่องตรวจอัจฉริยะ (AI Endoscope)",
    desc: "ใช้ Deep Learning วิเคราะห์ภาพจากกล้องส่องตรวจแบบ Real-time ตรวจจับเนื้องอกและรอยโรคที่ตาเปล่ามองไม่เห็น",
    features: ["วิเคราะห์ Endoscope Real-time", "ตรวจจับเนื้องอกอัตโนมัติ", "กล้องส่องตรวจพกพา", "Telemedicine"],
    products: ["T201S Orin Nano Super 8GB"] },
  { id: "smartcity", category: "เมืองอัจฉริยะ", icon: Building2, image: imgSmartCity,
    title: "เรือไร้คนขับ ตรวจคุณภาพน้ำและเก็บขยะ",
    desc: "เรือไร้คนขับใช้ AI นำทางและควบคุม ตรวจวัดคุณภาพน้ำ เก็บขยะผิวน้ำ ทำงานอัตโนมัติตามเส้นทางที่กำหนด",
    features: ["ตรวจวัดคุณภาพน้ำ", "เก็บขยะผิวน้ำอัตโนมัติ", "สำรวจแหล่งน้ำ", "เฝ้าระวังมลพิษ"],
    products: ["Carrier Y-C17", "IPC 11F1E2"] },
];

const gpuSolutions = [
  { icon: Shield, title: "หน่วยงานราชการ On-Premise (PDPA)",
    desc: "จัดการข้อมูลอ่อนไหวของประชาชน — บัตรประชาชน เวชระเบียน ข้อมูลการเงิน — ที่ต้องไม่หลุดออกนอกองค์กรตาม พ.ร.บ. PDPA",
    products: ["DGX Spark", "AGX Thor", "DGX A100"] },
  { icon: GraduationCap, title: "ห้องเรียน / Lab มหาวิทยาลัย",
    desc: "เร่งเพิ่ม AI และ Deep Learning เข้าหลักสูตร — ทดแทน Lab ที่ใช้ Consumer GPU ที่รันโมเดลใหญ่ไม่ไหว",
    products: ["W830", "WS1020"] },
  { icon: Factory, title: "โรงงาน AI Inference + Vision",
    desc: "AI ตรวจ QC ลดความสูญเสียจากสินค้าบกพร่อง — ตรวจรอยขีดข่วนเล็ก รอยร้าวระดับไมครอนได้ตลอด 24/7",
    products: ["AGX Thor", "DGX Spark"] },
  { icon: Bot, title: "Robotics / Autonomous",
    desc: "หุ่นยนต์ Humanoid ที่มองเห็น เข้าใจ และปรับตัวแบบ Real-time — ไม่ใช่ Pick-and-place แบบเดิม",
    products: ["AGX Thor"] },
  { icon: Brain, title: "AI Startup / R&D Lab พัฒนา LLM",
    desc: "ลดต้นทุนเช่า GPU บน Cloud — เผางบ 350,000-1,750,000 บาท/เดือน เปลี่ยนเป็นลงทุนครั้งเดียวบน On-prem",
    products: ["DGX Spark", "WS2030"] },
  { icon: Stethoscope, title: "การแพทย์ Medical AI Training",
    desc: "ช่วยรังสีแพทย์อ่าน CT scan แม่นยำขึ้น ลดความเหนื่อยล้า เพิ่มอัตราการตรวจพบมะเร็งระยะเริ่ม",
    products: ["WS2030", "DGX A100"] },
];

const aiModels = [
  { icon: Eye, title: "Computer Vision", color: "from-emerald-500 to-green-600",
    items: ["TAO PeopleNet — ตรวจจับคน/ใบหน้า", "TAO TrafficCamNet — ตรวจรถ", "TAO DashCamNet — Dash Camera",
      "TAO LPRNet — อ่านป้ายทะเบียน", "TAO BodyPoseNet — ท่าทางร่างกาย"] },
  { icon: Mic, title: "Speech AI", color: "from-blue-500 to-cyan-600",
    items: ["Riva ASR — เสียง→ข้อความ", "Riva TTS — ข้อความ→เสียง"] },
  { icon: Bot, title: "Robotics", color: "from-purple-500 to-pink-600",
    items: ["Isaac ROS Perception — รับรู้ 3D", "Isaac ROS Navigation — นำทาง", "Isaac Manipulator — แขนกล",
      "GR00T — Foundation Model หุ่น Humanoid"] },
  { icon: Video, title: "Video Analytics", color: "from-orange-500 to-red-600",
    items: ["DeepStream SDK — Multi-stream Pipeline", "Metropolis (VSS) — Video AI Enterprise"] },
  { icon: Sparkles, title: "Generative AI", color: "from-fuchsia-500 to-violet-600",
    items: ["Cosmos Reason2-2B — Video + Reasoning", "Nemotron — LLM Chat", "OpenClaw — AI Assistant Edge"] },
  { icon: Wrench, title: "Tools & SDK", color: "from-amber-500 to-orange-600",
    items: ["TAO Toolkit — Fine-tune Model", "TensorRT — เร่งความเร็ว Inference",
      "JetPack SDK — OS+Driver+Library", "Triton — Multi-model Server"] },
];

const NV = "#76B900";

export default function JetsonSolutions() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? useCases : useCases.filter((u) => u.id === tab);

  return (
    <>
      <SEOHead
        title="โซลูชัน NVIDIA Jetson — Edge AI สำหรับทุกอุตสาหกรรม"
        description="โซลูชัน Edge AI ขับเคลื่อนด้วย NVIDIA Jetson — ความปลอดภัย โรงงาน โดรน การแพทย์ เมืองอัจฉริยะ พร้อม GPU Server และ AI Models สำเร็จรูป"
        path="/nvidia-jetson/solutions"
      />
      <SiteNavbar />
      <PageBanner image={banner} title="โซลูชัน NVIDIA Jetson"
        subtitle="Edge AI ที่พร้อมใช้งานจริง — ตั้งแต่หน้างานไปจนถึง Data Center" />

      <main className="bg-background">
        {/* ───── Persona Hero ───── */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <Badge className="mb-3" style={{ backgroundColor: NV, color: "#000" }}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Solutions for Your Business
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                โซลูชันสำหรับธุรกิจของคุณ
              </h2>
              <p className="text-muted-foreground mt-3">
                เลือกโซลูชันที่ตรงกับธุรกิจของคุณ — เรามีทีมวิศวกรไทยช่วยปรึกษาฟรีตั้งแต่ออกแบบจนถึงติดตั้ง
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {personas.map((p) => (
                <Card key={p.tag} className="overflow-hidden group hover:shadow-2xl transition-all border-border/60 hover:border-[--nv] flex flex-col"
                  style={{ ["--nv" as never]: NV }}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <Badge className="absolute top-3 left-3" style={{ backgroundColor: NV, color: "#000" }}>
                      {p.tag}
                    </Badge>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 flex-1">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.chips.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-1 rounded-md bg-muted text-foreground/80">
                          {c}
                        </span>
                      ))}
                    </div>
                    <Link to="/contact">
                      <Button className="w-full" style={{ backgroundColor: NV, color: "#000" }}>
                        {p.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Industry Use Cases ───── */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">โซลูชันอุตสาหกรรม</h2>
              <p className="text-muted-foreground mt-3">
                Edge AI ขับเคลื่อนด้วย NVIDIA Jetson สำหรับทุกอุตสาหกรรม
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {industryTabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    tab === t.id
                      ? "text-black border-transparent shadow-md"
                      : "bg-background text-muted-foreground border-border hover:border-[--nv]"
                  }`}
                  style={tab === t.id ? { backgroundColor: NV } : { ["--nv" as never]: NV }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((uc, idx) => {
                const Icon = uc.icon;
                return (
                  <Card key={`${uc.title}-${idx}`} className="overflow-hidden group hover:shadow-2xl transition-all border-border/60">
                    <div className="grid md:grid-cols-5">
                      <div className="relative md:col-span-2 h-48 md:h-auto overflow-hidden">
                        <img src={uc.image} alt={uc.title} loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                      </div>
                      <div className="md:col-span-3 p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-xs font-medium" style={{ color: NV }}>
                          <Icon className="w-4 h-4" /> {uc.category}
                        </div>
                        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{uc.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{uc.desc}</p>
                        <ul className="space-y-1 mb-3">
                          {uc.features.map((f) => (
                            <li key={f} className="text-xs flex items-start gap-1.5 text-foreground/80">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: NV }} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto pt-2 border-t border-border">
                          <div className="text-[11px] text-muted-foreground mb-1.5">สินค้าแนะนำ:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {uc.products.map((pr) => (
                              <span key={pr} className="text-[10px] px-2 py-1 rounded bg-muted text-foreground/80 font-medium">
                                {pr}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── GPU Server Solutions ───── */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={imgGpuServer} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <Badge className="mb-3" style={{ backgroundColor: NV, color: "#000" }}>
                <Server className="w-3.5 h-3.5 mr-1.5" /> GPU Server
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">โซลูชัน GPU Server</h2>
              <p className="text-muted-foreground mt-3">
                โครงสร้าง GPU ระดับองค์กร ออกแบบสำหรับทุกอุตสาหกรรม — ตั้งแต่ราชการ PDPA จนถึง Medical AI
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gpuSolutions.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.title} className="p-6 group hover:shadow-2xl transition-all border-border/60 hover:border-[--nv] bg-card/95 backdrop-blur"
                    style={{ ["--nv" as never]: NV }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${NV}20` }}>
                      <Icon className="w-6 h-6" style={{ color: NV }} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.products.map((p) => (
                        <span key={p} className="text-[10px] font-medium px-2 py-1 rounded border border-[--nv] text-foreground"
                          style={{ ["--nv" as never]: NV }}>
                          {p}
                        </span>
                      ))}
                    </div>
                    <Link to="/contact" className="text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                      style={{ color: NV }}>
                      ดูรายละเอียด <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── AI Models ───── */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <Badge className="mb-3" variant="outline" style={{ borderColor: NV, color: NV }}>
                <Brain className="w-3.5 h-3.5 mr-1.5" /> NVIDIA NGC
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">AI Models พร้อมใช้งาน</h2>
              <p className="text-muted-foreground mt-3">
                AI Model สำเร็จรูปจาก NVIDIA NGC — ดาวน์โหลดฟรี รันบน Jetson ได้ทันที
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {aiModels.map((m) => {
                const Icon = m.icon;
                return (
                  <Card key={m.title} className="overflow-hidden group hover:shadow-xl transition-all border-border/60">
                    <div className={`h-2 bg-gradient-to-r ${m.color}`} />
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{m.title}</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {m.items.map((i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="mt-1 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <Link to="/nvidia-jetson">
                <Button size="lg" style={{ backgroundColor: NV, color: "#000" }}>
                  <Cpu className="w-4 h-4 mr-1" /> ดูสินค้า Jetson ทั้งหมด
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  <Handshake className="w-4 h-4 mr-1" /> ปรึกษาระบบ AI
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
