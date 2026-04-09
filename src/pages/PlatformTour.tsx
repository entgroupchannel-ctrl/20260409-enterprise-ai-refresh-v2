import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, FileText, Send, Eye, MessageSquare, Shield,
  ClipboardList, Truck, CreditCard, BarChart3, Bell, Search,
  Heart, UserCheck, Headphones, ArrowRight, CheckCircle2,
  Package, Receipt, FileCheck, Users, Zap, Clock, ChevronRight, ArrowLeft,
  Monitor, Lock, Globe, Home, User, LogIn, UserPlus, LogOut,
  FolderOpen, Bot, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import FooterCompact from "@/components/FooterCompact";
import ThemeToggle from "@/components/ThemeToggle";
import AIChatWidget from "@/components/AIChatWidget";
import QuoteCartButton from "@/components/QuoteCartButton";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo-entgroup.avif";

/* ═══════════════════════════════════════════════════════════
 * Platform Tour — B2B Industrial Platform
 * เล่าเรื่องว่าระบบทำอะไรได้บ้าง พร้อม placeholder สำหรับ screenshot
 * ═══════════════════════════════════════════════════════════ */

/* ── Section: User Features ── */
const userFeatures = [
  {
    id: "browse",
    icon: Search,
    title: "ค้นหาและเปรียบเทียบสินค้า",
    desc: "เรียกดูสินค้ากว่า 200+ รุ่น พร้อมตัวกรองสเปก เปรียบเทียบราคาและคุณสมบัติ ช่วยให้คุณเลือกรุ่นที่เหมาะกับงานได้รวดเร็ว",
    details: [
      "ตัวกรองตามหมวดหมู่ ซีรีส์ ช่วงราคา",
      "ดู Datasheet PDF ได้ทันทีบนเว็บ",
      "ระบบแนะนำสินค้า Product Advisor",
    ],
    screenshotPlaceholder: "หน้า Product Catalog + Filter",
    screenshot: "/images/platform/product-catalog.png",
  },
  {
    id: "wishlist",
    icon: Heart,
    title: "บันทึกรายการโปรด",
    desc: "กดหัวใจเพื่อเก็บสินค้าที่สนใจไว้ดูทีหลัง เปรียบเทียบ shortlist ก่อนตัดสินใจ",
    details: [
      "บันทึกได้ไม่จำกัดจำนวน",
      "ดูรายการโปรดจากทุกหน้า",
      "ส่งต่อให้ทีมจัดซื้อได้ทันที",
    ],
    screenshotPlaceholder: "หน้า Wishlist",
    screenshot: "/images/platform/wishlist.png",
  },
  {
    id: "quote-create",
    icon: ClipboardList,
    title: "สร้างใบเสนอราคาด้วยตัวเอง",
    desc: "เลือกสินค้าจาก Catalog หรือเพิ่มรายการเอง กำหนดจำนวนและราคา บันทึก Draft แก้ไขได้ไม่จำกัด ก่อนส่งให้ทีมขาย",
    details: [
      "เลือกสินค้าจาก Catalog พร้อมราคาอ้างอิง",
      "เพิ่มรายการ Custom ได้ไม่จำกัด",
      "บันทึก Draft → แก้ไข → ส่งเมื่อพร้อม",
      "ยืนยันก่อนส่งด้วย Dialog ปลอดภัย",
    ],
    screenshotPlaceholder: "หน้า สร้างใบเสนอราคา",
    screenshot: "/images/platform/quote-create.png",
  },
  {
    id: "quote-track",
    icon: Eye,
    title: "ติดตามสถานะใบเสนอราคา",
    desc: "ดูสถานะแบบ Real-time ตั้งแต่ร่าง → ส่ง → ทีมขายตรวจสอบ → อนุมัติ → สั่งซื้อ พร้อม Timeline แสดงทุกขั้นตอน",
    details: [
      "Milestone Timeline แสดง 5 ขั้นตอน",
      "เปิดดูรายละเอียดเอกสารที่ส่งแล้วในโหมด Read-only",
      "แจ้งเตือนเมื่อสถานะเปลี่ยน",
    ],
    screenshotPlaceholder: "หน้า ใบเสนอราคาของฉัน + Timeline",
    screenshot: "/images/platform/quote-track.png",
  },
  {
    id: "negotiate",
    icon: MessageSquare,
    title: "สนทนาและต่อรองกับทีมขาย",
    desc: "ช่องทางสื่อสารตรงในระบบ ถาม-ตอบเรื่องราคา สเปก เงื่อนไข โดยไม่ต้องออกจากหน้าเว็บ",
    details: [
      "พิมพ์ข้อความตอบกลับได้ทันที",
      "ทีมขายตอบภายใน 2 ชั่วโมง (วันทำการ)",
      "ประวัติสนทนาเก็บไว้ตลอด",
    ],
    screenshotPlaceholder: "ส่วน สนทนา/ต่อรอง ในหน้าใบเสนอราคา",
    screenshot: "/images/platform/negotiation.png",
  },
  {
    id: "po-upload",
    icon: FileCheck,
    title: "อัปโหลด PO / ยืนยันสั่งซื้อ",
    desc: "เมื่อราคาตกลงกันแล้ว อัปโหลด PO ได้ทันทีในระบบ พร้อมยืนยันสั่งซื้อด้วยคลิกเดียว",
    details: [
      "อัปโหลดไฟล์ PO (PDF, รูปภาพ)",
      "กดยืนยันสั่งซื้อได้จากหน้ารายการ",
      "ระบบแจ้ง Admin อัตโนมัติ",
    ],
    screenshotPlaceholder: "ส่วน Upload PO + ปุ่มยืนยัน",
    screenshot: "/images/platform/po-upload.png",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "แจ้งเตือนอัจฉริยะ",
    desc: "รับการแจ้งเตือนทันทีเมื่อมีการเปลี่ยนแปลง ไม่ว่าจะเป็นใบเสนอราคาอนุมัติ สินค้าพร้อมส่ง หรือมีข้อความใหม่",
    details: [
      "แจ้งเตือนในระบบ (กระดิ่ง)",
      "อีเมลอัตโนมัติ",
      "สรุปรายวัน (กำลังพัฒนา)",
    ],
    screenshotPlaceholder: "Notification Bell + รายการแจ้งเตือน",
    screenshot: "/images/platform/notifications-illust.png",
  },
  {
    id: "account",
    icon: UserCheck,
    title: "จัดการบัญชีของฉัน",
    desc: "ศูนย์รวมข้อมูลส่วนตัว ประวัติใบเสนอราคา คำสั่งซื้อ เอกสาร และรายการโปรด ในหน้าเดียว",
    details: [
      "แก้ไขโปรไฟล์ ชื่อบริษัท เลขประจำตัวผู้เสียภาษี",
      "ดูประวัติ Quote / Order ทั้งหมด",
      "ขอเอกสาร ใบรับประกัน ใบกำกับภาษี",
    ],
    screenshotPlaceholder: "หน้า My Account Overview",
    screenshot: "/images/platform/account-illust.png",
  },
];

/* ── Section: Admin Behind the Scenes ── */
const adminFeatures = [
  {
    icon: Users,
    title: "จัดการรายชื่อลูกค้า",
    desc: "ระบบ CRM เก็บข้อมูลลูกค้า ประวัติติดต่อ Lead Score ติดตาม SLA ไม่พลาดทุกโอกาสขาย",
  },
  {
    icon: FileText,
    title: "ตรวจสอบ & อนุมัติใบเสนอราคา",
    desc: "ทีมขายตรวจสอบราคา ปรับเงื่อนไข อนุมัติหรือส่งกลับพร้อมคอมเมนต์ ภายใน 2 ชั่วโมง",
  },
  {
    icon: Receipt,
    title: "ออกเอกสาร Sales Order → Invoice",
    desc: "ออกใบสั่งซื้อ ใบวางบิล ใบแจ้งหนี้ ต่อเนื่องจากใบเสนอราคาที่อนุมัติ ลดงานซ้ำซ้อน",
  },
  {
    icon: Truck,
    title: "ใบส่งสินค้า & ติดตามจัดส่ง",
    desc: "บันทึกเลขพัสดุ วันจัดส่ง Serial Number ลูกค้าตรวจสอบสถานะได้ทุกเวลา",
  },
  {
    icon: CreditCard,
    title: "บันทึกการชำระเงิน",
    desc: "ยืนยันสลิปโอนเงิน บันทึกยอดชำระ ตรวจสอบยอดค้าง จัดการ Payment Records ครบถ้วน",
  },
  {
    icon: BarChart3,
    title: "วิเคราะห์และรายงาน",
    desc: "Dashboard สรุปยอดขาย Engagement สินค้ายอดนิยม Lead ใหม่ ช่วยวางแผนธุรกิจ",
  },
  {
    icon: Headphones,
    title: "Live Chat & AI Chat",
    desc: "แชทตอบคำถามลูกค้าแบบ Real-time พร้อม AI ช่วยตอบคำถามพื้นฐานโดยอัตโนมัติ",
  },
  {
    icon: Package,
    title: "คลังสินค้า & Catalog",
    desc: "จัดการ Catalog กว่า 200+ รุ่น ตั้งราคา จัดหมวดหมู่ อัปเดตสต๊อก จากหน้า Admin เดียว",
  },
];

/* ── Section: Workflow Steps ── */
const workflowSteps = [
  { step: 1, title: "สมัครสมาชิก", desc: "ลงทะเบียนฟรี กรอกข้อมูลบริษัท", icon: UserCheck, color: "text-blue-500" },
  { step: 2, title: "เลือกสินค้า", desc: "ค้นหา เปรียบเทียบ เก็บ Wishlist", icon: Search, color: "text-emerald-500" },
  { step: 3, title: "สร้างใบเสนอราคา", desc: "เลือกรุ่น จำนวน ส่ง Draft", icon: ClipboardList, color: "text-amber-500" },
  { step: 4, title: "ทีมขายตรวจสอบ", desc: "อนุมัติราคาภายใน 2 ชม.", icon: Shield, color: "text-purple-500" },
  { step: 5, title: "ยืนยันสั่งซื้อ", desc: "อัปโหลด PO ยืนยันออเดอร์", icon: Send, color: "text-primary" },
  { step: 6, title: "รับสินค้า", desc: "ติดตามจัดส่ง ตรวจรับ เสร็จสิ้น", icon: Truck, color: "text-rose-500" },
];

const PlatformTour = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Platform Tour — B2B Industrial Platform | ENT Group"
        description="สำรวจความสามารถของแพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร ตั้งแต่เลือกสินค้า สร้างใบเสนอราคา ติดตามสถานะ จนถึงรับสินค้า"
        path="/platform"
      />

      {/* ═══════════════ Hero ═══════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(220,20%,8%)] via-[hsl(220,20%,12%)] to-[hsl(168,40%,12%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(168_80%_38%/0.08),transparent_60%)]" />

        {/* ── Navbar ── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            กลับหน้าหลัก
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="หน้าแรก">
              <Home size={18} />
            </Link>
            <QuoteCartButton />
            <ThemeToggle />
            <button
              onClick={() => setAiChatOpen(true)}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="AI Assistant"
              title="AI ผู้เชี่ยวชาญ"
            >
              <Bot size={18} />
            </button>
            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="บัญชีผู้ใช้"
              >
                <User size={20} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-card border border-border shadow-xl py-1 z-50 animate-fade-in">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border truncate">
                        <span>{user.email}</span>
                        {isAdmin && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                            <Shield size={9} /> {isSuperAdmin ? "Super Admin" : "Admin"}
                          </span>
                        )}
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors">
                          <Shield size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/my-account" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <User size={14} /> บัญชีของฉัน
                      </Link>
                      <Link to="/my-account/quotes" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <FileText size={14} /> ใบเสนอราคา
                      </Link>
                      <Link to="/my-account/documents" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <FolderOpen size={14} /> ศูนย์เอกสาร
                      </Link>
                      <button onClick={async () => { setUserMenuOpen(false); await signOut(); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <LogOut size={14} /> ออกจากระบบ
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/admin-login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <LogIn size={14} /> เข้าสู่ระบบ
                      </Link>
                      <Link to="/member-register" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                        <UserPlus size={14} /> สมัครสมาชิก
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="relative container max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
            <Globe size={14} /> B2B Industrial Platform
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-5">
            แพลตฟอร์มจัดซื้ออุตสาหกรรม
            <br />
            <span className="text-primary">แบบครบวงจร</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8">
            ตั้งแต่ค้นหาสินค้า เปรียบเทียบสเปก สร้างใบเสนอราคา ติดตามสถานะ
            จนถึงรับสินค้า — ทุกขั้นตอนอยู่บนระบบเดียว มีทีมขายคอยช่วยเหลือตลอดเส้นทาง
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/member-register">
              <Button size="lg" className="gap-2 font-bold">
                <UserCheck size={18} /> สมัครสมาชิกฟรี
              </Button>
            </Link>
            <a href="#workflow">
              <Button variant="outline" size="lg" className="gap-2 border-white/40 text-white bg-white/10 hover:bg-white/20 font-bold">
                <Eye size={18} /> ดูขั้นตอนการใช้งาน
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════ Workflow Overview ═══════════════ */}
      <section id="workflow" className="py-16 md:py-20 bg-muted/30 border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              6 ขั้นตอนง่ายๆ จากเลือกสินค้าถึงรับของ
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              ระบบออกแบบมาเพื่อลูกค้าองค์กร ลดขั้นตอนยุ่งยาก ทีมขายคอยช่วยเหลือทุกขั้นตอน
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {workflowSteps.map((s) => (
              <div key={s.step} className="relative group">
                <div className="bg-card border border-border/60 rounded-xl p-4 text-center hover:border-primary/30 hover:shadow-md transition-all h-full">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border mb-3 ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-bold mb-1">STEP {s.step}</div>
                  <h3 className="text-xs font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                {s.step < 6 && (
                  <ChevronRight size={14} className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ User Features ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4">
              <Monitor size={12} /> สำหรับลูกค้า / ฝ่ายจัดซื้อ
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              ฟีเจอร์ที่คุณใช้ได้ทันที
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              ลงทะเบียนแล้วเข้าใช้งานได้เลย ไม่มีค่าใช้จ่าย ไม่ต้องติดตั้งโปรแกรม
            </p>
          </div>

          <div className="space-y-16">
            {userFeatures.map((f, idx) => (
              <div
                key={f.id}
                className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
              >
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <f.icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-primary" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Screenshot or Placeholder */}
                <div className="flex-1 min-w-0 w-full">
                  {f.screenshot ? (
                    <div className="relative rounded-xl border border-border overflow-hidden shadow-lg">
                      <img src={f.screenshot} alt={f.screenshotPlaceholder} className="w-full h-auto" loading="lazy" />
                    </div>
                  ) : (
                    <div className="relative rounded-xl border-2 border-dashed border-border bg-muted/30 aspect-[16/10] flex flex-col items-center justify-center gap-3 p-6">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Monitor size={24} className="text-muted-foreground/50" />
                      </div>
                      <p className="text-xs text-muted-foreground text-center font-medium">
                        📸 {f.screenshotPlaceholder}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50">
                        Screenshot จะถูกเพิ่มในลำดับถัดไป
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ Admin Section ═══════════════ */}
      <section className="py-16 md:py-20 bg-[hsl(220,20%,8%)] text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-4">
              <Lock size={12} /> หลังบ้าน — ทีมขาย ENT Group
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              มีทีมขายคอยช่วยเหลือทุกขั้นตอน
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto">
              ทุกใบเสนอราคาที่คุณส่งเข้ามา จะมีทีมขายตรวจสอบ อนุมัติ และดูแลเอกสารครบวงจร
              ผ่านระบบ Admin Dashboard ที่ออกแบบมาเพื่อบริการลูกค้า B2B โดยเฉพาะ
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {adminFeatures.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <f.icon size={20} className="text-primary mb-3" />
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Admin Dashboard Screenshot */}
          <div className="relative rounded-xl border border-white/10 overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <img src="/images/platform/admin-dashboard-illust.png" alt="Admin Dashboard — ภาพรวมระบบหลังบ้าน" className="w-full h-auto" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══════════════ Trust / Stats ═══════════════ */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "200+", label: "รุ่นสินค้า" },
              { value: "8,000+", label: "รายชื่อลูกค้า" },
              { value: "< 2 ชม.", label: "ตอบกลับใบเสนอราคา" },
              { value: "10+ ปี", label: "ประสบการณ์" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-display font-black text-primary mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            พร้อมเริ่มต้นใช้งาน?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
            สมัครสมาชิกฟรี ไม่มีค่าใช้จ่าย เริ่มสร้างใบเสนอราคาได้ทันที
            ทีมขายพร้อมให้คำปรึกษาทุกขั้นตอน
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/member-register">
              <Button size="lg" className="gap-2 font-bold">
                <Zap size={18} /> สมัครสมาชิกฟรี
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="gap-2">
                <Headphones size={18} /> ติดต่อทีมขาย
              </Button>
            </Link>
            <Link to="/product-advisor">
              <Button variant="ghost" size="lg" className="gap-2">
                ช่วยเลือกสินค้า <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterCompact />
      <AIChatWidget open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
};

export default PlatformTour;
