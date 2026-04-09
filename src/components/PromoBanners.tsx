import { Link } from "react-router-dom";
import { Zap, Bell, ArrowRight, Calendar, Sparkles, Flame } from "lucide-react";

/* ───── Shared promo data (active + recurring only) ───── */
const activePromos = [
  {
    id: "em-t195-deal",
    title: "Deal of the Month — EM-T195 Rugged Tablet",
    subtitle: '10.1" | 5G Ready | IP65 | Android 11 — ลด 15%',
    badge: "HOT",
    badgeIcon: "flame",
    period: "พร้อมส่งทันที เพียง 5 เครื่อง",
    image: "/images/rugged/front-TlZtwxwQ.png",
    highlights: [
      "ราคาพิเศษ ฿18,615 (จาก ฿21,900)",
      "MediaTek Dimensity 5G — ชิปเทคโนโลยีล่าสุด",
      "4GB LPDDR4X / 64GB / WiFi+4G LTE",
      "น้ำหนักเบา 650g / Barcode Scanner ในตัว",
    ],
    status: "active" as const,
    link: "/rugged-tablet/em-t195",
  },
  {
    id: "starter-plus",
    title: "STARTER PLUS+ อัพสเปคฟรี!",
    subtitle: "RAM & SSD อัพฟรีทุกซีรีส์",
    badge: "คุ้มสุด",
    period: "จนถึง 31 ธ.ค. 2568",
    image: "/images/wix/0597a3_edb77d9f4150436f837edf75bf00a6e6_55c2b56b.png",
    highlights: ["RAM 4→8GB ฟรี", "SSD 128→256GB ฟรี", "ประหยัด 2,700 บาท/เครื่อง"],
    status: "active" as const,
    link: "/promotions",
  },
  {
    id: "endyear-windows",
    title: "END YEAR SALE แถม Windows ฟรี!",
    subtitle: "GT Series + Windows OEM มูลค่า 4,900 บาท",
    badge: "HOT",
    badgeIcon: "flame",
    period: "จนถึง 31 ธ.ค. 2568",
    image: "/images/wix/0597a3_db1433a3bf0c4657a1f5d99352280129_8b3388da.png",
    highlights: ["แถมฟรี Windows Pro OEM", "มูลค่าสูงสุด 4,900 บาท", "Fanless + พอร์ตครบ"],
    status: "active" as const,
    link: "/promotions",
  },
  {
    id: "wifi6-free",
    title: "ซื้อ 1 แถม 1! WiFi 6 ฟรี",
    subtitle: "Industrial PC + WiFi 6 มูลค่า 3,900 บาท",
    period: "จนถึง 31 ธ.ค. 2568",
    image: "/images/wix/0597a3_dc716eff20664aae8238509cca867668_0f736af8.png",
    highlights: ["ฟรี WiFi 6 Module", "เชื่อมต่อเร็วกว่า", "ใช้ได้ GT & GB Series"],
    status: "active" as const,
    link: "/promotions",
  },
];

const PromoBanners = () => {
  const featured = activePromos[0];
  const rest = activePromos.slice(1);

  return (
    <section className="section-padding" id="promotions">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
            Promotions
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-3">
            โปรโมชั่น<span className="text-gradient">พิเศษ</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ข้อเสนอสุดพิเศษสำหรับลูกค้าองค์กร — อัพเดทล่าสุด
          </p>
        </div>

        {/* Featured promo */}
        <Link
          to={featured.link || "/promotions"}
          className="card-surface overflow-hidden group hover:border-primary/30 transition-all mb-6 flex flex-col md:flex-row"
        >
          <div className="relative bg-secondary/20 flex items-center justify-center p-8 md:w-2/5">
            {featured.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground inline-flex items-center gap-1">
                <Flame size={10} /> {featured.badge}
              </span>
            )}
            >
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500 text-white">
              <Zap size={10} /> กำลังจัด
            </span>
            <img
              src={featured.image}
              alt={featured.title}
              className="max-h-56 object-contain group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground font-medium">{featured.period}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{featured.title}</h3>
            <p className="text-sm text-primary font-medium mb-3">{featured.subtitle}</p>
            <ul className="space-y-1 mb-4">
              {featured.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">✓</span> {h}
                </li>
              ))}
              >
            </ul>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
              ดูรายละเอียด <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        {/* Rest of promos */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {rest.map((promo) => (
            <Link
              key={promo.id}
              to={promo.link || "/promotions"}
              className="card-surface overflow-hidden group hover:border-primary/30 transition-all flex flex-col"
            >
              <div className="relative bg-secondary/20 flex items-center justify-center p-6 h-44">
                {promo.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                    promo.status === "active"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-amber-500 text-white"
                  }`}>
                    {(promo as any).badgeIcon === "flame" && <Flame size={8} />}
                    {promo.badge}
                  </span>
                )}
                >
                <span className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  promo.status === "active" ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                }`}>
                  {promo.status === "active" ? <Zap size={10} /> : <Bell size={10} />}
                  {promo.status === "active" ? "กำลังจัด" : "จัดประจำ"}
                </span>
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Calendar size={12} className="text-primary" />
                  <span className="text-[11px] text-muted-foreground">{promo.period}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-0.5 leading-tight">{promo.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{promo.subtitle}</p>
                <ul className="space-y-0.5 mb-3">
                  {promo.highlights.slice(0, 2).map((h) => (
                    <li key={h} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="text-primary text-[10px]">✓</span> {h}
                    </li>
                  ))}
                  >
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                  ดูเพิ่มเติม <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
          >
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/promotions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles size={16} /> ดูโปรโมชั่นทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
