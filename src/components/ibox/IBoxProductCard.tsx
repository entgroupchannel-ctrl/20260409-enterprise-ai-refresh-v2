import { Link } from "react-router-dom";
import { Eye, Cpu, Network, Thermometer, Sparkles, FileText, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { IBoxProduct } from "@/data/ibox-products";

interface IBoxProductCardProps {
  product: IBoxProduct;
  selectedProducts: Set<string>;
  toggleSelect: (name: string) => void;
  onQuote: (name: string) => void;
}

const IBoxProductCard = ({ product, selectedProducts, toggleSelect, onQuote }: IBoxProductCardProps) => {
  const isSelected = selectedProducts.has(product.name);

  return (
    <div className={`card-surface overflow-hidden group transition-all flex flex-col ${isSelected ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"}`}>
      <Link
        to={`/ibox-series/${product.id}`}
        className="block relative aspect-[4/3] bg-gradient-to-b from-secondary/50 to-secondary/20 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.nameTH}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"

          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge>
              <Sparkles className="w-3 h-3 mr-1" />
              NEW
            </Badge>
          )}
          {product.isHot && (
            <Badge variant="destructive" className="text-xs">
              <Flame className="inline w-3 h-3 mr-0.5" /> HOT
            </Badge>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSelect(product.name); }}
          className="absolute top-3 right-3 z-10"
        >
          <Checkbox checked={isSelected} className="h-5 w-5" />
        </button>
        {product.specs.poe && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              PoE+
            </Badge>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-mono text-primary font-semibold mb-1">{product.id}</p>
        <Link to={`/ibox-series/${product.id}`}>
          <h3 className="font-display font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1 text-sm">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{product.nameTH}</p>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <Cpu className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground truncate">{product.specs.cpu}</span>
          </div>
          {product.specs.lanPorts !== undefined && product.specs.lanPorts > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Network className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-muted-foreground">
                {product.specs.lanPorts}x LAN
                {product.specs.comPorts ? `, ${product.specs.comPorts}x COM` : ""}
                {product.specs.poe ? " (PoE)" : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <Thermometer className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-muted-foreground">{product.specs.temp}</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-primary mb-3">สอบถามราคา</p>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Link to={`/ibox-series/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />
              รายละเอียด
            </Button>
          </Link>
          <Button size="sm" className="flex-1 text-xs" onClick={() => onQuote(product.name)}>
            <FileText className="w-3.5 h-3.5 mr-1" />
            ขอราคา
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IBoxProductCard;

