import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ImportResult {
  batch: number;
  count: number;
  success: boolean;
  error?: string;
}

export default function ProductImport() {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [total, setTotal] = useState(0);

  const importGKSeries = async () => {
    setImporting(true);
    setResults([]);

    try {
      const res = await fetch('/data/gk-import.json');
      const allProducts = await res.json();
      setTotal(allProducts.length);

      const batchSize = 50;
      const batches: any[][] = [];
      for (let i = 0; i < allProducts.length; i += batchSize) {
        batches.push(allProducts.slice(i, i + batchSize));
      }

      for (let i = 0; i < batches.length; i++) {
        try {
          const { data, error } = await supabase.functions.invoke('bulk-import-products', {
            body: { products: batches[i] },
          });

          if (error) {
            setResults(prev => [...prev, { batch: i, count: 0, success: false, error: error.message }]);
          } else {
            setResults(prev => [...prev, { batch: i, count: data?.count ?? batches[i].length, success: true }]);
          }
        } catch (err: any) {
          setResults(prev => [...prev, { batch: i, count: 0, success: false, error: err.message }]);
        }
      }
    } catch (err: any) {
      setResults(prev => [...prev, { batch: -1, count: 0, success: false, error: `Failed to load data: ${err.message}` }]);
    }

    setImporting(false);
  };

  const successCount = results.filter(r => r.success).reduce((sum, r) => sum + r.count, 0);
  const failCount = results.filter(r => !r.success).length;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">นำเข้าสินค้า GK Series</h1>
            <p className="text-sm text-muted-foreground">Import 590 สินค้า GK Series เข้าฐานข้อมูล</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-4xl">📦</div>
            <div>
              <h2 className="text-xl font-semibold">GK Series — 590 รายการ</h2>
              <p className="text-muted-foreground mt-1">GK1501, GK1004, GK1506, GK1901, GK2101</p>
            </div>

            <Button
              size="lg"
              onClick={importGKSeries}
              disabled={importing}
              className="min-w-[200px]"
            >
              {importing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />กำลัง Import...</>
              ) : (
                <><Upload className="w-5 h-5 mr-2" />เริ่ม Import GK Series</>
              )}
            </Button>

            {results.length > 0 && (
              <div className="text-left space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-4">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {r.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span>
                      Batch {r.batch + 1}: {r.success ? `✅ ${r.count} รายการ` : `❌ ${r.error}`}
                    </span>
                  </div>
                ))}

                {!importing && (
                  <div className="border-t pt-3 mt-3 font-semibold">
                    สำเร็จ: {successCount} / {total} รายการ
                    {failCount > 0 && <span className="text-red-500 ml-2">({failCount} batch ล้มเหลว)</span>}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
