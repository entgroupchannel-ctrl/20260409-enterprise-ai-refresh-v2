import { Shield, AlertTriangle, Monitor, Truck, Phone, FileDown, CheckCircle, XCircle } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import GEOMeta from "@/components/GEOMeta";
import bannerImg from "@/assets/banner-warranty.jpg";

const warrantyFaqs = [
  { q: "ENT Group รับประกันสินค้านานเท่าไหร่?", a: "รับประกันมาตรฐาน 1 ปี สำหรับสินค้าทั่วไป และสูงสุด 3 ปีสำหรับ Industrial PC / Panel PC บางรุ่น โดยครอบคลุมการซ่อม-เปลี่ยนอะไหล่ที่เสียจากการใช้งานปกติ" },
  { q: "หน้าจอแตก/ร้าว อยู่ในประกันหรือไม่?", a: "หน้าจอแสดงผลทั่วไปเปลี่ยนได้ 1 ครั้งภายใน 1 ปี โดยไม่มีค่าอะไหล่ ส่วนหน้าจอสัมผัส (Touch Screen) ที่แตก-ร้าว อยู่นอกเหนือการรับประกัน" },
  { q: "สินค้าเสียภายในกี่วันสามารถเปลี่ยนตัวใหม่ได้?", a: "หากสินค้าชำรุด/ใช้งานไม่ได้ภายใน 7 วันหลังรับสินค้า บริษัทจะเปลี่ยนสินค้าตัวใหม่ (รุ่นเดียวกันหรือดีกว่า) ให้ทันที" },
  { q: "ส่งเคลมประกันได้ที่ไหน?", a: "ส่งเคลมที่ ENT Group สำนักงานใหญ่ พร้อมเอกสารแจ้งซ่อมที่ดาวน์โหลดได้จากหน้านี้ หรือติดต่อ LINE @entgroup เพื่อนัดรับสินค้า" },
];

const generalExclusions = [
  "อาการเสียหรือความเสียหายอันเนื่องมาจากของเหลวหรืออาหารหกใส่ผลิตภัณฑ์ หรือภัยธรรมชาติ เช่น ไฟไหม้ น้ำท่วม แผ่นดินไหว หรือใช้แรงดันไฟฟ้าผิดจากที่กำหนด",
  "ความเสียหายจากอุบัติเหตุ การใช้งานผิดวิธี การทดลอง การสาธิต การซ่อมบำรุง การติดตั้ง การดัดแปลงที่ไม่เหมาะสม หรือความประมาทที่เกิดจากการไม่ปฏิบัติตามคู่มือ",
];

const screenWarranty = [
  { type: "covered", text: "หน้าจอแสดงผลเสียหาย เช่น แตก ร้าว หรือใช้งานไม่ปกติ — เปลี่ยนได้ 1 ครั้ง ภายใน 1 ปี โดยไม่มีค่าใช้จ่ายสำหรับอะไหล่" },
  { type: "covered", text: "หมายเลขเครื่องถูกแก้ไข ลบ ขีดฆ่า หรือทำลาย และใบรับประกันถูกแก้ไข — ไม่ครอบคลุม" },
  { type: "excluded", text: "หน้าจอถลอก สีเหลืองจากการตากแดดหรือโดนสารเคมี" },
  { type: "excluded", text: "สัมผัสหน้าจอเพี้ยน ตำแหน่งไม่ตรง จากสภาพแวดล้อมที่ส่งผลให้เสื่อมสภาพ" },
  { type: "excluded", text: "รอยขูดขีดและความเสียหายบนพื้นผิวภายนอกจากการใช้งาน" },
];

const touchScreenWarranty = [
  { type: "excluded", text: "หน้าจอแตก ร้าว หรือใช้งานไม่ปกติ ในช่วงระยะเวลาการรับประกัน — อยู่นอกเหนือการรับประกัน" },
  { type: "excluded", text: "หน้าจอถลอก สีเหลืองจากการตากแดดหรือโดนสารเคมี" },
  { type: "excluded", text: "ใช้งานในกิจกรรมกลางแจ้ง (60–70°C) หรือสภาพเย็นจัด (-10°C, -20°C) เกิดความเสียหาย" },
  { type: "excluded", text: "สัมผัสเพี้ยน ตำแหน่งไม่ตรง จากสภาพแวดล้อม" },
  { type: "excluded", text: "ติดตั้ง OS นอกเหนือจากที่กำหนดในคุณสมบัติสินค้า ทำให้ไม่มี Driver สัมผัสหน้าจอ" },
  { type: "info", text: "กรณีตัวเครื่องมีปัญหาและอยู่ในประกัน แต่ไม่สามารถซ่อมได้ (อะไหล่ขาดตลาด ฯลฯ) — บริษัทฯ เสนอสินค้าทดแทนพร้อมส่วนลดพิเศษ" },
  { type: "info", text: "กรณีหน้าจอหมดประกัน สามารถส่งตรวจสอบฟรี โดยบริษัทฯ จะเสนอราคาค่าซ่อมเพื่อพิจารณา" },
];

const shippingWarranty = [
  "สินค้าชำรุดหรือไม่สามารถใช้งานได้ภายใน 7 วัน หลังรับสินค้า — บริษัทฯ เปลี่ยนสินค้าตัวใหม่ (รุ่นเดียวกันหรือดีกว่า)",
  "จัดส่งสินค้าทดแทนภายใน 3 วันทำการ นับจากตรวจสอบเอกสารและสินค้า",
  "สินค้าส่งคืนต้องครบบรรจุภัณฑ์ หมายเลขกล่องตรงกับเครื่อง พร้อมคู่มือและอุปกรณ์ต่อพ่วงครบ",
  "ไม่ครอบคลุมความเสียหายจากอุบัติเหตุ การใช้งานผิดประเภท การดัดแปลง การติดตั้งไม่ถูกวิธี",
];

const Warrantys = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="เงื่อนไขการรับประกันสินค้า Industrial PC / Panel PC"
        description="นโยบายรับประกัน ENT Group: Industrial PC, Mini PC, Panel PC, Touch Screen รับประกัน 1-3 ปี เปลี่ยนสินค้าใหม่ภายใน 7 วัน ครอบคลุมหน้าจอ อะไหล่ และค่าขนส่ง"
        path="/warranty"
        keywords="รับประกัน Industrial PC, ประกัน Mini PC, warranty panel pc, เคลมสินค้า ENT Group, นโยบายรับประกัน"
      />
      <GEOMeta
        topic="นโยบายการรับประกันสินค้าคอมพิวเตอร์อุตสาหกรรมของ ENT Group"
        summary="ENT Group รับประกันสินค้า Industrial PC, Mini PC และ Panel PC 1-3 ปี ครอบคลุมการซ่อม-เปลี่ยนอะไหล่จากการใช้งานปกติ พร้อมบริการเปลี่ยนสินค้าใหม่ภายใน 7 วันหากชำรุด"
        keyFacts={[
          "รับประกัน 1 ปีมาตรฐาน, สูงสุด 3 ปีสำหรับบางรุ่น",
          "เปลี่ยนสินค้าใหม่ฟรีหากเสียภายใน 7 วันแรก",
          "หน้าจอแสดงผลเปลี่ยนได้ 1 ครั้งใน 1 ปีโดยไม่มีค่าอะไหล่",
          "หน้าจอสัมผัสแตก/ร้าวไม่อยู่ในเงื่อนไขรับประกัน",
          "ไม่ครอบคลุมความเสียหายจากของเหลว ไฟไหม้ น้ำท่วม หรืออุบัติเหตุ",
        ]}
        sourceAuthority="บริษัท อีเอ็นที กรุ๊ป จำกัด (ENT Group) — Authorized Distributor"
        faqs={warrantyFaqs}
      />
      <PageBanner image={bannerImg} title="เงื่อนไขการรับประกัน" subtitle="Warranty Policy — ENT Group" />

      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield size={16} />
            Warranty Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            เงื่อนไขการรับประกันทั่วไป
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            บริษัท อีเอ็นที กรุ๊ป จำกัด ให้ความสำคัญกับคุณภาพสินค้าและบริการหลังการขาย
            เพื่อให้ลูกค้ามั่นใจในทุกการซื้อ
          </p>
          <a
            href="https://ugzdwmyylqmirrljtuej.supabase.co/storage/v1/object/public/datasheets/0597a3_8bd7ef8b2e2b46bc889bc0f70700a2be.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
            <FileDown size={18} />
            ดาวน์โหลดเอกสารแจ้งซ่อม
          </a>
        </div>
      </section>

      {/* General Exclusions */}
      <section className="py-12 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">ข้อยกเว้นการรับประกันทั่วไป</h2>
          </div>
          <div className="space-y-4">
            {generalExclusions.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                <XCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screen Warranty */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Monitor size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">การรับประกันหน้าจอ</h2>
          </div>
          <div className="space-y-3">
            {screenWarranty.map((item, i) => (
              <div
                key={i}
                className={`flex gap-3 p-4 rounded-xl border ${
                  item.type === "covered"
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30"
                    : "bg-destructive/5 border-destructive/10"
                }`}>
                {item.type === "covered" ? (
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Touch Screen Warranty */}
      <section className="py-12 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
              <Monitor size={20} className="text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">การรับประกันหน้าจอแบบสัมผัส</h2>
          </div>
          <div className="space-y-3">
            {touchScreenWarranty.map((item, i) => (
              <div
                key={i}
                className={`flex gap-3 p-4 rounded-xl border ${
                  item.type === "info"
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30"
                    : "bg-destructive/5 border-destructive/10"
                }`}>
                {item.type === "info" ? (
                  <CheckCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-destructive shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Warranty */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">การรับประกันการขนส่งสินค้า</h2>
          </div>
          <div className="space-y-3">
            {shippingWarranty.map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-card border border-border">
                <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Service */}
      <section className="py-12 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
            <Phone size={32} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">แจ้งรับบริการหลังการขาย</h3>
            <p className="text-muted-foreground text-sm mb-4">
              ติดต่อบริษัทฯ ผ่านช่องทางปกติ เพื่อรับบริการซ่อมหรือเคลมสินค้า
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="tel:020456104" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                <Phone size={16} /> 02-045-6104
              </a>
              <a href="tel:0957391053" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                <Phone size={16} /> 095-739-1053
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Warrantys;

