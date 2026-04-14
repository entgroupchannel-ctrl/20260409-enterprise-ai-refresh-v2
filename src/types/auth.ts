// Phase 6.0: Centralized role type definitions

export const ROLES = [
  'super_admin',
  'admin',
  'sales',
  'accountant',
  'warehouse',
  'viewer',
  'member',
] as const;

export type UserRole = typeof ROLES[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'ผู้ดูแลระบบสูงสุด',
  admin: 'ผู้จัดการ',
  sales: 'พนักงานขาย',
  accountant: 'พนักงานบัญชี',
  warehouse: 'พนักงานคลัง',
  viewer: 'ผู้ตรวจสอบ',
  member: 'ลูกค้า',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-red-100 text-red-700 border-red-300',
  admin: 'bg-purple-100 text-purple-700 border-purple-300',
  sales: 'bg-blue-100 text-blue-700 border-blue-300',
  accountant: 'bg-green-100 text-green-700 border-green-300',
  warehouse: 'bg-orange-100 text-orange-700 border-orange-300',
  viewer: 'bg-gray-100 text-gray-700 border-gray-300',
  member: 'bg-slate-100 text-slate-700 border-slate-300',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'เข้าถึงทุกอย่าง + จัดการสิทธิ์ผู้ใช้',
  admin: 'เข้าถึงทุกอย่าง except การจัดการสิทธิ์',
  sales: 'จัดการใบเสนอราคา ลูกค้า ดูใบวางบิล',
  accountant: 'จัดการใบวางบิล ใบกำกับภาษี ใบเสร็จ รายงาน',
  warehouse: 'จัดการสินค้า Sale Orders สต็อก',
  viewer: 'ดูได้ทุกอย่างแต่แก้ไขไม่ได้',
  member: 'ลูกค้า เห็นข้อมูลของตัวเอง',
};

// Helper: check if role is staff (admin panel access)
export const STAFF_ROLES: UserRole[] = [
  'super_admin', 'admin', 'sales', 'accountant', 'warehouse', 'viewer',
];

export const isStaffRole = (role: string | null | undefined): boolean => {
  return role ? STAFF_ROLES.includes(role as UserRole) : false;
};
