import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageBannerProps {
  image: string;
  title: string;
  subtitle?: string;
}

const PageBanner = ({ image, title, subtitle }: PageBannerProps) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container max-w-7xl mx-auto px-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{title}</h1>
            {subtitle && <p className="text-sm md:text-base text-white/80">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="container max-w-7xl mx-auto px-6 py-3 border-b border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          <ArrowLeft size={14} />
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
};

export default PageBanner;
