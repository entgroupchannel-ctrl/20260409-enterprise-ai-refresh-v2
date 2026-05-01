import { useState, useMemo } from "react";
import { Building2, Store, Building, Home, Hotel, Castle, Layers as LayersIcon, MapPin, CheckCircle2, AlertCircle, Sparkles, ImageIcon, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { volktekCatalog, type VolktekProduct, type VolktekSubCategory } from "@/data/volktek-products";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import VolktekProductDialog from "@/components/volktek/VolktekProductDialog";

/**
 * Volktek Solutions — เรียบเรียงจาก volktek.com/solutiondetail_en.php (id 2,4-10)
 * เป็นภาษาไทยสำหรับช่าง network และ system integrator คนไทย
 *
 * แต่ละ solution ประกอบด้วย:
 * - Hero image + Application Diagram จาก volktek.com (CDN ตรง)
 * - ภาพรวมการใช้งาน (Application Overview)
 * - ข้อพิจารณาหลัก (Key Considerations)
 * - คุณประโยชน์จาก Volktek (Key Benefits)
 */

type Benefit = { area: string; feature: string; benefit: string };

type Solution = {
  id: string;
  externalId: number;
  category: "Broadband — FTTBiz" | "Broadband — FTTB" | "Broadband — FTTH";
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  hero: string;
  diagram: string;
  overview: string;
  considerations: string[];
  benefits: Benefit[];
  /** รุ่นที่แนะนำสำหรับโซลูชันนี้ — ใช้ model ตรงกับใน volktekCatalog */
  recommendedModels: string[];
};

const SOLUTIONS: Solution[] = [
  {
    id: "corporations",
    externalId: 2,
    category: "Broadband — FTTBiz",
    title: "องค์กรขนาดใหญ่ (Corporations)",
    shortTitle: "องค์กร",
    icon: Building2,
    hero: "https://www.volktek.com/_i/assets/upload/solution/0c24881711c407b42b4af100ebde1f43.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/NSH-3428P_Application.png",
    overview:
      "องค์กรขนาดใหญ่ต้องการการเชื่อมต่อระดับโลก ทั้งสำหรับการสื่อสารภายในและการติดต่อลูกค้าภายนอก ต้องรองรับ bandwidth สูงและฟีเจอร์ broadband ขั้นสูง — เช่น การส่งไฟล์ขนาดใหญ่ การประชุมเสียง/วิดีโอความละเอียดสูง (HD) แบบ low-latency และต้องมั่นใจในความปลอดภัยของข้อมูล",
    considerations: [
      "รองรับการรับส่งข้อมูลความเร็วสูงตั้งแต่ 1G ถึง 10G พร้อมฟีเจอร์ Layer 2 ขั้นสูง, Layer 3 พื้นฐาน และ IPv6",
      "ฟีเจอร์ความปลอดภัยครบ — DHCP Snooping, IP Source Guard, VLAN ป้องกันการโจมตีจากภายนอก",
      "QoS คุณภาพสูง — รับประกันการส่งข้อมูล mission-critical เช่น เสียงและวิดีโอ",
      "Rapid Spanning Tree Protocol (RSTP, IEEE 802.1w) ป้องกัน loop ในเครือข่าย",
      "Dual flash memory เก็บ firmware และไฟล์ตั้งค่าสองชุด — primary fail ระบบสำรองทำงานทันที ลด OPEX",
    ],
    benefits: [
      { area: "Reliability", feature: "Redundant Power", benefit: "ทำงานต่อเนื่องแม้ไฟตก/ไฟดับ" },
      { area: "Availability", feature: "Dual Image + Ring Protection", benefit: "Flash สำรองเก็บ config — กู้คืนเร็วเมื่อระบบหลักล้ม" },
      { area: "Performance", feature: "Quality of Service (QoS)", benefit: "ส่งทราฟฟิกสำคัญได้แม่นยำ" },
      { area: "Security", feature: "DHCP Snooping, IP Source Guard, VLAN", benefit: "จำกัดทราฟฟิกขาเข้าและตรวจสอบ source ที่เชื่อถือได้" },
      { area: "Management", feature: "Email Alarm", benefit: "แจ้งเตือนเหตุการณ์สำคัญผ่านอีเมลทันที" },
    ],
    recommendedModels: ["9561-8GT4XS-TSN", "9560-16GP4XS-I", "9005-24GP2GS", "MEN-6412"],
  },
  {
    id: "small-business",
    externalId: 4,
    category: "Broadband — FTTBiz",
    title: "ธุรกิจขนาดเล็ก-กลาง (SMB)",
    shortTitle: "SMB",
    icon: Store,
    hero: "https://www.volktek.com/_i/assets/upload/solution/85593a97ec81469e51841f9af19aaa9c.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/MEN-3410_Application.png",
    overview:
      "ธุรกิจขนาดเล็ก-กลาง (SMB) ต้องการโซลูชันเครือข่ายที่ใช้งานง่าย เชื่อถือได้ มีทั้ง Ethernet และ Fiber redundancy เพื่อลดทั้ง CAPEX และ OPEX โดยทั่วไปต้องการเครือข่ายปลอดภัย bandwidth สูง สำหรับส่งไฟล์ขนาดใหญ่ สตรีมวิดีโอ และทำธุรกรรมออนไลน์",
    considerations: [
      "อุปกรณ์คุ้มค่า ใช้พอร์ตน้อย แต่มีฟีเจอร์ครบ — OPEX ต่ำ",
      "Ethernet พร้อม ring redundancy + loop protection ทำงานต่อเนื่องไม่สะดุด",
      "Bandwidth สูงพร้อม QoS ครบ — ส่งทราฟฟิกสำคัญ (เสียง/วิดีโอ) ได้เสถียร",
    ],
    benefits: [
      { area: "Reliability", feature: "Redundant Power", benefit: "ทำงานต่อแม้ไฟตก" },
      { area: "Availability", feature: "Loop Protection", benefit: "เชื่อมต่อต่อเนื่องแม้ link ใดล่ม" },
      { area: "Performance", feature: "Quality of Service (QoS)", benefit: "ส่งทราฟฟิก mission-critical อย่างมีประสิทธิภาพ" },
      { area: "Security", feature: "Access Control List (ACL) + IP Source Guard", benefit: "ควบคุมทราฟฟิกอย่างละเอียด เพิ่มความปลอดภัย" },
      { area: "Management", feature: "Email Alarm", benefit: "แจ้งเตือนผ่านอีเมลเมื่อเกิดเหตุ" },
    ],
    recommendedModels: ["MEN-3410", "MEN-3406", "INS-8424P", "IEN-8408P-24V"],
  },
  {
    id: "convenience-stores",
    externalId: 5,
    category: "Broadband — FTTBiz",
    title: "ร้านสะดวกซื้อ (Convenience Stores)",
    shortTitle: "ร้านสะดวกซื้อ",
    icon: Store,
    hero: "https://www.volktek.com/_i/assets/upload/solution/8a271821287b38d20797deb3ae04f379.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/FTTB.png",
    overview:
      "เครือข่ายร้านสะดวกซื้อมีขนาดเล็ก แต่ต้องการความเสถียรระดับ Gigabit สำหรับ PoS, กล้องวงจรปิด และระบบอื่น ๆ ที่ทำงาน 24/7 ต้องการอุปกรณ์ที่ราคาประหยัด ติดตั้งในพื้นที่จำกัดได้ และรองรับการดำเนินงานต่อเนื่องตลอดเวลา",
    considerations: [
      "Gigabit network พร้อมฟีเจอร์ฮาร์ดแวร์/ซอฟต์แวร์ขั้นสูง — ลด OPEX ระยะยาว",
      "Multi-rate SFP สำหรับ uplink — เลือก bandwidth ได้ตามต้องการ พร้อม link redundancy",
      "ดีไซน์ slim & compact — ติดตั้งใน cabinet หน้าร้านได้ง่าย ลด CAPEX",
      "Redundant power — รองรับทั้ง AC และ DC พร้อม battery backup",
    ],
    benefits: [
      { area: "Reliability", feature: "Redundant Power", benefit: "ทำงานต่อเมื่อไฟดับ" },
      { area: "Availability", feature: "Ring Redundancy", benefit: "เชื่อมต่อต่อเนื่องเมื่อ active link ล่ม" },
      { area: "Performance", feature: "Quality of Service (QoS)", benefit: "กำหนดความสำคัญของเครือข่าย" },
      { area: "Security", feature: "Port-Security + DHCP Snooping", benefit: "จำกัดทราฟฟิกขาเข้า ตรวจสอบ source ที่ไว้ใจได้" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor เครือข่ายจากจุดเดียวกลางสำนักงาน" },
    ],
    recommendedModels: ["MEN-3406", "INS-8424P", "IEN-8205P-24V", "HNS-8405P"],
  },
  {
    id: "high-rise",
    externalId: 6,
    category: "Broadband — FTTB",
    title: "อาคารสูง / High-Rise Apartments",
    shortTitle: "อาคารสูง",
    icon: Building,
    hero: "https://www.volktek.com/_i/assets/upload/solution/c4de5d7214844d66433599293756b65d.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/Applications_MEN-5428.png",
    overview:
      "FTTB (Fiber to the Building) สำหรับคอนโด/อพาร์ตเมนต์สูง ให้บริการครบ — internet มูลค่าเพิ่ม, IP Surveillance 24/7, และ IPTV คุณภาพสูง ต้องการระบบที่ bandwidth สูง เสถียร และขยาย fiber ได้ในอนาคต โดยลงทุน CAPEX ต่ำ",
    considerations: [
      "รองรับข้อมูล 1G–10G พร้อมฟีเจอร์ L2 ขั้นสูง, L3 พื้นฐาน และ IPv6",
      "เลือก interface ได้หลากหลาย (fiber/copper) — รองรับงานปัจจุบันและอนาคต",
      "Redundant power AC + DC battery backup — ป้องกันไฟดับ",
      "PoE+ plug-and-play — ติดตั้งกล้อง IP / Wi-Fi AP ง่าย ดูแลน้อย",
    ],
    benefits: [
      { area: "Reliability", feature: "Multi-Rate Fiber Port + Redundant Power", benefit: "Auto negotiate ความเร็ว uplink/downlink + ทำงานต่อเมื่อไฟดับ" },
      { area: "Availability", feature: "Link Aggregation Control Protocol (LACP)", benefit: "เพิ่มประสิทธิภาพและ redundancy ของ uplink" },
      { area: "Performance", feature: "Multicast Listener Discovery (MLD) + QoS", benefit: "IPTV ส่งง่าย กำหนดความสำคัญทราฟฟิกได้" },
      { area: "Security", feature: "Access Control List (ACL)", benefit: "ควบคุมทราฟฟิกได้ละเอียด" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor จากศูนย์กลางได้ทันที" },
    ],
    recommendedModels: ["9005-24GP2GS", "9005-16GP2GS", "MEN-6412", "INS-8624P"],
  },
  {
    id: "property-developers",
    externalId: 7,
    category: "Broadband — FTTB",
    title: "นักพัฒนาอสังหาฯ (Property Developers)",
    shortTitle: "Property Dev",
    icon: LayersIcon,
    hero: "https://www.volktek.com/_i/assets/upload/solution/7906996eb445196c4db69bcfbdf43620.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/Applications_MEN-4532.png",
    overview:
      "Volktek Metro Ethernet สำหรับ Property Developer มีครบทั้ง Aggregation, Access และ CPE (Customer Premise Equipment) เพื่อรองรับความต้องการของผู้พักอาศัยที่เพิ่มขึ้น พร้อมโซลูชันที่พิสูจน์แล้วในตลาด",
    considerations: [
      "เชื่อมต่อ bandwidth สูง",
      "Battery backup เมื่อไฟดับ",
      "ติดตั้ง ตั้งค่า และดูแลง่าย — OPEX/CAPEX ต่ำ",
      "โครงสร้างเครือข่ายปลอดภัย",
      "Zero downtime — ไม่มีช่วงเครือข่ายล่ม",
    ],
    benefits: [
      { area: "Reliability", feature: "Multi-Rate Fiber Port + Redundant Power", benefit: "Auto rate + ทำงานต่อเมื่อไฟดับ" },
      { area: "Availability", feature: "LACP", benefit: "เสริม redundancy ของ uplink" },
      { area: "Performance", feature: "MLD + QoS", benefit: "IPTV ส่งง่าย กำหนดความสำคัญทราฟฟิกได้" },
      { area: "Security", feature: "Access Control List (ACL)", benefit: "ควบคุมทราฟฟิกอย่างละเอียด" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor จากจุดเดียว" },
    ],
    recommendedModels: ["MEN-6412", "9005-24GP2GS", "INS-8624P", "MEN-3410"],
  },
  {
    id: "villas",
    externalId: 8,
    category: "Broadband — FTTB",
    title: "บ้านเดี่ยว / Villas",
    shortTitle: "บ้านเดี่ยว",
    icon: Home,
    hero: "https://www.volktek.com/_i/assets/upload/solution/209de3f6f4b8d2b90ab3d79e3e21d52f.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/Applications_MEN-5428(1).png",
    overview:
      "FTTB สำหรับบ้านเดี่ยว/วิลล่า รองรับงานพักอาศัยทั่วไป เช่น IPTV คุณภาพสูง และ broadband internet — อุปกรณ์ Volktek ติดตั้งและจัดการง่าย ส่งข้อมูลผ่าน fiber ความเร็วสูง ทำงาน 24/7 ที่อุณหภูมิสูงได้ รองรับบริการเช่น 4K VLAN",
    considerations: [
      "Surge protection 6kVA ป้องกันไฟกระชาก",
      "Multi-rate SFP uplink + link redundancy — เลือก bandwidth ได้ตามต้องการ",
      "Auto-provisioning — อัปเดต firmware/software แบบ zero-touch ไม่ต้องส่งช่างหน้างาน",
      "Security protocol + ACL — เปิดบริการเฉพาะลูกค้าที่ขอ",
    ],
    benefits: [
      { area: "Reliability", feature: "Power Isolation Circuit + Redundant Power", benefit: "ป้องกันไฟกระชาก + ทำงานต่อเมื่อไฟดับ" },
      { area: "Availability", feature: "Ring Redundancy", benefit: "เชื่อมต่อต่อเนื่องเมื่อ active link ล่ม" },
      { area: "Performance", feature: "Multicast Listener Discovery (MLD)", benefit: "IPTV ส่งง่าย" },
      { area: "Security", feature: "Access Control List (ACL)", benefit: "ควบคุมทราฟฟิกได้ละเอียด" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor เครือข่ายจากศูนย์กลาง" },
    ],
    recommendedModels: ["MEN-3406", "INS-840G", "INS-8005A", "INS-8405A"],
  },
  {
    id: "townhouses",
    externalId: 9,
    category: "Broadband — FTTB",
    title: "ทาวน์เฮาส์ / Townhouses",
    shortTitle: "ทาวน์เฮาส์",
    icon: Hotel,
    hero: "https://www.volktek.com/_i/assets/upload/solution/ab2972bd5ee375336d774ea26ef65673.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/FTTB_Townhouses.jpg",
    overview:
      "FTTB สำหรับทาวน์เฮาส์ รองรับ IPTV คุณภาพสูง และ broadband internet — ผู้ให้บริการต้องการ Ethernet ที่ flexible, scalable, ปลอดภัย คุ้มค่า และมี fiber ในตัวเพื่อใช้กับโครงสร้างเดิมได้",
    considerations: [
      "Backbone bandwidth สูง พร้อม L2 ขั้นสูง + L3 พื้นฐาน — เพิ่มบริการ value-added",
      "Multi-rate SFP uplink + link redundancy — เลือก bandwidth ได้ตามต้องการ",
      "ดีไซน์ sleek/compact — ติดตั้งใน field cabinet ได้ ลงทุน CAPEX ต่ำ",
      "Antitheft device locking — อุปกรณ์ทำงานเฉพาะกับเครือข่ายที่ตั้งไว้",
    ],
    benefits: [
      { area: "Reliability", feature: "Multi-Rate Fiber Port", benefit: "Auto negotiate uplink/downlink rate" },
      { area: "Availability", feature: "Ring Redundancy", benefit: "เชื่อมต่อต่อเนื่องเมื่อ link ล่ม" },
      { area: "Performance", feature: "VLAN + MLD", benefit: "เชื่อมต่อ device ระยะไกล + IPTV ส่งง่าย" },
      { area: "Security", feature: "Port-Security, DHCP Snooping, Device Locking", benefit: "ป้องกันการเข้าถึงและขโมยอุปกรณ์ — last mile protection" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor จากศูนย์กลาง" },
    ],
    recommendedModels: ["MEN-3410", "MEN-3406", "IEN-8225P-24V", "INS-8424P"],
  },
  {
    id: "condos",
    externalId: 10,
    category: "Broadband — FTTH",
    title: "คอนโดมิเนียม / Condos",
    shortTitle: "คอนโด",
    icon: Castle,
    hero: "https://www.volktek.com/_i/assets/upload/solution/e469e5493cb2fe32dc3ca5daa2233e75.jpg",
    diagram: "https://www.volktek.com/_i/assets/upload/images/Applications_MEN-4532(2).png",
    overview:
      "FTTB สำหรับคอนโดมิเนียม ต้อง flexible เพราะแต่ละห้องมีความต้องการต่างกัน — Ethernet ต้อง scalable พร้อมฟีเจอร์/ฟังก์ชันหลากหลาย รองรับการเปลี่ยนแปลงของบริการในอนาคต",
    considerations: [
      "Surge protection 6kVA ป้องกันไฟกระชาก",
      "Multi-rate SFP uplink + link redundancy — เลือก bandwidth ตามใจ",
      "Auto-provisioning — zero-touch upgrade firmware/software",
      "โครงสร้างเครือข่ายปลอดภัย",
      "Ethernet Loop Detection + Auto Recovery Timer — แก้ไขจาก remote ได้ทันที",
    ],
    benefits: [
      { area: "Reliability", feature: "Power Isolation Circuit + Redundant Power", benefit: "ป้องกันไฟกระชาก + ทำงานต่อเมื่อไฟดับ" },
      { area: "Availability", feature: "Ring Redundancy", benefit: "เชื่อมต่อต่อเนื่องเมื่อ active link ล่ม" },
      { area: "Performance", feature: "VLAN + Storm Control", benefit: "เชื่อมต่อ device ระยะไกล + ป้องกัน LAN traffic storm" },
      { area: "Security", feature: "Device Locking", benefit: "Last mile protection — อุปกรณ์ทำงานเฉพาะเครือข่ายที่ตั้งไว้" },
      { area: "Management", feature: "SNMP + TRAP", benefit: "Monitor เครือข่ายจากจุดเดียว" },
    ],
    recommendedModels: ["MEN-6412", "9005-16GP2GS", "INS-8624P", "MEN-3410"],
  },
];

type LookupEntry = { product: VolktekProduct; subCategory: VolktekSubCategory; categoryTitle: string };

/** Build lookup map: model → { product, subCategory, categoryTitle } จาก volktekCatalog */
function buildProductLookup(): Map<string, LookupEntry> {
  const map = new Map<string, LookupEntry>();
  for (const cat of volktekCatalog) {
    for (const sub of cat.subCategories) {
      for (const p of sub.products) {
        if (!map.has(p.model)) map.set(p.model, { product: p, subCategory: sub, categoryTitle: cat.title });
      }
    }
  }
  return map;
}

export default function VolktekSolutions() {
  const [activeTab, setActiveTab] = useState(SOLUTIONS[0].id);
  const productLookup = useMemo(() => buildProductLookup(), []);
  const [dialogState, setDialogState] = useState<LookupEntry | null>(null);

  const openProduct = (model: string) => {
    const entry = productLookup.get(model);
    if (entry) setDialogState(entry);
  };
  const selectFromDialog = (p: VolktekProduct) => {
    const entry = productLookup.get(p.model);
    if (entry) setDialogState(entry);
  };

  return (
    <section id="solutions" className="scroll-mt-24">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          <MapPin size={12} /> Real-World Solutions
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          โซลูชัน <span className="text-gradient">Volktek</span> สำหรับงานจริง
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          8 โซลูชันที่นำไปใช้งานได้จริง — เรียบเรียงเป็นภาษาไทยสำหรับช่าง network และ system integrator
          ครอบคลุมตั้งแต่องค์กรขนาดใหญ่ จนถึงคอนโด/ทาวน์เฮาส์
        </p>
      </div>

      <div className="card-surface p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab pills — 2 rows on mobile, 4 cols on tablet, 8 cols on desktop */}
          <TabsList className="h-auto p-1.5 bg-muted/40 border border-border rounded-xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1 mb-5 w-full">
            {SOLUTIONS.map((s) => {
              const isActive = activeTab === s.id;
              return (
                <TabsTrigger
                  key={s.id}
                  value={s.id}
                  className={`h-auto py-2 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span className="text-[10px] md:text-[11px] font-bold leading-tight text-center truncate w-full">
                    {s.shortTitle}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {SOLUTIONS.map((s) => (
            <TabsContent key={s.id} value={s.id} className="mt-0">
              {/* Hero header */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-5">
                <div className="lg:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-muted border border-border">
                  <img
                    src={s.hero}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary text-primary-foreground mb-2">
                      {s.category}
                    </span>
                    <h3 className="text-lg md:text-2xl font-display font-bold text-foreground">
                      {s.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                        ภาพรวมการใช้งาน
                      </h4>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{s.overview}</p>
                  </div>

                  {/* Recommended Products — compact list ใต้ภาพรวม */}
                  {(() => {
                    const items = s.recommendedModels
                      .map((m) => productLookup.get(m))
                      .filter((x): x is LookupEntry => Boolean(x));
                    if (items.length === 0) return null;
                    return (
                      <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-3 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Package className="w-4 h-4 text-primary shrink-0" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex-1">
                            รุ่นที่แนะนำ
                          </h4>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                            {items.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex-1">
                          {items.map(({ product: p }) => (
                            <div
                              key={p.model}
                              className="rounded-lg border border-border bg-background overflow-hidden hover:border-primary/50 hover:shadow-sm transition-all flex flex-col group"
                            >
                              <button
                                type="button"
                                onClick={() => openProduct(p.model)}
                                aria-label={`ดูรายละเอียด Volktek ${p.model}`}
                                className="text-left flex flex-col flex-1 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-t-lg"
                              >
                                <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={p.image}
                                    alt={p.model}
                                    loading="lazy"
                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="p-2 flex flex-col gap-1.5">
                                  <div className="font-mono text-[11px] font-bold text-primary leading-tight line-clamp-1 group-hover:underline">
                                    {p.model}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                                    {p.description}
                                  </p>
                                </div>
                              </button>
                              <div className="px-2 pb-2 flex gap-1 mt-auto">
                                <AddToCartButton
                                  productModel={p.model}
                                  productName={`Volktek ${p.model}`}
                                  productDescription={p.description}
                                  size="sm"
                                  variant="outline"
                                  iconOnly
                                />
                                <QuoteRequestButton
                                  productModel={p.model}
                                  productName={`Volktek ${p.model}`}
                                  size="sm"
                                  variant="outline"
                                  iconOnly
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2.5 text-[10px] text-muted-foreground text-center">
                          คลิกที่รุ่นเพื่อดูสเปคแบบเต็ม
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Considerations + Benefits two-column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mb-5">
                {/* Key Considerations */}
                <div className="rounded-xl border border-border bg-background/50 p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">ข้อพิจารณาหลัก (Key Considerations)</h4>
                  </div>
                  <ul className="space-y-2">
                    {s.considerations.map((c, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/85 leading-relaxed">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Benefits */}
                <div className="rounded-xl border border-border bg-background/50 p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground">คุณประโยชน์จาก Volktek (Key Benefits)</h4>
                  </div>
                  <div className="space-y-2.5">
                    {s.benefits.map((b, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 pb-2 last:pb-0 border-b last:border-b-0 border-border/50"
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 self-start">
                          {b.area}
                        </span>
                        <div className="text-xs font-semibold text-foreground">{b.feature}</div>
                        <span />
                        <p className="text-xs text-muted-foreground leading-relaxed">{b.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Application Diagram */}
              <div className="rounded-xl border border-border bg-muted/20 p-3 sm:p-4 md:p-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                  <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                  <h4 className="text-sm font-bold text-foreground">Application Diagram</h4>
                  <span className="text-[10px] text-muted-foreground basis-full sm:basis-auto">— ภาพการใช้งานจริงจาก Volktek</span>
                </div>
                <div className="relative bg-background rounded-lg overflow-hidden border border-border w-full">
                  <img
                    src={s.diagram}
                    alt={`${s.title} application diagram`}
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto max-w-full object-contain max-h-[260px] sm:max-h-[360px] md:max-h-[480px] mx-auto"
                  />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground text-center sm:hidden">
                  แตะค้างที่ภาพเพื่อซูมดูรายละเอียด
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <VolktekProductDialog
        product={dialogState?.product ?? null}
        subCategory={dialogState?.subCategory ?? null}
        categoryTitle={dialogState?.categoryTitle ?? ""}
        onClose={() => setDialogState(null)}
        onSelect={selectFromDialog}
      />
    </section>
  );
}
