import { Link } from "react-router-dom";
import LineQRButton from "@/components/LineQRButton";
import SEOHead from "@/components/SEOHead";
import GEOMeta from "@/components/GEOMeta";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "เกี่ยวกับ ENT Group — บริษัท อีเอ็นที กรุ๊ป จำกัด",
  url: "https://www.entgroup.co.th/about",
  mainEntity: {
    "@type": "Organization",
    name: "ENT Group",
    legalName: "บริษัท อีเอ็นที กรุ๊ป จำกัด",
    foundingDate: "2015",
    url: "https://www.entgroup.co.th",
    description: "B2B Industrial Platform — แพลตฟอร์มจัดซื้อ Industrial PC, Mini PC, Panel PC, Rugged Tablet และ Software License สำหรับองค์กร ครบวงจร ประสบการณ์กว่า 10 ปี",
    slogan: "B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร",
    areaServed: "TH",
  },
};
import {
  Headset, ShieldCheck, Users, Handshake, Truck, Award, ArrowLeft,
  Building2, Rocket, Globe, ShoppingCart, Monitor, Cpu, TabletSmartphone,
  Network, Package, TrendingUp,
} from "lucide-react";
import FooterCompact from "@/components/FooterCompact";
import MiniNavbar from "@/components/MiniNavbar";
import heroGrowth from "@/assets/about-hero-growth.jpg";
import entLogoFull from "@/assets/entgroup-logo-full.jpg";

/* ═══════ Timeline Data ═══════ */
const timeline = [
  {
    year: "2558",
    yearEn: "2015",
    title: "ก่อตั้ง ENT Group",
    desc: "จดทะเบียนบริษัท อี เอ็น ที กรุ๊ป จำกัด เริ่มต้นจำหน่าย Mini PC และ Touchscreen Monitor",
    icon: Building2,
  },
  {
    year: "2560",
    yearEn: "2017",
    title: "ขยายสายผลิตภัณฑ์",
    desc: "เพิ่มหมวด Industrial PC, Panel PC และ Software License เข้าสู่ Eco System",
    icon: Package,
  },
  {
    year: "2562",
    yearEn: "2019",
    title: "Authorized Distributor",
    desc: "ได้รับแต่งตั้งเป็นตัวแทนจำหน่ายอย่างเป็นทางการจาก GreenthinPC และ Volktek",
    icon: Award,
  },
  {
    year: "2563",
    yearEn: "2020",
    title: "ขยายช่องทาง Online",
    desc: "เปิดร้านค้าบน Shopee, Lazada และ LINE Official พร้อมระบบ Multi-Platform",
    icon: ShoppingCart,
  },
  {
    year: "2565",
    yearEn: "2022",
    title: "Rugged & Smart Display",
    desc: "เพิ่มหมวด Rugged Tablet/Notebook เกรดทหาร และ Smart Display/KIOSK",
    icon: TabletSmartphone,
  },
  {
    year: "2566",
    yearEn: "2023",
    title: "Network & Security",
    desc: "ขยายสู่ Mini PC Firewall, Industrial Switch และโซลูชัน vCloudPoint Zero Client",
    icon: Network,
  },
  {
    year: "2567",
    yearEn: "2024",
    title: "Edge AI & อุตสาหกรรม 4.0",
    desc: "ขยายสู่ Edge AI Computing, NVIDIA Jetson และ GPU Server สำหรับ Smart Factory",
    icon: Rocket,
  },
  {
    year: "2568",
    yearEn: "2025",
    title: "One-Stop IT Solution",
    desc: "ครบวงจรกว่า 50 รุ่น ลูกค้าองค์กร 8,000+ ราย พร้อม B2B ราคาโรงงาน",
    icon: TrendingUp,
    current: true,
  },
];

/* ═══════ ENT Meaning ═══════ */
const entMeaning = [
  { letter: "E", word: "Entrepreneur", desc: "บุคคลที่แสวงหาหนทางการทำธุรกิจที่ตนเองถนัด" },
  { letter: "N", word: "eNter", desc: "ช่องทางในการเข้าสู่ระบบไอทีอันทันสมัย" },
  { letter: "T", word: "enTerprise", desc: "ระบบไอทีที่องค์กรชั้นนำนิยมใช้งาน" },
];

/* ═══════ Values ═══════ */
const values = [
  { icon: Headset, title: "ผู้เชี่ยวชาญช่วยเลือกสเปก", desc: "ทีมวิศวกรและแอดมินพร้อมให้คำปรึกษา ช่วยเลือกรุ่นที่ตรงกับ TOR และงบประมาณ" },
  { icon: ShieldCheck, title: "รับประกันหลังการขาย 1–3 ปี", desc: "ซ่อม เปลี่ยน ดูแลอย่างมืออาชีพ พร้อมบริการ On-site สำหรับลูกค้าองค์กร" },
  { icon: Users, title: "ลูกค้าองค์กรชั้นนำไว้วางใจ", desc: "หน่วยงานราชการ โรงงาน โรงพยาบาล สถาบันการศึกษา เลือกใช้สินค้าของเราอย่างต่อเนื่อง" },
  { icon: Handshake, title: "B2B ราคาพิเศษสำหรับโครงการ", desc: "สั่งซื้อจำนวนมากราคาดีกว่า พร้อมเทรนนิ่ง ใบเสนอราคาออกได้ภายใน 24 ชม." },
  { icon: Truck, title: "นำเข้าจากโรงงานโดยตรง", desc: "สินค้าคุณภาพจาก GreenthinPC, Winmate, Volktek นำเข้าตรงไม่ผ่านคนกลาง" },
  { icon: Award, title: "Authorized Distributor", desc: "ตัวแทนจำหน่ายอย่างเป็นทางการ สินค้าแท้ 100% สต๊อกในไทยส่งได้ทันที" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="เกี่ยวกับเรา — ENT Group ผู้นำเข้า Industrial PC ครบวงจร"
        description="ENT Group ก่อตั้งปี 2558 — ผู้จัดจำหน่าย Industrial PC, Mini PC, Panel PC, Rugged Tablet และ Edge AI (NVIDIA Jetson) ลูกค้าองค์กร 8,000+ ราย Authorized Distributor GreenthinPC, Winmate, Volktek"
        path="/about"
        keywords="เกี่ยวกับ ENT Group, บริษัทอีเอ็นที กรุ๊ป, ผู้นำเข้า Industrial PC, ตัวแทนจำหน่าย Mini PC, B2B IT solution ไทย"
        jsonLd={aboutJsonLd}
      />
      <GEOMeta
        topic="ประวัติและธุรกิจของ ENT Group ผู้จัดจำหน่ายคอมพิวเตอร์อุตสาหกรรมในประเทศไทย"
        summary="ENT Group (บริษัท อีเอ็นที กรุ๊ป จำกัด) เป็น B2B Industrial Platform ก่อตั้งปี 2558 จำหน่าย Industrial PC, Mini PC, Panel PC, Rugged Tablet, Edge AI (NVIDIA Jetson) และ Software License แบบครบวงจร เป็น Authorized Distributor ของ GreenthinPC, Winmate และ Volktek"
        keyFacts={[
          "ก่อตั้งปี 2558 (2015) มีประสบการณ์ 10+ ปี",
          "ลูกค้าองค์กรกว่า 8,000 ราย ทั้งราชการ โรงงาน โรงพยาบาล สถาบันการศึกษา",
          "Authorized Distributor: GreenthinPC, Winmate, Volktek",
          "ผลิตภัณฑ์: Industrial PC, Mini PC, Panel PC, Rugged Tablet/Notebook, NVIDIA Jetson Edge AI, Zero Client, Industrial Switch, Firewall",
          "บริการ B2B ใบเสนอราคาภายใน 24 ชม. รับประกัน 1-3 ปี พร้อมบริการ on-site",
          "นำเข้าตรงจากโรงงาน ไม่ผ่านคนกลาง",
        ]}
        sourceAuthority="บริษัท อีเอ็นที กรุ๊ป จำกัด (ENT Group) — เว็บไซต์ทางการ"
      />
      <MiniNavbar />
      {/* ═══════ Hero with growth image ═══════ */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden">
        <img
          src={heroGrowth}
          alt="ENTGroup Growth"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={640}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        <div className="relative z-10 container max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            เกี่ยวกับ <span className="text-primary">ENT Group</span>
          </h1>
          <p className="text-white/70 max-w-2xl text-sm md:text-base leading-relaxed">
            บริษัท อีเอ็นที กรุ๊ป จำกัด — แพลตฟอร์มจัดซื้อ Industrial PC สำหรับองค์กร
            ครบทั้งฮาร์ดแวร์ ซอฟต์แวร์ไลเซนส์ และบริการออกแบบติดตั้ง ด้วยประสบการณ์กว่า 10 ปี
          </p>
        </div>
      </section>

      {/* ═══════ ENT Meaning ═══════ */}
      <section className="py-14 px-4 md:px-8">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              <span className="text-gradient">ENT</span> ในความหมายของเรา
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5 items-center">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={entLogoFull}
                alt="ENT Group Logo"
                className="w-32 md:w-40 h-auto"
                loading="lazy"
              />
            </div>
            {/* Meaning cards */}
            {entMeaning.map((item) => (
              <div key={item.letter} className="card-surface rounded-xl p-6 text-center group hover:border-primary/20 transition-all">
                <span className="text-4xl font-display font-black text-primary">{item.letter}</span>
                <h3 className="text-sm font-bold text-foreground mt-2 mb-1">{item.word}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Company Story ═══════ */}
      <section className="py-14 px-4 md:px-8 bg-surface/50">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">Our Story</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              เรื่องราวของ<span className="text-gradient">เรา</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-surface rounded-xl p-6">
              <Globe size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">B2B Industrial Platform — แพลตฟอร์มจัดซื้ออุตสาหกรรมแบบครบวงจร</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                เราคือบริษัทไอทีที่มีทักษะขั้นสูง มีความเชี่ยวชาญเฉพาะด้าน มีภารกิจช่วยเหลือลูกค้าให้มีระบบไอทีที่ทันสมัย
                มีมาตรฐาน ผ่านการนำเข้าสินค้าจากโรงงานโดยตรง ทำให้ต้นทุนและราคาขายประหยัดกว่าเมื่อเทียบกับเจ้าอื่นในตลาด
              </p>
            </div>
            <div className="card-surface rounded-xl p-6">
              <Monitor size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">One-Stop Service — ครบจบที่เดียว</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ผลิตภัณฑ์ที่ครบวงจรทั้งฮาร์ดแวร์ ซอฟต์แวร์ไลเซ่นส์ และงานบริการออกแบบติดตั้ง
                ลูกค้าสามารถคัดสรรเลือกได้จากที่เดียว ภายใต้สโลแกน "B2B Industrial Platform"
                — ร้านคอมพิวเตอร์ที่เลือกซื้อสินค้าเหมาะกับตัวเอง ภายใต้งบประมาณที่กำหนด
              </p>
            </div>
            <div className="card-surface rounded-xl p-6">
              <Cpu size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">ผลิตภัณฑ์หลากหลาย</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Touchscreen Monitor, Mini PC, Industrial PC, Industrial Panel PC, Rugged Tablet, Software License,
                Smart Display, KIOSK, Firewall, Industrial Switch และ Zero Client — ครอบคลุมทุกกลุ่มอุตสาหกรรม
              </p>
            </div>
            <div className="card-surface rounded-xl p-6">
              <ShieldCheck size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">คุณภาพ ราคาสมเหตุสมผล</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                เราไม่เพียงนำเสนอสินค้าและบริการ แต่รับประกันความพึงพอใจสูงสุดให้ลูกค้า
                ทั้งก่อนการขาย ระหว่างการขาย และหลังการขาย — เป้าหมายที่ทำให้เราอยู่ในอุตสาหกรรมนี้อย่างยั่งยืน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Timeline ═══════ */}
      <section className="py-16 px-4 md:px-8 overflow-hidden">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
              Our Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              เส้นทาง<span className="text-gradient">การเติบโต</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              จากจุดเริ่มต้นในปี 2558 สู่โซลูชันไอทีอุตสาหกรรมครบวงจร
            </p>
          </div>

          {/* Horizontal timeline */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />

            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
              <div className="flex gap-0 min-w-max">
                {timeline.map((item, i) => (
                  <div key={item.year} className="flex flex-col items-center w-[140px] md:w-[160px] shrink-0 relative">
                    {/* Circle */}
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center z-10 mb-3 transition-all ${
                      item.current
                        ? "bg-primary border-primary shadow-lg shadow-primary/30"
                        : "bg-background border-primary/40 hover:border-primary/70"
                    }`}>

                      <item.icon size={18} className={item.current ? "text-primary-foreground" : "text-primary/70"} />
                    </div>

                    {/* Year */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-sm font-display font-black ${item.current ? "text-primary" : "text-foreground"}`}>

                        {item.year}
                      </span>
                      {item.current && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-primary text-primary-foreground leading-none">
                          NOW
                        </span>
                      )}
                    </div>

                    {/* Title & desc */}
                    <h3 className="text-[11px] font-bold text-foreground text-center leading-tight mb-1 px-1">
                      {item.title}
                    </h3>
                    <p className="text-[9px] text-muted-foreground text-center leading-relaxed px-2 line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll hint on mobile */}
            <p className="text-center text-[10px] text-muted-foreground/50 mt-2 md:hidden">
              ← เลื่อนดูเพิ่มเติม →
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ Why Choose Us ═══════ */}
      <section className="py-14 px-4 md:px-8 bg-surface/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 block">
              Why Choose Us
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              ทำไมต้อง<span className="text-gradient">เลือกเรา</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card-surface rounded-xl p-6 hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 px-4">
        <div className="container max-w-3xl mx-auto text-center card-surface rounded-2xl p-8 md:p-12">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
            พร้อมเริ่มต้นโครงการ?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            ติดต่อเราวันนี้ รับใบเสนอราคาภายใน 24 ชม. พร้อมคำแนะนำจากผู้เชี่ยวชาญ
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
              ติดต่อเรา
            </Link>
            <LineQRButton
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors">
              LINE @entgroup
            </LineQRButton>
          </div>
        </div>
      </section>

      <FooterCompact />
    </div>
  );
};

export default AboutUs;

