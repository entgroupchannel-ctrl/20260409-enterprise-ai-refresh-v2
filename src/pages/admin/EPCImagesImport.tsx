import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';

interface EPCModel {
  model: string;
  seriesGroup: string;
  name: string;
  description: string;
  unit_price: number;
  primaryImage: string;
  galleryImages: string[];
}

const EPC_MODELS: EPCModel[] = [
  {
    model: 'EPC-106A', seriesGroup: '10XA',
    name: 'EPC-106A — Celeron J1900 Fanless Compact',
    description: 'Fanless Industrial Box PC, Celeron J1900, 4GB/128GB, LEGO Mode, 200mm Compact',
    unit_price: 14990,
    primaryImage: '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
    galleryImages: [
      '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
      '/images/wix/0597a3_4681e86fee384a13953cfc1477fe4eeb_5458d060.png',
      '/images/wix/0597a3_7043dbbbf77841f599d56ca8bd1c8eeb_bcb7f419.png',
      '/images/wix/0597a3_a33086dc821449789942597ff318195f_62e6f2fd.png',
    ],
  },
  {
    model: 'EPC-107A', seriesGroup: '10XA',
    name: 'EPC-107A — Celeron J6412 Fanless Elkhart Lake',
    description: 'Fanless Industrial Box PC, Celeron J6412, 8GB/256GB, LEGO Mode',
    unit_price: 13990,
    primaryImage: '/images/wix/0597a3_4681e86fee384a13953cfc1477fe4eeb_5458d060.png',
    galleryImages: [
      '/images/wix/0597a3_4681e86fee384a13953cfc1477fe4eeb_5458d060.png',
      '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
      '/images/wix/0597a3_7043dbbbf77841f599d56ca8bd1c8eeb_bcb7f419.png',
    ],
  },
  {
    model: 'EPC-109A', seriesGroup: '10XA',
    name: 'EPC-109A — Core i3/i5/i7 Gen 10 Comet Lake',
    description: 'Fanless Industrial Box PC, Intel Core 10th Gen, 8GB/256GB, LEGO Mode',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_1044f895f5d842f7a7c68fcc6caf36c9_5dffe446.png',
    galleryImages: [
      '/images/wix/0597a3_1044f895f5d842f7a7c68fcc6caf36c9_5dffe446.png',
      '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
      '/images/wix/0597a3_a33086dc821449789942597ff318195f_62e6f2fd.png',
    ],
  },
  {
    model: 'EPC-102A', seriesGroup: '10XA',
    name: 'EPC-102A — Core i3/i5 Gen 12 Alder Lake',
    description: 'Fanless Industrial Box PC, Intel Core 12th Gen, 8GB/256GB, LEGO Mode',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_f72a672e77bc413a90eaa099e8bcfe0e_679aa82e.png',
    galleryImages: [
      '/images/wix/0597a3_f72a672e77bc413a90eaa099e8bcfe0e_679aa82e.png',
      '/images/wix/0597a3_e66a5a6616b64254a920d2c6f05b93f8_48ed79f4.png',
      '/images/wix/0597a3_7043dbbbf77841f599d56ca8bd1c8eeb_bcb7f419.png',
    ],
  },
  {
    model: 'EPC-206A', seriesGroup: '20XA',
    name: 'EPC-206A — Celeron J1900 Enhanced Expansion',
    description: 'Enhanced Box PC, 79mm height, +68% cooling space, Celeron J1900',
    unit_price: 14990,
    primaryImage: '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    galleryImages: [
      '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    ],
  },
  {
    model: 'EPC-207A', seriesGroup: '20XA',
    name: 'EPC-207A — Celeron J6412 Enhanced Expansion',
    description: 'Enhanced Box PC, 79mm height, Celeron J6412, 8GB/256GB',
    unit_price: 13990,
    primaryImage: '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    galleryImages: [
      '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    ],
  },
  {
    model: 'EPC-209A', seriesGroup: '20XA',
    name: 'EPC-209A — Core i3/i5/i7 Gen 10 Enhanced',
    description: 'Enhanced Box PC, 79mm height, Intel Core 10th Gen, 8GB/256GB',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    galleryImages: [
      '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    ],
  },
  {
    model: 'EPC-202A', seriesGroup: '20XA',
    name: 'EPC-202A — Core i3/i5 Gen 12 Enhanced',
    description: 'Enhanced Box PC, 79mm height, Intel Core 12th Gen, 8GB/256GB',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    galleryImages: [
      '/images/wix/0597a3_373c66cd76674aafb9d631325e3e3a26_258223ef.png',
    ],
  },
  {
    model: 'EPC-306A', seriesGroup: '30XA',
    name: 'EPC-306A — Celeron J1900 Wide Rack Mount',
    description: 'Wide Form Factor, 337mm, Low Profile 47.5mm, Rack/Panel Mount, Celeron J1900',
    unit_price: 14990,
    primaryImage: '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
    galleryImages: [
      '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
      '/images/wix/0597a3_58406a7c4f4f4150ae07b2d6376366b0_04bc328f.png',
      '/images/wix/0597a3_0367da74dfe34d24971aeda0f990b9a2_cf347c22.png',
      '/images/wix/0597a3_722adc2902d94e0aa1c6d285e63a01b5_3456525d.png',
    ],
  },
  {
    model: 'EPC-307A', seriesGroup: '30XA',
    name: 'EPC-307A — Celeron J6412 Wide Rack Mount',
    description: 'Wide Form Factor, 337mm, Low Profile, Celeron J6412, 8GB/256GB',
    unit_price: 13990,
    primaryImage: '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
    galleryImages: [
      '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
      '/images/wix/0597a3_58406a7c4f4f4150ae07b2d6376366b0_04bc328f.png',
      '/images/wix/0597a3_0367da74dfe34d24971aeda0f990b9a2_cf347c22.png',
    ],
  },
  {
    model: 'EPC-309A', seriesGroup: '30XA',
    name: 'EPC-309A — Core i3/i5/i7 Gen 10 Wide',
    description: 'Wide Form Factor, 337mm, Intel Core 10th Gen, Rack Mount',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
    galleryImages: [
      '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
      '/images/wix/0597a3_722adc2902d94e0aa1c6d285e63a01b5_3456525d.png',
    ],
  },
  {
    model: 'EPC-302A', seriesGroup: '30XA',
    name: 'EPC-302A — Core i3/i5 Gen 12 Wide',
    description: 'Wide Form Factor, 337mm, Intel Core 12th Gen, Rack Mount',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
    galleryImages: [
      '/images/wix/0597a3_66f688e771804493b4e10e4daf7dd19a_e2ade35a.png',
      '/images/wix/0597a3_58406a7c4f4f4150ae07b2d6376366b0_04bc328f.png',
    ],
  },
  {
    model: 'EPC-406A', seriesGroup: '40XA',
    name: 'EPC-406A — Celeron J1900 Flagship',
    description: 'Flagship Model, 337×160×79.5mm, Maximum cooling +168%, Celeron J1900',
    unit_price: 14990,
    primaryImage: '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    galleryImages: [
      '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    ],
  },
  {
    model: 'EPC-407A', seriesGroup: '40XA',
    name: 'EPC-407A — Celeron J6412 Flagship',
    description: 'Flagship Model, Maximum Form Factor, Celeron J6412',
    unit_price: 13990,
    primaryImage: '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    galleryImages: [
      '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    ],
  },
  {
    model: 'EPC-409A', seriesGroup: '40XA',
    name: 'EPC-409A — Core i3/i5/i7 Gen 10 Flagship',
    description: 'Flagship Model, Maximum Form Factor, Intel Core 10th Gen, Mission-Critical',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    galleryImages: [
      '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    ],
  },
  {
    model: 'EPC-402A', seriesGroup: '40XA',
    name: 'EPC-402A — Core i3/i5 Gen 12 Flagship',
    description: 'Flagship Model, Maximum Form Factor, Intel Core 12th Gen, Mission-Critical',
    unit_price: 30990,
    primaryImage: '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
    galleryImages: [
      '/images/wix/0597a3_97f200930e3047dc887b96a9e8c48203_bc6a9156.png',
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

export default function EPCImagesImport() {
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
      // Deduplicate images across all models
      const uniqueImages = new Map<string, string>();
      EPC_MODELS.forEach(m => {
        m.galleryImages.forEach(img => {
          const filename = img.split('/').pop()!;
          uniqueImages.set(filename, img);
        });
      });

      log(`📸 จะอัปโหลด ${uniqueImages.size} รูปที่ไม่ซ้ำ...`);

      // Upload all unique images in batches
      const imageEntries = Array.from(uniqueImages.entries());
      const batchSize = 5;
      const uploadedUrls = new Map<string, string>();

      for (let i = 0; i < imageEntries.length; i += batchSize) {
        const batch = imageEntries.slice(i, i + batchSize);
        const images = await Promise.all(
          batch.map(async ([filename, url]) => ({
            filename: filename.replace('.png', '.png').replace('.jpg', '.jpg'),
            base64Data: await urlToBase64(url),
            contentType: filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
          }))
        );

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke(
          'upload-gt-images',
          { body: { images, folder: 'epc-series' } }
        );

        if (uploadError) {
          log(`❌ Upload batch error: ${uploadError.message}`);
          continue;
        }

        uploadResult.results.forEach((r: any) => {
          if (r.url) {
            uploadedUrls.set(r.filename, r.url);
            log(`   ✅ ${r.filename}`);
          } else {
            log(`   ❌ ${r.filename}: ${r.error}`);
          }
        });

        setProgress(Math.round(((i + batchSize) / imageEntries.length) * 40));
      }

      log(`\n📦 อัปเดต ${EPC_MODELS.length} models ใน DB...`);

      // Update products
      for (let i = 0; i < EPC_MODELS.length; i++) {
        const m = EPC_MODELS[i];
        const primaryFilename = m.primaryImage.split('/').pop()!;
        const primaryUrl = uploadedUrls.get(primaryFilename) || m.primaryImage;
        const galleryUrls = m.galleryImages.map(img => {
          const fn = img.split('/').pop()!;
          return uploadedUrls.get(fn) || img;
        });

        const slug = m.model.toLowerCase();
        const productPayload = {
          sku: `${slug}-base`,
          model: m.model,
          slug: slug,
          series: 'EPC Series',
          name: `EPC Box PC ${m.name}`,
          description: m.description,
          category: 'Industrial Box PC',
          unit_price: m.unit_price,
          image_url: primaryUrl,
          thumbnail_url: primaryUrl,
          gallery_urls: galleryUrls,
          is_active: true,
        };

        const { data: existing } = await (supabase as any)
          .from('products')
          .select('id')
          .eq('model', m.model)
          .maybeSingle();

        if (existing) {
          await (supabase as any).from('products').update(productPayload).eq('id', existing.id);
          log(`   🔄 Updated ${m.model} (${m.seriesGroup})`);
        } else {
          await (supabase as any).from('products').insert(productPayload);
          log(`   ➕ Created ${m.model} (${m.seriesGroup})`);
        }

        setProgress(40 + Math.round(((i + 1) / EPC_MODELS.length) * 60));
      }

      log('\n🎉 Done! EPC Box Series ทุกรุ่นอัปเดตเรียบร้อย');
      setDone(true);
      toast({ title: '✅ Import สำเร็จ', description: `${EPC_MODELS.length} EPC models updated` });
    } catch (e: any) {
      log(`❌ Error: ${e.message}`);
      toast({ title: 'Import ไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const uniqueImageCount = new Set(EPC_MODELS.flatMap(m => m.galleryImages)).size;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Import EPC Box Series Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>นำเข้า {EPC_MODELS.length} EPC Box models (10XA, 20XA, 30XA, 40XA) พร้อมรูปภาพเข้า Supabase Storage</p>
              <p className="mt-1">รวม {uniqueImageCount} รูปภาพที่ไม่ซ้ำกัน</p>
            </div>

            {/* Preview */}
            <div className="grid grid-cols-4 gap-3">
              {['10XA', '20XA', '30XA', '40XA'].map(group => {
                const model = EPC_MODELS.find(m => m.seriesGroup === group);
                return model ? (
                  <div key={group} className="text-center">
                    <img
                      src={model.primaryImage}
                      alt={group}
                      className="w-full aspect-square object-contain rounded border bg-muted/30"
                    />
                    <p className="text-xs mt-1 font-medium">EPC-{group}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {EPC_MODELS.filter(m => m.seriesGroup === group).length} models
                    </p>
                  </div>
                ) : null;
              })}
            </div>

            <Button onClick={handleImport} disabled={running || done} className="w-full">
              {running ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลัง Import...</>
              ) : done ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" />เสร็จแล้ว</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />เริ่ม Import EPC Box Series ({EPC_MODELS.length} models)</>
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
