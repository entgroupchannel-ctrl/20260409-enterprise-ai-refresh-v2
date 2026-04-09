import { Phone, MapPin, Facebook, Youtube, Instagram, Crosshair, Server, ShieldCheck, Monitor, Tablet, Cloud, Tv } from "lucide-react";
import LineQRButton from "@/components/LineQRButton";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-entgroup.avif";

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

const quickLinks = [
  { label: "GT Series", href: "/gt-series", icon: Server },
  { label: "Mini PC Firewall", href: "/minipc-firewall", icon: ShieldCheck },
  { label: "Panel PC", href: "/panel-pc-gtg", icon: Monitor },
  { label: "Rugged Tablet", href: "/rugged-tablet", icon: Tablet },
  { label: "vCloudPoint", href: "/vcloudpoint", icon: Cloud },
  { label: "Smart Display", href: "/smart-display", icon: Tv },
  { label: "ช่วยเลือกสินค้า", href: "/product-advisor", icon: Crosshair },
];

const FooterCompact = () => {
  return (
    <footer className="mt-auto bg-[hsl(220,20%,10%)] text-[hsl(210,20%,85%)] border-t border-border">
      <div className="container max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo + Contact */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="ENT GROUP" className="h-8 w-auto" />
            <div className="w-px h-8 bg-[hsl(220,15%,20%)]" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">บจก. อีเอ็นที กรุ๊ป</span>
              <div className="flex items-center gap-3 text-[11px] text-[hsl(215,15%,55%)]">
                <a href="tel:020456104" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Phone size={10} /> 02-045-6104
                </a>
                <a href="https://maps.app.goo.gl/3NcEVup5QNTS88xj6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MapPin size={10} /> แผนที่
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links — horizontal */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {quickLinks.map((link) => (
              <Link
                key={link.label}>
                to={link.href}
                className="inline-flex items-center gap-1 text-[11px] text-[hsl(215,15%,55%)] hover:text-primary transition-colors">
                <link.icon size={10} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}>
                href={s.href}>
                target="_blank">
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-[hsl(220,15%,18%)] flex items-center justify-center text-[hsl(215,15%,55%)] hover:text-primary hover:bg-[hsl(220,15%,22%)] transition-colors">
                aria-label={s.label}
                <s.icon size={12} />
              </a>
            ))}
            <LineQRButton
              className="ml-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-colors flex items-center gap-1">
              LINE @entgroup
            </LineQRButton>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[hsl(220,15%,15%)]">
        <div className="container max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[hsl(215,15%,40%)]">
            © {new Date().getFullYear()} ENT Group Co., Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[10px] text-[hsl(215,15%,40%)]">
            <Link to="/" className="hover:text-primary transition-colors">หน้าหลัก</Link>
            <span>·</span>
            <Link to="/about-us" className="hover:text-primary transition-colors">เกี่ยวกับเรา</Link>
            <span>·</span>
            <span className="text-primary/70">PDPA ✓</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCompact;
