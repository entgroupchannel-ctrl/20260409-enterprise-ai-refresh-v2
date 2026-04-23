import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Cpu, Zap, ExternalLink } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";
import { upcSeriesDetails } from "@/data/upcSeriesDetails";

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

              <div className="mt-auto pt-4 border-t border-border space-y-2">
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
              </div>
            </div>
          </div>

          {/* Tabs: Specs / Selection / Highlights */}
          {detail ? (
            <Tabs defaultValue="specs" className="mt-6">
              <TabsList>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                {detail.selection && <TabsTrigger value="selection">Part Numbers</TabsTrigger>}
              </TabsList>

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

              {detail.selection && (
                <TabsContent value="selection" className="mt-4">
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-wide">Part Number</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-wide">CPU</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-wide">Memory</th>
                          <th className="px-3 py-2 text-left text-xs uppercase tracking-wide">Storage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.selection.map((s, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="px-3 py-2 font-mono text-xs">{s.partNumber}</td>
                            <td className="px-3 py-2">{s.cpu}</td>
                            <td className="px-3 py-2">{s.memory}</td>
                            <td className="px-3 py-2">{s.storage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
    </Dialog>
  );
};

export default ProductDetailDialog;
