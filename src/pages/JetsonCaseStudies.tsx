import { Link } from "react-router-dom";
import {
  Building2, GraduationCap, Wrench, Factory, Sparkles,
  ArrowRight, Phone, MessageCircle, Tag, CheckCircle2
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import GEOMeta from "@/components/GEOMeta";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import JetsonCTABar from "@/components/JetsonCTABar";
import B2BWorkflowBanner from "@/components/B2BWorkflowBanner";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import banner from "@/assets/banner-solution.jpg";
import bgGov from "@/assets/jetson-banner-government.jpg";
import bgEdu from "@/assets/jetson-banner-education.jpg";
import bgInt from "@/assets/jetson-banner-integrator.jpg";
import bgFac from "@/assets/jetson-banner-factory.jpg";
import bgGen from "@/assets/jetson-banner-genai.jpg";

import imgRobot from "@/assets/case-security-robot.jpg";
import imgFork from "@/assets/case-forklift-ai.jpg";
import imgFit from "@/assets/case-smart-fitness.jpg";
import imgUav from "@/assets/case-uav-mapping.jpg";
import imgMed from "@/assets/case-medical-ai.jpg";
import imgPatrol from "@/assets/case-patrol-car.jpg";
import imgEnvDr from "@/assets/case-env-drone.jpg";
import imgBoat from "@/assets/case-unmanned-boat.jpg";

const NV = "#76B900";

const audiences = [
  {
    icon: Building2, tag: "หน่วยงานราชการ", image: bgGov,
    title: "AI Server สำหรับหน่วยงานราชการ",
    desc: "ประมวลผลในประเทศ ไม่ต้องส่งข้อมูลขึ้น Cloud — รองรับ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    chips: ["DGX Spark — 1 PFLOP, 128GB", "AGX Thor — 2,070 TFLOPS", "AGX Orin 64GB — 275 TOPS", "IPC 28F1E4 — Rack-mount"],
    cta: "ขอใบเสนอราคา",
  },
  {
    icon: GraduationCap, tag: "การศึกษา", image: bgEdu,
    title: "เริ่มต้นสอน AI ในห้องเรียน",
    desc: "Dev Kit พร้อมใช้ เปิดกล่องเขียน AI ได้เลย — เหมาะสำหรับโครงงาน, Senior Project, วิจัย",
    chips: ["Orin Nano 4GB — ฿22,900", "Orin Nano 8GB — ฿25,900", "Y-C18-DEV — ฿38,900"],
    cta: "สั่งซื้อสำหรับห้องเรียน",
  },
  {
    icon: Wrench, tag: "ผู้รับเหมาระบบ (SI)", image: bgInt,
    title: "เพิ่มมูลค่าโซลูชันของคุณ",
    desc: "ฝัง AI เข้าไปในผลิตภัณฑ์และโครงการของคุณ — ราคาพิเศษสำหรับ SI/Reseller สั่งซื้อจำนวนมาก",
    chips: ["Orin NX 16GB — Module", "IPC 18F1E1 — ฿46,900", "Carrier Y-C18 — Custom", "T201S — Edge AI"],
    cta: "สมัครเป็นพาร์ทเนอร์",
  },
  {
    icon: Factory, tag: "โรงงานอัจฉริยะ", image: bgFac,
    title: "ตรวจสอบคุณภาพด้วย AI",
    desc: "AI Vision ตรวจจับชิ้นงานเสียบนสายพานได้ทันที — Fanless, ทนฝุ่น, ติดตั้งง่ายบน DIN Rail",
    chips: ["IPC 18F1E1 — ฿46,900", "T201S 4GB — ฿42,900", "Orin NX + Y-C18 Bundle", "IPC 17F1 — Multi-cam"],
    cta: "ปรึกษาทีมวิศวกรฟรี",
  },
  {
    icon: Sparkles, tag: "Generative AI", image: bgGen,
    title: "รัน LLM บนโต๊ะทำงาน",
    desc: "Jetson AGX Thor รัน Qwen3 32B, Cosmos ได้บนเครื่องเดียว — 128GB, 2,070 TFLOPS, Blackwell",
    chips: ["DGX Spark — Desktop AI", "AGX Thor Dev Kit — Physical AI", "Orin Nano Super — GenAI Entry"],
    cta: "สั่งจอง",
  },
];

const cases = [
  {
    image: imgRobot, tag: "ระบบรักษาความปลอดภัย",
    title: "หุ่นยนต์ลาดตระเวนอัจฉริยะ",
    desc: "หุ่นยนต์ลาดตระเวนอัตโนมัติที่ใช้ Edge AI ตรวจจับภัยคุกคามแบบ Real-time ลาดตระเวนได้ 24 ชม. โดยไม่ต้องพักผ่อน",
    chips: ["AGX Orin", "DeepStream", "Isaac ROS"],
  },
  {
    image: imgFork, tag: "Industrial",
    title: "AI ป้องกันอุบัติเหตุรถโฟล์คลิฟท์และเครน",
    desc: "ระบบ AI ตรวจจับคนในจุดบอด 360° เตือนก่อนชน ตรวจสอบพฤติกรรมคนขับ และบันทึกหลักฐานอัตโนมัติ — ลดอุบัติเหตุในคลังสินค้าและโรงงานได้กว่า 90%",
    chips: ["Orin NX 16GB", "TAO PeopleNet", "Multi-cam"],
  },
  {
    image: imgFit, tag: "Smart Cities",
    title: "ระบบฟิตเนสและชุมชนอัจฉริยะ",
    desc: "อุปกรณ์ออกกำลังกายสาธารณะเชื่อมต่อ AI วิเคราะห์ท่าทาง วัดสมรรถภาพ Real-time และระบบจัดการชุมชนอัจฉริยะครบวงจร",
    chips: ["Orin Nano", "BodyPoseNet", "Edge IoT"],
  },
  {
    image: imgUav, tag: "Agriculture",
    title: "โดรน AI ทำแผนที่ เกษตรอัจฉริยะ",
    desc: "โดรน AI สำหรับเกษตรแม่นยำ ทำแผนที่ พ่นยา ใส่ปุ๋ยอัตโนมัติ ลดต้นทุนแรงงาน 70% เพิ่มผลผลิต — รองรับภาครัฐ เอกชน เกษตรกร และต่อยอดธุรกิจรับจ้างบริการ",
    chips: ["Orin NX", "TAO Detection", "GPS RTK"],
  },
  {
    image: imgMed, tag: "Healthcare",
    title: "ระบบ AI สำหรับโรงพยาบาลอัจฉริยะ",
    desc: "Edge AI ครบวงจรสำหรับโรงพยาบาล: วิเคราะห์ภาพทางการแพทย์ บริหารผู้ป่วย ตรวจห้องว่าง เซ็นเซอร์อากาศ วิเคราะห์คิว พยากรณ์บุคลากร และระบบนัดหมายอัจฉริยะ",
    chips: ["AGX Orin", "MONAI", "Triton Server"],
  },
  {
    image: imgPatrol, tag: "Self-Driving",
    title: "รถลาดตระเวน AI — ตรวจทะเบียน ค้นหาอาชญากร",
    desc: "รถลาดตระเวนอัตโนมัติติดตั้ง AI อ่านทะเบียน ตรวจจับรูปพรรณผู้ต้องสงสัย ค้นหารถหนีไฟแนนซ์ ลาดตระเวนหมู่บ้าน-ชายแดน-นิคมฯ ลดคนงาม 80% ทำงาน 24/7",
    chips: ["AGX Orin 64GB", "TAO LPRNet", "ANPR"],
  },
  {
    image: imgEnvDr, tag: "Environment",
    title: "โดรน AI สิ่งแวดล้อม — ค้นหาไฟป่า กู้ภัย",
    desc: "โดรน AI ตรวจจับไฟป่า สำรวจน้ำท่วม ส่งเสบียงในพื้นที่เข้าถึงยาก ติดตามสัตว์ป่า สนับสนุนหน่วยลาดตระเวนเขตอนุรักษ์ — ทำงานได้แม้ไม่มีสัญญาณมือถือ",
    chips: ["Orin NX", "Thermal AI", "Mesh Network"],
  },
  {
    image: imgBoat, tag: "Smart Cities",
    title: "เรือไร้คนขับ AI — ตรวจคุณภาพน้ำ",
    desc: "เรือไร้คนขับ AI ตรวจคุณภาพน้ำในแม่น้ำ เขื่อน ทะเล ลาดตระเวนทางน้ำ เก็บขยะผิวน้ำ และสำรวจสิ่งแวดล้อมทางทะเล — ทำงาน 24/7 ไม่ต้องมีคนบนเรือ",
    chips: ["AGX Orin", "Sensor Fusion", "Marine"],
  },
];

export default function JetsonCaseStudies() {
  return (
    <>
      <SEOHead
        title="Case Studies — ตัวอย่างการใช้งาน NVIDIA Jetson จริง | ENT Group"
        description="รวมตัวอย่างการใช้งาน NVIDIA Jetson ในอุตสาหกรรมจริง: หุ่นยนต์, โดรน AI, รถลาดตระเวน, โรงพยาบาล, โรงงาน, เกษตร และอีกมากมาย"
        path="/nvidia-jetson/case-studies"
      />
      <GEOMeta
        topic="NVIDIA Jetson Real-world Case Studies Thailand"
        summary="รวมตัวอย่างการใช้งาน NVIDIA Jetson จริงในประเทศไทย — หุ่นยนต์ โดรน รถลาดตระเวน โรงพยาบาล โรงงาน เกษตร"
        keyFacts={[
          "Smart Factory & Predictive Maintenance",
          "Autonomous Drone & Robotics",
          "Hospital AI Vision",
          "Smart Agriculture & Surveillance",
        ]}
      />
      <SiteNavbar />
      <PageBanner
        image={banner}
        title="ตัวอย่างการใช้งาน NVIDIA Jetson จริง"
        subtitle="โซลูชัน Edge AI ในอุตสาหกรรมไทย — หุ่นยนต์ โดรน รถลาดตระเวน โรงพยาบาล โรงงาน และอีกมาก"
      />

      <main className="bg-background">
        {/* ─── Audiences (โซลูชันสำหรับธุรกิจของคุณ) ─── */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-3" style={{ borderColor: NV, color: NV }}>
                For Every Industry
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">โซลูชันสำหรับธุรกิจของคุณ</h2>
              <p className="text-muted-foreground mt-3">เลือกแนวทาง Jetson ที่เหมาะกับองค์กรของคุณ พร้อมรุ่นแนะนำ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {audiences.map((a) => {
                const Icon = a.icon;
                return (
                  <Card key={a.tag} className="overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img src={a.image} alt={a.tag} loading="lazy" width={768} height={512}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="backdrop-blur bg-background/80 text-foreground border-border flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" style={{ color: NV }} />
                          {a.tag}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{a.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {a.chips.map((c) => (
                          <span key={c} className="text-[10px] px-2 py-1 rounded bg-muted text-foreground/80 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                      <Link to="/quote">
                        <Button className="w-full" style={{ backgroundColor: NV, color: "#000" }}>
                          {a.cta} <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Real Case Studies ─── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-3" style={{ borderColor: NV, color: NV }}>
                Real-World Deployments
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">ตัวอย่างการใช้งานจริง</h2>
              <p className="text-muted-foreground mt-3">โครงการ Edge AI ที่ใช้งานจริงในประเทศไทยและภูมิภาค</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {cases.map((c) => (
                <Card key={c.title} className="overflow-hidden group hover:shadow-2xl transition-all flex flex-col border-border/60">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={c.image} alt={c.title} loading="lazy" width={768} height={512}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <Badge className="absolute top-3 left-3 backdrop-blur bg-background/80 text-foreground border-border text-[10px]">
                      <Tag className="w-3 h-3 mr-1" style={{ color: NV }} />
                      {c.tag}
                    </Badge>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-4">{c.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.chips.map((ch) => (
                        <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded font-medium border"
                          style={{ borderColor: `${NV}55`, color: NV }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                    <Link to="/quote" className="text-xs font-semibold flex items-center gap-1 group/link" style={{ color: NV }}>
                      ปรึกษาโครงการคล้ายกัน
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why ENT trust ─── */}
        <section className="py-12 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                { t: "Authorized NVIDIA Partner", d: "พาร์ทเนอร์อย่างเป็นทางการ สินค้ารับประกันแท้ 100%" },
                { t: "ทีมวิศวกร AI พร้อม POC ฟรี", d: "ทดสอบความเป็นไปได้ก่อนซื้อ ไม่มีค่าใช้จ่าย" },
                { t: "บริการครบวงจรในไทย", d: "ออกแบบ ส่งมอบ ติดตั้ง อบรม และซัพพอร์ตหลังการขาย" },
              ].map((x) => (
                <div key={x.t} className="text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: NV }} />
                  <h3 className="font-bold text-foreground mb-1">{x.t}</h3>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              มีโครงการในใจ? คุยกับทีมวิศวกรของเราได้เลย
            </h2>
            <p className="text-muted-foreground mb-6">
              ENT Group — Authorized NVIDIA Partner ในประเทศไทย พร้อมให้คำปรึกษาและทำ POC ฟรี
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
              <Link to="/quote"><Button size="lg" variant="outline">ขอใบเสนอราคา</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <B2BWorkflowBanner showShopCta />
      <JetsonCTABar message="อยากทำเคสคล้ายกันนี้? เริ่มที่นี่" />
      <Footer />
    </>
  );
}
