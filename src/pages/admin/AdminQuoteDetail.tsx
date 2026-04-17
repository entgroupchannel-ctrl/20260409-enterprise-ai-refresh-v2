// src/pages/admin/AdminQuoteDetail.tsx
import { useEffect, useState, useMemo } from 'react';
import CreateSaleOrderDialog from '@/components/admin/CreateSaleOrderDialog';
import CreateInvoiceFromSODialog from '@/components/admin/CreateInvoiceFromSODialog';
import type { InvoiceSource } from '@/components/admin/CreateInvoiceFromSODialog';
import PrintPreviewDialog from '@/components/admin/PrintPreviewDialog';
import POActionsMenu from '@/components/admin/POActionsMenu';
import POVersionHistory from '@/components/admin/POVersionHistory';
import { QuoteTimeline } from '@/components/QuoteTimeline';
import RevisionTimeline from '@/components/negotiation/RevisionTimeline';
import QuoteTermsEditor from '@/components/admin/QuoteTermsEditor';
import CounterOfferDialog from '@/components/negotiation/CounterOfferDialog';
import EditCustomerInfoDialog from '@/components/admin/EditCustomerInfoDialog';
import PendingApprovalBanner from '@/components/negotiation/PendingApprovalBanner';
import NegotiationRequestsList from '@/components/negotiation/NegotiationRequestsList';
import NegotiationInsightsCard from '@/components/negotiation/NegotiationInsightsCard';
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
import DiscountInput from '@/components/shared/DiscountInput';
import ProductSpecDisplay from '@/components/shared/ProductSpecDisplay';
import { useToast } from '@/hooks/use-toast';
import ProductEditor from '@/components/admin/ProductEditor';
import {
  ArrowLeft,
  CircleCheckBig,
  CircleX,
  SendHorizonal,
  Paperclip,
  Download,
  FileSearch,
  Timer,
  UserRound,
  Landmark,
  MailCheck,
  PhoneCall,
  CalendarClock,
  ShieldAlert,
  ScanEye,
  FileCheck2,
  Printer,
  Receipt,
  User,
  Calendar,
  Briefcase,
  Phone,
  Mail,
  MessageCircle,
  Pencil,
} from 'lucide-react';
import { formatShortDateTime, formatFullDate, formatRelativeTime } from '@/lib/format';

// ============================================
// 🧮 Centralized Quote Calculation
// ============================================
interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  beforeVat: number;
  vatAmount: number;
  grandTotal: number;
}

const calculateQuoteTotals = (
  products: any[],
  discountType: 'percent' | 'baht' = 'percent',
  discountValue: number = 0,
  vatPercent: number = 7
): QuoteTotals => {
  const subtotal = (products || []).reduce((sum: number, p: any) => {
    const qty = Number(p.qty) || 0;
    const unitPrice = Number(p.unit_price) || 0;
    const itemDiscountPct = Number(p.discount_percent) || 0;
    const lineGross = qty * unitPrice;
    const lineDiscount = lineGross * (itemDiscountPct / 100);
    return sum + (lineGross - lineDiscount);
  }, 0);

  const discountAmount = discountType === 'baht'
    ? Math.min(subtotal, discountValue)
    : subtotal * ((Number(discountValue) || 0) / 100);
  const beforeVat = subtotal - discountAmount;
  const vatAmount = beforeVat * ((Number(vatPercent) || 0) / 100);
  const grandTotal = beforeVat + vatAmount;

  return { subtotal, discountAmount, beforeVat, vatAmount, grandTotal };
};

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
  discount_percent: number | null;
  discount_amount: number;
  discount_type: 'percent' | 'baht' | null;
  vat_percent: number | null;
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
  // Negotiation fields
  current_revision_id: string | null;
  current_revision_number: number | null;
  total_revisions: number | null;
  negotiation_count: number | null;
  free_items: any[] | null;
  accepted_at: string | null;
  accepted_by: string | null;
  expired_at: string | null;
  has_sale_order: boolean | null;
  assigned_to: string | null;
  created_by: string | null;
  customer_line: string | null;
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

  // UserRound role
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'sales'>('admin');
  const [userEmail, setUserEmail] = useState('');

  // Dialog states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showCreateSO, setShowCreateSO] = useState(false);
  const [showCounterOffer, setShowCounterOffer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [counterNegotiationId, setCounterNegotiationId] = useState<string | undefined>();
  const [revisionKey, setRevisionKey] = useState(0);
  const [printingRevision, setPrintingRevision] = useState<any>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [linkedInvoice, setLinkedInvoice] = useState<any>(null);
  const totals = useMemo(() => {
    if (!quote) return { subtotal: 0, discountAmount: 0, beforeVat: 0, vatAmount: 0, grandTotal: 0 };
    const dt = (quote.discount_type === 'baht' ? 'baht' : 'percent') as 'percent' | 'baht';
    const dv = dt === 'baht' ? (quote.discount_amount || 0) : (quote.discount_percent || 0);
    return calculateQuoteTotals(
      quote.products || [],
      dt,
      dv,
      quote.vat_percent || 7
    );
  }, [quote?.products, quote?.discount_type, quote?.discount_percent, quote?.discount_amount, quote?.vat_percent]);

  const [assignedSaleUser, setAssignedSaleUser] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [assigningStaff, setAssigningStaff] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuoteDetails();
      loadUserRole();
      loadStaffList();
    }
  }, [id]);

  const loadStaffList = async () => {
    try {
      const { data } = await (supabase as any)
        .from('users')
        .select('id, full_name, email, position, phone')
        .in('role', ['super_admin', 'admin', 'sales'])
        .eq('is_active', true)
        .order('full_name');
      setStaffList(data || []);
    } catch (e) {
      console.warn('Failed to load staff list:', e);
    }
  };

  const handleAssignSale = async (userId: string | null) => {
    if (!quote) return;
    setAssigningStaff(true);
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ assigned_to: userId } as any)
        .eq('id', quote.id);
      if (error) throw error;
      setQuote({ ...quote, assigned_to: userId });
      toast({ title: 'บันทึกแล้ว', description: userId ? 'มอบหมายผู้รับผิดชอบเรียบร้อย' : 'ยกเลิกการมอบหมายแล้ว' });
    } catch (e: any) {
      toast({ title: 'เกิดข้อผิดพลาด', description: e.message, variant: 'destructive' });
    } finally {
      setAssigningStaff(false);
    }
  };

  // Load assigned sale person (admin/sales staff only — never fall back to created_by which is the customer)
  useEffect(() => {
    const loadSalePerson = async () => {
      if (!quote?.assigned_to) {
        setAssignedSaleUser(null);
        return;
      }
      try {
        const { data } = await (supabase as any)
          .from('users')
          .select('id, full_name, email, position, avatar_url, phone')
          .eq('id', quote.assigned_to)
          .maybeSingle();
        setAssignedSaleUser(data);
      } catch (e) {
        console.warn('Failed to load sale person:', e);
      }
    };
    loadSalePerson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote?.assigned_to]);

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
      const quoteObj = { ...quoteData, products: (quoteData.products as any) || [] } as Quote;
      setQuote(quoteObj);

      // Load linked invoice if has_invoice
      if ((quoteData as any).has_invoice) {
        const { data: invData } = await (supabase as any)
          .from('invoices')
          .select('id, invoice_number, status, grand_total')
          .eq('quote_id', quoteData.id)
          .is('deleted_at', null)
          .maybeSingle();
        setLinkedInvoice(invData);
      } else {
        setLinkedInvoice(null);
      }

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
          <FileSearch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">ไม่พบใบเสนอราคา</h2>
          <Button onClick={() => navigate('/admin/quotes')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้ารายการ
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const poFiles = files.filter((f) => f.category === 'po' || f.category === 'customer_po' || f.category === 'po_virtual');
  const quoteFiles = files.filter((f) => f.category === 'quote_pdf');

  const handleSaveAndSendQuote = async () => {
    if (!quote) return;
    setSavingQuote(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data: userData } = await supabase
        .from('users')
        .select('full_name, role')
        .eq('id', authUser.id)
        .single();

      const now = new Date().toISOString();

      const { data: revData, error: revError } = await (supabase.from as any)('quote_revisions')
        .insert({
          quote_id: id,
          revision_number: 1,
          revision_type: 'initial',
          created_by: authUser.id,
          created_by_name: (userData as any)?.full_name || authUser.email || 'Admin',
          created_by_role: (userData as any)?.role || 'admin',
          products: quote.products || [],
          free_items: quote.free_items || [],
          subtotal: totals.subtotal,
          discount_type: quote.discount_type || 'percent',
          discount_percent: quote.discount_percent || 0,
          discount_amount: totals.discountAmount,
          vat_percent: quote.vat_percent || 7,
          vat_amount: totals.vatAmount,
          grand_total: totals.grandTotal,
          change_reason: 'Initial quote',
          requires_approval: false,
          approval_status: 'none',
          status: 'sent',
          sent_at: now,
          valid_until: quote.valid_until || null,
          internal_notes: quote.internal_notes || null,
        })
        .select('id')
        .single();

      if (revError) throw revError;

      const { error: updateError } = await supabase
        .from('quote_requests')
        .update({
          status: 'quote_sent',
          subtotal: totals.subtotal,
          discount_type: quote.discount_type || 'percent',
          discount_amount: totals.discountAmount,
          vat_amount: totals.vatAmount,
          grand_total: totals.grandTotal,
          sent_at: now,
          current_revision_id: revData.id,
          current_revision_number: 1,
          total_revisions: 1,
        } as any)
        .eq('id', id);

      if (updateError) throw updateError;

      if (quote.created_by) {
        import('@/lib/notifications').then(({ createNotification, sendQuoteStatusEmail }) => {
          createNotification({
            userId: quote.created_by!,
            type: 'quote_sent',
            title: 'ใบเสนอราคาพร้อมแล้ว',
            message: `ใบเสนอราคา ${quote.quote_number} ถูกส่งถึงคุณแล้ว กรุณาตรวจสอบ`,
            priority: 'high',
            actionUrl: `/my-account/quotes/${id}`,
            actionLabel: 'ดูใบเสนอราคา',
            linkType: 'quote',
            linkId: id,
          });
          if (quote.customer_email) {
            sendQuoteStatusEmail({
              recipientEmail: quote.customer_email,
              customerName: quote.customer_name,
              quoteNumber: quote.quote_number,
              status: 'sent',
              viewUrl: `https://www.entgroup.co.th/my-account/quotes/${id}`,
            });
          }
        });
      }

      toast({
        title: 'ส่งใบเสนอราคาสำเร็จ',
        description: 'ส่งใบเสนอราคาไปยังลูกค้าแล้ว (Revision #1)',
      });

      await loadQuoteDetails();
      setRevisionKey((k) => k + 1);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSavingQuote(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-content-area space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/quotes')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const { data } = await (supabase as any)
                  .from('quote_revisions')
                  .select('*')
                  .eq('quote_id', id)
                  .eq('revision_number', quote.current_revision_number || 1)
                  .maybeSingle();
                
                if (data) {
                  setPrintingRevision(data);
                } else {
                  toast({ title: 'ไม่พบ revision', variant: 'destructive' });
                }
              }}
            >
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์ / PDF
            </Button>
          </div>
        </div>

        {/* Summary + Timeline — 2 columns to save space */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Summary Card */}
          <Card>
            <CardContent className="pt-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="w-5 h-5 text-primary shrink-0" />
                    <h1 className="text-xl font-bold font-mono truncate">{quote.quote_number}</h1>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={quote.status} />
                    {quote.valid_until && (
                      <Badge variant="outline" className="text-xs">
                        ใช้ได้ถึง: {new Date(quote.valid_until).toLocaleDateString('th-TH', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </Badge>
                    )}
                    {quote.sla_breached && (
                      <Badge variant="destructive" className="gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        SLA เกิน
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground">ยอดรวม</div>
                  <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 2,
                    }).format(quote.grand_total || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Timeline */}
          <Card>
            <CardContent className="pt-6 h-full flex items-center">
              <div className="w-full">
                <QuoteTimeline status={quote.status} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SO Action Banner — compact */}
        {quote.status === 'po_approved' && !quote.has_sale_order && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-center gap-2 min-w-0">
              <CircleCheckBig className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-900 dark:text-green-200 truncate">PO อนุมัติแล้ว — สร้าง SO หรือใบวางบิล</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" onClick={() => setShowCreateSO(true)}>
                <FileSearch className="w-4 h-4 mr-1.5" />
                สร้าง SO
              </Button>
              {linkedInvoice ? (
                <Button size="sm" variant="outline" className="border-blue-400 text-blue-700 hover:bg-blue-50" onClick={() => navigate(`/admin/invoices/${linkedInvoice.id}`)}>
                  <Receipt className="w-4 h-4 mr-1.5" />
                  ดูใบวางบิล {linkedInvoice.invoice_number}
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setShowCreateInvoice(true)}>
                  <Receipt className="w-4 h-4 mr-1.5" />
                  ใบวางบิล
                </Button>
              )}
            </div>
          </div>
        )}

        {quote.has_sale_order && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 min-w-0">
              <CircleCheckBig className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                {linkedInvoice ? 'มี Sale Order + ใบวางบิลแล้ว' : 'มี Sale Order แล้ว — สร้างใบวางบิลเพิ่มได้'}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => navigate('/admin/sale-orders')}>
                <ScanEye className="w-4 h-4 mr-1.5" />
                ดู SO
              </Button>
              {linkedInvoice ? (
                <Button size="sm" variant="outline" className="border-blue-400 text-blue-700 hover:bg-blue-50" onClick={() => navigate(`/admin/invoices/${linkedInvoice.id}`)}>
                  <Receipt className="w-4 h-4 mr-1.5" />
                  ดูใบวางบิล {linkedInvoice.invoice_number}
                </Button>
              ) : (
                <Button size="sm" onClick={() => setShowCreateInvoice(true)}>
                  <Receipt className="w-4 h-4 mr-1.5" />
                  ใบวางบิล
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Two-column Meta Grid — Customer | Dates & Sale Person */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Customer Card */}
           <Card>
             <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                 <CardTitle className="text-sm flex items-center gap-2">
                   <User className="w-4 h-4" />
                   ลูกค้า
                 </CardTitle>
                 <Button
                   size="sm"
                   variant="ghost"
                   onClick={() => setShowEditCustomer(true)}
                   className="h-7 text-xs"
                 >
                   <Pencil className="w-3 h-3 mr-1" />
                   แก้ไข
                 </Button>
               </div>
             </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <div className="font-semibold text-base">{quote.customer_name}</div>
              {quote.customer_company && (
                <div className="text-muted-foreground">{quote.customer_company}</div>
              )}
              {quote.customer_address && (
                <div className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                  {quote.customer_address}
                </div>
              )}
              {quote.customer_tax_id && (
                <div className="text-xs pt-1">
                  <span className="text-muted-foreground">เลขประจำตัวผู้เสียภาษี: </span>
                  <span className="font-mono">{quote.customer_tax_id}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                {quote.customer_phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {quote.customer_phone}</span>
                )}
                {quote.customer_email && (
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {quote.customer_email}</span>
                )}
                {quote.customer_line && (
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {quote.customer_line}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates & Sale Person */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                วันที่ & ผู้รับผิดชอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">วันที่สร้าง:</span>
                <span>{formatShortDateTime(quote.created_at)}</span>
              </div>
              {quote.valid_until && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ใช้ได้ถึง:</span>
                  <span className={
                    new Date(quote.valid_until) < new Date() 
                      ? 'text-destructive font-semibold' 
                      : ''
                  }>
                    {new Date(quote.valid_until).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {quote.payment_terms && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground shrink-0">เงื่อนไขชำระ:</span>
                  <span className="text-right text-xs">{quote.payment_terms}</span>
                </div>
              )}
              
              {/* Sale Admin Assignment */}
              <div className="pt-3 mt-2 border-t">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-semibold">ผู้รับผิดชอบ</span>
                  </div>
                  <Pencil className="w-3 h-3 text-muted-foreground cursor-pointer" />
                </div>
                <select
                  className="w-full text-xs border rounded px-2 py-1.5 bg-background text-foreground mb-2"
                  value={quote.assigned_to || ''}
                  disabled={assigningStaff}
                  onChange={(e) => handleAssignSale(e.target.value || null)}
                >
                  <option value="">— ยังไม่มอบหมาย —</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name || s.email} {s.position ? `(${s.position})` : ''}
                    </option>
                  ))}
                </select>
                {assignedSaleUser && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {assignedSaleUser.avatar_url ? (
                        <img 
                          src={assignedSaleUser.avatar_url} 
                          alt={assignedSaleUser.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {assignedSaleUser.full_name || assignedSaleUser.email}
                        </div>
                        {assignedSaleUser.position && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {assignedSaleUser.position}
                          </div>
                        )}
                      </div>
                    </div>
                    {assignedSaleUser.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{assignedSaleUser.phone}</span>
                      </div>
                    )}
                    {assignedSaleUser.email && (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{assignedSaleUser.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PO Action Banner (review needed) */}
        {(quote.status === 'po_uploaded' || quote.status === 'po_confirmed') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">
                      {quote.status === 'po_confirmed' ? 'ลูกค้ายืนยัน PO แล้ว' : 'มี PO รอตรวจสอบ'}
                    </h3>
                    <p className="text-sm text-orange-700">กรุณาตรวจสอบและอนุมัติ PO</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                    <CircleX className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                  <Button onClick={() => setShowApproveDialog(true)}>
                    <CircleCheckBig className="w-4 h-4 mr-2" />
                    อนุมัติ PO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Pending Approval Banner */}
        {quote.current_revision_id && (
          <PendingApprovalBanner
            revisionId={quote.current_revision_id}
            isSuperAdmin={false}
            onRefresh={loadQuoteDetails}
          />
        )}

        {/* Expired Quote Banner */}
        {quote.status === 'expired' && (
          <Card className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 text-gray-500" />
                <div>
                  <h3 className="font-semibold">ใบเสนอราคาหมดอายุ</h3>
                  <p className="text-sm text-muted-foreground">
                    หมดอายุเมื่อ: {quote.expired_at ? formatShortDateTime(quote.expired_at) : '-'}
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowCounterOffer(true)}>
                🔄 สร้างใบเสนอราคาใหม่ (Renew)
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products & Terms */}
          <div className="lg:col-span-2 space-y-6">

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
                      const dt = (quote.discount_type === 'baht' ? 'baht' : 'percent') as 'percent' | 'baht';
                      const dv = dt === 'baht' ? (quote.discount_amount || 0) : (quote.discount_percent || 0);
                      const recalc = calculateQuoteTotals(
                        updatedProducts,
                        dt,
                        dv,
                        quote.vat_percent || 7
                      );
                      const { error } = await supabase
                        .from('quote_requests')
                        .update({
                          products: updatedProducts as any,
                          subtotal: recalc.subtotal,
                          discount_amount: recalc.discountAmount,
                          vat_amount: recalc.vatAmount,
                          grand_total: recalc.grandTotal,
                        })
                        .eq('id', id);
                      
                      if (!error) {
                        setQuote({
                          ...quote,
                          products: updatedProducts,
                          subtotal: recalc.subtotal,
                          discount_amount: recalc.discountAmount,
                          vat_amount: recalc.vatAmount,
                          grand_total: recalc.grandTotal,
                        });
                        toast({ title: 'บันทึกสินค้าแล้ว' });
                      } else {
                        toast({ title: 'บันทึกไม่สำเร็จ', description: error.message, variant: 'destructive' });
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
                              {product.description && (
                                <div className="mt-1">
                                  <ProductSpecDisplay description={product.description} variant="ui" />
                                </div>
                              )}
                              {product.notes && (
                                <p className="text-sm text-primary mt-2 whitespace-pre-line">หมายเหตุ: {product.notes}</p>
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

                {/* Terms & Notes Editor — replaced broken internal notes textarea */}

                <Separator className="my-4" />

                {/* ✅ Overall Discount Input - แสดงเฉพาะตอน editable */}
                {quote.status === 'pending' && (
                  <DiscountInput
                    subtotal={totals.subtotal}
                    discountType={(quote.discount_type === 'baht' ? 'baht' : 'percent') as 'percent' | 'baht'}
                    discountValue={
                      quote.discount_type === 'baht' 
                        ? (quote.discount_amount || 0)
                        : (quote.discount_percent || 0)
                    }
                    onChange={(newType, newValue) => {
                      setQuote({ 
                        ...quote, 
                        discount_type: newType,
                        discount_percent: newType === 'percent' ? newValue : 0,
                        discount_amount: newType === 'baht' ? newValue : 0,
                      });
                    }}
                    onBlur={async () => {
                      const dt = (quote.discount_type === 'baht' ? 'baht' : 'percent') as 'percent' | 'baht';
                      const dv = dt === 'baht' ? (quote.discount_amount || 0) : (quote.discount_percent || 0);
                      const recalc = calculateQuoteTotals(
                        quote.products || [],
                        dt,
                        dv,
                        quote.vat_percent || 7
                      );
                      const { error } = await supabase
                        .from('quote_requests')
                        .update({
                          discount_type: dt,
                          discount_percent: dt === 'percent' ? dv : 0,
                          discount_amount: recalc.discountAmount,
                          subtotal: recalc.subtotal,
                          vat_amount: recalc.vatAmount,
                          grand_total: recalc.grandTotal,
                        } as any)
                        .eq('id', id);
                      if (!error) {
                        toast({ title: 'บันทึกส่วนลดแล้ว' });
                      }
                    }}
                  />
                )}

                <Separator className="my-4" />

                {/* Summary - ใช้ totals real-time */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">รวมเป็นเงิน</span>
                    <span className="text-foreground">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>
                        ส่วนลด {quote.discount_type === 'baht' 
                          ? `(฿${formatCurrency(quote.discount_amount || 0)})`
                          : `(${quote.discount_percent || 0}%)`}
                      </span>
                      <span>-{formatCurrency(totals.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ราคาหลังหักส่วนลด</span>
                    <span className="text-foreground">{formatCurrency(totals.beforeVat)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม {quote.vat_percent || 7}%</span>
                    <span className="text-foreground">{formatCurrency(totals.vatAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">จำนวนเงินรวมทั้งสิ้น</span>
                    <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                </div>

                {/* SendHorizonal Quote Button - Only show when pending */}
                {quote.status === 'pending' && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={async () => {
                        try {
                          // Get current user
                          const { data: { user: authUser } } = await supabase.auth.getUser();
                          if (!authUser) throw new Error('Not authenticated');
                          
                          const { data: userData } = await supabase
                            .from('users')
                            .select('full_name, role')
                            .eq('id', authUser.id)
                            .single();
                          
                          const now = new Date().toISOString();
                          
                          // Step 1: Create revision #1 (initial)
                          const { data: revData, error: revError } = await (supabase.from as any)('quote_revisions')
                            .insert({
                              quote_id: id,
                              revision_number: 1,
                              revision_type: 'initial',
                              created_by: authUser.id,
                              created_by_name: (userData as any)?.full_name || authUser.email || 'Admin',
                              created_by_role: (userData as any)?.role || 'admin',
                              products: quote.products || [],
                              free_items: quote.free_items || [],
                              subtotal: totals.subtotal,
                              discount_type: quote.discount_type || 'percent',
                              discount_percent: quote.discount_percent || 0,
                              discount_amount: totals.discountAmount,
                              vat_percent: quote.vat_percent || 7,
                              vat_amount: totals.vatAmount,
                              grand_total: totals.grandTotal,
                              change_reason: 'Initial quote',
                              requires_approval: false,
                              approval_status: 'none',
                              status: 'sent',
                              sent_at: now,
                              valid_until: quote.valid_until || null,
                              internal_notes: quote.internal_notes || null,
                            })
                            .select('id')
                            .single();
                          
                          if (revError) throw revError;
                          
                          // Step 2: Update quote_requests with revision info
                          const { error: updateError } = await supabase
                            .from('quote_requests')
                            .update({
                              status: 'quote_sent',
                              subtotal: totals.subtotal,
                              discount_type: quote.discount_type || 'percent',
                              discount_amount: totals.discountAmount,
                              vat_amount: totals.vatAmount,
                              grand_total: totals.grandTotal,
                              sent_at: now,
                              current_revision_id: revData.id,
                              current_revision_number: 1,
                              total_revisions: 1,
                            } as any)
                            .eq('id', id);

                          if (updateError) throw updateError;

                          // Notify customer (in-app)
                          if (quote.created_by) {
                            import('@/lib/notifications').then(({ createNotification, sendQuoteStatusEmail }) => {
                              createNotification({
                                userId: quote.created_by!,
                                type: 'quote_sent',
                                title: 'ใบเสนอราคาพร้อมแล้ว',
                                message: `ใบเสนอราคา ${quote.quote_number} ถูกส่งถึงคุณแล้ว กรุณาตรวจสอบ`,
                                priority: 'high',
                                actionUrl: `/my-account/quotes/${id}`,
                                actionLabel: 'ดูใบเสนอราคา',
                                linkType: 'quote',
                                linkId: id,
                              });
                              // Send email via Resend
                              if (quote.customer_email) {
                                sendQuoteStatusEmail({
                                  recipientEmail: quote.customer_email,
                                  customerName: quote.customer_name,
                                  quoteNumber: quote.quote_number,
                                  status: 'sent',
                                  viewUrl: `https://www.entgroup.co.th/my-account/quotes/${id}`,
                                });
                              }
                            });
                          }

                          toast({
                            title: 'ส่งใบเสนอราคาสำเร็จ',
                            description: 'ส่งใบเสนอราคาไปยังลูกค้าแล้ว (Revision #1)',
                          });

                          await loadQuoteDetails();
                          setRevisionKey((k) => k + 1);
                        } catch (error: any) {
                          toast({
                            title: 'เกิดข้อผิดพลาด',
                            description: error.message,
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <SendHorizonal className="w-5 h-5 mr-2" />
                      บันทึกและส่งใบเสนอราคา
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms & Notes Editor */}
            <QuoteTermsEditor
              quoteId={quote.id}
              initialValues={{
                payment_terms: quote.payment_terms,
                delivery_terms: quote.delivery_terms,
                warranty_terms: quote.warranty_terms,
                notes: quote.notes,
                internal_notes: quote.internal_notes,
                valid_until: quote.valid_until,
              }}
              disabled={quote.status !== 'pending' && quote.status !== 'quote_sent' && quote.status !== 'negotiating'}
              onSaved={loadQuoteDetails}
            />

            {/* Negotiation: Revision Timeline */}
            <RevisionTimeline
              key={revisionKey}
              quoteId={quote.id}
              currentRevisionId={quote.current_revision_id}
              viewerRole="admin"
              onCreateCounter={() => {
                setCounterNegotiationId(undefined);
                setShowCounterOffer(true);
              }}
              onRefresh={loadQuoteDetails}
              onPrintRevision={(rev) => setPrintingRevision(rev)}
            />

            {/* Negotiation Requests from Customer */}
            <NegotiationRequestsList
              quoteId={quote.id}
              onCreateCounter={(reqId) => {
                setCounterNegotiationId(reqId);
                setShowCounterOffer(true);
              }}
            />

          </div>

          {/* Right Column - Chat & Timeline */}
          <div className="space-y-6">
            {/* Phase 5: Negotiation Insights */}
            <NegotiationInsightsCard quoteId={quote.id} />

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
                    <SendHorizonal className="w-4 h-4 mr-2" />
                    {sendingMessage ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PO Files — compact below chat */}
            {poFiles.length > 0 && (
              <Card>
                <CardContent className="pt-4 pb-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Paperclip className="w-3 h-3" /> PO จากลูกค้า ({poFiles.length})</p>
                  <div className="space-y-1">
                    {poFiles.map((file) => (
                      file.category === 'po_virtual' ? (
                        <div key={file.id} className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileCheck2 className="w-4 h-4 text-amber-600 shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-medium">ลูกค้าใช้ใบเสนอราคาเป็น PO</p>
                              <p className="text-[10px] text-muted-foreground">ไม่มีระบบ PO formal — ใช้ใบเสนอราคา {quote.quote_number} เป็นเอกสาร PO</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
                        >
                          <FileSearch className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-xs font-medium text-foreground truncate flex-1">{file.file_name}</span>
                          <Download className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                        </a>
                      )
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
              <strong>ยอดรวม: {formatCurrency(totals.grandTotal)}</strong>
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

      {/* Create Invoice from Quote Dialog */}
      <CreateInvoiceFromSODialog
        open={showCreateInvoice}
        onOpenChange={setShowCreateInvoice}
        source={quote ? {
          type: 'quote',
          quote: {
            id: quote.id,
            quote_number: quote.quote_number || '',
            customer_name: quote.customer_name,
            customer_company: quote.customer_company,
            customer_address: quote.customer_address,
            customer_email: quote.customer_email,
            customer_phone: quote.customer_phone,
            customer_tax_id: quote.customer_tax_id,
            customer_branch_type: null,
            customer_branch_code: null,
            customer_branch_name: null,
            payment_terms: quote.payment_terms,
            notes: quote.notes,
            subtotal: totals.beforeVat,
            vat_amount: totals.vatAmount,
            grand_total: totals.grandTotal,
            products: quote.products || [],
          },
        } : null}
      />


      <CounterOfferDialog
        quoteId={quote.id}
        currentRevisionId={quote.current_revision_id}
        negotiationRequestId={counterNegotiationId}
        open={showCounterOffer}
        onClose={() => setShowCounterOffer(false)}
        onSuccess={() => {
          loadQuoteDetails();
          setRevisionKey((k) => k + 1);
        }}
      />

      {/* Edit Customer Info Dialog */}
      {quote && (
        <EditCustomerInfoDialog
          open={showEditCustomer}
          onClose={() => setShowEditCustomer(false)}
          quoteId={quote.id}
          initialValues={{
            customer_name: quote.customer_name,
            customer_email: quote.customer_email,
            customer_phone: quote.customer_phone,
            customer_company: quote.customer_company,
            customer_address: quote.customer_address,
            customer_tax_id: quote.customer_tax_id,
            customer_line: quote.customer_line,
          }}
          onSaved={loadQuoteDetails}
        />
      )}

      {/* Print Preview Dialog */}
      {quote && printingRevision && (
        <PrintPreviewDialog
          open={!!printingRevision}
          onOpenChange={(v) => !v && setPrintingRevision(null)}
          quote={quote}
          revision={printingRevision}
        />
      )}
    </AdminLayout>
  );
}
