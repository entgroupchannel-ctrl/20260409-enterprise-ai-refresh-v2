import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Factory, Package, Wrench, ShieldCheck, Truck, X } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageBanner from "@/components/PageBanner";
import FooterCompact from "@/components/FooterCompact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import heroBanner from "@/assets/accessories/hero-banner.jpg";

import desktopStand from "@/assets/accessories/desktop-stand.jpg";
import foldableStand from "@/assets/accessories/foldable-stand.jpg";
import adjustableArm from "@/assets/accessories/adjustable-arm.jpg";
import wallMount from "@/assets/accessories/wall-mount.jpg";
import lShapeStand from "@/assets/accessories/l-shape-stand.jpg";
import designerStand from "@/assets/accessories/designer-stand.jpg";
import premiumStand from "@/assets/accessories/premium-stand.jpg";
import aioDesktopStand from "@/assets/accessories/aio-desktop-stand.jpg";
import aioWallMount from "@/assets/accessories/aio-wall-mount.jpg";

interface Accessory {
  id: string;
  title: string;
  size: string;
  /** Min/max screen size in inches that this accessory supports */
  sizeMin: number;
  sizeMax: number;
  image: string;
  features: string[];
  compatibleWith?: string;
}

const ACCESSORIES: Accessory[] = [
  {
    id: "desktop-stand",
    sizeMin: 15, sizeMax: 27,
    title: "Desktop Stand — ขาตั้งวางโต๊ะมาตรฐาน",
    size: "15\" – 27\"",
    image: desktopStand,
    features: [
      "โครงสร้างแข็งแรง รองรับน้ำหนักจอขนาดใหญ่ได้อย่างปลอดภัย",
      "ดีไซน์เรียบง่าย เข้ากับสภาพแวดล้อมสำนักงานทุกแบบ",
      "ปรับมุมก้ม-เงยได้ ให้มุมมองที่สบายตาในการใช้งานต่อเนื่อง",
    ],
  },
  {
    id: "foldable-stand",
    sizeMin: 15, sizeMax: 23.8,
    title: "Foldable Stand — ขาตั้งพับเก็บได้",
    size: "15\" – 23.8\"",
    image: foldableStand,
    features: [
      "ดีไซน์พับเก็บได้ ประหยัดพื้นที่จัดเก็บ เหมาะกับพื้นที่จำกัด",
      "ติดตั้งและถอดง่าย เหมาะกับงานอีเวนต์หรือบูธที่ต้องเคลื่อนย้ายบ่อย",
      "รองรับอุปกรณ์หลากหลาย ให้การยึดเกาะที่มั่นคง",
    ],
  },
  {
    id: "adjustable-arm",
    sizeMin: 7, sizeMax: 23.8,
    title: "Adjustable Arm — แขนปรับระดับ",
    size: "7\" – 23.8\"",
    image: adjustableArm,
    features: [
      "ปรับมุม / ความสูงได้อิสระ รองรับการใช้งานหลายรูปแบบ",
      "ลดอาการปวดคอ-ตา จากการนั่งทำงานต่อเนื่องเป็นเวลานาน",
      "โครงสร้างแข็งแรง ลดการสั่นสะเทือน ให้การใช้งานที่นิ่งและเสถียร",
    ],
  },
  {
    id: "wall-mount",
    sizeMin: 5, sizeMax: 65,
    title: "Wall Mount — ขายึดผนัง",
    size: "5\" – 65\"",
    image: wallMount,
    features: [
      "ประหยัดพื้นที่บนโต๊ะ เหมาะกับร้านค้า สำนักงาน หรือห้องประชุม",
      "ปรับมุมมองได้หลากหลาย เหมาะกับจอขนาดใหญ่หรือใช้หลายจอ",
      "ดีไซน์เรียบหรู เพิ่มความเป็นระเบียบให้กับพื้นที่ติดตั้ง",
    ],
  },
  {
    id: "l-shape-stand",
    sizeMin: 15, sizeMax: 27,
    title: "L-Shape Stand — ขาตั้งทรง L",
    size: "15\" – 27\"",
    image: lShapeStand,
    features: [
      "ใช้งานได้ทั้งแนวนอน (Landscape) และแนวตั้ง (Portrait)",
      "ฐานยึดมั่นคง ลดความเสี่ยงจากการเลื่อนหรือเอียงของอุปกรณ์",
      "ดีไซน์โมเดิร์น เพิ่มพื้นที่ใช้สอยบนโต๊ะให้วางอุปกรณ์อื่นได้อีก",
    ],
  },
  {
    id: "designer-stand",
    sizeMin: 32, sizeMax: 65,
    title: "Designer Stand — ขาตั้งดีไซน์เฉพาะตัว",
    size: "32\" – 65\"",
    image: designerStand,
    features: [
      "ดีไซน์สร้างสรรค์ มีคุณค่าทั้งในเชิงความงามและการใช้งาน",
      "โครงสร้างนิ่ง เหมาะกับจอที่ต้องการเสริมเอกลักษณ์ให้พื้นที่",
      "รองรับการปรับมุมจอได้ ให้การใช้งานยืดหยุ่น",
    ],
  },
  {
    id: "premium-stand",
    sizeMin: 17, sizeMax: 32,
    title: "Premium Stand — ขาตั้งระดับพรีเมียม",
    size: "17\" – 32\"",
    image: premiumStand,
    features: [
      "ดีไซน์ผสานความโมเดิร์นและฟังก์ชัน เหมาะกับสำนักงานระดับ Hi-end",
      "รองรับน้ำหนักจอและอุปกรณ์ได้มั่นคง ลดการสั่นไหวที่ไม่จำเป็น",
      "เหมาะกับพื้นที่สำนักงานขนาดกะทัดรัด เพิ่มเอกลักษณ์ทางสายตา",
    ],
  },
  {
    id: "aio-desktop-stand",
    sizeMin: 15.6, sizeMax: 43,
    title: "All-Metal Desktop Stand — สำหรับ All-in-One (GD Series)",
    size: "15.6\" – 43\"",
    image: aioDesktopStand,
    compatibleWith: "GD Series 15.6\" – 43\"",
    features: [
      "วัสดุโลหะทั้งชิ้น ฐานหนาแน่น รองรับเครื่อง AIO ทุกขนาดได้นิ่ง ไม่โยก",
      "ดีไซน์สวยงาม ติดตั้งง่าย ถอดบำรุงรักษาในอนาคตได้สะดวก",
      "เหมาะกับร้านอาหารระดับพรีเมียม ร้านกาแฟ หรืองานบริการ",
    ],
  },
  {
    id: "aio-wall-mount",
    sizeMin: 15.6, sizeMax: 43,
    title: "All-Metal Wall Mount — สำหรับ All-in-One (GD Series)",
    size: "15.6\" – 43\"",
    image: aioWallMount,
    compatibleWith: "GD Series 15.6\" – 43\"",
    features: [
      "วัสดุโลหะทั้งชิ้น ออกแบบเฉพาะสำหรับงานติดผนัง รองรับได้ทุกขนาด",
      "ดีไซน์สวยงาม ติดตั้งง่าย ประหยัดพื้นที่ใช้สอยอย่างเห็นได้ชัด",
      "เหมาะกับร้านอาหาร ร้านบริการ และจุด Self-service ที่ต้องการความเรียบร้อย",
    ],
  },
];

const PROMISES = [
  {
    icon: Factory,
    title: "ส่งตรงจากโรงงาน",
    desc: "สั่งผลิตและจัดส่งจากโรงงานผู้ผลิตเดียวกับสินค้าหลัก ไม่ผ่านพ่อค้าคนกลาง",
  },
  {
    icon: Package,
    title: "เข้ากันได้กับสินค้า ENT",
    desc: "ทุกชิ้นได้รับการทดสอบให้เข้ากับสินค้าในกลุ่ม Smart Display และ Interactive Display ของเรา",
  },
  {
    icon: Wrench,
    title: "ติดตั้งง่าย ใช้งานได้ทันที",
    desc: "มาตรฐาน VESA Mount พร้อมคู่มือไทย ทีมงานพร้อมให้คำปรึกษาก่อนติดตั้ง",
  },
  {
    icon: ShieldCheck,
    title: "รับประกันคุณภาพ",
    desc: "รับประกันสินค้า 1 ปี เปลี่ยนทดแทนทันทีหากพบปัญหาจากการผลิต",
  },
];

const Accessories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sizeParam = searchParams.get("size");
  // Convert "23.8" → 23.8, "98" → 98, ignore invalid
  const targetSize = sizeParam && !isNaN(parseFloat(sizeParam)) ? parseFloat(sizeParam) : null;

  const filtered = useMemo(() => {
    if (targetSize === null) return ACCESSORIES;
    return ACCESSORIES.filter(a => targetSize >= a.sizeMin && targetSize <= a.sizeMax);
  }, [targetSize]);

  const clearFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("size");
    setSearchParams(next);
  };

  return (
    <>
      <SEOHead
        title='Accessories — ขาตั้ง ขายึดผนัง สำหรับ Touch Screen & KIOSK'
        description={`อุปกรณ์เสริมของแท้สำหรับหน้าจอสัมผัสและ KIOSK — Desktop Stand, Wall Mount, Adjustable Arm รองรับขนาด 5"–65" ส่งตรงจากโรงงาน TouchWO รับประกัน 1 ปี`}
        path="/accessories"
        keywords="ขาตั้งจอ, wall mount, monitor stand, kiosk accessories, vesa mount, ขายึดผนัง"
      />
      <BreadcrumbJsonLd items={[
        { name: "สินค้า", path: "/smart-display" },
        { name: "Accessories", path: "/accessories" },
      ]} />

      <PageBanner
        image={heroBanner}
        title="Accessories — อุปกรณ์เสริมของแท้"
        subtitle="ขาตั้ง / ขายึดผนัง / แขนจอ สำหรับ Touch Screen และ KIOSK ทุกขนาด"
        backTo="/interactive-display"
        backLabel="กลับไปหน้า Interactive Display"
      />

      {/* Intro */}
      <section className="py-12 px-4 md:px-8">
        <div className="container max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            ครบทุกอุปกรณ์เสริม สำหรับหน้าจอสัมผัสและ KIOSK
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            ลูกค้าที่ซื้อสินค้าในกลุ่ม{" "}
            <Link to="/smart-display" className="text-primary font-semibold hover:underline">
              Smart Display
            </Link>{" "}
            และ{" "}
            <Link to="/interactive-display" className="text-primary font-semibold hover:underline">
              Interactive Display
            </Link>{" "}
            สามารถสั่งซื้ออุปกรณ์เสริมเพิ่มเติมได้ในขั้นตอนเดียวกัน
            — ทุกชิ้นส่งตรงจากโรงงาน TouchWO รองรับขนาดหน้าจอ 5"–65" พร้อมมาตรฐาน VESA Mount
          </p>
        </div>
      </section>

      {/* Promises */}
      <section className="pb-12 px-4 md:px-8">
        <div className="container max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMISES.map((p) => (
            <Card key={p.title} className="p-5 bg-gradient-to-br from-primary/5 via-background to-background border-border">
              <div className="rounded-lg bg-primary/10 p-2.5 w-fit mb-3">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Accessories grid */}
      <section className="pb-16 px-4 md:px-8">
        <div className="container max-w-7xl mx-auto">
          {targetSize !== null && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="text-sm">
                <span className="text-muted-foreground">กำลังกรอง Accessories ที่รองรับหน้าจอ </span>
                <span className="font-bold text-primary">{sizeParam}"</span>
                <span className="text-muted-foreground"> — พบ {filtered.length} รายการ</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                <X size={14} className="mr-1" /> ล้างตัวกรอง · ดูทั้งหมด
              </Button>
            </div>
          )}

          {targetSize === null && (
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                เลือก Accessories ที่ใช่กับงานของคุณ
              </h2>
              <p className="text-muted-foreground">10 รายการ ครอบคลุมหน้าจอตั้งแต่ 5" ถึง 65"</p>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground mb-4">ไม่พบ Accessories ที่รองรับขนาดนี้โดยตรง</p>
              <Button variant="outline" onClick={clearFilter}>ดู Accessories ทั้งหมด</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((acc) => (
                <Card key={acc.id} className="overflow-hidden group hover:shadow-lg transition-all border-border flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={acc.image}
                      alt={acc.title}
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg leading-tight">{acc.title}</h3>
                    </div>
                    <div className="text-xs font-semibold text-primary mb-3">
                      Available in {acc.size}
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground flex-1 mb-4">
                      {acc.features.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                    {acc.compatibleWith && (
                      <div className="text-xs px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground border border-border">
                        <span className="font-semibold text-foreground">เข้ากันได้กับ:</span> {acc.compatibleWith}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order CTA */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-primary/5 via-background to-background border-y border-border">
        <div className="container max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <Truck size={14} />
            ส่งตรงจากโรงงาน — ไม่มียอดขั้นต่ำ
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            สั่งซื้อพร้อมหน้าจอหรือสั่งเพิ่มภายหลังก็ได้
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            ทีมงานของเราพร้อมแนะนำขาตั้ง / ขายึดที่เหมาะกับพื้นที่และวิธีติดตั้งของคุณ —
            แจ้งรุ่นจอที่คุณใช้ พร้อมแนบรูปพื้นที่ติดตั้ง เราคำนวณรุ่นที่ใช่ให้ภายใน 1 วันทำการ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/smart-display">
                ดูสินค้า Smart Display <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/interactive-display">
                ดู Interactive Display <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact-us">ขอคำแนะนำจากทีมงาน</Link>
            </Button>
          </div>
        </div>
      </section>

      <FooterCompact />
    </>
  );
};

export default Accessories;
