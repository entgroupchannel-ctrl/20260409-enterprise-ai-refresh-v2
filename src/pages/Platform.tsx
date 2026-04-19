import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  UserPlus, Search, FileText, ShieldCheck, ClipboardCheck, Truck,
  Heart, MessageSquare, Upload, Bell, User, Users, FileCheck,
  Receipt, Send, Wallet, BarChart3, Headphones, Package,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import platformHero from "@/assets/platform-hero.jpg";

const STEPS = [
  { n: "01", icon: UserPlus, title: "สมัครสมาชิก", desc: "ลงทะเบียนฟรี กรอกข้อมูลบริษัท" },
  { n: "02", icon: Search, title: "เลือกสินค้า", desc: "ค้นหา เปรียบเทียบ เก็บ Wishlist" },
  { n: "03", icon: FileText, title: "สร้างใบเสนอราคา", desc: "เลือกรุ่น จำนวน ส่ง Draft" },
  { n: "04", icon: ShieldCheck, title: "ทีมขายตรวจสอบ", desc: "อนุมัติราคาภายใน 2 ชม." },
  { n: "05", icon: ClipboardCheck, title: "ยืนยันสั่งซื้อ", desc: "อัปโหลด PO ยืนยันออเดอร์" },
  { n: "06", icon: Truck, title: "รับสินค้า", desc: "ติดตามจัดส่ง ตรวจรับ เสร็จสิ้น" },
];

const FEATURES = [
  {
    icon: Search,
    title: "ค้นหาและเปรียบเทียบสินค้า",
    desc: "เรียกดูสินค้ากว่า 200+ รุ่น พร้อมตัวกรองสเปก เปรียบเทียบราคาและคุณสมบัติ ช่วยให้คุณเลือกรุ่นที่เหมาะกับงานได้รวดเร็ว",
    points: ["ตัวกรองตามหมวดหมู่ ซีรีส์ ช่วงราคา", "ดู Datasheet PDF ได้ทันทีบนเว็บ", "ระบบแนะนำสินค้า Product Advisor"],
    href: "/shop",
    image: "/images/platform/product-catalog.png",
  },
  {
    icon: Heart,
    title: "บันทึกรายการโปรด",
    desc: "กดหัวใจเพื่อเก็บสินค้าที่สนใจไว้ดูทีหลัง เปรียบเทียบ shortlist ก่อนตัดสินใจ",
    points: ["บันทึกได้ไม่จำกัดจำนวน", "ดูรายการโปรดจากทุกหน้า", "ส่งต่อให้ทีมจัดซื้อได้ทันที"],
    href: "/shop/compare",
    image: "/images/platform/wishlist.png",
  },
  {
    icon: FileText,
    title: "สร้างใบเสนอราคาด้วยตัวเอง",
    desc: "เลือกสินค้าจาก Catalog หรือเพิ่มรายการเอง กำหนดจำนวนและราคา บันทึก Draft แก้ไขได้ไม่จำกัด ก่อนส่งให้ทีมขาย",
    points: [
      "เลือกสินค้าจาก Catalog พร้อมราคาอ้างอิง",
      "เพิ่มรายการ Custom ได้ไม่จำกัด",
      "บันทึก Draft → แก้ไข → ส่งเมื่อพร้อม",
      "ยืนยันก่อนส่งด้วย Dialog ปลอดภัย",
    ],
    href: "/request-quote",
    image: "/images/platform/quote-create.png",
  },
  {
    icon: ClipboardCheck,
    title: "ติดตามสถานะใบเสนอราคา",
    desc: "ดูสถานะแบบ Real-time ตั้งแต่ร่าง → ส่ง → ทีมขายตรวจสอบ → อนุมัติ → สั่งซื้อ พร้อม Timeline แสดงทุกขั้นตอน",
    points: ["Milestone Timeline แสดง 5 ขั้นตอน", "เปิดดูรายละเอียดเอกสารที่ส่งแล้ว", "แจ้งเตือนเมื่อสถานะเปลี่ยน"],
    href: "/my/quotes",
    image: "/images/platform/quote-track.png",
  },
  {
    icon: MessageSquare,
    title: "สนทนาและต่อรองกับทีมขาย",
    desc: "ช่องทางสื่อสารตรงในระบบ ถาม-ตอบเรื่องราคา สเปก เงื่อนไข โดยไม่ต้องออกจากหน้าเว็บ",
    points: ["พิมพ์ข้อความตอบกลับได้ทันที", "ทีมขายตอบภายใน 2 ชั่วโมง (วันทำการ)", "ประวัติสนทนาเก็บไว้ตลอด"],
    href: "/my/quotes",
    image: "/images/platform/negotiation.png",
  },
  {
    icon: Upload,
    title: "อัปโหลด PO / ยืนยันสั่งซื้อ",
    desc: "เมื่อราคาตกลงกันแล้ว อัปโหลด PO ได้ทันทีในระบบ พร้อมยืนยันสั่งซื้อด้วยคลิกเดียว",
    points: ["อัปโหลดไฟล์ PO (PDF, รูปภาพ)", "กดยืนยันสั่งซื้อได้จากหน้ารายการ", "ระบบแจ้ง Admin อัตโนมัติ"],
    href: "/my/quotes",
    image: "/images/platform/po-upload.png",
  },
  {
    icon: Bell,
    title: "แจ้งเตือนอัจฉริยะ",
    desc: "รับการแจ้งเตือนทันทีเมื่อมีการเปลี่ยนแปลง ไม่ว่าจะเป็นใบเสนอราคาอนุมัติ สินค้าพร้อมส่ง หรือมีข้อความใหม่",
    points: ["แจ้งเตือนในระบบ (กระดิ่ง)", "อีเมลอัตโนมัติ", "สรุปรายวัน (กำลังพัฒนา)"],
    href: "/notifications",
    image: "/images/platform/notifications-illust.png",
  },
  {
    icon: User,
    title: "จัดการบัญชีของฉัน",
    desc: "ศูนย์รวมข้อมูลส่วนตัว ประวัติใบเสนอราคา คำสั่งซื้อ เอกสาร และรายการโปรด ในหน้าเดียว",
    points: ["แก้ไขโปรไฟล์ ชื่อบริษัท เลขประจำตัวผู้เสียภาษี", "ดูประวัติ Quote / Order ทั้งหมด", "ขอเอกสาร ใบรับประกัน ใบกำกับภาษี"],
    href: "/my",
    image: "/images/platform/account-illust.png",
  },
];

const ADMIN_FEATURES = [
  { icon: Users, title: "จัดการรายชื่อลูกค้า", desc: "ระบบ CRM เก็บข้อมูลลูกค้า ประวัติติดต่อ Lead Score ติดตาม SLA ไม่พลาดทุกโอกาสขาย" },
  { icon: FileCheck, title: "ตรวจสอบ & อนุมัติใบเสนอราคา", desc: "ทีมขายตรวจสอบราคา ปรับเงื่อนไข อนุมัติหรือส่งกลับพร้อมคอมเมนต์ ภายใน 2 ชั่วโมง" },
  { icon: Receipt, title: "ออกเอกสาร Sales Order → Invoice", desc: "ออกใบสั่งซื้อ ใบวางบิล ใบแจ้งหนี้ ต่อเนื่องจากใบเสนอราคาที่อนุมัติ ลดงานซ้ำซ้อน" },
  { icon: Send, title: "ใบส่งสินค้า & ติดตามจัดส่ง", desc: "บันทึกเลขพัสดุ วันจัดส่ง Serial Number ลูกค้าตรวจสอบสถานะได้ทุกเวลา" },
  { icon: Wallet, title: "บันทึกการชำระเงิน", desc: "ยืนยันสลิปโอนเงิน บันทึกยอดชำระ ตรวจสอบยอดค้าง จัดการ Payment Records ครบถ้วน" },
  { icon: BarChart3, title: "วิเคราะห์และรายงาน", desc: "Dashboard สรุปยอดขาย Engagement สินค้ายอดนิยม Lead ใหม่ ช่วยวางแผนธุรกิจ" },
  { icon: Headphones, title: "Live Chat & AI Chat", desc: "แชทตอบคำถามลูกค้าแบบ Real-time พร้อม AI ช่วยตอบคำถามพื้นฐานโดยอัตโนมัติ" },
  { icon: Package, title: "คลังสินค้า & Catalog", desc: "จัดการ Catalog กว่า 200+ รุ่น ตั้งราคา จัดหมวดหมู่ อัปเดตสต๊อก จากหน้า Admin เดียว" },
];

const STATS = [
  { value: "200+", label: "รุ่นสินค้า" },
  { value: "8,000+", label: "รายชื่อลูกค้า" },
  { value: "< 2 ชม.", label: "ตอบกลับใบเสนอราคา" },
  { value: "10+ ปี", label: "ประสบการณ์" },
];

export default function Platform() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมครบวงจร | ENT Group</title>
        <meta
          name="description"
          content="แพลตฟอร์ม B2B จัดซื้ออุตสาหกรรมครบวงจร ตั้งแต่ค้นหาสินค้า เปรียบเทียบ สร้างใบเสนอราคา ติดตามสถานะ จนถึงรับสินค้า — ทุกขั้นตอนอยู่บนระบบเดียว"
        />
        <link rel="canonical" href="https://www.entgroup.co.th/platform" />
      </Helmet>

      <SiteNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-background">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-8 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-5 border-primary/30 text-primary">
                B2B Industrial Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                แพลตฟอร์มจัดซื้ออุตสาหกรรม
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  แบบครบวงจร
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ตั้งแต่ค้นหาสินค้า เปรียบเทียบสเปก สร้างใบเสนอราคา ติดตามสถานะ จนถึงรับสินค้า —
                ทุกขั้นตอนอยู่บนระบบเดียว มีทีมขายคอยช่วยเหลือตลอดเส้นทาง
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link to="/auth/register">สมัครสมาชิกฟรี <ArrowRight className="ml-1.5 w-4 h-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                  <a href="#workflow">ดูขั้นตอนการใช้งาน</a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> ลงทะเบียนฟรี</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> ไม่มีค่าติดตั้ง</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> ทีมขายตอบใน 2 ชม.</span>
              </div>
            </div>

            {/* Hero illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-orange-500/10 blur-2xl rounded-[2rem]" />
              <div className="relative rounded-3xl overflow-hidden border bg-card shadow-2xl">
                <img
                  src={platformHero}
                  alt="ภาพประกอบแพลตฟอร์มจัดซื้ออุตสาหกรรม B2B — Quote, Cart, Chat, Notification"
                  width={1280}
                  height={960}
                  className="w-full h-auto"
                />
              </div>
              {/* Floating stat chip */}
              <div className="hidden md:flex absolute -bottom-5 -left-5 bg-card border rounded-2xl shadow-lg px-4 py-3 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ลูกค้าองค์กรใช้งาน</div>
                  <div className="text-lg font-bold">8,000+ บริษัท</div>
                </div>
              </div>
              <div className="hidden md:flex absolute -top-4 -right-4 bg-card border rounded-2xl shadow-lg px-4 py-3 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">ตอบกลับใบเสนอราคา</div>
                  <div className="text-lg font-bold">&lt; 2 ชั่วโมง</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Steps */}
      <section id="workflow" className="container max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">6 ขั้นตอนง่ายๆ จากเลือกสินค้าถึงรับของ</h2>
          <p className="text-muted-foreground">ระบบออกแบบมาเพื่อลูกค้าองค์กร ลดขั้นตอนยุ่งยาก ทีมขายคอยช่วยเหลือทุกขั้นตอน</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STEPS.map(({ n, icon: Icon, title, desc }) => (
            <div
              key={n}
              className="group relative rounded-2xl border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-muted-foreground tracking-wider mb-1">STEP {n}</div>
                  <h3 className="text-lg font-bold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Features */}
      <section className="border-y bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">สำหรับลูกค้า / ฝ่ายจัดซื้อ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">ฟีเจอร์ที่คุณใช้ได้ทันที</h2>
            <p className="text-muted-foreground">ลงทะเบียนแล้วเข้าใช้งานได้เลย ไม่มีค่าใช้จ่าย ไม่ต้องติดตั้งโปรแกรม</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, points, href, image }) => (
              <div key={title} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted/60 to-muted/20 border-b flex items-center justify-center p-3">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain group-hover:scale-[1.03] transition-transform duration-500 rounded-md shadow-sm"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg leading-tight">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={href}
                    className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    ลองใช้ฟีเจอร์นี้ <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin / Sales side */}
      <section className="container max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">หลังบ้าน — ทีมขาย ENT Group</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">มีทีมขายคอยช่วยเหลือทุกขั้นตอน</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            ทุกใบเสนอราคาที่คุณส่งเข้ามา จะมีทีมขายตรวจสอบ อนุมัติ และดูแลเอกสารครบวงจร
            ผ่านระบบ Admin Dashboard ที่ออกแบบมาเพื่อบริการลูกค้า B2B โดยเฉพาะ
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {ADMIN_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border overflow-hidden bg-card shadow-md">
          <img
            src="/images/platform/admin-dashboard.png"
            alt="Admin Dashboard — ภาพรวมระบบหลังบ้าน"
            loading="lazy"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">พร้อมเริ่มต้นใช้งาน?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          สมัครสมาชิกฟรี ไม่มีค่าใช้จ่าย เริ่มสร้างใบเสนอราคาได้ทันที ทีมขายพร้อมให้คำปรึกษาทุกขั้นตอน
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link to="/auth/register">สมัครสมาชิกฟรี <ArrowRight className="ml-1.5 w-4 h-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link to="/contact">ติดต่อทีมขาย</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="rounded-full px-7">
            <Link to="/product-advisor">ช่วยเลือกสินค้า</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
