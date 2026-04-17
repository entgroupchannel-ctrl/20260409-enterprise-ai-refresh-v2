import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Send, Paperclip, MessageCircle, ChevronDown,
  X, User, Shield, CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  quote_id: string;
  sender_id: string | null;
  sender_name: string;
  sender_role: string;
  content: string;
  message_type: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  created_at: string;
  read_by: any;
}

interface QuoteOption {
  id: string;
  quote_number: string;
  status: string;
  created_at: string;
}

interface Props {
  quoteId?: string;
  mode?: 'widget' | 'inline';
}

const roleBubbleCls = (role: string, isMe: boolean) => {
  if (isMe) return 'bg-blue-600 text-white rounded-tr-sm';
  return 'bg-card border rounded-tl-sm';
};

const RoleAvatar = ({ role }: { role: string }) => {
  if (role === 'admin' || role === 'sales') {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
        <Shield className="w-3.5 h-3.5 text-emerald-600" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
      <User className="w-3.5 h-3.5 text-blue-600" />
    </div>
  );
};

export default function CustomerChat({ quoteId: propQuoteId, mode = 'widget' }: Props) {
  const { user, profile } = useAuth();

  const [open,         setOpen]         = useState(mode === 'inline');
  const [quotes,       setQuotes]       = useState<QuoteOption[]>([]);
  const [activeQuoteId,setActiveQuoteId]= useState<string | null>(propQuoteId ?? null);
  const [messages,     setMessages]     = useState<Message[]>([]);
  const [text,         setText]         = useState('');
  const [sending,      setSending]      = useState(false);
  const [uploadingFile,setUploadingFile]= useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const channelRef= useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('quote_requests')
      .select('id, quote_number, status, created_at')
      .eq('created_by', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as unknown as QuoteOption[];
        setQuotes(list);
        if (!activeQuoteId && list.length > 0) setActiveQuoteId(list[0].id);
      });
  }, [user?.id]);

  const loadMessages = useCallback(async (qId: string) => {
    const { data } = await supabase
      .from('quote_messages')
      .select('*')
      .eq('quote_id', qId)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) ?? []);

    const unread = ((data as Message[]) ?? []).filter(m => {
      const readBy: string[] = Array.isArray(m.read_by) ? (m.read_by as string[]) : [];
      return m.sender_role !== 'customer' && !readBy.includes(user?.id ?? '');
    }).length;
    setUnreadCount(unread);

    if (user?.id && data) {
      for (const m of data as Message[]) {
        const readBy: string[] = Array.isArray(m.read_by) ? (m.read_by as string[]) : [];
        if (m.sender_role !== 'customer' && !readBy.includes(user.id)) {
          await supabase.from('quote_messages')
            .update({ read_by: [...readBy, user.id] } as any)
            .eq('id', m.id);
        }
      }
      setUnreadCount(0);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!activeQuoteId) return;
    loadMessages(activeQuoteId);

    channelRef.current?.unsubscribe();
    channelRef.current = supabase
      .channel(`customer-chat-${activeQuoteId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'quote_messages',
        filter: `quote_id=eq.${activeQuoteId}`,
      }, payload => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
        const newMsg = payload.new as Message;
        if (newMsg.sender_role !== 'customer' && !open) {
          setUnreadCount(c => c + 1);
        }
      })
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [activeQuoteId, loadMessages]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open && activeQuoteId) {
      setUnreadCount(0);
      loadMessages(activeQuoteId);
    }
  }, [open, activeQuoteId, loadMessages]);

  const sendMessage = async (content: string, attachmentUrl?: string, attachmentName?: string) => {
    if (!activeQuoteId || !user) return;
    setSending(true);
    try {
      await supabase.from('quote_messages').insert({
        quote_id:        activeQuoteId,
        sender_id:       user.id,
        sender_name:     profile?.full_name ?? profile?.email ?? 'ลูกค้า',
        sender_role:     'customer',
        content,
        message_type:    attachmentUrl ? 'file' : 'text',
        attachment_url:  attachmentUrl ?? null,
        attachment_name: attachmentName ?? null,
      });
      setText('');
    } catch (e: any) { toast.error(e.message); }
    finally { setSending(false); }
  };

  const handleSend = () => {
    if (!text.trim() || sending) return;
    sendMessage(text.trim());
  };

  const handleFileUpload = async (file: File) => {
    if (!activeQuoteId || !user) return;
    setUploadingFile(true);
    try {
      const path = `chat-customer/${activeQuoteId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('supplier-documents').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
      await sendMessage(`📎 ${file.name}`, urlData.publicUrl, file.name);
    } catch (e: any) { toast.error('อัปโหลดล้มเหลว: ' + e.message); }
    finally { setUploadingFile(false); }
  };

  if (!user) return null;

  // INLINE mode
  if (mode === 'inline') {
    return (
      <ChatInner
        quotes={quotes}
        activeQuoteId={activeQuoteId}
        setActiveQuoteId={setActiveQuoteId}
        messages={messages}
        text={text}
        setText={setText}
        handleSend={handleSend}
        handleFileUpload={handleFileUpload}
        fileRef={fileRef}
        sending={sending}
        uploadingFile={uploadingFile}
        bottomRef={bottomRef}
        currentUserId={user.id}
      />
    );
  }

  // WIDGET mode
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2 md:bottom-6 md:left-6">
      {open && (
        <div className="w-[360px] max-h-[520px] rounded-2xl shadow-2xl border bg-background flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">ENT Group Support</p>
                <p className="text-[11px] text-blue-100">ทีมงานพร้อมช่วยเหลือคุณ</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="w-7 h-7 text-white hover:bg-white/20"
              onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ChatInner
            quotes={quotes}
            activeQuoteId={activeQuoteId}
            setActiveQuoteId={setActiveQuoteId}
            messages={messages}
            text={text}
            setText={setText}
            handleSend={handleSend}
            handleFileUpload={handleFileUpload}
            fileRef={fileRef}
            sending={sending}
            uploadingFile={uploadingFile}
            bottomRef={bottomRef}
            currentUserId={user.id}
            compact
          />
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all active:scale-95"
      >
        {open
          ? <ChevronDown className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

// Inner chat panel
interface InnerProps {
  quotes: QuoteOption[];
  activeQuoteId: string | null;
  setActiveQuoteId: (id: string) => void;
  messages: Message[];
  text: string;
  setText: (v: string) => void;
  handleSend: () => void;
  handleFileUpload: (f: File) => void;
  fileRef: React.RefObject<HTMLInputElement>;
  sending: boolean;
  uploadingFile: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  currentUserId: string;
  compact?: boolean;
}

function ChatInner({
  quotes, activeQuoteId, setActiveQuoteId,
  messages, text, setText, handleSend, handleFileUpload,
  fileRef, sending, uploadingFile, bottomRef, currentUserId, compact,
}: InnerProps) {
  const statusLabel: Record<string, { label: string; cls: string }> = {
    pending:     { label: 'รอดำเนินการ', cls: 'bg-yellow-100 text-yellow-800' },
    draft:       { label: 'ร่าง',        cls: 'bg-muted text-muted-foreground' },
    quote_sent:  { label: 'ส่งราคาแล้ว', cls: 'bg-blue-100 text-blue-800' },
    completed:   { label: 'เสร็จสิ้น',   cls: 'bg-green-100 text-green-800' },
    cancelled:   { label: 'ยกเลิก',     cls: 'bg-red-100 text-red-800' },
  };

  return (
    <div className={cn('flex flex-col flex-1', compact ? 'max-h-[430px]' : 'h-full')}>
      {quotes.length > 1 && (
        <div className="px-3 py-2 border-b bg-muted/30 flex gap-2 overflow-x-auto scrollbar-hide">
          {quotes.map(q => {
            const st = statusLabel[q.status] ?? { label: q.status, cls: 'bg-muted text-muted-foreground' };
            return (
              <button
                key={q.id}
                onClick={() => setActiveQuoteId(q.id)}
                className={cn(
                  'shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all',
                  activeQuoteId === q.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-card border-border hover:border-blue-300'
                )}
              >
                <span className="font-mono">#{q.quote_number}</span>
                <Badge className={cn('text-[9px] h-4 px-1', st.cls)}>{st.label}</Badge>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/10">
        {quotes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs px-4">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p>คุณยังไม่มีใบเสนอราคา</p>
            <p className="mt-1">
              <a href="/request-quote" className="text-blue-600 underline">ขอใบเสนอราคา</a>
              {' '}เพื่อเริ่มต้นการสนทนา
            </p>
          </div>
        )}

        {quotes.length > 0 && messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs">
            ยังไม่มีข้อความ — เริ่มส่งข้อความหาทีมงานได้เลย
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUserId || msg.sender_role === 'customer';
          const isSystem = msg.sender_role === 'system';
          const showSender = idx === 0 || messages[idx - 1].sender_role !== msg.sender_role;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[10px] text-muted-foreground bg-muted px-3 py-0.5 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={cn('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
              {!isMe && <RoleAvatar role={msg.sender_role} />}
              <div className={cn('max-w-[75%] space-y-0.5 flex flex-col', isMe ? 'items-end' : 'items-start')}>
                {showSender && !isMe && (
                  <span className="text-[10px] text-muted-foreground px-1">
                    {msg.sender_role === 'admin' || msg.sender_role === 'sales'
                      ? `${msg.sender_name} (ทีมงาน)`
                      : msg.sender_name}
                  </span>
                )}
                <div className={cn(
                  'rounded-2xl px-3 py-2 text-sm break-words',
                  roleBubbleCls(msg.sender_role, isMe)
                )}>
                  {msg.attachment_url ? (
                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 underline text-xs">
                      <Paperclip className="w-3.5 h-3.5 shrink-0" />
                      {msg.attachment_name || 'ไฟล์แนบ'}
                    </a>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>
                <div className={cn('flex items-center gap-1 px-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(msg.created_at), 'HH:mm', { locale: th })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-card p-2.5">
        {!activeQuoteId ? (
          <p className="text-center text-xs text-muted-foreground py-1">
            เลือก Quote เพื่อเริ่มส่งข้อความ
          </p>
        ) : (
          <div className="flex gap-1.5 items-center">
            <input ref={fileRef} type="file" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }} />
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0"
              onClick={() => fileRef.current?.click()} disabled={uploadingFile || sending}>
              <Paperclip className={cn('w-4 h-4', uploadingFile && 'animate-pulse')} />
            </Button>
            <input
              className="flex-1 px-3 py-1.5 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="พิมพ์ข้อความ..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              disabled={sending}
            />
            <Button size="icon" className="h-8 w-8 shrink-0 rounded-xl"
              onClick={handleSend} disabled={!text.trim() || sending}>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
