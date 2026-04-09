import { Link } from "react-router-dom";
import { Monitor, Cpu, TabletSmartphone, Wifi, Shield, LayoutGrid, Server, Tv } from "lucide-react";

import imgGT from "@/assets/product-gt-series.jpg";
import imgGB from "@/assets/product-gb-series.jpg";
import imgPanel from "@/assets/product-panel-pc.jpg";
import imgUTC from "@/assets/product-utc-series.jpg";
import imgSmart from "@/assets/product-smart-display.jpg";
import imgRugged from "@/assets/product-rugged.jpg";
import imgVolktek from "@/assets/product-volktek.jpg";
import imgEPC from "@/assets/product-epc.jpg";
import imgIBox from "@/assets/product-ibox-series.jpg";
import imgFirewall from "@/assets/product-firewall.jpg";
import imgVCloud from "@/assets/product-vcloudpoint.jpg";

const categories = [
  {
    title: "GT Series — Mini PC",
    subtitle: "Fanless Industrial Computer",
    description: "คอมพิวเตอร์อุตสาหกรรมไร้พัดลม 13 รุ่น ครบทุกสเปก ตั้งแต่ Celeron ถึง i7 Gen 12",
    icon: Cpu,
    href: "/gt-series",
    models: ["GT1000", "GT1200", "GT1300", "GT1400", "GT2000", "GT3000", "GT4000", "GT4500", "GT5000", "GT6000", "GT7000", "GT8000", "GT9000"],
    badge: "Hot",
    image: imgGT,
  },
  {
    title: "iBox Series — Industrial PC",
    subtitle: "Fanless Embedded Box PC",
    description: "คอมพิวเตอร์อุตสาหกรรมไร้พัดลม สำหรับ Edge AI, IoT Gateway, Machine Vision และงานโครงการ",
    icon: Server,
    href: "/ibox-series",
    models: ["AI Edge/GPU", "Embedded Box", "Gateway/DIN Rail", "PoE Multi-LAN", "Vehicle", "AEOLUS"],
    badge: "Hot",
    image: imgIBox,
  },
  {
    title: "GB Series",
    subtitle: "Industrial Grade Computer",
    description: "4 รุ่น 4 สไตล์ ตอบโจทย์ทุกความต้องการอุตสาหกรรม",
    icon: Server,
    href: "/gb-series",
    models: ["GB1000", "GB2000", "GB4000", "GB5000"],
    badge: "New",
    image: imgGB,
  },
  {
    title: "Panel PC",
    subtitle: "Industrial Touch Panel",
    description: "จอสัมผัสอุตสาหกรรม GTG/GTY, GK Series และ EPC Panel Series",
    icon: Monitor,
    href: "/panel-pc-gtg",
    models: ["GTG Series", "GK Series", "EPC Panel", "Stainless Steel"],
    image: imgPanel,
  },
  {
    title: "UTC Series",
    subtitle: "Panel PC with Touch Screen",
    description: "จอสัมผัสอุตสาหกรรม Modular Design 8\"–24\" พร้อม iDoor Technology",
    icon: Monitor,
    href: "/utc-series",
    models: ["Square 4:3", "Wide 16:9", "J6412"],
    badge: "New",
    image: imgUTC,
  },
  {
    title: "Smart Display",
    subtitle: "Digital Signage & Kiosk",
    description: "จอแสดงผลอุตสาหกรรม Indoor/Outdoor และตู้ Kiosk",
    icon: Tv,
    href: "/smart-display",
    models: ["Indoor", "Outdoor", "Stainless", "Food Grade"],
    badge: "New",
    image: imgSmart,
  },
  {
    title: "Rugged Devices",
    subtitle: "Tablet & Notebook",
    description: "แท็บเล็ตและโน้ตบุ๊กเกรดทหาร กันน้ำ กันกระแทก",
    icon: TabletSmartphone,
    href: "/rugged-tablet",
    models: ["Tablet", "Notebook", "Handheld"],
    image: imgRugged,
  },
  {
    title: "Volktek",
    subtitle: "Industrial Network Switch",
    description: "สวิตช์เครือข่ายอุตสาหกรรม Managed/Unmanaged",
    icon: Wifi,
    href: "/volktek",
    models: ["Managed", "Unmanaged", "PoE"],
    image: imgVolktek,
  },
  {
    title: "EPC & Mini PC",
    subtitle: "Compact Embedded System",
    description: "คอมพิวเตอร์ขนาดเล็ก EPC Box, Mini PC สำหรับงาน Embedded",
    icon: Shield,
    href: "/epc-box-series",
    models: ["EPC Box", "Mini PC"],
    image: imgEPC,
  },
  {
    title: "Mini PC Firewall",
    subtitle: "Network Security Appliance",
    description: "Firewall สำหรับทุกขนาดองค์กร pfSense / OPNsense Ready",
    icon: Shield,
    href: "/minipc-firewall",
    models: ["GT194L", "GT196L", "IPC068", "IPC090"],
    badge: "Hot",
    image: imgFirewall,
  },
  {
    title: "vCloudPoint",
    subtitle: "Zero Client Solution",
    description: "PC 1 เครื่อง ใช้ได้ 30 คน ประหยัดต้นทุน ประหยัดไฟ ทดลองฟรี 30 วัน",
    icon: Monitor,
    href: "/vcloudpoint",
    models: ["S100", "S100-v1", "A1", "vMatrix"],
    badge: "Hot",
    image: imgVCloud,
  },
];

const ProductHighlights = () => {
  return (
    <section className="section-padding" id="products">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">
            Product Categories
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            สินค้า<span className="text-gradient">แนะนำ</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            โซลูชันคอมพิวเตอร์อุตสาหกรรมครบวงจร ตอบโจทย์ทุกความต้องการ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.href}
              className="group relative card-surface rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {cat.badge && (
                <span className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  cat.badge === "Hot" 
                    ? "bg-destructive text-destructive-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}>
                  {cat.badge}
                </span>
              )}

              {/* Product image */}
              <div className="relative h-40 overflow-hidden bg-secondary/30">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={640}
                  height={512}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                {/* Icon + Text */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <cat.icon className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-primary/70 font-medium">{cat.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cat.description}</p>

                {/* Models strip */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cat.models.slice(0, 6).map((model) => (
                    <span
                      key={model}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary border border-border text-muted-foreground"
                    >
                      {model}
                    </span>
                  ))}
                  >
                  {cat.models.length > 6 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-primary/10 border border-primary/20 text-primary">
                      +{cat.models.length - 6} รุ่น
                    </span>
                  )}
                  >
                </div>

                {/* Bottom action hint */}
                <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span className="font-medium">ดูรายละเอียด →</span>
                  <span>{cat.models.length} หมวดหมู่</span>
                </div>
              </div>
            </Link>
          ))}
          >
        </div>
      </div>
    </section>
  );
};

export default ProductHighlights;
