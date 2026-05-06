import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen, Layers, Globe2, Award,
  Monitor, Volume2, Usb, MousePointerClick, Settings2, Zap,
  Server, Cpu, GraduationCap, Building2, Factory, HeadphonesIcon,
  DollarSign, Gauge, Smile, ShieldCheck,
} from "lucide-react";

/**
 * VCloudPointLearnMore — Tabs ความรู้เสริม (อ้างอิงโครงสร้าง vcloudpoint.com)
 * วางต่อท้ายเนื้อหาเดิม ก่อน Final CTA — ไม่แทนที่ของเดิม
 */
const VCloudPointLearnMore = () => {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">
            Learn More · ทำความรู้จัก vCloudPoint เชิงลึก
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            เข้าใจเทคโนโลยี Zero Client ใน 4 หัวข้อ
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            อ้างอิงเนื้อหาทางเทคนิคจาก vCloudPoint โดยตรง — เพื่อช่วยให้ทีม IT
            และผู้ตัดสินใจเข้าใจภาพรวมก่อนเลือกใช้งาน
          </p>
        </div>

        <Tabs defaultValue="shared" className="w-full">
          <TabsList className="h-auto flex-wrap gap-1 bg-secondary/40 mb-6 justify-center w-full">
            <TabsTrigger value="shared" className="text-xs md:text-sm gap-1.5">
              <BookOpen className="w-4 h-4" /> Shared Computing คืออะไร?
            </TabsTrigger>
            <TabsTrigger value="solutions" className="text-xs md:text-sm gap-1.5">
              <Layers className="w-4 h-4" /> RDS vs VDI
            </TabsTrigger>
            <TabsTrigger value="cases" className="text-xs md:text-sm gap-1.5">
              <Globe2 className="w-4 h-4" /> Use Cases ทั่วโลก
            </TabsTrigger>
            <TabsTrigger value="why" className="text-xs md:text-sm gap-1.5">
              <Award className="w-4 h-4" /> Why vCloudPoint
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Shared Computing ── */}
          <TabsContent value="shared" className="mt-0 space-y-8">
            <div className="card-surface p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                Shared Computing — 1 PC รองรับได้ถึง 30 Users
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                vCloudPoint Shared Computing คือโซลูชันที่ให้ผู้ใช้หลายคนแชร์ทรัพยากรของ
                Host PC หรือ Server เพียงเครื่องเดียว ผู้ใช้แต่ละคนทำงานได้อย่างอิสระ
                แต่ใช้ระบบปฏิบัติการและแอปพลิเคชันชุดเดียวกันที่ติดตั้งบน Host
                — ลดการลงทุน Hardware ลง 60% และง่ายต่อการบริหารจัดการแบบรวมศูนย์
              </p>
            </div>

            <div>
              <h4 className="text-lg font-display font-bold text-foreground mb-4">
                Dynamic Desktop Protocol (DDP) — ประสบการณ์ระดับ Full-Fidelity
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: Monitor, title: "Full HD Video", desc: "เล่นวิดีโอ 1080p ลื่น ไม่กระตุก รองรับ YouTube และสื่อการสอน" },
                  { icon: Volume2, title: "High Quality Audio", desc: "เสียงสองทิศทาง คุณภาพสูง รองรับ VoIP, Conference Call" },
                  { icon: Usb, title: "Broad USB Devices", desc: "Plug-and-Play อุปกรณ์ USB หลากหลาย: Printer, Scanner, Storage" },
                ].map((f) => (
                  <div key={f.title} className="card-surface p-5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="font-bold text-foreground mb-1">{f.title}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-display font-bold text-foreground mb-4">
                ติดตั้งง่ายกว่าที่คิด
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: MousePointerClick, title: "Simple Installation", desc: "ติดตั้ง vMatrix Software บน Host PC ใน 1 คลิก" },
                  { icon: Settings2, title: "Zero Configuration", desc: "ไม่ต้องตั้งค่า IP, ไม่ต้องลง Driver — ใช้งานได้ทันที" },
                  { icon: Zap, title: "Plug & Play Devices", desc: "เสียบสายแล้วเปิดเครื่อง พร้อมใช้งานในไม่กี่วินาที" },
                ].map((f) => (
                  <div key={f.title} className="card-surface p-5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="font-bold text-foreground mb-1">{f.title}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ── Tab 2: RDS vs VDI ── */}
          <TabsContent value="solutions" className="mt-0">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card-surface p-6 md:p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Shared Computing (RDS)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  RDS (Remote Desktop Services) ให้ผู้ใช้หลายคนแชร์ทรัพยากรของ Host PC
                  หรือ Server เครื่องเดียว ผู้ใช้ทำงานอิสระแต่ใช้ OS และแอปชุดเดียวกัน
                  เหมาะสำหรับงานออฟฟิศทั่วไป โรงเรียน และห้อง Lab
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>ต้นทุนต่ำที่สุด — Host เดียวพอ</span></li>
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>ติดตั้งและดูแลง่าย</span></li>
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>เหมาะกับ User 5–30 คนต่อ Host</span></li>
                </ul>
              </div>

              <div className="card-surface p-6 md:p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Virtual Desktop Infrastructure (VDI)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  VDI ให้ผู้ใช้ทำงานบน Virtual Desktop ที่รันใน VM ของตัวเอง —
                  มี OS และแอปแยกอิสระ ประสบการณ์เหมือนใช้ PC ส่วนตัว
                  เหมาะสำหรับงานที่ต้องการความเป็นส่วนตัวหรือ App ที่แยก License
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>แยก OS / App รายผู้ใช้</span></li>
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>ความปลอดภัยสูง แยก Process</span></li>
                  <li className="flex gap-2"><span className="text-primary">✓</span><span>เหมาะกับองค์กรที่ต้องการ Compliance</span></li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab 3: Use Cases ทั่วโลก ── */}
          <TabsContent value="cases" className="mt-0">
            <p className="text-sm text-muted-foreground text-center mb-6">
              vCloudPoint ให้บริการลูกค้าทั่วโลกในหลากหลายอุตสาหกรรม
              ตั้งแต่องค์กรขนาดเล็กไปจนถึงองค์กรขนาดใหญ่
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: GraduationCap, title: "Education", desc: "Quick provisioning, desktop broadcasting, remote support, file sharing — รองรับการเรียนการสอน" },
                { icon: Building2, title: "Office", desc: "ประสบการณ์ใช้งานดี จัดการ Desktop และข้อมูลง่าย เพิ่ม Productivity ของออฟฟิศ" },
                { icon: Factory, title: "Manufacturing", desc: "ดีไซน์กะทัดรัด ทนสภาพแวดล้อมโรงงาน เก็บข้อมูลรวมศูนย์ปลอดภัย" },
                { icon: HeadphonesIcon, title: "Call Center", desc: "Workspace มาตรฐานเดียวกัน เพิ่มประสิทธิภาพ IT และความปลอดภัยข้อมูล" },
              ].map((c) => (
                <div key={c.title} className="card-surface p-5 rounded-xl text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 mx-auto">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-bold text-foreground mb-2">{c.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── Tab 4: Why vCloudPoint ── */}
          <TabsContent value="why" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: DollarSign,
                  title: "Competitive Price",
                  desc: "ราคาคุ้มค่ากว่า Thin Client / Zero Client เจ้าอื่น และถูกกว่า Desktop PC ครึ่งหนึ่ง — ได้ Software บริหารจัดการครบ ฟรีตลอดอายุการใช้งาน รวมแล้วลดต้นทุนได้ถึง 1/3 ของระบบดั้งเดิม",
                },
                {
                  icon: Gauge,
                  title: "High Performance",
                  desc: "ใช้ Dynamic Desktop Protocol (DDP) ที่พัฒนาขึ้นเองโดยเฉพาะสำหรับ Centralized Computing ให้ประสบการณ์ระดับเดียวกับ PC ทั่วไป — ดีกว่า RemoteFX มาตรฐาน",
                },
                {
                  icon: Smile,
                  title: "Friendly Experience",
                  desc: "ออกแบบให้ใช้งานเข้าใจง่าย — One-key Installation, Zero Configuration, Plug-and-Play, Management Console ที่ชัดเจน ทีม IT ทำงานเบาขึ้นมาก",
                },
                {
                  icon: ShieldCheck,
                  title: "Thumbs-up Services",
                  desc: "รับประกัน 3+ ปี พร้อมบริการหลังการขายฟรีจาก ENT Group และพาร์ทเนอร์ในไทย — Software Updates ฟรีตลอดอายุการใช้งาน",
                },
              ].map((w) => (
                <div key={w.title} className="card-surface p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <w.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-foreground">{w.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default VCloudPointLearnMore;
