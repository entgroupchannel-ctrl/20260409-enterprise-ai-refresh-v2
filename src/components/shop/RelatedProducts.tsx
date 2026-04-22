import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedProduct {
  id: string;
  model: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  image_url: string | null;
  unit_price: number;
  series: string | null;
}

interface RelatedProductsProps {
  currentProductId: string;
  series: string | null;
  category: string | null;
  maxItems?: number;
}

const STORAGE_KEY = 'recentlyViewed';

export function addToRecentlyViewed(product: { id: string; slug: string; model: string; thumbnail_url: string | null; image_url?: string | null; unit_price: number }) {
  try {
    const viewed: any[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = viewed.filter((p: any) => p.id !== product.id);
    filtered.unshift(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch {}
}

function fmt(n: number) { return n.toLocaleString('th-TH'); }

async function enrichWithProductFiles(products: RelatedProduct[]): Promise<RelatedProduct[]> {
  const idsWithoutImage = products.filter(p => !p.thumbnail_url && !p.image_url).map(p => p.id);
  if (idsWithoutImage.length === 0) return products;
  const { data: files } = await supabase.from('product_files')
    .select('product_id, file_url, is_primary, display_order')
    .in('product_id', idsWithoutImage)
    .eq('file_type', 'image')
    .order('display_order', { ascending: true });
  if (!files || files.length === 0) return products;
  const fileMap = new Map<string, string>();
  for (const f of files) {
    if (!fileMap.has(f.product_id)) fileMap.set(f.product_id, f.file_url);
    if (f.is_primary) fileMap.set(f.product_id, f.file_url);
  }
  return products.map(p => fileMap.has(p.id) ? { ...p, image_url: fileMap.get(p.id)! } : p);
}

function ProductMiniCard({ p }: { p: RelatedProduct }) {
  const imgSrc = p.thumbnail_url || p.image_url || '/placeholder.svg';
  return (
    <Link to={`/shop/${p.slug}`} className="flex-shrink-0 w-40">
      <Card className="hover:shadow-md transition-shadow h-full border-border group">
        <CardContent className="p-3 space-y-2">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={imgSrc}
              alt={p.model}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={e = loading="lazy" decoding="async"> { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
            />
          </div>
          <p className="text-xs font-semibold truncate">{p.model}</p>
          <p className="text-xs text-primary font-bold">฿{fmt(p.unit_price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function RelatedProducts({ currentProductId, series, category, maxItems = 4 }: RelatedProductsProps) {
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      let q = supabase.from('products')
        .select('id, model, name, slug, thumbnail_url, image_url, unit_price, series')
        .eq('is_active', true)
        .neq('id', currentProductId)
        .gt('unit_price', 0)
        .limit(maxItems);
      if (series) q = q.eq('series', series);
      let { data } = await q;
      if ((!data || data.length === 0) && category) {
        const res = await supabase.from('products')
          .select('id, model, name, slug, thumbnail_url, image_url, unit_price, series')
          .eq('is_active', true)
          .eq('category', category)
          .neq('id', currentProductId)
          .gt('unit_price', 0)
          .limit(maxItems);
        data = res.data;
      }
      if (data && data.length > 0) {
        const enriched = await enrichWithProductFiles(data as RelatedProduct[]);
        setRelated(enriched);
      }
    };
    fetchRelated();

    try {
      const viewed: RelatedProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setRecentlyViewed(viewed.filter(p => p.id !== currentProductId).slice(0, 6));
    } catch {}
  }, [currentProductId, series, category, maxItems]);

  if (related.length === 0 && recentlyViewed.length === 0) return null;

  return (
    <div className="space-y-6">
      {related.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">สินค้าที่เกี่ยวข้อง</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {related.map(p => <ProductMiniCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
      {recentlyViewed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">สินค้าที่เพิ่งดู</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentlyViewed.map(p => <ProductMiniCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
