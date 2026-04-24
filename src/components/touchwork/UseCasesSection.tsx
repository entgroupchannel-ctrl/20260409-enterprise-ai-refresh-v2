import { Link } from "react-router-dom";
import { ArrowRight, Factory, UtensilsCrossed, Stethoscope, Truck, Hotel, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import imgFactory from "@/assets/touchwork/usecases/01-factory-mes.jpg";
import imgRestaurant from "@/assets/touchwork/usecases/02-restaurant-kiosk.jpg";
import imgHospital from "@/assets/touchwork/usecases/03-hospital-emr.jpg";
import imgWarehouse from "@/assets/touchwork/usecases/04-warehouse-wms.jpg";
import imgHotel from "@/assets/touchwork/usecases/05-hotel-room-booking.jpg";
import imgRetail from "@/assets/touchwork/usecases/06-retail-pos.jpg";

interface UseCase {
  id: string;
  industry: string;
  title: string;
  description: string;
  image: string;
  icon: typeof Factory;
  recommendedModel: string;
  recommendedSlug: string;
  arch: string;
  highlights: string[];
  tone: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "factory",
    industry: "โรงงานอุตสาหกรรม",
    title: "MES Dashboard ติดข้างไลน์ผลิต",
    description:
      "แสดงผล OEE, สถานะเครื่องจักร และยอดผลิตแบบ real-time ให้หัวหน้าไลน์เช็คได้ทันที จอใหญ่ 21.5″ มองเห็นจากระยะไกล รองรับการใช้งาน 24/7 ในสภาพโรงงาน",
    image: imgFactory,
    icon: Factory,
    recommendedModel: "DM215G",
    recommendedSlug: "dm215g",
    arch: "X86",
    highlights: ["จอ 21.5″ Full HD", "Intel Core i5", "Windows 10 IoT", "ทำงาน 24/7"],
    tone: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "restaurant",
    industry: "ร้านอาหาร / Café",
    title: "Self-Order Kiosk ลดคิวหน้าเคาน์เตอร์",
    description:
      "ลูกค้าเลือกเมนู สั่งอาหาร และชำระเงินได้เอง ลดภาระพนักงาน 40% เพิ่มยอดขายต่อบิล (upsell อัตโนมัติ) จอ Capacitive 10-point touch ใช้งานเหมือนสมาร์ทโฟน",
    image: imgRestaurant,
    icon: UtensilsCrossed,
    recommendedModel: "DM156G",
    recommendedSlug: "dm156g",
    arch: "X86",
    highlights: ["จอ 15.6″ Multi-touch", "Wi-Fi 6", "Windows / Android", "QR Payment"],
    tone: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "hospital",
    industry: "โรงพยาบาล / คลินิก",
    title: "EMR Workstation ที่เคาน์เตอร์พยาบาล",
    description:
      "เปิดเวชระเบียน ดูผล Lab สั่งยา และจดบันทึกได้ในจอเดียว ใช้งานด้วยถุงมือทางการแพทย์ได้ ขนาดกะทัดรัดติดตั้งบนแขน VESA ประหยัดพื้นที่บนเคาน์เตอร์",
    image: imgHospital,
    icon: Stethoscope,
    recommendedModel: "DM121G",
    recommendedSlug: "dm121g",
    arch: "X86",
    highlights: ["จอ 12.1″ XGA", "VESA Mount", "ใช้กับถุงมือได้", "ทำความสะอาดง่าย"],
    tone: "from-cyan-500/20 to-sky-500/10",
  },
  {
    id: "warehouse",
    industry: "คลังสินค้า / Logistics",
    title: "WMS บนรถ Forklift รุ่นทนทาน",
    description:
      "พนักงานสแกนบาร์โค้ด หยิบสินค้าตาม pick-list และยืนยันส่งออกได้บนรถ ขนาด 10.4″ พอดีมือ ทนแรงสั่นสะเทือน รองรับ Wi-Fi 6 + 4G LTE สลับสัญญาณอัตโนมัติ",
    image: imgWarehouse,
    icon: Truck,
    recommendedModel: "DM104G",
    recommendedSlug: "dm104g",
    arch: "ARM",
    highlights: ["จอ 10.4″ ทนสั่น", "Android 13", "Wi-Fi 6 + 4G LTE", "แบตสำรองในตัว"],
    tone: "from-emerald-500/20 to-green-500/10",
  },
  {
    id: "hotel",
    industry: "โรงแรม / สำนักงาน",
    title: "Room Booking Panel หน้าห้องประชุม",
    description:
      "แสดงสถานะห้องว่าง/ไม่ว่าง พร้อมจองห้องได้ทันทีหน้าประตู ดีไซน์บางพิเศษ ติดผนังสวยกลมกลืน ซิงค์กับ Microsoft 365 / Google Workspace อัตโนมัติ",
    image: imgHotel,
    icon: Hotel,
    recommendedModel: "GD133",
    recommendedSlug: "gd133",
    arch: "ARM",
    highlights: ["จอ 13.3″ Slim", "Wall-mount", "PoE Power", "ไฟ LED แสดงสถานะ"],
    tone: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "retail",
    industry: "ร้านค้าปลีก / มินิมาร์ท",
    title: "POS เคาน์เตอร์คิดเงินทันสมัย",
    description:
      "รับชำระเงินสด, บัตร, QR PromptPay ในเครื่องเดียว เชื่อมต่อเครื่องพิมพ์สลิป เครื่องอ่านบาร์โค้ด และลิ้นชักเก็บเงิน ตอบสนองไว ทำงานต่อเนื่องวันละ 16+ ชม.",
    image: imgRetail,
    icon: ShoppingBag,
    recommendedModel: "JD156B",
    recommendedSlug: "jd156b",
    arch: "X86",
    highlights: ["จอ 15.6″ FHD", "Intel Celeron", "เปิด-ปิดไว", "ราคาประหยัด"],
    tone: "from-rose-500/20 to-pink-500/10",
  },
];

export default function UseCasesSection() {
  return (
    <section className="container max-w-7xl mx-auto px-6 py-12 md:py-16 border-t border-border/40">
      {/* Header */}
      <div className="max-w-3xl mb-8 md:mb-10">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Factory className="h-3 w-3" /> Real-world Use Cases
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          งานจริงที่ลูกค้าใช้ TouchWork ทำอะไรได้บ้าง
        </h2>
        <p className="text-muted-foreground">
          6 ตัวอย่างการใช้งานจริงในอุตสาหกรรมต่าง ๆ — เลือกรุ่นที่เหมาะกับงานของคุณ
          หรือให้ทีมเราแนะนำสเปกที่ใช่
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {USE_CASES.map((uc) => {
          const Icon = uc.icon;
          return (
            <article
              key={uc.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                <img
                  src={uc.image}
                  alt={`${uc.title} — ${uc.industry}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${uc.tone} mix-blend-multiply opacity-60`} />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[11px] font-semibold border border-border">
                    <Icon className="h-3 w-3 text-primary" />
                    {uc.industry}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/90 text-background text-[10px] font-bold tracking-wide">
                    {uc.recommendedModel} · {uc.arch}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors">
                  {uc.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {uc.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {uc.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 border border-border/60 text-muted-foreground"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to={`/touchwork/${uc.recommendedSlug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  ดูรุ่น {uc.recommendedModel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        ไม่เห็นงานที่คล้ายของคุณ?{" "}
        <Link to="/contact" className="text-primary font-semibold hover:underline">
          ปรึกษาทีมเรา
        </Link>{" "}
        — ออกแบบสเปกให้ตรงกับการใช้งานจริง ใบเสนอราคาภายใน 4 ชม.
      </div>
    </section>
  );
}
