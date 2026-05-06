import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BookOpen, Layers, Globe2, Award, Sparkles, MapPin, Quote, ArrowRight,
  Monitor, Volume2, Usb, MousePointerClick, Settings2, Zap,
  Server, Cpu, GraduationCap, Building2, Factory, HeadphonesIcon,
  DollarSign, Gauge, Smile, ShieldCheck,
} from "lucide-react";

/**
 * VCloudPointLearnMore — Tabs ความรู้เสริม + Case Studies
 * วางต่อท้าย Hero ก่อน Benefits — ไม่แทนที่ของเดิม
 */
const VCloudPointLearnMore = () => {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-y-2 border-primary/20 overflow-hidden">
      {/* decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative">
        {/* Header — ทำให้รู้ว่าเป็นเมนูคลิกได้ */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase shadow-lg shadow-primary/30">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive · คลิกแท็บเพื่อดูเนื้อหา
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground mt-4">
            เข้าใจ <span className="text-primary">vCloudPoint</span> ใน <span className="text-primary">5 มุมมอง</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            แตะแท็บด้านล่างเพื่ออ่านเนื้อหาเชิงลึก พร้อมเรื่องราวความสำเร็จจากลูกค้าจริงทั่วโลก
          </p>
        </div>

        <Tabs defaultValue="cases" className="w-full">
          <TabsList className="h-auto flex-wrap gap-2 bg-card/80 backdrop-blur p-2 mb-8 justify-center w-full border-2 border-primary/30 shadow-xl shadow-primary/10 rounded-2xl">
            <TabsTrigger
              value="cases"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Globe2 className="w-4 h-4" /> Case Studies จริง
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <BookOpen className="w-4 h-4" /> Shared Computing คืออะไร?
            </TabsTrigger>
            <TabsTrigger
              value="solutions"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Layers className="w-4 h-4" /> RDS vs VDI
            </TabsTrigger>
            <TabsTrigger
              value="industries"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Building2 className="w-4 h-4" /> 4 อุตสาหกรรมเด่น
            </TabsTrigger>
            <TabsTrigger
              value="why"
              className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-xl px-4 py-2.5 font-semibold"
            >
              <Award className="w-4 h-4" /> ทำไมต้อง vCloudPoint
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Case Studies (DEFAULT) ── */}
          <TabsContent value="cases" className="mt-0 space-y-6">
            <div className="card-surface p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-widest uppercase mb-2">
                <Quote className="w-4 h-4" /> Worldwide Success Stories
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                ทำไมโรงเรียนและมหาวิทยาลัยทั่วโลกถึงเลือก vCloudPoint?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                vCloudPoint ถูกใช้งานจริงในโรงเรียน มหาวิทยาลัย และองค์กรกว่า{" "}
                <strong className="text-foreground">100 ประเทศทั่วโลก</strong> โดยเฉพาะใน
                ยุโรปตะวันออก (โปแลนด์), เอเชีย, แอฟริกา และอเมริกาใต้ — ที่ต้องการ
                ห้องคอมพิวเตอร์ราคาประหยัด ดูแลง่าย และทนการใช้งานหนัก
              </p>
            </div>

            {/* Case studies cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  flag: "🇵🇱",
                  location: "Lubin, Poland",
                  title: "MKS Zagłębie — โรงเรียนแชมป์แฮนด์บอลแห่งชาติ",
                  story:
                    "ห้อง Lab ภาษาที่นักกีฬาเยาวชนใช้เรียนภาษาต่างประเทศ ระหว่างฝึกซ้อม — ติดตั้งบน Host เครื่องเดียว รองรับนักเรียนทั้งห้องพร้อมกัน ครูควบคุมหน้าจอนักเรียนได้จากศูนย์กลาง",
                  outcome: "ลดค่า PC ลง 60% · ดูแลโดยครู IT คนเดียว",
                },
                {
                  flag: "🇵🇱",
                  location: "Płock, Poland",
                  title: "Karol Szymanowski State School of Music",
                  story:
                    "โรงเรียนดนตรีของรัฐที่ต้องการห้อง Lab สำหรับเรียน Music Production และทฤษฎีดนตรี — เลือก vCloudPoint เพราะเงียบ (ไม่มีพัดลม) ไม่รบกวนการฝึกซ้อมและการอัดเสียง",
                  outcome: "เครื่องเงียบสนิท · ประหยัดไฟ 80%",
                },
                {
                  flag: "🇵🇱",
                  location: "Częstochowa, Poland",
                  title: "Częstochowa University of Technology",
                  story:
                    "มหาวิทยาลัยเทคโนโลยีระดับประเทศ ติดตั้ง vCloudPoint หลายห้อง Lab สำหรับวิชา Programming, CAD เบื้องต้น และวิชาทั่วไป — ทีม IT บริหารจัดการรวมศูนย์ ติดตั้ง Software ครั้งเดียวใช้ได้ทุกเครื่อง",
                  outcome: "หลาย Lab รวมศูนย์ · Update ครั้งเดียวจบ",
                },
                {
                  flag: "🇵🇱",
                  location: "Gołuchów, Poland",
                  title: "โรงเรียนอนุบาลและประถม Gołuchów",
                  story:
                    "โรงเรียนขนาดเล็กในชนบทที่งบประมาณจำกัด แต่ต้องการห้องคอมพิวเตอร์มาตรฐานเดียวกับเมืองใหญ่ — vCloudPoint ทำให้สามารถมี 20 ที่นั่งด้วยงบเท่ากับซื้อ PC ใหม่ 5–6 เครื่อง",
                  outcome: "20 ที่นั่งในงบเท่า 5 เครื่อง PC",
                },
                {
                  flag: "🇵🇱",
                  location: "Marki, Poland",
                  title: "Primary School No. 2 — Home Army Soldiers",
                  story:
                    "โรงเรียนประถมที่ต้องการห้อง Lab รองรับเด็กประถม — ทนทานต่อการใช้งานหนัก ไม่กลัวเด็กถอด-เสียบสาย เพราะ Zero Client ไม่มีฮาร์ดดิสก์ ไม่มีอะไรให้พัง",
                  outcome: "เด็กใช้ได้ ทนทาน · ไม่ต้อง Reset เครื่อง",
                },
                {
                  flag: "🇵🇱",
                  location: "Lenartowice, Poland",
                  title: "Maria Konopnicka Primary School",
                  story:
                    "โรงเรียนประถมในชุมชน ติดตั้งห้องคอม 24 ที่นั่งด้วย Host PC เพียง 1 เครื่อง ครู IT (ที่จริงเป็นครูภาษาโปแลนด์) สามารถดูแลได้เอง โดยไม่ต้องจ้างผู้เชี่ยวชาญ",
                  outcome: "1 Host รองรับ 24 ที่นั่ง · ครูดูแลเอง",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="card-surface rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="text-base">{c.flag}</span>
                    <MapPin className="w-3 h-3" />
                    <span className="font-semibold">{c.location}</span>
                  </div>
                  <h4 className="font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {c.story}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <Sparkles className="w-3 h-3" /> {c.outcome}
                  </div>
                </div>
              ))}
            </div>

            {/* Pattern callout */}
            <div className="card-surface p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30">
              <h4 className="font-display font-bold text-foreground text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                สังเกตเห็น Pattern เดียวกันไหม?
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>โรงเรียน</strong> ทุกระดับ ตั้งแต่อนุบาลถึงมหาวิทยาลัย เลือกใช้เพราะ <strong>งบจำกัด</strong> แต่ต้องการคุณภาพมาตรฐาน</span>
                </div>
                <div className="flex gap-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>ครู IT คนเดียว</strong> ดูแลห้อง Lab ทั้งห้องได้ — ไม่ต้องจ้างผู้เชี่ยวชาญเพิ่ม</span>
                </div>
                <div className="flex gap-2">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>ใช้งานต่อเนื่อง 5–10 ปี</strong> โดยไม่ต้องเปลี่ยนเครื่อง — Update Host ทีเดียวพอ</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Tab: Shared Computing ── */}
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

          {/* ── Tab: RDS vs VDI ── */}
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

          {/* ── Tab: Industries (มี sub-tabs) ── */}
          <TabsContent value="industries" className="mt-0">
            <p className="text-sm text-muted-foreground text-center mb-6">
              vCloudPoint ให้บริการลูกค้าทั่วโลกในหลากหลายอุตสาหกรรม — เลือกหมวดเพื่อดูรายละเอียด
            </p>
            <Tabs defaultValue="edu" className="w-full">
              <TabsList className="h-auto flex-wrap gap-2 bg-card/60 backdrop-blur p-1.5 mb-6 justify-center w-full border border-primary/20 rounded-xl">
                {[
                  { v: "edu", icon: GraduationCap, label: "Education" },
                  { v: "office", icon: Building2, label: "Office" },
                  { v: "mfg", icon: Factory, label: "Manufacturing" },
                  { v: "cc", icon: HeadphonesIcon, label: "Call Center" },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="text-xs md:text-sm gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-3 py-2 font-semibold"
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Education sub-tab — ดึงเรื่องเล่าจาก vcloudpoint.com/work-category/zero-client-for-computer-lab */}
              <TabsContent value="edu" className="mt-0 space-y-6">
                {/* Hero banner */}
                <div className="relative overflow-hidden rounded-2xl card-surface bg-gradient-to-br from-primary/15 via-accent/10 to-transparent p-6 md:p-8">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative grid md:grid-cols-[1fr_auto] gap-4 items-center">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3 shadow-md">
                        <GraduationCap className="w-3 h-3" /> Zero Client for Computer Lab
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-black text-foreground mb-2">
                        ห้องคอมพิวเตอร์โรงเรียน — งบครึ่งเดียว ดูแลคนเดียว
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        จากโรงเรียนอนุบาลในชนบทถึงมหาวิทยาลัยเทคโนโลยีระดับประเทศ —
                        vCloudPoint ถูกเลือกใช้เพราะ <strong className="text-foreground">1 Host PC รองรับได้ 30+ ที่นั่ง</strong>
                        {" "}ครู IT คนเดียวดูแลทั้งห้อง อัปเดตซอฟต์แวร์ครั้งเดียวมีผลทุกเครื่อง ไม่มีฮาร์ดดิสก์ให้พัง
                      </p>
                    </div>
                    <div className="hidden md:flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-background/60 border border-primary/30">
                      <span className="text-3xl font-black text-primary">12+</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Schools in Poland alone</span>
                    </div>
                  </div>
                </div>

                {/* Education case studies grid with images */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/nsp.zaglebie.lubin-3-320x180.jpg",
                      title: "MKS Zagłębie Lubin",
                      type: "ห้อง Lab ภาษา · โรงเรียนแฮนด์บอล",
                      flag: "🇵🇱",
                      story: "นักกีฬาเยาวชนเรียนภาษาต่างประเทศระหว่างฝึก — Host เดียวรองรับทั้งห้อง ครูควบคุมจอนักเรียนได้",
                      tag: "Language Lab",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Karol-Szymanowski-State-School-of-Music-3-320x180.jpg",
                      title: "Karol Szymanowski School of Music",
                      type: "โรงเรียนดนตรีรัฐ · Płock",
                      flag: "🇵🇱",
                      story: "เครื่องเงียบสนิท ไม่มีพัดลม ไม่รบกวนการอัดเสียง — เหมาะกับการสอน Music Production",
                      tag: "Silent · Fanless",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Czestochowa-University-of-Technology-2-320x180.jpg",
                      title: "Częstochowa University of Technology",
                      type: "มหาวิทยาลัยเทคโนโลยี",
                      flag: "🇵🇱",
                      story: "หลายห้อง Lab สำหรับ Programming, CAD เบื้องต้น — ทีม IT บริหารจัดการรวมศูนย์",
                      tag: "Multi-Lab",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/School-kindergarten-in-Goluchow-web-1-320x180.jpg",
                      title: "Gołuchów School & Kindergarten",
                      type: "อนุบาล–ประถม ชนบท",
                      flag: "🇵🇱",
                      story: "20 ที่นั่งด้วยงบเท่ากับซื้อ PC ใหม่เพียง 5–6 เครื่อง — โรงเรียนเล็กก็มี Lab มาตรฐานได้",
                      tag: "Tight Budget",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Primary-School-No.-27-United-Europe-Children-web-1-320x180.jpg",
                      title: "Primary School No. 27 — United European Children",
                      type: "โรงเรียนประถม",
                      flag: "🇵🇱",
                      story: "ห้อง Lab สำหรับเด็กประถม — ทนทานต่อการใช้งานหนัก ไม่กลัวเด็กถอด-เสียบสาย",
                      tag: "Kid-Proof",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Primary-School-No-2-in-Marki-web-3-320x180.jpg",
                      title: "Home Army Soldiers No.2 Primary School",
                      type: "โรงเรียนประถม · Marki",
                      flag: "🇵🇱",
                      story: "ไม่มีฮาร์ดดิสก์ ไม่มีอะไรให้พัง — ครูไม่ต้อง Reset เครื่องทุกวัน",
                      tag: "Zero Maintenance",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Primary-School-in-Lenartowice-web-1-320x180.jpg",
                      title: "Maria Konopnicka Primary School",
                      type: "โรงเรียนประถมในชุมชน",
                      flag: "🇵🇱",
                      story: "1 Host รองรับ 24 ที่นั่ง — ครูภาษาโปแลนด์ดูแลเองได้ ไม่ต้องจ้าง IT เพิ่ม",
                      tag: "1 Host = 24 Seats",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Primary-School-in-G%C5%82uchow-web-1-320x180.jpg",
                      title: "Głuchowo Primary School",
                      type: "โรงเรียนประถม",
                      flag: "🇵🇱",
                      story: "เปลี่ยนห้องคอมเก่าให้เป็นห้องใหม่ — ใช้ Host PC เครื่องเดียว ลงทุนน้อย ใช้งานยาว",
                      tag: "Lab Refresh",
                    },
                    {
                      img: "https://www.vcloudpoint.com/wp-content/uploads/Primary-School-Bohaterow-Westerplatte-in-Czempin-web-1-320x180.jpg",
                      title: "Bohaterów Westerplatte Primary School",
                      type: "โรงเรียนประถม · Czempin",
                      flag: "🇵🇱",
                      story: "Lab พร้อมใช้สอนทั้งวิชาคอมพิวเตอร์และการค้นคว้าออนไลน์ — เปิดเครื่องพร้อมใช้ใน 5 วินาที",
                      tag: "5-sec Boot",
                    },
                  ].map((c) => (
                    <a
                      key={c.title}
                      href="https://www.vcloudpoint.com/work-category/zero-client-for-computer-lab/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group card-surface rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-video overflow-hidden bg-secondary">
                        <img
                          src={c.img}
                          alt={c.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold backdrop-blur">
                          <Sparkles className="w-3 h-3" /> {c.tag}
                        </div>
                        <div className="absolute bottom-2 left-3 right-3 flex items-center gap-1.5 text-xs text-foreground">
                          <span className="text-base">{c.flag}</span>
                          <MapPin className="w-3 h-3 text-primary" />
                          <span className="font-semibold truncate">{c.type}</span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h4 className="font-display font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {c.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{c.story}</p>
                        <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-primary group-hover:gap-2 transition-all">
                          อ่านเรื่องเต็ม <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Why education chooses vCloudPoint */}
                <div className="card-surface p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30">
                  <h4 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    ทำไมโรงเรียนทั่วโลกเลือก vCloudPoint?
                  </h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {[
                      { icon: DollarSign, t: "งบครึ่งเดียวของ PC", d: "Zero Client เครื่องละเศษเสี้ยวของ Desktop ทั่วไป" },
                      { icon: Smile, t: "ครู IT คนเดียวก็ได้", d: "Management Console ใช้ง่าย ไม่ต้องเชี่ยวชาญ" },
                      { icon: Zap, t: "ประหยัดไฟ 80%+", d: "5W ต่อเครื่อง vs 200W ของ PC ทั่วไป" },
                      { icon: ShieldCheck, t: "ทนเด็ก ใช้ได้ 5–10 ปี", d: "ไม่มี HDD/พัดลม ไม่มีอะไรให้พัง" },
                    ].map((b) => (
                      <div key={b.t} className="flex flex-col gap-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                          <b.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-bold text-foreground text-sm">{b.t}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{b.d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Office sub-tab */}
              <TabsContent value="office" className="mt-0">
                <div className="card-surface p-6 md:p-8 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-2">Office Workspace</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Workspace มาตรฐานเดียวกันทุกโต๊ะ — IT ดูแลรวมศูนย์ ลดค่าไฟลง 80% เพิ่ม Productivity ของพนักงาน
                        ข้อมูลทั้งหมดอยู่บน Host ปลอดภัย ไม่กลัวพนักงานก๊อปไฟล์ออกไปกับเครื่องส่วนตัว
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Manufacturing sub-tab */}
              <TabsContent value="mfg" className="mt-0">
                <div className="card-surface p-6 md:p-8 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <Factory className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-2">Manufacturing</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        ดีไซน์กะทัดรัด ติดหลังจอได้ ทนสภาพแวดล้อมโรงงาน — ฝุ่น ความชื้น ความร้อน
                        ข้อมูลการผลิตเก็บรวมศูนย์ปลอดภัย ไม่กระจายอยู่ที่เครื่องของพนักงาน
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Call Center sub-tab */}
              <TabsContent value="cc" className="mt-0">
                <div className="card-surface p-6 md:p-8 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <HeadphonesIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-display font-bold text-foreground mb-2">Call Center</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Workspace มาตรฐานเดียวกันทุก Agent — Audio คุณภาพสูงรองรับ VoIP
                        IT จัดเตรียมเครื่องใหม่ใน 5 นาที (vs 1 ชั่วโมงสำหรับ PC ทั่วไป) ลด Downtime ของ Agent
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* ── Tab: Why vCloudPoint ── */}
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
