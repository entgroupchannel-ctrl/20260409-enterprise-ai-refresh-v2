import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, CheckCircle2, Loader2, FileText, Download } from 'lucide-react';

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
        setRunning(false);
        return;
      }

      log(`📦 Found ${filenames.length} datasheets to migrate (1 file per request)`);

      const allResults: UploadResult[] = [];

      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        try {
          const response = await fetch(`/datasheets/${filename}`);
          if (!response.ok) {
            log(`   ❌ Fetch failed: ${filename} — HTTP ${response.status}`);
            allResults.push({ filename, oldPath: `/datasheets/${filename}`, newUrl: null, error: `HTTP ${response.status}` });
            continue;
          }
          const blob = await response.blob();

          if (blob.size > 50 * 1024 * 1024) {
            log(`   ⚠️ Skip ${filename} (${(blob.size / 1024 / 1024).toFixed(1)} MB > 50MB)`);
            continue;
          }

          const base64Data = await blobToBase64(blob);

          const { data, error } = await supabase.functions.invoke('upload-datasheets', {
            body: { filename, base64Data },
          });

          if (error) {
            log(`   ❌ ${filename} — ${error.message}`);
            allResults.push({ filename, oldPath: `/datasheets/${filename}`, newUrl: null, error: error.message });
          } else if (data?.url) {
            allResults.push({ filename, oldPath: `/datasheets/${filename}`, newUrl: data.url });
          } else {
            log(`   ❌ ${filename} — ${data?.error || 'Unknown error'}`);
            allResults.push({ filename, oldPath: `/datasheets/${filename}`, newUrl: null, error: data?.error });
          }
        } catch (e: any) {
          log(`   ❌ ${filename} — ${e.message}`);
          allResults.push({ filename, oldPath: `/datasheets/${filename}`, newUrl: null, error: e.message });
        }

        const pct = Math.round(((i + 1) / filenames.length) * 100);
        setProgress(pct);
        setResults([...allResults]);

        // Log every 10 files
        if ((i + 1) % 10 === 0) {
          const ok = allResults.filter(r => r.newUrl).length;
          log(`   📊 Progress: ${i + 1}/${filenames.length} (${ok} uploaded)`);
        }
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
              <p className="text-xs">⚠️ อัปโหลดทีละไฟล์เพื่อหลีกเลี่ยง CPU limit ของ Edge Function</p>
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
