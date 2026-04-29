import { Plug, Zap } from "lucide-react";
import { cfPowerSupplyCatalog, voltageBadgeClass, type PowerSupplyModel, type PowerSeries } from "@/data/cffiberlink-power";

import sgdHeroImg from "@/assets/cffiberlink/power-sgd-hero.jpg";
import lgdHeroImg from "@/assets/cffiberlink/power-lgd-hero.jpg";

const SERIES_IMAGES: Record<PowerSeries, { hero: string; alt: string }> = {
  SGD: { hero: sgdHeroImg, alt: "CF Fiberlink SGD Series — Plastic DIN-Rail Power Supply" },
  LGD: { hero: lgdHeroImg, alt: "CF Fiberlink LGD Series — Aluminum Alloy DIN-Rail Power Supply" },
};

/**
 * CF Fiberlink — Industrial Power Supply Section
 * แสดงท้ายหน้า /partners/cffiberlink
 * ออกแบบเรียบ — ตารางสรุปต่อ Series ไม่มี modal/filter (ลิสต์ที่ต้องการอย่างเดียว)
 */
const PowerSupplySection = () => {
  return (
    <section className="bg-muted/30 border-t border-border py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Plug className="w-3.5 h-3.5" />
            Industrial Power Supply
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            อุปกรณ์เสริม — Power Supply DIN-Rail
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            หม้อแปลงไฟแบบราง DIN ของ CF Fiberlink — Input 85–264VAC ใช้คู่กับ Switch อุตสาหกรรมและกล้อง IP / AP / PLC
            มี 2 ซีรีส์: <span className="font-semibold text-foreground">SGD</span> เคสพลาสติก และ{" "}
            <span className="font-semibold text-foreground">LGD</span> เคสอลูมิเนียม
          </p>
        </div>

        {/* Series Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {cfPowerSupplyCatalog.map((series) => {
            const imgs = SERIES_IMAGES[series.id];
            return (
            <div key={series.id} className="card-surface overflow-hidden">
              {/* Series Header — รูปสินค้า + ข้อมูล */}
              <div className="border-b border-border bg-gradient-to-br from-muted/40 via-card to-card">
                <div className="grid grid-cols-[auto,1fr] gap-4 p-4 items-center">
                  {/* Product Photo */}
                  <div className="relative w-32 sm:w-40 h-32 sm:h-40 shrink-0 flex items-center justify-center bg-white rounded-lg border border-border/50 overflow-hidden">
                    <img
                      src={imgs.hero}
                      alt={imgs.alt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      width={1024}
                      height={1024}
                    />
                  </div>

                  {/* Series Info */}
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Zap className="w-4 h-4 text-primary shrink-0" />
                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight">{series.title}</h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border whitespace-nowrap">
                        {series.models.length} รุ่น
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary mb-1">{series.th}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{series.desc}</p>
                  </div>
                </div>
              </div>

              {/* Models Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="text-left font-semibold py-2 px-3">Model</th>
                      <th className="text-left font-semibold py-2 px-2">Power</th>
                      <th className="text-left font-semibold py-2 px-2">Output</th>
                      <th className="text-left font-semibold py-2 px-2 hidden sm:table-cell">Input</th>
                      <th className="text-right font-semibold py-2 px-3">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.models.map((m: PowerSupplyModel, i) => {
                      return (
                      <tr
                        key={m.model}
                        className={`border-t border-border hover:bg-muted/30 transition-colors ${
                          i % 2 === 0 ? "bg-background" : "bg-muted/10"
                        }`}
                      >
                        <td className="font-mono font-semibold text-foreground py-2 px-3 whitespace-nowrap">
                          {m.model}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <span className="font-semibold text-foreground">{m.power}W</span>
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[10px] font-semibold ${voltageBadgeClass(
                              m.voltage
                            )}`}
                          >
                            DC {m.voltage}V / {m.current}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                          {m.input} · {m.freq}
                        </td>
                        <td className="py-2 px-3 text-right whitespace-nowrap">
                          <span className="text-[10px] text-muted-foreground italic">สอบถามแอดมิน</span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-muted-foreground text-center mt-6">
          สเปคทั่วไปทุกรุ่น: Input 85–264VAC · 50–60Hz · สี Blue / Black · ติดตั้งแบบ DIN-Rail ·
          สอบถามราคาและจำนวนติดต่อทีมแอดมิน
        </p>
      </div>
    </section>
  );
};

export default PowerSupplySection;
