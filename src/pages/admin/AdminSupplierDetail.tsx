import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/layouts/AdminLayout';
import SupplierRegistrationForm from '@/components/admin/SupplierRegistrationForm';
import SupplierStatusBadge from '@/components/admin/SupplierStatusBadge';
import SupplierLifecycleBadge, { LIFECYCLE_STAGES } from '@/components/admin/SupplierLifecycleBadge';
import SupplierPrequalForm from '@/components/admin/SupplierPrequalForm';
import SupplierScoringMatrix from '@/components/admin/SupplierScoringMatrix';
import SupplierOutreachLog from '@/components/admin/SupplierOutreachLog';
import SupplierVideoCallLog from '@/components/admin/SupplierVideoCallLog';
import SupplierSamplePilotPanel from '@/components/admin/SupplierSamplePilotPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowLeft, Edit2, Trash2, Loader2, Building2, Mail, Phone, Globe,
  MapPin, Landmark, CreditCard, Package, Star, MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

export default function AdminSupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplier, setSupplier] = useState<any>(null);
  const [pos, setPos] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
    setLoading(true);
    const [sRes, poRes, trRes] = await Promise.all([
      supabase.from('suppliers').select('*').eq('id', id!).maybeSingle(),
      supabase.from('purchase_orders').select('*').eq('supplier_id', id!).is('deleted_at', null).order('created_at', { ascending: false }),
      supabase.from('international_transfer_requests').select('*').eq('supplier_id', id!).is('deleted_at', null).order('created_at', { ascending: false }),
    ]);
    setSupplier(sRes.data);
    setPos((poRes.data as any[]) || []);
    setTransfers((trRes.data as any[]) || []);
    setLoading(false);
  };

  const softDelete = async () => {
    if (!confirm('ต้องการลบ Supplier นี้?')) return;
    await supabase.from('suppliers').update({ deleted_at: new Date().toISOString() } as any).eq('id', id!);
    toast({ title: 'ลบแล้ว' });
    navigate('/admin/suppliers');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      </AdminLayout>
    );
  }

  if (!supplier) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">ไม่พบข้อมูล Supplier</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/suppliers')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (editing) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> ยกเลิกแก้ไข
          </Button>
          <SupplierRegistrationForm
            editData={supplier}
            onSaved={() => { setEditing(false); load(); }}
          />
        </div>
      </AdminLayout>
    );
  }

  const s = supplier;
  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-2 text-sm">
        <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
        <div>
          <span className="text-muted-foreground">{label}: </span>
          <span className="font-medium">{value}</span>
        </div>
      </div>
    );
  };

  const businessTypeLabel: Record<string, string> = {
    manufacturer: 'ผู้ผลิต', distributor: 'ผู้จัดจำหน่าย', reseller: 'ตัวแทน', oem: 'OEM',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/suppliers')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
            </Button>
            <Button variant="destructive" size="sm" onClick={softDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> ลบ
            </Button>
          </div>
        </div>

        {/* Title card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{s.supplier_code}</span>
                  <SupplierStatusBadge status={s.status} />
                  <SupplierLifecycleBadge stage={s.lifecycle_stage} />
                  {s.is_preferred && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Preferred
                    </span>
                  )}
                  {s.overall_score != null && (
                    <Badge variant="outline" className="text-xs">★ {Number(s.overall_score).toFixed(2)}</Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold">{s.company_name}</h1>
                {s.company_name_en && s.company_name_en !== s.company_name && (
                  <p className="text-sm text-muted-foreground">{s.company_name_en}</p>
                )}
                {(s.city || s.country) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {[s.city, s.state_province, s.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              {s.quality_rating != null && (
                <div className="flex items-center gap-1 text-lg font-bold">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  {s.quality_rating}
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Lifecycle stage:</span>
              <Select
                value={s.lifecycle_stage ?? 'discovery'}
                onValueChange={async (v) => {
                  await supabase.from('suppliers').update({ lifecycle_stage: v } as any).eq('id', id!);
                  toast({ title: 'อัปเดต stage แล้ว' });
                  load();
                }}
              >
                <SelectTrigger className="w-48 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LIFECYCLE_STAGES.map(st => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="text-xs">ภาพรวม</TabsTrigger>
            <TabsTrigger value="prequal" className="text-xs">Pre-qual</TabsTrigger>
            <TabsTrigger value="scoring" className="text-xs">Scoring</TabsTrigger>
            <TabsTrigger value="outreach" className="text-xs">Outreach</TabsTrigger>
            <TabsTrigger value="video" className="text-xs">Video Call</TabsTrigger>
            <TabsTrigger value="sample" className="text-xs">Sample/Pilot</TabsTrigger>
          </TabsList>

          <TabsContent value="prequal"><SupplierPrequalForm supplierId={id!} /></TabsContent>
          <TabsContent value="scoring"><SupplierScoringMatrix supplierId={id!} /></TabsContent>
          <TabsContent value="outreach"><SupplierOutreachLog supplierId={id!} supplierName={s.company_name} /></TabsContent>
          <TabsContent value="video"><SupplierVideoCallLog supplierId={id!} /></TabsContent>
          <TabsContent value="sample"><SupplierSamplePilotPanel supplierId={id!} /></TabsContent>

          <TabsContent value="overview" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Company info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" /> ข้อมูลบริษัท
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow icon={Building2} label="ประเภท" value={businessTypeLabel[s.business_type] || s.business_type} />
              <InfoRow icon={MapPin} label="ประเทศ" value={s.country} />
              <InfoRow icon={Mail} label="อีเมล" value={s.email} />
              <InfoRow icon={Phone} label="โทร" value={s.phone} />
              <InfoRow icon={Phone} label="มือถือ" value={s.mobile} />
              <InfoRow icon={MessageCircle} label="WhatsApp" value={s.whatsapp} />
              <InfoRow icon={MessageCircle} label="WeChat" value={s.wechat_id} />
              <InfoRow icon={MessageCircle} label="Skype" value={s.skype} />
              <InfoRow icon={MessageCircle} label="LINE" value={s.line_id} />
              <InfoRow icon={Globe} label="เว็บ" value={s.website} />
              <InfoRow icon={Building2} label="ผู้ติดต่อ" value={[s.contact_name, s.contact_position].filter(Boolean).join(' — ')} />
              {s.address && (
                <div className="text-sm pt-1 border-t">
                  <span className="text-muted-foreground">ที่อยู่: </span>
                  <span>{[s.address, s.city, s.state_province, s.postal_code].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Landmark className="w-4 h-4" /> ข้อมูลธนาคาร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <InfoRow icon={Landmark} label="ธนาคาร" value={s.bank_name} />
              <InfoRow icon={CreditCard} label="SWIFT" value={s.swift_code} />
              <InfoRow icon={CreditCard} label="เลขบัญชี" value={s.bank_account_number} />
              <InfoRow icon={CreditCard} label="ชื่อบัญชี" value={s.bank_account_name} />
              <InfoRow icon={CreditCard} label="IBAN" value={s.iban} />
              <InfoRow icon={Landmark} label="ที่อยู่ธนาคาร" value={s.bank_address} />
              <InfoRow icon={Landmark} label="ประเทศธนาคาร" value={s.bank_country} />
              {s.intermediary_bank && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Intermediary Bank</p>
                  </div>
                  <InfoRow icon={Landmark} label="ธนาคาร" value={s.intermediary_bank} />
                  <InfoRow icon={CreditCard} label="SWIFT" value={s.intermediary_swift} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products & terms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="w-4 h-4" /> สินค้า & เงื่อนไข
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                {s.main_products?.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">สินค้าหลัก: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.main_products.map((p: string, i: number) => (
                        <span key={i} className="bg-muted px-2 py-0.5 rounded text-xs">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
                <InfoRow icon={Package} label="สกุลเงิน" value={s.currency} />
                <InfoRow icon={Package} label="Payment Terms" value={s.payment_terms || s.default_payment_terms} />
                <InfoRow icon={Package} label="Price Terms" value={s.default_price_terms} />
              </div>
              <div className="space-y-2">
                <InfoRow icon={Package} label="Delivery Days" value={s.default_delivery_days} />
                <InfoRow icon={Package} label="Lead Time" value={s.lead_time_days ? `${s.lead_time_days} วัน` : null} />
                <InfoRow icon={Package} label="ยอดขั้นต่ำ" value={s.minimum_order_amount ? `${s.minimum_order_amount}` : null} />
                <InfoRow icon={Package} label="ประกันฟรี" value={s.warranty_terms_free} />
                <InfoRow icon={Package} label="ประกันเสียเงิน" value={s.warranty_terms_paid} />
              </div>
            </div>
            {s.notes && (
              <div className="mt-3 pt-3 border-t text-sm">
                <span className="text-muted-foreground">หมายเหตุ: </span>{s.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {/* POs */}
        {pos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">PO ที่เกี่ยวข้อง ({pos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่ PO</TableHead>
                    <TableHead>PI</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead className="text-right">ยอดรวม</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pos.map(po => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono text-xs">{po.po_number}</TableCell>
                      <TableCell className="text-xs">{po.pi_number || '-'}</TableCell>
                      <TableCell className="text-sm">
                        {po.order_date ? format(new Date(po.order_date), 'dd MMM yy', { locale: th }) : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {po.currency} {Number(po.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{po.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Transfers */}
        {transfers.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Transfer ที่เกี่ยวข้อง ({transfers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>เลขที่</TableHead>
                    <TableHead>วันที่</TableHead>
                    <TableHead className="text-right">จำนวน</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.transfer_number}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(t.created_at), 'dd MMM yy', { locale: th })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {t.currency} {Number(t.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{t.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
