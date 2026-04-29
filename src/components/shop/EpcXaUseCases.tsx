import { Sparkles } from "lucide-react";
import img1 from "@/assets/epc-xa-usecases/01-factory-automation.jpg";
import img2 from "@/assets/epc-xa-usecases/02-retail-kiosk.jpg";
import img3 from "@/assets/epc-xa-usecases/03-its-traffic.jpg";
import img4 from "@/assets/epc-xa-usecases/04-warehouse-agv.jpg";
import img5 from "@/assets/epc-xa-usecases/05-airport-fids.jpg";
import img6 from "@/assets/epc-xa-usecases/06-edge-5g.jpg";
import img7 from "@/assets/epc-xa-usecases/07-machine-vision.jpg";
import img8 from "@/assets/epc-xa-usecases/08-medical-imaging.jpg";

interface Props {
  model: string; // e.g. EPC-20XA
}

const cases = [
  {
    image: img1,
    tag: "Factory Automation",
    title: "ควบคุมไลน์ผลิตในโรงงาน",
    caption: "Fanless ทนฝุ่น/ความร้อน เชื่อม PLC + Robot Arm ได้ 24/7 ผ่าน RS-232/485",
  },
  {
    image: img2,
    tag: "Retail Kiosk",
    title: "ตู้บริการตนเอง (Self-service)",
    caption: "ขนาดเล็ก ฝังหลังตู้ Kiosk ได้ — รองรับ Touch + รับชำระเงิน + พิมพ์สลิป",
  },
  {
    image: img3,
    tag: "ITS Traffic",
    title: "ตู้ควบคุมจราจรริมถนน",
    caption: "Wide-Voltage 9–36V + Wide-Temp ทนตู้ริมทาง พร้อม 4G สำหรับงาน ITS",
  },
  {
    image: img4,
    tag: "Warehouse AGV",
    title: "หุ่นยนต์ขนของในคลังสินค้า",
    caption: "DC Input + กันสั่นสะเทือน ติดตั้งบน AGV/AMR ขับเคลื่อน Navigation + LiDAR",
  },
  {
    image: img5,
    tag: "Airport FIDS",
    title: "ป้ายตารางบินสนามบิน",
    caption: "Dual Display HDMI/VGA — ขับจอ FIDS / Digital Signage แบบ 24/7 ไม่มีพัดลม",
  },
  {
    image: img6,
    tag: "5G Edge / Telecom",
    title: "Edge Server ในตู้ 5G",
    caption: "Multi-LAN + Intel Core 12th Gen — รัน MEC ในตู้ Base Station ลด Latency",
  },
  {
    image: img7,
    tag: "Machine Vision",
    title: "ตรวจคุณภาพ PCB ด้วยกล้อง AI",
    caption: "USB 3.0 + LAN ความเร็วสูง รับภาพจากกล้องอุตสาหกรรม ประมวลผล AI Inspection",
  },
  {
    image: img8,
    tag: "Medical Imaging",
    title: "อุปกรณ์การแพทย์เคลื่อนที่",
    caption: "ขนาดเล็ก เงียบสนิท (Fanless) ติดตั้งบน Medical Cart — ปลอดภัยกับห้องตรวจ",
  },
];

export default function EpcXaUseCases({ model }: Props) {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-10 lg:py-12">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          REAL-WORLD APPLICATIONS
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          {model} ใช้งานได้หลากหลาย
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          8 สถานการณ์จริงที่ Industrial Box PC ตระกูล EPC-XA พร้อมขับเคลื่อนงานของคุณ
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cases.map((c, i) => (
          <figure
            key={c.tag}
            className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-lg hover:border-primary/40 transition-all"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted/30 relative">
              <img
                src={c.image}
                alt={`${c.tag} — ${c.title}`}
                loading="lazy"
                width={1408}
                height={800}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                0{i + 1}
              </span>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-3 text-white">
              <p className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5 font-bold">
                {c.tag}
              </p>
              <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow mb-1">
                {c.title}
              </h3>
              <p className="text-[11px] md:text-xs leading-snug opacity-90 line-clamp-3 drop-shadow">
                {c.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
