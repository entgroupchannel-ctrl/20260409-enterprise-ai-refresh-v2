import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

// Import all GT images from src/assets
import gt1000Banner from '@/assets/gt1000-banner.jpg';
import gt1000Front from '@/assets/gt1000-front.jpg';
import gt1000Hero from '@/assets/gt1000-hero.jpg';
import gt1000Product from '@/assets/gt1000-product.jpg';
import gt1000Rear from '@/assets/gt1000-rear.jpg';
import gt1000Side from '@/assets/gt1000-side.jpg';
import gt1000Top from '@/assets/gt1000-top.jpg';
import gt1000Wifi from '@/assets/gt1000-wifi.jpg';
import gt1200Product from '@/assets/gt1200-product.jpg';
import gt1400Product from '@/assets/gt1400-product.jpg';
import gt2000Banner from '@/assets/gt2000-banner.jpg';
import gt2000Product from '@/assets/gt2000-product.jpg';
import gt3000Banner from '@/assets/gt3000-banner.jpg';
import gt3000Product from '@/assets/gt3000-product.jpg';
import gt4000Banner from '@/assets/gt4000-banner.jpg';
import gt4000Product from '@/assets/gt4000-product.jpg';
import gt4500Banner from '@/assets/gt4500-banner.jpg';
import gt4500Product from '@/assets/gt4500-product.jpg';
import gt5000Banner from '@/assets/gt5000-banner.jpg';
import gt5000Product from '@/assets/gt5000-product.jpg';
import gt6000Banner from '@/assets/gt6000-banner.jpg';
import gt6000Product from '@/assets/gt6000-product.jpg';
import gt7000Banner from '@/assets/gt7000-banner.jpg';
import gt7000Product from '@/assets/gt7000-product.jpg';
import gt8000Banner from '@/assets/gt8000-banner.jpg';
import gt8000Product from '@/assets/gt8000-product.jpg';
import gt9000Banner from '@/assets/gt9000-banner.jpg';
import gt9000Product from '@/assets/gt9000-product.jpg';

interface GTModel {
  model: string;
  series: string;
  category: string;
  name: string;
  description: string;
  unit_price: number;
  primary: string;
  gallery: { url: string; filename: string; label: string }[];
}

const GT_MODELS: GTModel[] = [
  {
    model: 'GT1000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1000 — 10.4" Industrial Panel PC',
    description: 'Fanless industrial panel PC, ARM Cortex, IP65 front',
    unit_price: 19500, primary: gt1000Product,
    gallery: [
      { url: gt1000Product, filename: 'gt1000-product.jpg', label: 'หลัก' },
      { url: gt1000Front, filename: 'gt1000-front.jpg', label: 'ด้านหน้า' },
      { url: gt1000Rear, filename: 'gt1000-rear.jpg', label: 'ด้านหลัง' },
      { url: gt1000Side, filename: 'gt1000-side.jpg', label: 'ด้านข้าง' },
      { url: gt1000Top, filename: 'gt1000-top.jpg', label: 'ด้านบน' },
      { url: gt1000Hero, filename: 'gt1000-hero.jpg', label: 'Hero' },
      { url: gt1000Banner, filename: 'gt1000-banner.jpg', label: 'Banner' },
      { url: gt1000Wifi, filename: 'gt1000-wifi.jpg', label: 'WiFi version' },
    ],
  },
  {
    model: 'GT1200', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1200 — 12" Industrial Panel PC',
    description: 'Fanless 12-inch panel PC',
    unit_price: 22500, primary: gt1200Product,
    gallery: [{ url: gt1200Product, filename: 'gt1200-product.jpg', label: 'หลัก' }],
  },
  {
    model: 'GT1400', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT1400 — 14" Industrial Panel PC',
    description: 'Fanless 14-inch panel PC',
    unit_price: 26500, primary: gt1400Product,
    gallery: [{ url: gt1400Product, filename: 'gt1400-product.jpg', label: 'หลัก' }],
  },
  {
    model: 'GT2000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT2000 — 15" Industrial Panel PC',
    description: 'Industrial 15-inch panel PC, Intel Celeron',
    unit_price: 32000, primary: gt2000Product,
    gallery: [
      { url: gt2000Product, filename: 'gt2000-product.jpg', label: 'หลัก' },
      { url: gt2000Banner, filename: 'gt2000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT3000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT3000 — 15" Industrial Panel PC i5',
    description: 'Industrial 15-inch panel PC, Intel Core i5',
    unit_price: 42000, primary: gt3000Product,
    gallery: [
      { url: gt3000Product, filename: 'gt3000-product.jpg', label: 'หลัก' },
      { url: gt3000Banner, filename: 'gt3000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT4000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT4000 — 17" Industrial Panel PC',
    description: 'Industrial 17-inch panel PC',
    unit_price: 48000, primary: gt4000Product,
    gallery: [
      { url: gt4000Product, filename: 'gt4000-product.jpg', label: 'หลัก' },
      { url: gt4000Banner, filename: 'gt4000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT4500', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT4500 — 17" Industrial Panel PC i5',
    description: 'Industrial 17-inch panel PC, Intel Core i5',
    unit_price: 55000, primary: gt4500Product,
    gallery: [
      { url: gt4500Product, filename: 'gt4500-product.jpg', label: 'หลัก' },
      { url: gt4500Banner, filename: 'gt4500-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT5000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT5000 — 19" Industrial Panel PC',
    description: 'Industrial 19-inch panel PC',
    unit_price: 58000, primary: gt5000Product,
    gallery: [
      { url: gt5000Product, filename: 'gt5000-product.jpg', label: 'หลัก' },
      { url: gt5000Banner, filename: 'gt5000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT6000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT6000 — 19" Industrial Panel PC i5',
    description: 'Industrial 19-inch panel PC, Intel Core i5',
    unit_price: 65000, primary: gt6000Product,
    gallery: [
      { url: gt6000Product, filename: 'gt6000-product.jpg', label: 'หลัก' },
      { url: gt6000Banner, filename: 'gt6000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT7000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT7000 — 21.5" Industrial Panel PC',
    description: 'Industrial 21.5-inch panel PC',
    unit_price: 72000, primary: gt7000Product,
    gallery: [
      { url: gt7000Product, filename: 'gt7000-product.jpg', label: 'หลัก' },
      { url: gt7000Banner, filename: 'gt7000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT8000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT8000 — 21.5" Industrial Panel PC i5',
    description: 'Industrial 21.5-inch panel PC, Intel Core i5',
    unit_price: 78000, primary: gt8000Product,
    gallery: [
      { url: gt8000Product, filename: 'gt8000-product.jpg', label: 'หลัก' },
      { url: gt8000Banner, filename: 'gt8000-banner.jpg', label: 'Banner' },
    ],
  },
  {
    model: 'GT9000', series: 'GT Series', category: 'Industrial Panel PC',
    name: 'GT9000 — 24" Industrial Panel PC',
    description: 'Industrial 24-inch panel PC, Intel 10th Gen',
    unit_price: 85000, primary: gt9000Product,
    gallery: [
      { url: gt9000Product, filename: 'gt9000-product.jpg', label: 'หลัก' },
      { url: gt9000Banner, filename: 'gt9000-banner.jpg', label: 'Banner' },
    ],
  },
];

async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function GTImagesImport() {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleImport = async () => {
    setRunning(true);
    setLogs([]);
    setDone(false);
    setProgress(0);

    try {
      const totalSteps = GT_MODELS.length;

      for (let i = 0; i < GT_MODELS.length; i++) {
        const m = GT_MODELS[i];
        log(`📦 ${m.model} — uploading ${m.gallery.length} images...`);

        // 1. Convert all gallery images to base64
        const images = await Promise.all(
          m.gallery.map(async (g) => ({
            filename: g.filename,
            base64Data: await urlToBase64(g.url),
            contentType: 'image/jpeg',
          }))
        );

        // 2. Upload via Edge Function
        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke(
          'upload-gt-images',
          { body: { images } }
        );

        if (uploadError) throw uploadError;

        const successUploads = uploadResult.results.filter((r: any) => r.url);
        log(`   ✅ Uploaded ${successUploads.length}/${m.gallery.length} images`);

        if (successUploads.length === 0) {
          log(`   ❌ Skipping ${m.model} — no images uploaded`);
          continue;
        }

        // 3. Find primary image URL
        const primaryUpload = uploadResult.results.find(
          (r: any) => r.filename === m.gallery[0].filename
        );
        const galleryUrls = successUploads.map((r: any) => r.url);

        // 4. INSERT or UPDATE product
        const { data: existing } = await (supabase as any)
          .from('products')
          .select('id')
          .eq('model', m.model)
          .maybeSingle();

        const slug = m.model.toLowerCase();
        const productPayload = {
          sku: slug,
          model: m.model,
          slug: slug,
          series: m.series,
          name: m.name,
          description: m.description,
          category: m.category,
          unit_price: m.unit_price,
          image_url: primaryUpload?.url || galleryUrls[0],
          thumbnail_url: primaryUpload?.url || galleryUrls[0],
          gallery_urls: galleryUrls,
          is_active: true,
        };

        if (existing) {
          await (supabase as any).from('products').update(productPayload).eq('id', existing.id);
          log(`   🔄 Updated ${m.model}`);
        } else {
          await (supabase as any).from('products').insert(productPayload);
          log(`   ➕ Created ${m.model}`);
        }

        setProgress(Math.round(((i + 1) / totalSteps) * 100));
      }

      log('🎉 Done! All GT Series products updated with images');
      setDone(true);
      toast({ title: '✅ Import สำเร็จ', description: `${GT_MODELS.length} models updated` });
    } catch (e: any) {
      log(`❌ Error: ${e.message}`);
      toast({ title: 'Import ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Import GT Series Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>นำเข้า {GT_MODELS.length} GT models พร้อมรูปภาพจาก src/assets เข้า Supabase Storage</p>
              <p className="mt-1">รวม {GT_MODELS.reduce((s, m) => s + m.gallery.length, 0)} รูปภาพ</p>
            </div>

            {/* Preview thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {GT_MODELS.map((m) => (
                <div key={m.model} className="text-center">
                  <img
                    src={m.primary}
                    alt={m.model}
                    className="w-full aspect-square object-contain rounded border bg-muted/30"
                  />
                  <p className="text-[10px] mt-1 text-muted-foreground">{m.model}</p>
                </div>
              ))}
            </div>

            <Button onClick={handleImport} disabled={running || done} className="w-full">
              {running ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลัง Import...</>
              ) : done ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" />เสร็จแล้ว</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />เริ่ม Import GT Series ({GT_MODELS.length} models)</>
              )}
            </Button>

            {running && <Progress value={progress} />}

            {logs.length > 0 && (
              <div className="bg-muted/50 rounded p-3 max-h-96 overflow-y-auto font-mono text-xs space-y-0.5">
                {logs.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
