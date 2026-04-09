// src/pages/admin/AdminQuoteDetail.tsx
import { useEffect, useState } from 'react';
import CreateSaleOrderDialog from '@/components/admin/CreateSaleOrderDialog';
import POActionsMenu from '@/components/admin/POActionsMenu';
import POVersionHistory from '@/components/admin/POVersionHistory';
import { QuoteTimeline } from '@/components/QuoteTimeline';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ProductEditor from '@/components/admin/ProductEditor';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Send,
  Paperclip,
  Download,
  FileText,
  Clock,
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatShortDateTime, formatFullDate, formatRelativeTime } from '@/lib/format';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_company: string | null;
  customer_address: string | null;
  customer_tax_id: string | null;
  products: any[];
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  grand_total: number;
  status: string;
  payment_terms: string | null;
  delivery_terms: string | null;
  warranty_terms: string | null;
  notes: string | null;
  internal_notes: string | null;
  valid_until: string | null;
  created_at: string;
  sent_at: string | null;
  po_uploaded_at: string | null;
  approved_at: string | null;
  sla_breached: boolean;
  sla_po_review_due: string | null;
}

interface QuoteFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  category: string;
  uploaded_at: string;
  uploaded_by: string | null;
}

interface QuoteMessage {
  id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export default function AdminQuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [files, setFiles] = useState<QuoteFile[]>([]);
  const [messages, setMessages] = useState<QuoteMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // User role
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'sales'>('admin');
  const [userEmail, setUserEmail] = useState('');

  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showCreateSO, setShowCreateSO] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuoteDetails();
      loadUserRole();
    }
  }, [id]);

  useEffect(() => {
    // Check for action in URL params
    const action = searchParams.get('action');
    if (action === 'approve') {
      setShowApproveDialog(true);
    } else if (action === 'reject') {
      setShowRejectDialog(true);
    }
  }, [searchParams]);

  const loadUserRole = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setUserEmail(authUser.email || '');

      // Check user_roles table for super_admin
      const { data: roleData } = await (supabase.from as any)('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      if (roleData && roleData.some((r: any) => r.role === 'super_admin')) {
        setUserRole('super_admin');
        return;
      }

      // Fall back to users table
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', authUser.id)
        .single();

      if (userData) {
        setUserRole(userData.role === 'sales' ? 'sales' : 'admin');
      }
    } catch (e) {
      console.error('Error loading user role:', e);
    }
  };

  const loadQuoteDetails = async () => {
    try {
      // Load quote
      const { data: quoteData, error: quoteError } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (quoteError) throw quoteError;
      setQuote({ ...quoteData, products: (quoteData.products as any) || [] } as Quote);

      // Load files
      const { data: filesData, error: filesError } = await supabase
        .from('quote_files')
        .select('*')
        .eq('quote_id', id)
        .order('uploaded_at', { ascending: false });

      if (filesError) throw filesError;
      setFiles(filesData || []);

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('quote_messages')
        .select('*')
        .eq('quote_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSendingMessage(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { error } = await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_id: authUser?.id || null,
        sender_name: 'Admin',
        sender_role: 'admin',
        content: messageText,
        message_type: 'text',
      });

      if (error) throw error;

      setMessageText('');
      await loadQuoteDetails();
      toast({ title: 'ส่งข้อความสำเร็จ' });
    } catch (error: any) {
      toast({
        title: 'ส่งข้อความไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          status: 'po_approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Add system message
      await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_name: 'System',
        sender_role: 'system',
        content: 'อนุมัติ PO แล้ว - รอดำเนินการจัดส่ง',
        message_type: 'status_change',
      });

      toast({
        title: 'อนุมัติสำเร็จ',
        description: 'อนุมัติ PO เรียบร้อยแล้ว',
      });

      setShowApproveDialog(false);
      await loadQuoteDetails();
    } catch (error: any) {
      toast({
        title: 'อนุมัติไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: 'กรุณาระบุเหตุผล',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Add system message
      await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_name: 'System',
        sender_role: 'system',
        content: `ปฏิเสธ PO - เหตุผล: ${rejectReason}`,
        message_type: 'status_change',
      });

      toast({
        title: 'ปฏิเสธสำเร็จ',
        description: 'ปฏิเสธ PO เรียบร้อยแล้ว',
      });

      setShowRejectDialog(false);
      setRejectReason('');
      await loadQuoteDetails();
    } catch (error: any) {
      toast({
        title: 'ปฏิเสธไม่สำเร็จ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // StatusBadge is now imported from @/components/ui/StatusBadge

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!quote) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">ไม่พบใบเสนอราคา</h2>
          <Button onClick={() => navigate('/admin/quotes')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารายการ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const poFiles = files.filter((f) => f.category === 'po' || f.category === 'customer_po');
  const quoteFiles = files.filter((f) => f.category === 'quote_pdf');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/quotes')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{quote.quote_number}</h1>
              <p className="text-gray-600 text-sm mt-1">
                สร้างเมื่อ {formatShortDateTime(quote.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={quote.status} />
            {quote.sla_breached && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                SLA เกิน
              </Badge>
            )}
          </div>
        </div>

        {/* PO Action Banner (review needed) */}
        {(quote.status === 'po_uploaded' || quote.status === 'po_confirmed') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">
                      {quote.status === 'po_confirmed' ? 'ลูกค้ายืนยัน PO แล้ว' : 'มี PO รอตรวจสอบ'}
                    </h3>
                    <p className="text-sm text-orange-700">กรุณาตรวจสอบและอนุมัติ PO</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                  <Button onClick={() => setShowApproveDialog(true)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    อนุมัติ PO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SO Action Banner */}
        {quote.status === 'po_approved' && !(quote as any).has_sale_order && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-200">PO อนุมัติแล้ว</h3>
                    <p className="text-sm text-green-700 dark:text-green-400">สร้าง Sale Order เพื่อดำเนินการต่อ</p>
                  </div>
                </div>
                <Button onClick={() => setShowCreateSO(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  สร้าง Sale Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(quote as any).has_sale_order && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200">สร้าง Sale Order แล้ว</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">กระบวนการขายเสร็จสิ้น</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/admin/sale-orders')}>
                  <Eye className="w-4 h-4 mr-2" />
                  ดู Sale Order
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5" />
                  ข้อมูลลูกค้า
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">ชื่อลูกค้า</Label>
                    <p className="font-semibold text-foreground">{quote.customer_name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">ที่อยู่</Label>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {quote.customer_address || '-'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">รหัสไปรษณีย์</Label>
                      <p className="text-sm text-foreground">
                        {quote.customer_address?.match(/\d{5}$/)?.[0] || '-'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">เลขประจำตัวผู้เสียภาษี</Label>
                      <p className="text-sm text-foreground">{quote.customer_tax_id || '-'}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">สำนักงานใหญ่</Label>
                    <p className="text-sm text-foreground">
                      {quote.customer_company ? 'สำนักงานใหญ่' : '-'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <Label className="text-xs text-muted-foreground">แก้ไข</Label>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">ผู้ติดต่อ:</Label>
                    <p className="font-semibold text-foreground">{quote.customer_name}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">อีเมล:</Label>
                    <p className="text-sm text-foreground">{quote.customer_email}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">ที่ตั้งธุรกิจ:</Label>
                    <p className="text-sm text-foreground">ไทย</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>รายการสินค้า</CardTitle>
              </CardHeader>
              <CardContent>
                {quote.status === 'pending' ? (
                  <ProductEditor
                    products={quote.products || []}
                    onUpdate={async (updatedProducts) => {
                      const { error } = await supabase
                        .from('quote_requests')
                        .update({ products: updatedProducts as any })
                        .eq('id', id);
                      
                      if (!error) {
                        setQuote({ ...quote, products: updatedProducts });
                        toast({ title: 'บันทึกสินค้าแล้ว' });
                      }
                    }}
                    disabled={false}
                  />
                ) : (
                  <div className="space-y-3">
                    {quote.products && quote.products.length > 0 ? (
                      quote.products.map((product: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{product.model || 'N/A'}</h4>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                              {product.notes && (
                                <p className="text-sm text-primary mt-1">หมายเหตุ: {product.notes}</p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="font-semibold text-primary">
                                {formatCurrency(product.line_total || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>จำนวน: {product.qty || 0}</span>
                            <span>ราคา/หน่วย: {formatCurrency(product.unit_price || 0)}</span>
                            {product.discount_percent > 0 && (
                              <span className="text-green-600 dark:text-green-400">
                                ส่วนลด {product.discount_percent}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">ไม่มีรายการสินค้า</p>
                    )}
                  </div>
                )}

                {/* Internal Notes - Below Products */}
                {quote.status === 'pending' && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      หมายเหตุภายใน
                    </Label>
                    <Textarea
                      placeholder="โน้ตภายในสำหรับทีม (ลูกค้าไม่เห็น)"
                      rows={4}
                      className="text-foreground bg-background border-border"
                      defaultValue={quote.notes || ''}
                      onBlur={async (e) => {
                        const { error } = await supabase
                          .from('quote_requests')
                          .update({ notes: e.target.value })
                          .eq('id', id);
                        
                        if (!error) {
                          toast({ title: 'บันทึกหมายเหตุแล้ว' });
                        }
                      }}
                    />
                  </div>
                )}

                <Separator className="my-4" />

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">รวมเป็นเงิน</span>
                    <span className="text-foreground">{formatCurrency(quote.subtotal || 0)}</span>
                  </div>
                  {quote.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>ส่วนลด</span>
                      <span>-{formatCurrency(quote.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ราคาหลังหักส่วนลด</span>
                    <span className="text-foreground">{formatCurrency(quote.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม 7%</span>
                    <span className="text-foreground">{formatCurrency(quote.vat_amount || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">จำนวนเงินรวมทั้งสิ้น</span>
                    <span className="text-primary">{formatCurrency(quote.grand_total || 0)}</span>
                  </div>
                </div>

                {/* Send Quote Button - Only show when pending */}
                {quote.status === 'pending' && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={async () => {
                        try {
                          // Calculate totals
                          const subtotal = quote.products.reduce((sum: number, p: any) => sum + (p.line_total || 0), 0);
                          const vatAmount = subtotal * 0.07;
                          const grandTotal = subtotal + vatAmount;

                          const { error } = await supabase
                            .from('quote_requests')
                            .update({
                              status: 'quote_sent',
                              subtotal,
                              vat_amount: vatAmount,
                              grand_total: grandTotal,
                              sent_at: new Date().toISOString(),
                            })
                            .eq('id', id);

                          if (error) throw error;

                          toast({
                            title: 'ส่งใบเสนอราคาสำเร็จ',
                            description: 'ส่งใบเสนอราคาไปยังลูกค้าแล้ว',
                          });

                          await loadQuoteDetails();
                        } catch (error: any) {
                          toast({
                            title: 'เกิดข้อผิดพลาด',
                            description: error.message,
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      บันทึกและส่งใบเสนอราคา
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Chat & Timeline */}
          <div className="space-y-6">
            {/* Chat/Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ข้อความ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.sender_role === 'admin' || msg.sender_role === 'sales'
                            ? 'bg-blue-50 ml-4'
                            : msg.sender_role === 'system'
                            ? 'bg-gray-100'
                            : 'bg-green-50 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{msg.sender_name}</span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">ยังไม่มีข้อความ</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="พิมพ์ข้อความ..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={3}
                    className="text-foreground bg-background border-border"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !messageText.trim()}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendingMessage ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PO Files — compact below chat */}
            {poFiles.length > 0 && (
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">📎 PO จากลูกค้า ({poFiles.length})</p>
                  <div className="space-y-1">
                    {poFiles.map((file) => (
                      <a
                        key={file.id}
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-medium text-foreground truncate flex-1">{file.file_name}</span>
                        <Download className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PO Actions Menu */}
            {poFiles.length > 0 && (
              <POActionsMenu
                quoteId={quote.id}
                quoteNumber={quote.quote_number}
                poFiles={poFiles}
                userRole={userRole}
                userEmail={userEmail}
                onRefresh={loadQuoteDetails}
              />
            )}

            {/* PO Version History */}
            {poFiles.length > 0 && (
              <POVersionHistory quoteId={quote.id} currentFiles={poFiles} />
            )}
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการอนุมัติ PO</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการอนุมัติ PO สำหรับใบเสนอราคา {quote.quote_number}?
              <br />
              <br />
              <strong>ยอดรวม: {formatCurrency(quote.grand_total)}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={processing}>
              {processing ? 'กำลังดำเนินการ...' : 'ยืนยันอนุมัติ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธ PO</DialogTitle>
            <DialogDescription>
              กรุณาระบุเหตุผลในการปฏิเสธ PO สำหรับใบเสนอราคา {quote.quote_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>เหตุผลในการปฏิเสธ *</Label>
              <Textarea
                placeholder="เช่น: สินค้าหมด, ราคาไม่ตรง, เงื่อนไขไม่ตรงกัน..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={processing}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? 'กำลังดำเนินการ...' : 'ยืนยันปฏิเสธ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Sale Order Dialog */}
      <CreateSaleOrderDialog
        open={showCreateSO}
        onOpenChange={setShowCreateSO}
        quote={quote}
        onSuccess={loadQuoteDetails}
      />
    </AdminLayout>
  );
}
