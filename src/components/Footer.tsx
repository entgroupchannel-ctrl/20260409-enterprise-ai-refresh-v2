import { useState } from "react";
import {
  ChevronDown,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle,
  Loader2,
  Lock,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-entgroup.avif";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email, source: "website_footer" });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "อีเมลนี้สมัครรับข่าวสารแล้ว", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        setEmail("");
        toast({ title: "สมัครรับข่าวสารสำเร็จ!" });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      toast({ title: "เกิดข้อผิดพลาด กรุณาลองใหม่", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="กรอกอีเมลของคุณ"
        className="flex-1 px-4 py-2.5 rounded-lg bg-white/80 border border-gray-300 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary dark:bg-[hsl(220,15%,15%)] dark:border-[hsl(220,15%,22%)] dark:text-white dark:placeholder:text-[hsl(215,15%,40%)]"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : success ? (
          <>
            <CheckCircle size={16} /> สำเร็จ!
          </>
        ) : (
          "สมัคร"
        )}
      </button>
    </form>
  );
};

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Industrial PC",
    links: [
      { label: "GT Series — Fanless Mini PC", href: "/gt-series" },
      { label: "GB Series — Compact PC", href: "/gb-series" },
      { label: "EPC Box Series", href: "/epc-box-series" },
      { label: "EPC Series", href: "/epc-series" },
      { label: "iBox — Embedded PC", href: "/ibox-series" },
      { label: "Mini PC", href: "/mini-pc" },
      { label: "Waterproof PC", href: "/waterproof-pc" },
      { label: "ตู้แร็ค / Cabinets", href: "/cabinets" },
    ],
  },
  {
    title: "Panel PC & Rugged",
    links: [
      { label: "GK Series — Panel PC", href: "/gk-series" },
      { label: "Panel PC GTG — Stainless", href: "/panel-pc-gtg" },
      { label: "Smart Display / KIOSK", href: "/smart-display" },
      { label: "UTC Series", href: "/utc-series" },
      { label: "All-in-One PC", href: "/aio" },
      { label: "Rugged Tablet", href: "/rugged-tablet" },
      { label: "Rugged Notebook", href: "/rugged-notebook" },
      { label: "Rugged Handheld", href: "/handheld" },
    ],
  },
  {
    title: "AI / Network / Solutions",
    links: [
      { label: "NVIDIA Jetson — Edge AI", href: "/nvidia-jetson" },
      { label: "Jetson Solutions", href: "/nvidia-jetson/solutions" },
      { label: "AI-Ready Devices", href: "/nvidia-jetson/ai-ready" },
      { label: "GPU Server", href: "/gpu-server" },
      { label: "Professional GPU", href: "/professional-gpu" },
      { label: "ตัวช่วยเลือกสินค้า (Product Advisor)", href: "/product-advisor" },
      { label: "Mini PC Firewall", href: "/minipc-firewall" },
      { label: "Volktek — Network Switch", href: "/volktek" },
      { label: "vCloudPoint — Zero Client", href: "/vcloudpoint" },
    ],
  },
  {
    title: "บริการลูกค้า",
    links: [
      { label: "วิธีใช้งานแพลตฟอร์ม", href: "/platform" },
      { label: "🛒 Shop — สั่งซื้อออนไลน์", href: "/shop" },
      { label: "เปรียบเทียบสินค้า", href: "/shop/compare" },
      { label: "ขอใบเสนอราคา", href: "/request-quote" },
      { label: "ลงทะเบียนสินค้า (Warranty)", href: "/my/products/register" },
      { label: "แจ้งซ่อม / Request Repair", href: "/my/repairs/new" },
      { label: "เงื่อนไขการรับประกัน", href: "/warrantys" },
      { label: "วิธีการชำระเงิน", href: "/payment" },
      { label: "ขั้นตอนการจัดส่ง", href: "/delivery" },
    ],
  },
  {
    title: "เกี่ยวกับเรา & พันธมิตร",
    links: [
      { label: "เกี่ยวกับเรา", href: "/about-us" },
      { label: "ติดต่อเรา / แผนที่", href: "/contact" },
      { label: "กรณีศึกษาลูกค้า", href: "/case-studies" },
      { label: "บทความเทคนิค", href: "/blog" },
      { label: "โปรโมชั่น", href: "/promotions" },
      { label: "พันธมิตรโรงงาน (Partner)", href: "/partner" },
      { label: "Partner Portal", href: "/partner/portal" },
      { label: "สร้างรายได้ (Affiliate)", href: "/affiliate" },
      { label: "สมัคร Affiliate", href: "/affiliate/apply" },
      { label: "สมัครงาน", href: "https://entgroup-job.lovable.app/", external: true },
    ],
  },
];

const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.79 4.79 0 0 1-1-.06z" />
  </svg>
);

const socials = [
  { icon: Facebook, href: "https://www.facebook.com/entgroup.th/", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@ENTGROUP-TH", label: "YouTube" },
  { icon: Instagram, href: "https://www.instagram.com/entgroupcompany/", label: "Instagram" },
  { icon: TiktokIcon, href: "https://www.tiktok.com/@entgroup", label: "TikTok" },
];

const CollapsibleSection = ({ title, links }: { title: string; links: FooterLink[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-[hsl(220,15%,18%)] md:border-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-3 md:py-0 md:pointer-events-none md:cursor-default text-left"
      >
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        <ChevronDown
          size={16}
          className={`text-gray-400 dark:text-[hsl(215,15%,55%)] transition-transform duration-200 md:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>

      <ul
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out md:!max-h-[500px] md:mt-3 ${
          open ? "max-h-[500px] pb-3" : "max-h-0"
        }`}
      >
        {links.map((link) => (
          <li key={link.label} className="mb-1.5">
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-[hsl(215,15%,55%)] hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                to={link.href}
                className="text-sm text-gray-600 dark:text-[hsl(215,15%,55%)] hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const [pdpaOpen, setPdpaOpen] = useState(false);

  return (
    <footer className="border-t border-border" id="contact">
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-gray-100 to-gray-300 text-gray-700 dark:from-[hsl(220,15%,16%)] dark:via-[hsl(220,18%,10%)] dark:to-[hsl(220,20%,6%)] dark:text-[hsl(210,20%,85%)]">
        {/* ลายกนกไทย — ผนังวัด มุมล่างขวา กลืนพื้นหลัง */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-[170px] h-[170px] md:w-[230px] md:h-[230px] opacity-[0.10] dark:opacity-[0.12] select-none z-0 mix-blend-multiply dark:mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g fill='none' stroke='%238B6F2A' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><path d='M100 25 C 68 55, 68 95, 100 118 C 132 95, 132 55, 100 25 Z'/><path d='M100 42 C 82 62, 82 88, 100 105 C 118 88, 118 62, 100 42 Z'/><path d='M100 58 C 90 70, 90 90, 100 100 C 110 90, 110 70, 100 58 Z'/><circle cx='100' cy='78' r='2'/><path d='M55 115 C 68 138, 88 148, 100 138'/><path d='M145 115 C 132 138, 112 148, 100 138'/><path d='M68 138 C 74 153, 90 160, 100 152'/><path d='M132 138 C 126 153, 110 160, 100 152'/><path d='M100 152 C 95 168, 95 182, 100 190 C 105 182, 105 168, 100 152 Z'/><path d='M35 175 C 52 165, 70 170, 76 180'/><path d='M165 175 C 148 165, 130 170, 124 180'/></g></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right',
            backgroundSize: 'contain',
          }}
        />
        <div className="relative z-10 container max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8">
            <div className="md:col-span-1 lg:col-span-2">
              <img src={logo} alt="ENT GROUP" className="h-10 w-auto mb-4" />
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">บริษัท อีเอ็นที กรุ๊ป จำกัด</p>
              <p className="text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] leading-relaxed mb-4">
                70/5 หมู่ 4 เมทโทร บิซทาวน์ แจ้งวัฒนะ 2<br />
                ต.คลองพระอุดม อ.ปากเกร็ด<br />
                จ.นนทบุรี 11120
              </p>

              <div className="space-y-1.5 mb-4">
                <a href="tel:020456104" className="flex items-center gap-2 text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] hover:text-primary transition-colors">
                  <Phone size={12} /> 02-045-6104
                </a>
                <a href="tel:0957391053" className="flex items-center gap-2 text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] hover:text-primary transition-colors">
                  <Phone size={12} /> 095-739-1053, 084-046-1315
                </a>
                <a
                  href="https://maps.app.goo.gl/3NcEVup5QNTS88xj6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] hover:text-primary transition-colors"
                >
                  <MapPin size={12} /> แผนที่สำนักงาน
                </a>
              </div>

              <div className="flex gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:bg-gray-300 transition-colors dark:bg-[hsl(220,15%,18%)] dark:text-[hsl(215,15%,55%)] dark:hover:bg-[hsl(220,15%,22%)]"
                      aria-label={social.label}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>

            {footerSections.map((section) => (
              <CollapsibleSection key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        {/* RFQ + Newsletter — two-column split */}
        <div className="border-t border-gray-300 dark:border-[hsl(220,15%,18%)]">
          <div className="container max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:divide-x divide-gray-300 dark:divide-[hsl(220,15%,18%)]">
            {/* RFQ */}
            <div className="md:pr-8 text-center md:text-left">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 flex items-center justify-center md:justify-start gap-1.5">
                <FileText size={15} className="text-primary" />
                ต้องการใบเสนอราคา?
              </h3>
              <p className="text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] mb-4 leading-relaxed">
                กรอกฟอร์มเพียง 2 นาที ทีมขายตอบกลับภายใน 24 ชม.<br className="hidden sm:inline" />
                รองรับงาน B2B / โครงการ / ส่วนราชการ
              </p>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                ขอใบเสนอราคา <ArrowRight size={14} />
              </Link>
            </div>

            {/* Newsletter */}
            <div className="md:pl-8 text-center md:text-left">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">สมัครรับข่าวสาร</h3>
              <p className="text-xs text-gray-600 dark:text-[hsl(215,15%,55%)] mb-4 leading-relaxed">
                รับข่าวสารล่าสุดเกี่ยวกับสินค้า โปรโมชั่น<br className="hidden sm:inline" />
                และเทคโนโลยีใหม่ๆ จาก ENT Group
              </p>
              <div className="md:mx-0">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-[hsl(220,15%,18%)]">
          <div className="container max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-bold text-foreground mr-2">เว็บไซต์ในเครือ:</span>
            {[
              { label: "Rugged Device", href: "https://entgroup-rugged.com", external: true },
              { label: "NVIDIA Jetson", href: "/nvidia-jetson" },
              { label: "ENT Group Biz", href: "/about-us" },
              { label: "VIMOSA", href: "https://www.vimosa.co.th/", external: true },
              { label: "VICHAKAN", href: "https://www.vichakarn.co/", external: true },
            ].map((site, i, arr) => (
              <span key={site.label} className="inline-flex items-center gap-1">
                {site.external ? (
                  <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {site.label}
                  </a>
                ) : (
                  <Link to={site.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {site.label}
                  </Link>
                )}
                {i < arr.length - 1 && <span className="text-muted-foreground/40 mx-1">|</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-[hsl(220,15%,18%)]">
          <div className="container max-w-7xl mx-auto px-6 py-4">
            <button
              type="button"
              onClick={() => setPdpaOpen((prev) => !prev)}
              className="flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors"
            >
              <Lock size={14} className="text-primary" />
              การคุ้มครองข้อมูลส่วนบุคคล (PDPA)
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${pdpaOpen ? "rotate-180" : ""}`} />
            </button>
            {pdpaOpen && (
              <div className="mt-3 p-4 rounded-lg bg-white/60 dark:bg-[hsl(220,15%,12%)]">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  บริษัท อีเอ็นที กรุ๊ป จำกัด ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                  ข้อมูลของท่าน ได้แก่ ชื่อ อีเมล เบอร์โทรศัพท์ และข้อมูลบริษัท จะถูกจัดเก็บเพื่อวัตถุประสงค์ในการจัดทำใบเสนอราคา ให้คำปรึกษาด้านเทคนิค และบริการหลังการขายเท่านั้น
                  เราจะไม่จำหน่าย แบ่งปัน หรือเปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-[hsl(220,15%,18%)]">
          <div className="container max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} ENT Group Co., Ltd. All rights reserved. — B2B Industrial Platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

