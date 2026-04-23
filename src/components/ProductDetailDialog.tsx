import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Cpu, Zap, ExternalLink, Maximize2, X, Shield, Sparkles, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { upcSeriesDetails } from "@/data/upcSeriesDetails";
import { upcDimensionImages } from "@/data/upcDimensionImages";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  productId: string | null;
  productName?: string;
  cpu?: string;
  highlight?: string;
  tag?: string;
  datasheet?: string;
  fallbackImage?: string;
};

const ProductDetailDialog = ({
  open,
  onOpenChange,
  productId,
  productName,
  cpu,
  highlight,
  tag,
  datasheet,
  fallbackImage,
}: Props) => {
  const detail = productId ? upcSeriesDetails[productId] : null;
  const gallery = detail?.gallery?.length ? detail.gallery : fallbackImage ? [fallbackImage] : [];
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // reset image index when product changes
  useState(() => setActiveImage(0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-start gap-3 flex-wrap">
            {tag && <Badge variant="outline" className="text-xs">{tag}</Badge>}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl md:text-2xl font-display font-bold">
                {productName ?? productId}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1 flex flex-wrap gap-3">
                {cpu && <span className="inline-flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> {cpu}</span>}
                {highlight && <span className="inline-flex items-center gap-1 text-primary font-medium"><Zap className="w-3.5 h-3.5" /> {highlight}</span>}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {/* Gallery */}
            <div>
              <div className="aspect-[4/3] rounded-xl bg-secondary/40 border border-border overflow-hidden flex items-center justify-center p-4">
                {gallery[activeImage] ? (
                  <img
                    src={gallery[activeImage]}
                    alt={`${productName ?? productId} ${activeImage + 1}`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">ไม่มีรูป</div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 bg-secondary/30 flex items-center justify-center p-1 transition-all ${
                        activeImage === i ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={src} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions + Highlights */}
            <div className="flex flex-col">
              {detail?.intro && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{detail.intro}</p>
              )}

              {detail?.highlights && (
                <div className="space-y-1.5 mb-5">
                  {detail.highlights.slice(0, 7).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{h}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-border space-y-3">
                {/* Warranty badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                    <Shield className="w-3.5 h-3.5" /> รับประกัน 1 ปี (มาตรฐาน)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> ขยายได้ถึง 3 ปี
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {productName && (
                    <AddToCartButton
                      productModel={productName}
                      productName={`${productName}${highlight ? ` — ${highlight}` : ""}`}
                      productDescription={`${cpu ?? ""}${detail?.intro ? ` • ${detail.intro}` : ""}`}
                      size="sm"
                    />
                  )}
                  <QuoteRequestButton productName={productName ?? productId ?? "UPC Series"} />
                </div>
                {datasheet && (
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={datasheet} target="_blank" rel="noreferrer">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> ดาวน์โหลด Datasheet (PDF)
                    </a>
                  </Button>
                )}

                {/* B2B Platform CTA */}
                <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-tight">
                        สร้างใบเสนอราคาอัตโนมัติ ภายใน 4 ชั่วโมง
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        ใช้ระบบ B2B Platform จัดซื้อแบบมืออาชีพ — ติดตามสถานะ PO, ใบกำกับภาษี, จัดส่งครบในที่เดียว
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/request-quote"
                    onClick={() => onOpenChange(false)}
                    className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    เริ่มขอใบเสนอราคา <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Specs / Features / Dimensions */}
          {detail ? (
            <Tabs defaultValue="specs" className="mt-6">
              <div className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-1 h-3 bg-primary rounded-full" />
                  คลิกเพื่อดูข้อมูลเพิ่มเติม
                </p>
                <TabsList className="h-auto p-1 bg-secondary/60 border border-border rounded-lg flex flex-wrap gap-1">
                  <TabsTrigger
                    value="specs"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-4 py-2 text-sm font-semibold rounded-md transition-all hover:bg-background"
                  >
                    📋 Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-4 py-2 text-sm font-semibold rounded-md transition-all hover:bg-background"
                  >
                    ✨ Features
                  </TabsTrigger>
                  {productId && upcDimensionImages[productId]?.length > 0 && (
                    <TabsTrigger
                      value="dimensions"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md px-4 py-2 text-sm font-semibold rounded-md transition-all hover:bg-background"
                    >
                      📐 Dimensions
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="specs" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {detail.specs.map((group, gi) => (
                    <div key={gi} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-secondary/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                        {group.title}
                      </div>
                      <table className="w-full text-sm">
                        <tbody>
                          {group.rows.map((r, ri) => (
                            <tr key={ri} className="border-t border-border first:border-t-0">
                              <td className="px-3 py-2 text-muted-foreground w-1/3 align-top font-medium">{r.label}</td>
                              <td className="px-3 py-2 text-foreground/90">{r.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-4">
                <div className="grid sm:grid-cols-2 gap-2">
                  {detail.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm border border-border rounded-lg p-3 bg-secondary/20">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>




              {productId && upcDimensionImages[productId]?.length > 0 && (
                <TabsContent value="dimensions" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      ภาพสินค้าและขนาดมิติ — คลิกที่ภาพเพื่อขยาย หรือกดปุ่มดาวน์โหลด
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {upcDimensionImages[productId].map((src, i) => (
                        <div
                          key={i}
                          className="group relative border border-border rounded-lg bg-secondary/20 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => setLightbox(src)}
                            className="w-full flex items-center justify-center p-3 cursor-zoom-in hover:bg-secondary/40 transition-colors"
                            aria-label={`ขยายภาพ ${i + 1}`}
                          >
                            <img
                              src={src}
                              alt={`${productName ?? productId} dimension ${i + 1}`}
                              className="max-h-72 w-auto object-contain group-hover:scale-[1.02] transition-transform"
                              loading="lazy"
                            />
                          </button>
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setLightbox(src)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-background/90 backdrop-blur border border-border shadow hover:bg-primary hover:text-primary-foreground transition-colors"
                              title="ขยายภาพ"
                              aria-label="ขยายภาพ"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <a
                              href={src}
                              download
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-background/90 backdrop-blur border border-border shadow hover:bg-primary hover:text-primary-foreground transition-colors"
                              title="ดาวน์โหลดภาพ"
                              aria-label="ดาวน์โหลดภาพ"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="mt-6 p-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground text-center">
              ยังไม่มีรายละเอียดสเปกของรุ่นนี้ — กรุณาดาวน์โหลด Datasheet หรือขอใบเสนอราคา
            </div>
          )}
        </div>
      </DialogContent>

      {/* Lightbox for dimension images */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/20 hover:bg-background/40 text-white transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
          <a
            href={lightbox}
            download
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-16 inline-flex items-center gap-1.5 px-3 h-10 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <Download className="w-4 h-4" /> ดาวน์โหลด
          </a>
          <img
            src={lightbox}
            alt="Dimension preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Dialog>
  );
};

export default ProductDetailDialog;
