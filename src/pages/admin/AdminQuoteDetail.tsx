// src/pages/admin/AdminQuoteDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { formatDistanceToNow, format } from 'date-fns';
import { th } from 'date-fns/locale';

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

  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuoteDetails();
    }
  }, [id]);

  // Real-time chat subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`admin-quote-msgs-${id}-${Date.now()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quote_messages',
        filter: `quote_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === (payload.new as any).id)) return prev;
          return [...prev, payload.new as QuoteMessage];
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; variant: any; color: string }> = {
      pending: { label: 'รอตอบกลับ', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      quote_sent: { label: 'ส่งราคาแล้ว', variant: 'default', color: 'bg-blue-100 text-blue-800' },
      po_uploaded: { label: 'รอตรวจ PO', variant: 'destructive', color: 'bg-red-100 text-red-800' },
      po_approved: { label: 'อนุมัติแล้ว', variant: 'default', color: 'bg-green-100 text-green-800' },
      completed: { label: 'เสร็จสิ้น', variant: 'default', color: 'bg-muted text-gray-800' },
      rejected: { label: 'ปฏิเสธ', variant: 'destructive', color: 'bg-red-100 text-red-800' },
    };

    const conf = config[status] || { label: status, variant: 'default', color: 'bg-muted' };
    return <Badge className={conf.color}>{conf.label}</Badge>;
  };

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!quote) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">ไม่พบใบเสนอราคา</h2>
          <Button onClick={() => navigate('/admin/quotes')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารายการ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const poFiles = files.filter((f) => f.category === 'customer_po');
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
              <p className="text-muted-foreground text-sm mt-1">
                สร้างเมื่อ {format(new Date(quote.created_at), 'dd MMMM yyyy HH:mm', { locale: th })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(quote.status)}
            {quote.sla_breached && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                SLA เกิน
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {quote.status === 'po_uploaded' && (
          <Card className="border-orange-500/30 bg-orange-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-foreground">มี PO รอตรวจสอบ</h3>
                    <p className="text-sm text-muted-foreground">กรุณาตรวจสอบและอนุมัติ PO</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  ข้อมูลลูกค้า
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">ชื่อลูกค้า</Label>
                    <p className="font-medium">{quote.customer_name}</p>
                  </div>
                  {quote.customer_company && (
                    <div>
                      <Label className="text-muted-foreground">บริษัท</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {quote.customer_company}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">อีเมล</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {quote.customer_email}
                    </p>
                  </div>
                  {quote.customer_phone && (
                    <div>
                      <Label className="text-muted-foreground">โทรศัพท์</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {quote.customer_phone}
                      </p>
                    </div>
                  )}
                  {quote.customer_tax_id && (
                    <div>
                      <Label className="text-muted-foreground">เลขประจำตัวผู้เสียภาษี</Label>
                      <p className="font-medium">{quote.customer_tax_id}</p>
                    </div>
                  )}
                  {quote.customer_address && (
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground">ที่อยู่</Label>
                      <p className="font-medium">{quote.customer_address}</p>
                    </div>
                  )}
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
                              <span className="text-green-600 dark:text-green-400 dark:text-green-400">
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

                <Separator className="my-4" />

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ยอดรวม</span>
                    <span>{formatCurrency(quote.subtotal || 0)}</span>
                  </div>
                  {quote.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>ส่วนลด</span>
                      <span>-{formatCurrency(quote.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT 7%</span>
                    <span>{formatCurrency(quote.vat_amount || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>ยอดรวมทั้งสิ้น</span>
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

            {/* Files */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    ไฟล์แนบ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {poFiles.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">PO จากลูกค้า</h4>
                        {poFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-primary" />
                              <div>
                                <p className="font-medium">{file.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(file.uploaded_at), 'dd MMM yyyy HH:mm', {
                                    locale: th,
                                  })}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                ดู
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {quoteFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                          ใบเสนอราคา PDF
                        </h4>
                        {quoteFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                              <div>
                                <p className="font-medium">{file.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(file.uploaded_at), 'dd MMM yyyy HH:mm', {
                                    locale: th,
                                  })}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={file.file_url} download>
                                <Download className="w-4 h-4 mr-2" />
                                ดาวน์โหลด
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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
                            ? 'bg-primary/10 ml-4'
                            : msg.sender_role === 'system'
                            ? 'bg-muted'
                            : 'bg-green-500/10 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{msg.sender_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(msg.created_at), {
                              addSuffix: true,
                              locale: th,
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">ยังไม่มีข้อความ</p>
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

            {/* Quote Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ข้อมูลเพิ่มเติม</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {quote.valid_until && (
                  <div>
                    <Label className="text-muted-foreground">ใช้ได้ถึง</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {format(new Date(quote.valid_until), 'dd MMMM yyyy', { locale: th })}
                    </p>
                  </div>
                )}
                {quote.payment_terms && (
                  <div>
                    <Label className="text-muted-foreground">เงื่อนไขการชำระเงิน</Label>
                    <p>{quote.payment_terms}</p>
                  </div>
                )}
                {quote.delivery_terms && (
                  <div>
                    <Label className="text-muted-foreground">เงื่อนไขการจัดส่ง</Label>
                    <p>{quote.delivery_terms}</p>
                  </div>
                )}
                {quote.warranty_terms && (
                  <div>
                    <Label className="text-muted-foreground">การรับประกัน</Label>
                    <p>{quote.warranty_terms}</p>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <Label className="text-muted-foreground">หมายเหตุ</Label>
                    <p>{quote.notes}</p>
                  </div>
                )}
                {quote.internal_notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Label className="text-yellow-800">หมายเหตุภายใน (Admin เท่านั้น)</Label>
                    <p className="text-yellow-900">{quote.internal_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
    </AdminLayout>
  );
}
