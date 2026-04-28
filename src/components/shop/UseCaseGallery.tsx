import { Sparkles } from "lucide-react";

export interface UseCaseItem {
  image: string;
  title: string;     // short scenario label (e.g. "Retail Self-service")
  caption: string;   // 1-line inspiration / value
}

interface Props {
  items: UseCaseItem[];
  heading?: string;
  subheading?: string;
}

/**
 * Inspirational use-case gallery (4-up).
 * Section "ใช้งานเหมาะกับ" — แสดงเป็นภาพบรรยากาศการใช้งานจริง
 * เพื่อสร้างแรงบันดาลใจให้ลูกค้านำไปใช้ในธุรกิจของตน
 */
export default function UseCaseGallery({
  items,
  heading = "ใช้งานเหมาะกับ",
  subheading = "ภาพบรรยากาศการใช้งานจริง — เลือกได้ตรงกับธุรกิจของคุณ",
}: Props) {
  return (
    <section className="container mx-auto px-4 pb-10">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            {heading}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{subheading}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((uc, i) => (
          <figure
            key={i}
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted/30">
              <img
                src={uc.image}
                alt={uc.title}
                loading="lazy"
                width={1024}
                height={768}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>

            <figcaption className="absolute inset-x-0 bottom-0 p-3 text-white">
              <p className="text-xs uppercase tracking-wider opacity-80 mb-0.5">
                Use case 0{i + 1}
              </p>
              <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow">
                {uc.title}
              </h3>
              <p className="text-[11px] md:text-xs leading-snug opacity-90 mt-1 line-clamp-2 drop-shadow">
                {uc.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
