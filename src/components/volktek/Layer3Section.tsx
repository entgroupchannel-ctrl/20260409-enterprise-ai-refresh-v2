import { useState } from "react";
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { volktekLayer3 } from "@/data/volktek-products";
import AddToCartButton from "@/components/AddToCartButton";
import QuoteRequestButton from "@/components/QuoteRequestButton";

/**
 * Phase 1 — Layer 3 Industrial Ethernet Switches (รุ่นจริงจากโรงงาน Volktek)
 * แสดงใต้ section Catalog เดิม โดยไม่แตะ category card grid ของหน้า /volktek
 */
const Layer3Section = () => {
  const [active, setActive] = useState(volktekLayer3.subCategories[0].id);

  return (
    <section id="layer3-detail" className="card-surface p-6 md:p-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary block">
            Detailed Catalog · Phase 1
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {volktekLayer3.title}
          </h2>
        </div>
      </div>

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="h-auto flex-wrap gap-1 bg-secondary/40 mb-5">
          {volktekLayer3.subCategories.map((sub) => (
            <TabsTrigger key={sub.id} value={sub.id} className="text-xs md:text-sm">
              {sub.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {volktekLayer3.subCategories.map((sub) => (
          <TabsContent key={sub.id} value={sub.id} className="mt-0">
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              {sub.blurb}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sub.products.map((p) => (
                <div
                  key={p.model}
                  className="rounded-xl border border-border bg-background/40 overflow-hidden hover:border-primary/40 transition-colors group"
                >
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.model}
                      loading="lazy"
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="font-mono text-base font-bold text-foreground mb-1.5">
                      {p.model}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.features.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border">
                      <AddToCartButton
                        productModel={p.model}
                        productName={`Volktek ${p.model}`}
                        productDescription={p.description}
                        size="sm"
                        variant="outline"
                        iconOnly
                      />
                      <QuoteRequestButton
                        productModel={p.model}
                        productName={`Volktek ${p.model}`}
                        size="sm"
                        variant="outline"
                        iconOnly
                      />
                      <Button variant="ghost" size="sm" asChild className="ml-auto text-xs">
                        <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
                          รายละเอียด <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default Layer3Section;
