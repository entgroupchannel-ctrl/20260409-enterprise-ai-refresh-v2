import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, FileText, Search, ArrowUpDown, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { savePendingQuote } from '@/hooks/usePendingQuote';
import { UPC_PRICING } from '@/data/upcPricing';
import { cn } from '@/lib/utils';

type Model = {
  id: string;
  name: string;
  cpu: string;
  highlight: string;
  feature: string;
  image: string;
  datasheet: string;
  tag: 'EPC' | 'UPC' | 'CTN';
  popular?: boolean;
};

interface Props {
  models: Model[];
  onViewDetail?: (model: Model) => void;
}

const fmt = (n: number) => n.toLocaleString('th-TH');

const tagColor = (tag: Model['tag']) => {
  switch (tag) {
    case 'UPC': return 'bg-primary/10 text-primary border-primary/30';
    case 'EPC': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    case 'CTN': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
  }
};

type SortKey = 'name' | 'priceFrom' | 'priceTo';

export default function UpcPricingTable({ models, onViewDetail }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('priceFrom');
  const [sortAsc, setSortAsc] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  const rows = useMemo(() => {
    return models.map((m) => {
      const pricing = UPC_PRICING[m.name.toUpperCase()];
      const prices = pricing?.cpus.map((c) => c.total) ?? [];
      const priceFrom = prices.length ? Math.min(...prices) : 0;
      const priceTo = prices.length ? Math.max(...prices) : 0;
      return {
        ...m,
        priceFrom,
        priceTo,
        cpuOptions: pricing?.cpus.length ?? 0,
        included: pricing?.includedFeatures ?? [],
        chassis: pricing?.chassis ?? null,
      };
    });
  }, [models]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.cpu.toLowerCase().includes(q) ||
        r.highlight.toLowerCase().includes(q) ||
        r.feature.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'priceFrom') cmp = a.priceFrom - b.priceFrom;
      else cmp = a.priceTo - b.priceTo;
      return sortAsc ? cmp : -cmp;
    });
  }, [rows, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleAddToCart = async (row: typeof filtered[0]) => {
    if (!row.priceFrom) return;
    if (!user) {
      savePendingQuote({
        customer_name: '', customer_email: '', customer_phone: null, customer_company: null,
        notes: `รุ่น ${row.name} (สเปกเริ่มต้น)`,
        products: [{
          model: row.name,
          description: `${row.name} • ${row.cpu} • ${row.highlight}`,
          qty: 1, unit_price: row.priceFrom, discount_percent: 0, line_total: row.priceFrom,
        }],
      });
      toast({ title: 'บันทึกแล้ว', description: 'กรุณาเข้าสู่ระบบเพื่อเพิ่มลงตะกร้า' });
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    setAdding(row.id);
    try {
      await addToCart({
        model: row.name,
        name: `${row.name} — ${row.highlight}`,
        description: `${row.cpu} • ${row.feature}`,
        quantity: 1,
        price: row.priceFrom,
      });
    } finally {
      setAdding(null);
    }
  };

  const handleQuote = (row: typeof filtered[0]) => {
    savePendingQuote({
      customer_name: '', customer_email: user?.email ?? '',
      customer_phone: null, customer_company: null,
      notes: `ขอใบเสนอราคา ${row.name} (สเปกเริ่มต้น)`,
      products: [{
        model: row.name,
        description: `${row.name} • ${row.cpu} • ${row.highlight}`,
        qty: 1,
        unit_price: row.priceFrom || 0,
        discount_percent: 0,
        line_total: row.priceFrom || 0,
      }],
    });
    navigate('/request-quote?action=continue');
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="overflow-hidden border-border">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between p-3 border-b border-border bg-muted/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหาชื่อรุ่น / CPU / ฟีเจอร์..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            แสดง <span className="font-semibold text-foreground">{filtered.length}</span> / {models.length} รุ่น • ราคาเริ่มต้น base config
          </p>
        </div>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left">
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider w-16">รูป</th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 hover:text-foreground">
                    รุ่น <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">CPU</th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center w-20">RAM</th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center w-24">SSD</th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden xl:table-cell">พอร์ต / จุดเด่น</th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">
                  <button onClick={() => toggleSort('priceFrom')} className="inline-flex items-center gap-1 hover:text-foreground">
                    ราคาเริ่มต้น <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-3 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center w-32">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-border/60 transition-colors hover:bg-muted/40',
                    i % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                  )}
                >
                  <td className="px-3 py-2">
                    <button onClick={() => onViewDetail?.(row)} className="block w-12 h-12 rounded-md bg-secondary/40 overflow-hidden hover:ring-2 hover:ring-primary/40 transition">
                      <img src={row.image} alt={row.name} className="w-full h-full object-contain" loading="lazy" />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', tagColor(row.tag))}>{row.tag}</Badge>
                      {row.popular && <Badge className="text-[9px] px-1.5 py-0 bg-primary text-primary-foreground border-0">Hot</Badge>}
                    </div>
                    <button onClick={() => onViewDetail?.(row)} className="font-bold text-foreground hover:text-primary transition-colors text-left">
                      {row.name}
                    </button>
                    {row.chassis && <p className="text-[10px] text-muted-foreground mt-0.5">{row.chassis} chassis</p>}
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-xs text-foreground font-medium">{row.cpu}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{row.cpuOptions} ตัวเลือก</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 bg-secondary/60 border-border text-foreground">
                      4 GB
                    </Badge>
                    <p className="text-[9px] text-muted-foreground mt-1">→ 32 GB</p>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 bg-secondary/60 border-border text-foreground">
                      128 GB
                    </Badge>
                    <p className="text-[9px] text-muted-foreground mt-1">→ 2 TB</p>
                  </td>
                  <td className="px-3 py-2 hidden xl:table-cell max-w-xs">
                    {row.included.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {row.included.map((f) => (
                          <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">{row.feature}</p>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.priceFrom > 0 ? (
                      <>
                        <p className="font-bold text-foreground whitespace-nowrap">฿{fmt(row.priceFrom)}</p>
                        {row.priceTo > row.priceFrom && (
                          <p className="text-[10px] text-muted-foreground whitespace-nowrap">สูงสุด ฿{fmt(row.priceTo)}</p>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">สอบถาม</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAddToCart(row)}
                            disabled={adding === row.id || !row.priceFrom}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>เพิ่มลงตะกร้า (สเปกเริ่มต้น)</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuote(row)}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>ขอใบเสนอราคา</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <a href={row.datasheet} target="_blank" rel="noreferrer" aria-label="Datasheet">
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>ดาวน์โหลด Datasheet</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                    ไม่พบรุ่นที่ตรงกับการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {filtered.map((row) => (
            <div key={row.id} className="p-3 flex gap-3">
              <button onClick={() => onViewDetail?.(row)} className="w-16 h-16 rounded-md bg-secondary/40 overflow-hidden shrink-0">
                <img src={row.image} alt={row.name} className="w-full h-full object-contain" loading="lazy" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', tagColor(row.tag))}>{row.tag}</Badge>
                  {row.popular && <Badge className="text-[9px] px-1.5 py-0 bg-primary text-primary-foreground border-0">Hot</Badge>}
                </div>
                <button onClick={() => onViewDetail?.(row)} className="font-bold text-sm">{row.name}</button>
                <p className="text-[11px] text-muted-foreground">{row.cpu}</p>
                <p className="text-xs font-medium text-primary">{row.highlight}</p>
                <div className="flex items-center justify-between mt-1.5">
                  {row.priceFrom > 0 ? (
                    <p className="text-sm font-bold">฿{fmt(row.priceFrom)} <span className="text-[10px] text-muted-foreground font-normal">เริ่มต้น</span></p>
                  ) : <span className="text-xs text-muted-foreground">สอบถามราคา</span>}
                  <div className="flex gap-1">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleAddToCart(row)} disabled={adding === row.id || !row.priceFrom}>
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                    <Button size="icon" className="h-7 w-7" onClick={() => handleQuote(row)}>
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">ไม่พบรุ่นที่ตรงกับการค้นหา</p>
          )}
        </div>

        {/* Footer note */}
        <div className="px-3 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground text-center">
          ราคาเริ่มต้น = base config (4GB RAM / 128GB SSD / รับประกัน 1 ปี) ยังไม่รวม VAT 7% • คลิกชื่อรุ่นเพื่อปรับแต่งสเปกเอง
        </div>
      </Card>
    </TooltipProvider>
  );
}
