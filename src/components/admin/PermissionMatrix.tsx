import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileText, Package, ShoppingCart, Receipt, Users,
  BarChart3, Settings, Trash2, RotateCcw, Info, Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Permission {
  module: string;
  default_permission: string;
  override_permission: string | null;
  effective_permission: string;
  is_override: boolean;
}

interface Props {
  userId: string;
  userName: string;
  readOnly?: boolean;
  onUpdate?: () => void;
}

const MODULE_INFO: Record<string, { label: string; icon: any; desc: string }> = {
  quotes: { label: 'ใบเสนอราคา', icon: FileText, desc: 'สร้าง แก้ไข ดูใบเสนอราคา' },
  sale_orders: { label: 'Sale Orders', icon: ShoppingCart, desc: 'จัดการ SO' },
  invoices: { label: 'ใบวางบิล', icon: Receipt, desc: 'จัดการใบวางบิล' },
  tax_invoices: { label: 'ใบกำกับภาษี', icon: Receipt, desc: 'จัดการใบกำกับภาษี' },
  receipts: { label: 'ใบเสร็จรับเงิน', icon: Receipt, desc: 'จัดการใบเสร็จ' },
  products: { label: 'สินค้า', icon: Package, desc: 'จัดการสินค้า สต็อก' },
  contacts: { label: 'ลูกค้า', icon: Users, desc: 'จัดการข้อมูลลูกค้า' },
  reports: { label: 'รายงาน', icon: BarChart3, desc: 'ดูรายงานและสถิติ' },
  settings: { label: 'ตั้งค่า', icon: Settings, desc: 'ตั้งค่าระบบ' },
  trash: { label: 'ถังขยะ', icon: Trash2, desc: 'จัดการถังขยะ' },
};

const PERMISSION_LABELS: Record<string, string> = {
  none: '❌ ไม่มีสิทธิ์',
  read: '👁 อ่าน',
  write: '✏️ แก้ไข',
  admin: '✅ เต็ม',
};

const PERMISSION_COLORS: Record<string, string> = {
  none: 'bg-gray-100 text-gray-700 border-gray-300',
  read: 'bg-blue-100 text-blue-700 border-blue-300',
  write: 'bg-amber-100 text-amber-700 border-amber-300',
  admin: 'bg-green-100 text-green-700 border-green-300',
};

export default function PermissionMatrix({ 
  userId, 
  userName, 
  readOnly = false, 
  onUpdate 
}: Props) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (userId) loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any).rpc(
        'get_user_effective_permissions',
        { p_user_id: userId }
      );
      
      if (error) throw error;
      setPermissions((data as Permission[]) || []);
    } catch (e: any) {
      toast({
        title: 'โหลดข้อมูลไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (module: string, newPermission: string) => {
    setSaving(module);
    try {
      const { error } = await (supabase as any).rpc(
        'upsert_user_permission',
        {
          p_user_id: userId,
          p_module: module,
          p_permission: newPermission,
        }
      );
      
      if (error) throw error;
      
      toast({ 
        title: '✅ บันทึกแล้ว',
        description: `${MODULE_INFO[module]?.label}: ${PERMISSION_LABELS[newPermission]}`,
      });
      
      await loadPermissions();
      onUpdate?.();
    } catch (e: any) {
      toast({
        title: 'บันทึกไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleRevert = async (module: string) => {
    setSaving(module);
    try {
      const { error } = await (supabase as any).rpc(
        'remove_user_permission',
        {
          p_user_id: userId,
          p_module: module,
        }
      );
      
      if (error) throw error;
      
      toast({ 
        title: '↩️ คืนค่าเริ่มต้นแล้ว',
        description: `${MODULE_INFO[module]?.label}: กลับไปใช้ค่าตาม role`,
      });
      
      await loadPermissions();
      onUpdate?.();
    } catch (e: any) {
      toast({
        title: 'ไม่สำเร็จ',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          กำลังโหลด...
        </CardContent>
      </Card>
    );
  }

  const overrideCount = permissions.filter(p => p.is_override).length;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                สิทธิ์การเข้าถึงโมดูล
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {readOnly ? 'ดูได้อย่างเดียว' : `${userName} • ${overrideCount} override จาก default`}
              </p>
            </div>
            {readOnly && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                <Lock className="w-3 h-3 mr-1" />
                Read-only
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {permissions.map((p) => {
              const info = MODULE_INFO[p.module];
              if (!info) return null;
              const Icon = info.icon;
              
              return (
                <div
                  key={p.module}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                    p.is_override 
                      ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800"
                      : "border-border"
                  )}
                >
                  <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{info.label}</p>
                      {p.is_override && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400">
                              ⭐ Override
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              Default: {PERMISSION_LABELS[p.default_permission]}<br/>
                              Override: {PERMISSION_LABELS[p.override_permission || '']}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {readOnly ? (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", PERMISSION_COLORS[p.effective_permission])}
                      >
                        {PERMISSION_LABELS[p.effective_permission]}
                      </Badge>
                    ) : (
                      <>
                        <Select
                          value={p.effective_permission}
                          onValueChange={(v) => handleChange(p.module, v)}
                          disabled={saving === p.module}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ ไม่มีสิทธิ์</SelectItem>
                            <SelectItem value="read">👁 อ่าน</SelectItem>
                            <SelectItem value="write">✏️ แก้ไข</SelectItem>
                            <SelectItem value="admin">✅ เต็ม</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {p.is_override && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRevert(p.module)}
                                disabled={saving === p.module}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">คืนค่าเริ่มต้น</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {!readOnly && overrideCount === 0 && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                ยังไม่มี override — ผู้ใช้กำลังใช้สิทธิ์เริ่มต้นตาม role ทุกโมดูล
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
