import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import outdoorDisplayBanner from "@/assets/outdoor-display-banner.jpg";
import waterproofPcBanner from "@/assets/waterproof-pc-banner.jpg";
import ruggedDevicesBanner from "@/assets/rugged-devices-banner.jpg";
import volktekBanner from "@/assets/volktek-banner.jpg";
import touchscreenBanner from "@/assets/touchscreen-kiosk-banner.jpg";

const sections = [
  {
    title: "หน้าจอสัมผัสและคีออสก์",
    description: "โซลูชันหน้าจอสัมผัสคาปาซิทีฟครบวงจร — POS, คีออสก์, Panel PC สำหรับร้านค้า โรงงาน และงานบริการ",
    image: touchscreenBanner,
    links: [
      { label: "EPC Series", href: "/epc-series" },
      { label: "EPC Box Series", href: "/epc-box-series" },
      { label: "KIOSK สำเร็จรูป", href: "/smart-display?tab=kiosk" },
    ],
  },
  {
    title: "จอภาพติดตั้งภายนอกอาคาร",
    description: "วางกลางแดดกลางฝนได้สบาย — ออกแบบมาเพื่อสภาพอากาศเมืองไทยโดยเฉพาะ IP55 กันน้ำกันฝุ่น ความสว่างสูง 1,500-2,500 nits มองเห็นชัดแม้แดดจัด เริ่มต้น ฿69,000 รับประกัน 1 ปี",
    image: outdoorDisplayBanner,
    price: "เริ่มต้น ฿69,000",
    links: [{ label: "ดูรุ่นทั้งหมด", href: "/smart-display?tab=outdoor" }],
  },
  {
    title: "Waterproof Panel PC — สแตนเลส สำหรับไลน์ผลิตอาหาร",
    description: "ตัวเครื่องสแตนเลส IP65/IP69K ทำความสะอาดง่าย ทนน้ำ ทนสารเคมี ออกแบบมาสำหรับโรงงานอาหาร ห้องเย็น และสายการผลิตที่ต้องล้างทำความสะอาดบ่อย",
    image: waterproofPcBanner,
    links: [{ label: "ข้อมูลเพิ่มเติม", href: "/waterproof-pc" }],
  },
  {
    title: "Rugged Devices — ทนร้อน ทนกระแทก เกรดทหาร",
    description: "Tablet, Notebook และ Handheld สำหรับงานคลังสินค้า งานภาคสนาม สแกน QR/Barcode กันระเบิด MIL-STD-810G มีให้เลือกหลายรุ่น",
    image: ruggedDevicesBanner,
    links: [
      { label: "Rugged Tablet", href: "/rugged-tablet" },
      { label: "Rugged Notebook", href: "/rugged-notebook" },
      { label: "Handheld & PDA", href: "/handheld" },
    ],
  },
  {
    title: "Volktek Industrial Switch — เครือข่ายโรงงานที่เชื่อถือได้",
    description: "Managed/Unmanaged Switch สำหรับงานอุตสาหกรรม DIN-Rail ทนอุณหภูมิสูง รองรับ PoE สำหรับกล้องวงจรปิดและอุปกรณ์ IoT",
    image: volktekBanner,
    links: [{ label: "ดูรุ่นทั้งหมด", href: "/volktek" }],
  },
];

const ProductSections = () => {
  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto space-y-12">
        {sections.map((section) => (
          <div key={section.title} className="card-surface overflow-hidden relative rounded-2xl min-h-[340px] flex items-end">
            <img
              src={section.image}
              alt={section.title}
              className="absolute inset-0 w-full h-full object-cover">
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="relative z-10 p-8 md:p-10 w-full">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{section.title}</h3>
                  {section.description && (
                    <p className="text-white/80 text-sm md:text-base mb-4">{section.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    {section.price && (
                      <span className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                        {section.price}
                      </span>
                    )}
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all">
                        {link.label} <ArrowRight size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSections;

