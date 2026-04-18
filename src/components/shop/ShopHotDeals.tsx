import { Link } from "react-router-dom";
import { ArrowRight, Flame, Zap, Gift, Tag, Truck, Sparkles } from "lucide-react";

/**
 * ShopHotDeals — แถบโปรโมชั่นวิ่งสำหรับหน้า /shop
 * - Marquee แถวบน: ดีลร้อน (รวมโปรหลายแบบ)
 * - Ticker แถวล่าง: ข้อความสั้น เน้นความเคลื่อนไหว
 */

type Deal = {
  icon: typeof Flame;
  text: string;
  cta: string;
  href: string;
  tone?: "hot" | "new" | "free" | "bulk" | "edu";
};

const DEALS: Deal[] = [
  { icon: Flame, text: "🔥 Flash Sale ลดสูงสุด 15%", cta: "ดูดีลทั้งหมด", href: "/shop?sort=discount", tone: "hot" },
  { icon: Gift, text: "🎁 ซื้อ Orin Nano Super Devkit แถม SSD 256GB", cta: "สั่งซื้อ", href: "/shop/orin-nano-super-devkit", tone: "free" },
  { icon: Zap, text: "⚡ Jetson Thor IPC พร้อมส่ง — จองล็อตแรกรับส่วนลดพิเศษ", cta: "จองเลย", href: "/shop/ipc-thor-28f1", tone: "new" },
  { icon: Tag, text: "🏷️ Mini PC เริ่ม ฿9,900 — สเปกอุตสาหกรรม", cta: "เลือกรุ่น", href: "/shop?series=Mini%20PC", tone: "hot" },
  { icon: Truck, text: "🚚 ส่งฟรีทั่วไทยเมื่อสั่งครบ ฿20,000", cta: "เริ่มช้อป", href: "/shop", tone: "free" },
  { icon: Sparkles, text: "✨ Rugged Tablet ใหม่ — กันน้ำกันฝุ่น IP65", cta: "ดูสินค้า", href: "/shop?series=Rugged%20Tablet", tone: "new" },
  { icon: Tag, text: "🎓 ส่วนลดพิเศษสำหรับสถาบันการศึกษา & หน่วยงานราชการ", cta: "ขอใบเสนอราคา", href: "/contact", tone: "edu" },
  { icon: Tag, text: "🤝 SI/Reseller ราคาพิเศษเมื่อสั่งจำนวนมาก", cta: "สมัครพาร์ทเนอร์", href: "/partner", tone: "bulk" },
];

const TICKERS = [
  "🆕 NVIDIA Jetson Thor มาแล้ว — 2070 TFLOPS",
  "💎 Panel PC อุตสาหกรรม รับประกัน 3 ปี",
  "🔧 บริการติดตั้ง & คอนฟิกฟรี สำหรับลูกค้าองค์กร",
  "🚚 จัดส่งไว — กรณีสินค้าหมด 15-30 วัน",
  "📦 ล็อตใหญ่ ส่งฟรี มีประกันทุกชิ้น",
  "💳 ผ่อน 0% นาน 10 เดือน สำหรับลูกค้าองค์กร",
  "🛡️ รับประกันคุณภาพทุกชิ้น — เปลี่ยนคืนได้ภายใน 7 วัน",
];

export default function ShopHotDeals() {
  return (
    <div className="sticky top-16 z-40 overflow-hidden border-b border-white/10 shadow-sm">
      {/* แถวบน — Hot Deals (gradient ส้ม-ชมพู) */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 text-white">
        <div className="relative flex items-center gap-3 py-2.5 text-xs sm:text-sm font-semibold">
          <div className="flex shrink-0 items-center gap-2 px-4 border-r border-white/30">
            <Flame size={14} className="animate-pulse" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Hot Deals</span>
          </div>
          <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex gap-12 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 gap-12" aria-hidden={dup === 1}>
                  {DEALS.map((p, idx) => (
                    <span key={`${dup}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                      <span>{p.text}</span>
                      <Link
                        to={p.href}
                        className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline font-bold"
                      >
                        {p.cta} <ArrowRight size={12} />
                      </Link>
                      <span className="text-white/50">•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/shop?sort=discount"
            className="hidden md:inline-flex shrink-0 items-center gap-1.5 px-4 py-1 mr-3 rounded-full bg-white text-rose-600 hover:bg-white/90 text-xs font-bold transition-colors shadow-md"
          >
            🛒 ดูโปรทั้งหมด <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* แถวล่าง — Ticker (พื้นเข้ม วิ่งสวนทาง) */}
      <div className="bg-[#0a0e27] text-white/90 border-t border-white/5">
        <div className="relative flex items-center gap-3 py-1.5 text-[11px] sm:text-xs">
          <div className="flex shrink-0 items-center gap-1.5 px-4 border-r border-white/15 text-emerald-300">
            <Sparkles size={12} className="animate-pulse" />
            <span className="hidden sm:inline tracking-wider uppercase font-bold">Live</span>
          </div>
          <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div
              className="flex gap-10 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDirection: "reverse", animationDuration: "45s" }}
            >
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 gap-10" aria-hidden={dup === 1}>
                  {TICKERS.map((t, idx) => (
                    <span key={`${dup}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                      <span>{t}</span>
                      <span className="text-emerald-400/60">◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
