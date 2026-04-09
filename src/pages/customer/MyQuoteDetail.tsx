import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QuoteTimeline from '@/components/rfq/QuoteTimeline';
import POUploadDialog from '@/components/quotes/POUploadDialog';
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

        {/* Two Column Layout */}
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

            {/* PO Files */}
            {poFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    เอกสาร Purchase Order (PO)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {poFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{file.file_name}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>
                                {formatShortDateTime(file.uploaded_at)}
                              </span>
                              {file.file_size && <span>{formatFileSize(file.file_size)}</span>}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.file_url, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          ดาวน์โหลด
                        </Button>
                      </div>
                    ))}
                  </div>
                  {(quote.status === 'quote_sent' || quote.status === 'po_uploaded') && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center space-y-3">
                      <Send className="w-10 h-10 text-primary mx-auto" />
                      <div>
                        <p className="font-semibold text-foreground">พร้อมส่ง PO ให้ทีมงานตรวจสอบ</p>
                        <p className="text-sm text-muted-foreground">กดปุ่มด้านล่างเพื่อส่ง PO ทั้งหมดให้ทีมงาน</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowPOUpload(true)}>
                          <Upload className="w-4 h-4 mr-2" />
                          แนบไฟล์เพิ่ม
                        </Button>
                        <Button onClick={handleSendPO} disabled={confirming} className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          {confirming ? 'กำลังส่ง...' : 'ส่ง PO'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">เมื่อกดส่งแล้ว ทีมงานจะตรวจสอบและอนุมัติให้เร็วที่สุด</p>
                    </div>
                  )}
                  {quote.status === 'po_confirmed' && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
                      <p className="font-semibold text-foreground">ส่ง PO แล้ว</p>
                      <p className="text-sm text-muted-foreground">ทีมงานกำลังตรวจสอบและดำเนินการ</p>
                    </div>
                  )}
                  {(quote.status === 'po_approved' || quote.status === 'completed') && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">สถานะ:</span>{' '}
                        {quote.status === 'po_approved' && 'PO ได้รับการอนุมัติแล้ว'}
                        {quote.status === 'completed' && 'เสร็จสิ้น'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {(quote.status === 'quote_sent' || quote.status === 'po_uploaded') && (
              <div className="flex gap-3 justify-center print:hidden">
                <Button variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลด PDF
                </Button>
                <Button size="lg" onClick={() => setShowPOUpload(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  อัปโหลด PO
                </Button>
                {poFiles.length > 0 && (
                  <Button size="lg" variant="default" onClick={handleSendPO} disabled={confirming}>
                    <Send className="w-4 h-4 mr-2" />
                    {confirming ? 'กำลังส่ง...' : 'ส่ง PO'}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Chat & PO Upload */}
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

            {/* PO Upload Button */}
            {(quote.status === 'quote_sent' || quote.status === 'po_uploaded') && (
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full" size="lg" onClick={() => setShowPOUpload(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    แนบไฟล์ PO
                  </Button>
                  {poFiles.length > 0 && (
                    <Button className="w-full mt-2" size="lg" variant="default" onClick={handleSendPO} disabled={confirming}>
                      <Send className="w-4 h-4 mr-2" />
                      {confirming ? 'กำลังส่ง...' : `ส่ง PO (${poFiles.length} ไฟล์)`}
                    </Button>
                  )}
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
    </div>
  );
}
