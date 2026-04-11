import { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CircleCheckBig, AlertTriangle, PackageCheck, Layers,
  Database, ArrowLeft, Trash2, RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MigrationStats {
  totalBackup: number;
  parentsCount: number;
  variantsCount: number;
  modelsAffected: number;
  modelsByVariantCount: { model: string; variantCount: number; parentSku: string }[];
  suspiciousModels: { model: string; reason: string }[];
}

export default function ProductMigrationReview() {
  const { toast } = useToast();
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRollback, setShowRollback] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Total backup
      const { count: totalBackup } = await (supabase as any)
        .from('products_backup_pre_consolidation')
        .select('*', { count: 'exact', head: true });

      const { count: parentsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('migration_status' as any, 'parent');

      const { count: variantsCount } = await supabase
        .from('product_variants')
        .select('*', { count: 'exact', head: true });

      const { data: models } = await supabase
        .from('products')
        .select('id, model, sku')
        .eq('migration_status' as any, 'parent')
        .order('model');

      const modelsByVariantCount: MigrationStats['modelsByVariantCount'] = [];
      const suspicious: MigrationStats['suspiciousModels'] = [];

      for (const m of models || []) {
        const { count: vCount } = await supabase
          .from('product_variants')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', m.id);

        modelsByVariantCount.push({
          model: m.model,
          variantCount: vCount || 0,
          parentSku: m.sku,
        });

        if ((vCount || 0) <= 1) {
          suspicious.push({
            model: m.model,
            reason: 'มี variant แค่ 1 ตัว — ตรวจสอบว่าควรเป็น standalone product หรือไม่',
          });
        }
      }

      setStats({
        totalBackup: totalBackup || 0,
        parentsCount: parentsCount || 0,
        variantsCount: variantsCount || 0,
        modelsAffected: models?.length || 0,
        modelsByVariantCount: modelsByVariantCount.sort((a, b) => b.variantCount - a.variantCount),
        suspiciousModels: suspicious,
      });
    } catch (e: any) {
      toast({ title: 'โหลดข้อมูลไม่สำเร็จ', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMigration = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('commit_product_migration' as any);
      if (error) throw error;
      toast({ title: '✅ Migration เสร็จสมบูรณ์', description: 'Inactive products ถูกลบ และ migration columns ถูก clean up แล้ว' });
      setShowConfirm(false);
      loadStats();
    } catch (e: any) {
      toast({ title: 'ผิดพลาด', description: e.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRollback = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('rollback_product_migration' as any);
      if (error) throw error;
      toast({ title: '↩️ Rollback สำเร็จ', description: 'Products ถูก restore จาก backup เรียบร้อย' });
      setShowRollback(false);
      loadStats();
    } catch (e: any) {
      toast({ title: 'ผิดพลาด', description: e.message, variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/admin/products" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3 h-3" /> กลับไป Products
          </Link>
          <h1 className="text-2xl font-bold">🔄 Product Migration Review</h1>
          <p className="text-sm text-muted-foreground">ตรวจสอบผลการ consolidate products → variants ก่อน commit</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Database className="w-8 h-8 text-muted-foreground" />
                <span className="text-2xl font-bold">{stats.totalBackup}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">ก่อน migration</p>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <PackageCheck className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-primary">{stats.parentsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Parent Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Layers className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold">{stats.variantsCount}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Variants</p>
            </CardContent>
          </Card>
          <Card className={stats.suspiciousModels.length > 0 ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-900/10' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertTriangle className={`w-8 h-8 ${stats.suspiciousModels.length > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
                <span className="text-2xl font-bold">{stats.suspiciousModels.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">ต้องตรวจสอบ</p>
            </CardContent>
          </Card>
        </div>

        {/* Reduction summary */}
        <Card className="border-green-500/30 bg-green-50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <p className="text-sm">
              ลดจาก <strong>{stats.totalBackup}</strong> rows เหลือ{' '}
              <strong className="text-green-600">{stats.parentsCount}</strong> parent products
              {stats.totalBackup > 0 && (
                <span className="text-muted-foreground">
                  {' '}— ลดลง {Math.round((1 - stats.parentsCount / stats.totalBackup) * 100)}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Models breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-base">Models และจำนวน Variants</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {stats.modelsByVariantCount.map((m) => (
                <div
                  key={m.parentSku}
                  className={`flex items-center justify-between p-2.5 rounded border text-sm ${
                    m.variantCount <= 1 ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : 'border-border'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{m.model}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.parentSku}</p>
                  </div>
                  <Badge variant={m.variantCount <= 1 ? 'outline' : 'default'} className="ml-2">
                    {m.variantCount} variants
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suspicious */}
        {stats.suspiciousModels.length > 0 && (
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Models ที่ต้องตรวจสอบ ({stats.suspiciousModels.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.suspiciousModels.map((s) => (
                <div key={s.model} className="text-sm flex items-start gap-2">
                  <span className="font-medium">{s.model}:</span>
                  <span className="text-muted-foreground">{s.reason}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="default" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setShowConfirm(true)}>
              <CircleCheckBig className="w-4 h-4 mr-2" />
              ✅ Confirm Migration
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowRollback(true)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              ↩️ Rollback
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirm dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              ยืนยัน Commit Migration
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>การกระทำนี้จะ:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>ลบ products ที่เป็น inactive ({stats.totalBackup - stats.parentsCount} rows) ถาวร</li>
                  <li>ลบ migration columns ออกจาก products table</li>
                  <li>เก็บ backup table ไว้อีก 30 วันก่อน drop</li>
                </ul>
                <p className="text-amber-600 font-medium">⚠️ ตรวจสอบรายการ Models ก่อนกดยืนยัน</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMigration} disabled={processing} className="bg-destructive text-destructive-foreground">
              {processing ? 'กำลังดำเนินการ...' : '✅ ยืนยัน Commit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rollback dialog */}
      <AlertDialog open={showRollback} onOpenChange={setShowRollback}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>↩️ ยืนยัน Rollback</AlertDialogTitle>
            <AlertDialogDescription>
              จะ restore products table จาก backup กลับเป็น {stats.totalBackup} rows
              และลบ variants ทั้งหมดที่สร้างไว้ — แน่ใจหรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleRollback} disabled={processing}>
              {processing ? 'กำลังดำเนินการ...' : '↩️ Rollback'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
