import { ExternalLink, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Phone, MessageCircle, Gift, Cpu, Zap, ThermometerSun, Ruler, Plug, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import LineQRButton from "@/components/LineQRButton";
import type { VolktekProduct, VolktekSubCategory } from "@/data/volktek-products";

type Props = {
  product: VolktekProduct | null;
  subCategory: VolktekSubCategory | null;
  categoryTitle: string;
  onClose: () => void;
  onSelect: (product: VolktekProduct) => void;
};

const VolktekProductDialog = ({ product, subCategory, categoryTitle, onClose, onSelect }: Props) => {
  const open = !!product && !!subCategory;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {product && subCategory && (() => {
          const list = subCategory.products;
          const idx = list.findIndex((m) => m.model === product.model);
          const prev = idx > 0 ? list[idx - 1] : list[list.length - 1];
          const next = idx < list.length - 1 ? list[idx + 1] : list[0];
          const related = list.filter((m) => m.model !== product.model).slice(0, 6);
          const d = product.details;

          return (
            <>
              {/* Prev/Next navigator */}
              <div className="flex items-center justify-between gap-2 -mt-2 mb-1 pr-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(prev)}
                  disabled={list.length < 2}
                  className="gap-1 h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">รุ่นก่อนหน้า</span>
                  <span className="font-mono text-[10px] text-muted-foreground hidden md:inline">{prev.model}</span>
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  {idx + 1} / {list.length} ใน {subCategory.title}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(next)}
                  disabled={list.length < 2}
                  className="gap-1 h-8"
                >
                  <span className="font-mono text-[10px] text-muted-foreground hidden md:inline">{next.model}</span>
                  <span className="hidden sm:inline">รุ่นถัดไป</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <DialogHeader>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="text-[10px]">{categoryTitle}</Badge>
                  <Badge variant="outline" className="text-[10px]">{subCategory.title}</Badge>
                  {product.features.slice(0, 3).map((f) => (
                    <Badge
                      key={f}
                      className="bg-primary/15 text-primary border-primary/30 text-[10px]"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>
                <DialogTitle className="font-mono text-lg">Volktek {product.model}</DialogTitle>
                <DialogDescription className="text-sm">{product.description}</DialogDescription>
              </DialogHeader>

              {/* Image + Quick spec */}
              <div className="grid md:grid-cols-2 gap-5 mt-2">
                <div className="bg-muted rounded-lg overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={`Volktek ${product.model}`}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="space-y-3">
                  {/* Ports highlight */}
                  <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Plug className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] uppercase tracking-wide text-primary font-bold">พอร์ต / Interface</span>
                    </div>
                    {d?.ports ? (
                      <ul className="space-y-1">
                        {d.ports.slice(0, 4).map((p, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-primary shrink-0 mt-0.5">▸</span>
                            <span className="leading-snug">{p}</span>
                          </li>
                        ))}
                        {d.ports.length > 4 && (
                          <li className="text-[10px] text-muted-foreground italic ml-3">
                            + อีก {d.ports.length - 4} interface ดูด้านล่าง
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-foreground">{product.description}</p>
                    )}
                  </div>

                  {/* Power + Temp ที่สำคัญ */}
                  {d && (d.power || d.environment) && (
                    <div className="grid grid-cols-2 gap-2.5">
                      {d.power && (
                        <div className="rounded-lg border border-border bg-background/40 p-2.5">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Power</span>
                          </div>
                          <p className="text-xs font-semibold text-foreground leading-snug">{d.power.input}</p>
                          {d.power.poeBudget && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">{d.power.poeBudget}</p>
                          )}
                        </div>
                      )}
                      {d.environment && (
                        <div className="rounded-lg border border-border bg-background/40 p-2.5">
                          <div className="flex items-center gap-1 mb-0.5">
                            <ThermometerSun className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Operating Temp</span>
                          </div>
                          <p className="text-xs font-semibold text-foreground leading-snug">{d.environment.tempOperating}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{d.environment.housing}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.features.map((f) => (
                      <Badge key={f} variant="outline" className="text-[10px]">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overview */}
              {d?.overview && (
                <div className="mt-5 rounded-lg border border-border bg-secondary/20 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-primary font-bold mb-2">Overview</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{d.overview}</p>
                </div>
              )}

              {/* Highlights */}
              {d?.highlights && d.highlights.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-wide text-primary font-bold mb-3">จุดเด่น · Key Highlights</p>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {d.highlights.map((h, i) => (
                      <div key={i} className="rounded-lg border border-border bg-background/40 p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground mb-0.5 leading-snug">{h.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{h.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Spec table — มินิมอล แสดงเฉพาะที่สำคัญ */}
              {d && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[10px] uppercase tracking-wide text-primary font-bold mb-3">สเปคโดยย่อ</p>
                  <dl className="grid sm:grid-cols-2 gap-x-5 gap-y-2 text-xs">
                    {d.ports.length > 4 && (
                      <div className="sm:col-span-2 flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                        <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Interface ครบ</dt>
                        <dd className="text-foreground">
                          {d.ports.map((p, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-primary/60 shrink-0">·</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </dd>
                      </div>
                    )}
                    {d.ledPanel && (
                      <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                        <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">LED Panel</dt>
                        <dd className="text-foreground font-mono text-[11px]">{d.ledPanel}</dd>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                      <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Power Consumption</dt>
                      <dd className="text-foreground">{d.power.consumption}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                      <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Storage Temp</dt>
                      <dd className="text-foreground">{d.environment.tempStorage}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                      <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide">Humidity</dt>
                      <dd className="text-foreground">{d.environment.humidity}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                      <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide flex items-center gap-1">
                        <Ruler className="w-3 h-3" /> Dimension
                      </dt>
                      <dd className="text-foreground">{d.physical.dimension}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 pb-1.5 border-b border-border/40">
                      <dt className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wide flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Weight
                      </dt>
                      <dd className="text-foreground">{d.physical.weight}</dd>
                    </div>
                  </dl>
                  <p className="text-[10px] text-muted-foreground italic mt-3">
                    * รายละเอียดเชิงลึก (Standards / Software Features / Routing / Security ทั้งหมด) สอบถามทีมงานเพื่อเลือกรุ่นที่เหมาะกับโครงการของคุณ
                  </p>
                </div>
              )}

              {/* No-detail fallback */}
              {!d && (
                <div className="mt-5 rounded-lg border border-dashed border-border bg-background/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-3">
                    รายละเอียดเชิงลึกของรุ่นนี้กำลังจัดเตรียม — ดูสเปคฉบับเต็มที่เว็บโรงงาน หรือสอบถามทีมเรา
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      ดูที่ volktek.com
                    </a>
                  </Button>
                </div>
              )}

              {/* CTAs */}
              <div className="mt-5 flex gap-2 flex-wrap">
                <QuoteRequestButton
                  productModel={product.model}
                  productName={`Volktek ${product.model}`}
                  size="sm"
                />
                <AddToCartButton
                  productModel={product.model}
                  productName={`Volktek ${product.model}`}
                  productDescription={product.description}
                  size="sm"
                  variant="outline"
                />
                {d?.datasheetUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={d.datasheetUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Datasheet PDF
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> volktek.com
                  </a>
                </Button>
              </div>

              {/* PR Banner */}
              <div className="mt-4 rounded-lg border border-amber-400/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-3.5">
                <div className="flex items-start gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-foreground">สอบถามโปรโมชั่นพิเศษ</div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      ส่วนลด • ของแถม • ข้อเสนอพิเศษสำหรับโครงการ — ติดต่อทีมแอดมินได้เลย
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <a
                    href="tel:020456104"
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/80 border border-border hover:border-primary/50 text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" /> 02-045-6104
                  </a>
                  <a
                    href="tel:0957391053"
                    className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/80 border border-border hover:border-primary/50 text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" /> 095-739-1053
                  </a>
                  <LineQRButton className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> LINE @entgroup
                  </LineQRButton>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">รุ่นในหมวดเดียวกัน</h4>
                    <span className="text-[10px] text-muted-foreground ml-auto">{subCategory.title}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {related.map((m) => (
                      <button
                        key={m.model}
                        type="button"
                        onClick={() => onSelect(m)}
                        className="group text-left card-surface p-2 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                      >
                        <div className="aspect-square bg-muted rounded overflow-hidden mb-1.5">
                          <img
                            src={m.image}
                            alt={m.model}
                            loading="lazy"
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="font-mono text-[10px] font-semibold text-foreground truncate">{m.model}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
};

export default VolktekProductDialog;
