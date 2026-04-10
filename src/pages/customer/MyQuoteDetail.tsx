import { useEffect, useState } from 'react';
import NegotiationRequestDialog from '@/components/negotiation/NegotiationRequestDialog';
import AcceptQuoteDialog from '@/components/negotiation/AcceptQuoteDialog';
import RevisionTimeline from '@/components/negotiation/RevisionTimeline';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import POUploadDialog from '@/components/quotes/POUploadDialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  Printer,
  Upload,
  FileText,
  Package,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Edit,
  AlertCircle,
  RefreshCw,
  X,
  Loader2,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { formatShortDateTime, formatFullDate, formatRelativeTime } from '@/lib/format';

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company: string;
  customer_address: string;
  products: any[];
  notes: string;
  internal_notes: string;
  subtotal: number;
  vat_amount: number;
  grand_total: number;
  created_at: string;
  sent_at: string | null;
  payment_terms: string | null;
  delivery_terms: string | null;
  warranty_terms: string | null;
  valid_until: string | null;
  // Negotiation fields
  current_revision_id: string | null;
  current_revision_number: number | null;
  total_revisions: number | null;
  negotiation_count: number | null;
  free_items: any[] | null;
  accepted_at: string | null;
  accepted_by: string | null;
  expired_at: string | null;
}

interface Message {
  id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

interface POFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  uploaded_at: string;
}

export default function MyQuoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [poFiles, setPoFiles] = useState<POFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPOUpload, setShowPOUpload] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Customer PO edit request
  const [showRequestEdit, setShowRequestEdit] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [requestFiles, setRequestFiles] = useState<FileList | null>(null);
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [showAcceptQuote, setShowAcceptQuote] = useState(false);
  const [currentRevision, setCurrentRevision] = useState<any>(null);

  useEffect(() => {
    if (id && user) {
      loadQuote();
      loadMessages();
      loadPOFiles();
    }
  }, [id, user]);

  // Realtime subscription for messages
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`customer-chat-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quote_messages',
        filter: `quote_id=eq.${id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [id]);

  const loadQuote = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id!)
        .single();

      if (error) throw error;
      setQuote({ ...data, products: (data.products as any) || [] } as any);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/my-quotes');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_messages')
        .select('*')
        .eq('quote_id', id!)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadPOFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_files')
        .select('*')
        .eq('quote_id', id!)
        .eq('category', 'po')
        .order('uploaded_at', { ascending: false });

      if (!error && data) {
        setPoFiles(data);
      }
    } catch (error) {
      console.error('Error loading PO files:', error);
    }
  };

  const handleDeletePOFile = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(`ต้องการลบไฟล์ "${fileName}" ใช่หรือไม่?`);
    if (!confirmed) return;

    setDeletingFileId(fileId);
    try {
      // Get file URL to extract storage path
      const fileRecord = poFiles.find(f => f.id === fileId);
      if (fileRecord) {
        try {
          const url = new URL(fileRecord.file_url);
          const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/quote-files\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from('quote-files').remove([pathMatch[1]]);
          }
        } catch { /* storage cleanup best-effort */ }
      }

      const { error } = await supabase.from('quote_files').delete().eq('id', fileId);
      if (error) throw error;

      setPoFiles(prev => prev.filter(f => f.id !== fileId));
      toast({ title: 'ลบไฟล์แล้ว', description: `ลบ "${fileName}" เรียบร้อย` });
    } catch (error: any) {
      toast({ title: 'ลบไฟล์ไม่สำเร็จ', description: error.message, variant: 'destructive' });
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: messageText,
        message_type: 'text',
      });

      if (error) throw error;

      setMessageText('');
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

  const handleSendPO = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: 'po_confirmed' } as any)
        .eq('id', id!);

      if (error) throw error;

      await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: '📎 ส่ง PO เรียบร้อยแล้ว — รอทีมงานตรวจสอบ',
        message_type: 'system',
      });

      toast({ title: 'ส่ง PO สำเร็จ', description: 'ทีมงานจะตรวจสอบและดำเนินการให้เร็วที่สุด' });
      loadQuote();
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setConfirming(false);
    }
  };
  const handleCustomerRequestEdit = async () => {
    if (!requestReason.trim()) {
      toast({ title: 'กรุณาระบุเหตุผล', variant: 'destructive' });
      return;
    }
    setRequestProcessing(true);
    try {
      let uploadedFiles: any[] = [];
      if (requestFiles && requestFiles.length > 0) {
        for (const file of Array.from(requestFiles)) {
          const fileName = `temp/${id}/${Date.now()}_${file.name}`;
          const { data: uploadData } = await supabase.storage
            .from('quote-files')
            .upload(fileName, file);
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage.from('quote-files').getPublicUrl(fileName);
            uploadedFiles.push({ file_url: publicUrl, file_name: file.name, file_size: file.size });
          }
        }
      }

      await (supabase.from as any)('po_change_requests').insert({
        quote_id: id,
        request_type: 'edit',
        requested_by: user?.email || 'customer',
        requested_by_role: 'customer',
        request_reason: requestReason,
        new_files: uploadedFiles.length > 0 ? uploadedFiles : null,
      });

      await supabase.from('quote_messages').insert({
        quote_id: id,
        sender_name: user?.email || 'ลูกค้า',
        sender_role: 'customer',
        content: `ขอแก้ไข PO — ${requestReason}`,
        message_type: 'text',
      });

      toast({ title: 'ส่งคำขอสำเร็จ', description: 'ทีมงานจะตรวจสอบคำขอของคุณ' });
      setShowRequestEdit(false);
      setRequestReason('');
      setRequestFiles(null);
    } catch (error: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
    } finally {
      setRequestProcessing(false);
    }
  };


  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(amount);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 print:hidden">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/my-quotes')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-bold text-foreground">{quote.quote_number}</h1>
                <p className="text-xs text-muted-foreground">
                  {formatShortDateTime(quote.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />พิมพ์
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Timeline */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <QuoteTimeline currentStatus={quote.status} />
          </CardContent>
        </Card>

        {/* Attention Banner — pending / quote_sent */}
        {(quote.status === 'pending' || quote.status === 'quote_sent') && (
          <Card className="mb-6 border-primary/50 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0 hidden md:block">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">
                      💡 ทีมงานได้รับใบขอราคาของคุณแล้ว
                    </h3>
                    <Badge variant="secondary" className="animate-pulse">
                      กำลังดำเนินการ
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    เรากำลังตรวจสอบสินค้า สเปก รายละเอียด และราคา
                    แล้วจะดำเนินการตอบกลับโดยเร็วที่สุด
                  </p>

                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-3">
                      หากมีข้อสงสัย ติดต่อได้ที่:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="mailto:sales@entgroup.co.th"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-background border rounded-lg text-sm hover:bg-primary/5 hover:border-primary/50 transition-all"
                      >
                        <Mail className="w-4 h-4 text-primary" />
                        <span>sales@entgroup.co.th</span>
                      </a>
                      <a
                        href="https://line.me/R/ti/p/@entgroup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-background border rounded-lg text-sm hover:bg-primary/5 hover:border-primary/50 transition-all"
                      >
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span>LINE: @entgroup</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Negotiation Action Bar — quote_sent or negotiating */}
        {(quote.status === 'quote_sent' || quote.status === 'negotiating') && quote.grand_total > 0 && (
          <Card className="mb-6 border-primary/30">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ราคาที่เสนอ</p>
                  <p className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(quote.grand_total)} <span className="text-sm font-normal text-muted-foreground">(รวม VAT)</span>
                  </p>
                  {quote.valid_until && (
                    <p className="text-xs text-muted-foreground mt-1">⏱️ ราคานี้ใช้ได้ถึง: {formatFullDate(quote.valid_until)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAcceptQuote(true)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> ยอมรับราคานี้
                  </Button>
                  <Button variant="outline" onClick={() => setShowNegotiation(true)}>
                    💬 ขอต่อรอง
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accepted Banner */}
        {quote.status === 'accepted' && (
          <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-200">ยอมรับราคาแล้ว</h3>
                <p className="text-sm text-green-700 dark:text-green-400">ขั้นตอนต่อไป: อัปโหลดใบสั่งซื้อ (PO)</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revision Timeline */}
        <div className="mb-6">
          <RevisionTimeline
            quoteId={quote.id}
            currentRevisionId={(quote as any).current_revision_id}
            viewerRole="customer"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลผู้ขอใบเสนอราคา</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">ชื่อ-นามสกุล</p>
                    <p className="font-semibold text-foreground">{quote.customer_name}</p>
                  </div>
                  {quote.customer_company && (
                    <div>
                      <p className="text-xs text-muted-foreground">บริษัท</p>
                      <p className="font-semibold text-foreground">{quote.customer_company}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">อีเมล</p>
                    <p className="text-sm text-foreground">{quote.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">โทรศัพท์</p>
                    <p className="text-sm text-foreground">{quote.customer_phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  รายการสินค้า
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">รุ่น</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">รายละเอียด</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">จำนวน</th>
                        {quote.status !== 'pending' && (
                          <>
                            <th className="px-4 py-3 text-right text-sm font-semibold">ราคา/หน่วย</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold">ส่วนลด</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold">รวม</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {quote.products && quote.products.map((product: any, index: number) => (
                        <tr key={index} className="border-b border-border">
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{product.model}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{product.description}</td>
                          <td className="px-4 py-3 text-sm text-right">{product.qty}</td>
                          {quote.status !== 'pending' && (
                            <>
                              <td className="px-4 py-3 text-sm text-right">
                                {formatCurrency(product.unit_price || 0)}
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                {product.discount_percent > 0 ? `${product.discount_percent}%` : '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-semibold">
                                {formatCurrency(product.line_total || 0)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {quote.status !== 'pending' && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ยอดรวม</span>
                        <span className="font-semibold">{formatCurrency(quote.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT 7%</span>
                        <span className="font-semibold">{formatCurrency(quote.vat_amount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>ยอดรวมทั้งสิ้น</span>
                        <span className="text-primary">{formatCurrency(quote.grand_total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {(quote.notes || quote.payment_terms || quote.delivery_terms || quote.warranty_terms) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">หมายเหตุใบเสนอราคา</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {quote.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">หมายเหตุ</p>
                      <p className="text-foreground whitespace-pre-wrap">{quote.notes}</p>
                    </div>
                  )}
                  {quote.payment_terms && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">เงื่อนไขการชำระเงิน</p>
                      <p className="text-foreground">{quote.payment_terms}</p>
                    </div>
                  )}
                  {quote.delivery_terms && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">เงื่อนไขการจัดส่ง</p>
                      <p className="text-foreground">{quote.delivery_terms}</p>
                    </div>
                  )}
                  {quote.warranty_terms && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">เงื่อนไขการรับประกัน</p>
                      <p className="text-foreground">{quote.warranty_terms}</p>
                    </div>
                  )}
                  {quote.valid_until && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ใบเสนอราคามีผลถึง</p>
                      <p className="text-foreground">{formatFullDate(quote.valid_until)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Internal Notes */}
            {quote.internal_notes && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    หมายเหตุภายในองค์กร
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{quote.internal_notes}</p>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column - Chat & Files */}
          <div className="space-y-6">
            {/* Chat Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  ข้อความ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.sender_role === 'customer'
                            ? 'bg-primary/10 ml-4'
                            : msg.sender_role === 'system'
                            ? 'bg-muted'
                            : 'bg-accent/50 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-foreground">
                            {msg.sender_role === 'customer' ? 'คุณ' : msg.sender_role === 'admin' || msg.sender_role === 'sales' ? 'ทีมขาย' : msg.sender_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
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

            {/* PO Files - Compact */}
            {poFiles.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    ไฟล์แนบ ({poFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {poFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border hover:border-primary transition-colors group"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-foreground truncate flex-1 hover:underline"
                        >
                          {file.file_name}
                        </a>
                        <a href={file.file_url} download className="p-1 hover:bg-primary/10 rounded" title="ดาวน์โหลด">
                          <Download className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                        </a>
                        {(quote.status === 'quote_sent' || quote.status === 'po_uploaded') && (
                          <button
                            onClick={() => handleDeletePOFile(file.id, file.file_name)}
                            disabled={deletingFileId === file.id}
                            className="p-1 hover:bg-destructive/10 rounded disabled:opacity-50"
                            title="ลบไฟล์"
                          >
                            {deletingFileId === file.id
                              ? <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                              : <X className="w-3 h-3 text-destructive" />
                            }
                          </button>
                        )}
                      </div>
                    ))}
                   </div>

                  {/* Customer: Request Edit PO */}
                  {(quote.status === 'po_uploaded' || quote.status === 'po_confirmed') && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setShowRequestEdit(true)}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        ขอแก้ไข PO
                      </Button>
                      <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                        หากต้องการแก้ไขไฟล์ PO กรุณาส่งคำขอให้ทีมงาน
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* PO Upload Action */}
            {(quote.status === 'quote_sent' || quote.status === 'po_uploaded') && (
              <Card>
                <CardContent className="pt-5">
                  <div className="text-center space-y-3">
                    <Send className="w-8 h-8 text-primary mx-auto" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {poFiles.length > 0 ? 'พร้อมส่ง PO ให้ทีมงาน' : 'อัปโหลดใบสั่งซื้อ (PO)'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {poFiles.length > 0 ? 'กดส่ง PO ทั้งหมดให้ทีมงาน' : 'แนบไฟล์ PO เพื่อดำเนินการสั่งซื้อ'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowPOUpload(true)}>
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        {poFiles.length > 0 ? 'แนบเพิ่ม' : 'อัปโหลด PO'}
                      </Button>
                      {quote.status === 'po_uploaded' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            loadQuote();
                            loadPOFiles();
                            toast({ title: 'รีเฟรชแล้ว' });
                          }}
                          title="รีเฟรชข้อมูล"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button size="sm" onClick={handleSendPO} disabled={confirming || poFiles.length === 0} className="flex-1">
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        {confirming ? 'กำลังส่ง...' : 'ส่ง PO'}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">ทีมงานจะตรวจสอบและอนุมัติให้เร็วที่สุด</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {quote.status === 'po_confirmed' && (
              <Card>
                <CardContent className="pt-5 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                  <p className="font-semibold text-foreground text-sm">ส่ง PO แล้ว</p>
                  <p className="text-xs text-muted-foreground">ทีมงานกำลังตรวจสอบและดำเนินการให้เร็วที่สุด</p>
                </CardContent>
              </Card>
            )}

            {(quote.status === 'po_approved' || quote.status === 'completed') && (
              <Card>
                <CardContent className="pt-5">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">สถานะ:</span>{' '}
                    {quote.status === 'po_approved' && 'PO ได้รับการอนุมัติแล้ว'}
                    {quote.status === 'completed' && '✅ เสร็จสิ้น'}
                  </p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* PO Upload Dialog */}
      <POUploadDialog
        open={showPOUpload}
        onOpenChange={setShowPOUpload}
        quoteId={quote.id}
        quoteNumber={quote.quote_number}
        onSuccess={() => {
          loadQuote();
          loadPOFiles();
        }}
      />

      {/* Customer Request Edit PO Dialog */}
      <Dialog open={showRequestEdit} onOpenChange={setShowRequestEdit}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>ขอแก้ไข PO</DialogTitle>
            <DialogDescription>ส่งคำขอแก้ไขไฟล์ PO ให้ทีมงานตรวจสอบ</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <p className="text-xs text-orange-700 dark:text-orange-400">
                คำขอนี้จะถูกส่งให้ทีมงานพิจารณา — จะแจ้งผลให้ทราบทางข้อความ
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">ไฟล์ PO ใหม่ (ถ้ามี)</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setRequestFiles(e.target.files)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm">เหตุผลในการขอแก้ไข *</Label>
              <Textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                rows={4}
                placeholder="กรุณาระบุเหตุผลอย่างละเอียด..."
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestEdit(false)} disabled={requestProcessing}>
              ยกเลิก
            </Button>
            <Button onClick={handleCustomerRequestEdit} disabled={requestProcessing || !requestReason.trim()}>
              <Send className="w-4 h-4 mr-2" />
              {requestProcessing ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Negotiation Request Dialog */}
      <NegotiationRequestDialog
        quoteId={quote.id}
        currentRevisionId={(quote as any).current_revision_id}
        open={showNegotiation}
        onClose={() => setShowNegotiation(false)}
        onSuccess={() => loadQuote()}
      />

      {/* Accept Quote Dialog */}
      <AcceptQuoteDialog
        quoteId={quote.id}
        quoteNumber={quote.quote_number}
        grandTotal={quote.grand_total}
        freeItems={(quote as any).free_items || []}
        validUntil={quote.valid_until}
        open={showAcceptQuote}
        onClose={() => setShowAcceptQuote(false)}
        onSuccess={() => loadQuote()}
      />
    </div>
  );
}
