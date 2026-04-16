import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, ShieldCheck, Briefcase, Calculator, Warehouse, Eye, User,
  Check, X, Minus, Info,
} from 'lucide-react';
import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, type UserRole } from '@/types/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/* ── Permission matrix data ── */
type Access = 'full' | 'read' | 'none' | 'limited';

interface ModulePermission {
  module: string;
  description: string;
  permissions: Record<UserRole, { access: Access; note?: string }>;
}

const ROLE_ICONS: Record<UserRole, any> = {
  super_admin: Shield,
  admin: ShieldCheck,
  sales: Briefcase,
  accountant: Calculator,
  warehouse: Warehouse,
  viewer: Eye,
  member: User,
};

const STAFF_ROLES: UserRole[] = ['super_admin', 'admin', 'sales', 'accountant', 'warehouse', 'viewer'];

const modules: ModulePermission[] = [
  {
    module: 'Dashboard',
    description: 'หน้าหลักแอดมิน ภาพรวมยอดขาย',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'read', note: 'เห็นเฉพาะยอดขายของตัวเอง' },
      accountant: { access: 'read', note: 'เห็นเฉพาะยอดรายรับ-จ่าย' },
      warehouse: { access: 'read', note: 'เห็นเฉพาะสต็อก' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบเสนอราคา (Quotes)',
    description: 'สร้าง แก้ไข ส่งใบเสนอราคาให้ลูกค้า',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'full', note: 'สร้าง แก้ไข ส่ง และต่อรองราคาได้' },
      accountant: { access: 'read', note: 'ดูได้อย่างเดียว' },
      warehouse: { access: 'read', note: 'ดูเพื่อเตรียมสินค้า' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบสั่งขาย (Sale Orders)',
    description: 'จัดการใบสั่งขาย อัปเดตสถานะการจัดส่ง',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'full', note: 'สร้าง อัปเดตสถานะ SO ได้' },
      accountant: { access: 'read' },
      warehouse: { access: 'full', note: 'อัปเดตสถานะจัดส่ง/สต็อก' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบวางบิล (Invoices)',
    description: 'สร้างและส่งใบวางบิลให้ลูกค้า',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'full', note: 'สร้างใบวางบิลจากใบเสนอราคาได้' },
      accountant: { access: 'full' },
      warehouse: { access: 'none' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบกำกับภาษี (Tax Invoices)',
    description: 'ออกใบกำกับภาษี — เอกสารทางบัญชีที่สำคัญ',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none', note: '🔒 ปิดสิทธิ์ — เห็นต้นทุนได้' },
      accountant: { access: 'full' },
      warehouse: { access: 'none' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบเสร็จรับเงิน (Receipts)',
    description: 'ออกใบเสร็จรับเงินเมื่อชำระเงินแล้ว',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none', note: '🔒 ปิดสิทธิ์ — เห็นข้อมูลการเงินได้' },
      accountant: { access: 'full' },
      warehouse: { access: 'none' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ใบลดหนี้ (Credit Notes)',
    description: 'ออกใบลดหนี้เพื่อแก้ไขใบกำกับภาษี',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none' },
      accountant: { access: 'full' },
      warehouse: { access: 'none' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'โอนเงินต่างประเทศ',
    description: 'จัดการคำขอโอนเงินไปยังซัพพลายเออร์ต่างประเทศ',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none', note: '🔒 ปิดสิทธิ์ — ข้อมูลต้นทุนและธนาคาร' },
      accountant: { access: 'full' },
      warehouse: { access: 'none' },
      viewer: { access: 'none' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ซัพพลายเออร์',
    description: 'จัดการข้อมูลซัพพลายเออร์และ PO สั่งซื้อ',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none', note: '🔒 ปิดสิทธิ์ — ข้อมูลต้นทุน' },
      accountant: { access: 'read' },
      warehouse: { access: 'read', note: 'ดูเพื่อรับสินค้า' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'สินค้า (Products)',
    description: 'จัดการแคตตาล็อกสินค้า ราคา สต็อก',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'read', note: 'ดูข้อมูลสินค้าเพื่อเสนอราคา' },
      accountant: { access: 'read' },
      warehouse: { access: 'full', note: 'จัดการสต็อกและข้อมูลสินค้า' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ลูกค้า (Contacts)',
    description: 'จัดการรายชื่อลูกค้าและบริษัท',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'full', note: 'สร้างและแก้ไขข้อมูลลูกค้า' },
      accountant: { access: 'read' },
      warehouse: { access: 'read' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'รายงาน (Reports)',
    description: 'ดูรายงานยอดขาย รายรับ สถิติ',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'limited', note: 'เห็นเฉพาะยอดขายของตัวเอง' },
      accountant: { access: 'full' },
      warehouse: { access: 'limited', note: 'เห็นเฉพาะรายงานสต็อก' },
      viewer: { access: 'read' },
      member: { access: 'none' },
    },
  },
  {
    module: 'พนักงาน & สิทธิ์',
    description: 'จัดการบัญชีพนักงาน บทบาท สิทธิ์การเข้าถึง',
    permissions: {
      super_admin: { access: 'full', note: 'แก้ไข role, สิทธิ์, เปิด/ปิดบัญชี' },
      admin: { access: 'read', note: 'ดูรายชื่อพนักงานได้' },
      sales: { access: 'none' },
      accountant: { access: 'none' },
      warehouse: { access: 'none' },
      viewer: { access: 'none' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ตั้งค่าบริษัท',
    description: 'ข้อมูลบริษัท โลโก้ บัญชีธนาคาร เทมเพลต',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'full' },
      sales: { access: 'none' },
      accountant: { access: 'none' },
      warehouse: { access: 'none' },
      viewer: { access: 'none' },
      member: { access: 'none' },
    },
  },
  {
    module: 'ถังขยะ (Trash)',
    description: 'กู้คืนหรือลบเอกสารถาวร',
    permissions: {
      super_admin: { access: 'full', note: 'ลบถาวร + ล้างถังขยะ' },
      admin: { access: 'full', note: 'กู้คืน + ลบถาวร' },
      sales: { access: 'none' },
      accountant: { access: 'none' },
      warehouse: { access: 'none' },
      viewer: { access: 'none' },
      member: { access: 'none' },
    },
  },
  {
    module: 'Audit Log',
    description: 'ดูประวัติการใช้งานระบบทั้งหมด',
    permissions: {
      super_admin: { access: 'full' },
      admin: { access: 'read' },
      sales: { access: 'none' },
      accountant: { access: 'none' },
      warehouse: { access: 'none' },
      viewer: { access: 'none' },
      member: { access: 'none' },
    },
  },
];

const AccessIcon = ({ access, note }: { access: Access; note?: string }) => {
  const content = (
    <div className="flex items-center justify-center">
      {access === 'full' && (
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-700 font-medium hidden sm:inline">จัดการ</span>
        </div>
      )}
      {access === 'read' && (
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-blue-600 font-medium hidden sm:inline">ดูเท่านั้น</span>
        </div>
      )}
      {access === 'limited' && (
        <div className="flex items-center gap-1">
          <Minus className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-600 font-medium hidden sm:inline">จำกัด</span>
        </div>
      )}
      {access === 'none' && (
        <div className="flex items-center gap-1">
          <X className="w-4 h-4 text-red-400" />
          <span className="text-xs text-muted-foreground hidden sm:inline">ปิด</span>
        </div>
      )}
      {note && <Info className="w-3 h-3 text-muted-foreground ml-1" />}
    </div>
  );

  if (note) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px] text-xs">
          {note}
        </TooltipContent>
      </Tooltip>
    );
  }
  return content;
};

export default function AdminRoles() {
  return (
    <AdminLayout>
      <TooltipProvider delayDuration={200}>
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              บทบาทและสิทธิ์การเข้าถึง
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ภาพรวมสิทธิ์การเข้าถึงของแต่ละบทบาทในระบบ
            </p>
          </div>

          {/* Legend */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>จัดการได้เต็มที่</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span>ดูเท่านั้น</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Minus className="w-4 h-4 text-amber-500" />
                  <span>จำกัด (เฉพาะบางส่วน)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-400" />
                  <span>ปิดสิทธิ์</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">hover เพื่อดูรายละเอียด</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="matrix">
            <TabsList>
              <TabsTrigger value="matrix">ตารางสิทธิ์</TabsTrigger>
              <TabsTrigger value="roles">รายละเอียดบทบาท</TabsTrigger>
            </TabsList>

            {/* Matrix view */}
            <TabsContent value="matrix" className="mt-4">
              <Card>
                <CardContent className="pt-0 pb-0 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold min-w-[180px] sticky left-0 bg-card z-10">
                          โมดูล
                        </th>
                        {STAFF_ROLES.map((role) => {
                          const Icon = ROLE_ICONS[role];
                          return (
                            <th key={role} className="text-center py-3 px-2 min-w-[100px]">
                              <div className="flex flex-col items-center gap-1">
                                <Icon className="w-4 h-4" />
                                <Badge variant="outline" className={`${ROLE_COLORS[role]} text-[10px] px-1.5`}>
                                  {ROLE_LABELS[role]}
                                </Badge>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((mod, i) => (
                        <tr key={mod.module} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                          <td className="py-2.5 px-2 sticky left-0 bg-inherit z-10">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-help">
                                  <span className="font-medium">{mod.module}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-[250px] text-xs">
                                {mod.description}
                              </TooltipContent>
                            </Tooltip>
                          </td>
                          {STAFF_ROLES.map((role) => (
                            <td key={role} className="py-2.5 px-2 text-center">
                              <AccessIcon
                                access={mod.permissions[role].access}
                                note={mod.permissions[role].note}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Role detail cards */}
            <TabsContent value="roles" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {STAFF_ROLES.map((role) => {
                  const Icon = ROLE_ICONS[role];
                  const allowed = modules.filter(m => m.permissions[role].access !== 'none');
                  const blocked = modules.filter(m => m.permissions[role].access === 'none');

                  return (
                    <Card key={role}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className="w-5 h-5 text-primary" />
                          <Badge variant="outline" className={ROLE_COLORS[role]}>
                            {ROLE_LABELS[role]}
                          </Badge>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Allowed */}
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-1.5">✅ เข้าถึงได้</p>
                          <ul className="space-y-1">
                            {allowed.map(m => (
                              <li key={m.module} className="text-xs flex items-start gap-1.5">
                                <AccessIcon access={m.permissions[role].access} />
                                <span>
                                  {m.module}
                                  {m.permissions[role].note && (
                                    <span className="text-muted-foreground ml-1">
                                      — {m.permissions[role].note}
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Blocked */}
                        {blocked.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-red-600 mb-1.5">🔒 ปิดสิทธิ์</p>
                            <ul className="space-y-0.5">
                              {blocked.map(m => (
                                <li key={m.module} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <X className="w-3 h-3 text-red-400" />
                                  {m.module}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Sales-specific security note */}
          <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-4 pb-4">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4" />
                หมายเหตุด้านความปลอดภัย — บทบาท Sales
              </h3>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                <li>Sales สามารถ: สร้างใบเสนอราคา, ออกใบวางบิล, อัปเดตสถานะ SO</li>
                <li>Sales <strong>ไม่สามารถ</strong>: เข้าถึงใบกำกับภาษี, ใบเสร็จรับเงิน, ข้อมูลซัพพลายเออร์ (เพราะมีข้อมูลต้นทุน)</li>
                <li>Sales <strong>ไม่สามารถ</strong>: เข้าถึงระบบโอนเงินต่างประเทศ, บัญชีธนาคาร</li>
                <li>สิทธิ์ทั้งหมดถูกควบคุมโดย RLS policies ในฐานข้อมูล — ไม่สามารถ bypass ได้จากฝั่ง client</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </AdminLayout>
  );
}
