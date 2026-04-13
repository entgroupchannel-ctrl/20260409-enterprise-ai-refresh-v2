import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, FileText, Download } from 'lucide-react';

const BATCH_SIZE = 5;

interface UploadResult {
  filename: string;
  oldPath: string;
  newUrl: string | null;
  error?: string;
}

export default function MigrateDatasheets() {
  const { toast } = useToast();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [done, setDone] = useState(false);

  const log = (msg: string) => setLogs(prev => [...prev, msg]);

  async function blobToBase64(blob: Blob): Promise<string> {
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

  const handleMigrate = async () => {
    setRunning(true);
    setLogs([]);
    setResults([]);
    setDone(false);
    setProgress(0);

    try {
      log('📋 Loading datasheet manifest...');
      
      let filenames: string[] = [];
      try {
        const manifestRes = await fetch('/datasheets-manifest.json');
        if (manifestRes.ok) {
          filenames = await manifestRes.json();
        }
      } catch (e) {
        // Manifest missing
      }

      if (filenames.length === 0) {
        log('⚠️ ไม่พบ /datasheets-manifest.json');
        log('💡 กรุณาสร้างไฟล์ public/datasheets-manifest.json ที่มี array ของชื่อไฟล์ PDF');
        log('   ตัวอย่าง: ["005637_xxx.pdf", "005637_yyy.pdf", ...]');
        setRunning(false);
        return;
      }

      log(`📦 Found ${filenames.length} datasheets to migrate`);
      log(`⚙️ Batch size: ${BATCH_SIZE}`);

      const allResults: UploadResult[] = [];
      const totalBatches = Math.ceil(filenames.length / BATCH_SIZE);

      for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
        const start = batchIdx * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, filenames.length);
        const batch = filenames.slice(start, end);

        log(`\n📦 Batch ${batchIdx + 1}/${totalBatches} (${batch.length} files)`);

        const datasheets = await Promise.all(
          batch.map(async (filename) => {
            try {
              const response = await fetch(`/datasheets/${filename}`);
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              }
              const blob = await response.blob();
              
              if (blob.size > 50 * 1024 * 1024) {
                log(`   ⚠️ Skip ${filename} (${(blob.size / 1024 / 1024).toFixed(1)} MB > 50MB limit)`);
                return null;
              }
              
              const base64Data = await blobToBase64(blob);
              return { filename, base64Data };
            } catch (e: any) {
              log(`   ❌ Fetch failed: ${filename} — ${e.message}`);
              return null;
            }
          })
        );

        const validDatasheets = datasheets.filter((d): d is NonNullable<typeof d> => d !== null);
        
        if (validDatasheets.length === 0) {
          log('   ⚠️ No valid files in batch');
          continue;
        }

        try {
          const { data, error } = await supabase.functions.invoke('upload-datasheets', {
            body: { datasheets: validDatasheets },
          });

          if (error) throw error;

          const batchResults: UploadResult[] = data.results.map((r: any) => ({
            filename: r.filename,
            oldPath: `/datasheets/${r.filename}`,
            newUrl: r.url,
            error: r.error,
          }));

          allResults.push(...batchResults);

          const successCount = batchResults.filter(r => r.newUrl).length;
          log(`   ✅ Uploaded ${successCount}/${validDatasheets.length}`);
        } catch (e: any) {
          log(`   ❌ Batch upload failed: ${e.message}`);
        }

        setProgress(Math.round(((batchIdx + 1) / totalBatches) * 100));
        setResults([...allResults]);
      }

      const successTotal = allResults.filter(r => r.newUrl).length;
      log(`\n🎉 Migration complete: ${successTotal}/${filenames.length} uploaded`);
      setDone(true);
      toast({ 
        title: '✅ Migration สำเร็จ', 
        description: `${successTotal} ไฟล์อัปโหลดแล้ว — ดาวน์โหลด URL mapping เพื่อใช้ใน Phase 2B` 
      });
    } catch (e: any) {
      log(`❌ Error: ${e.message}`);
      toast({ title: 'Migration ล้มเหลว', description: e.message, variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const handleDownloadMapping = () => {
    const mapping: Record<string, string> = {};
    results.forEach(r => {
      if (r.newUrl) mapping[r.oldPath] = r.newUrl;
    });
    
    const blob = new Blob([JSON.stringify(mapping, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datasheets-url-mapping.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Migrate Datasheets to Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>ย้าย PDF datasheets จาก <code>/public/datasheets/</code> ไป Supabase Storage bucket <code>datasheets</code></p>
              <p className="text-xs">⚠️ กระบวนการนี้ทำครั้งเดียว — หลังเสร็จให้ดาวน์โหลด URL mapping เพื่อใช้ใน Phase 2B</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleMigrate} disabled={running || done} className="flex-1">
                {running ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />กำลัง Migrate...</>
                ) : done ? (
                  <><CheckCircle2 className="w-4 h-4 mr-2" />เสร็จแล้ว</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" />เริ่ม Migrate Datasheets</>
                )}
              </Button>

              {results.length > 0 && (
                <Button variant="outline" onClick={handleDownloadMapping}>
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลด URL Mapping
                </Button>
              )}
            </div>

            {running && <Progress value={progress} />}

            {logs.length > 0 && (
              <div className="bg-muted/50 rounded p-3 max-h-96 overflow-y-auto font-mono text-xs space-y-0.5">
                {logs.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {done && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded p-3 text-sm">
                <p className="font-semibold text-green-900 dark:text-green-100">🎉 Phase 2A เสร็จแล้ว!</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  1. ดาวน์โหลด URL mapping JSON<br/>
                  2. ส่งให้ Claude เพื่อสร้าง Phase 2B spec (update source code references)<br/>
                  3. หลัง Phase 2B เสร็จ → Phase 3 ลบ /public/datasheets/ (ลด 616 MB)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
