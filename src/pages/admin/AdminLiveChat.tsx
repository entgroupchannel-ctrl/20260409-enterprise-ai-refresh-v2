import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Send, Paperclip, Search, RefreshCw, MessageCircle,
  User, Clock, CheckCheck, Circle, X, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Types ─────────────────────────────────────────────────────────────────

interface ChatSession {
  quote_id: string;
  quote_number: string;
  customer_name: string;
  customer_company: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  status: string;
}

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const relativeTime = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true, locale: th });

const roleLabel: Record<string, string> = {
  customer: 'ลูกค้า', sales: 'เซลส์', admin: 'แอดมิน', system: 'ระบบ',
};
const roleBubbleCls: Record<string, string> = {
  customer: 'bg-blue-600 text-white',
  sales:    'bg-emerald-600 text-white',
  admin:    'bg-violet-600 text-white',
  system:   'bg-muted text-muted-foreground text-xs italic',
};
const roleTagCls: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  sales:    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  admin:    'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  system:   'bg-muted text-muted-foreground',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminLiveChat() {
  const { profile } = useAuth();

  const [sessions,        setSessions]        = useState<ChatSession[]>([]);
  const [filteredSessions,setFilteredSessions]= useState<ChatSession[]>([]);
  const [activeQuoteId,   setActiveQuoteId]   = useState<string | null>(null);
  const [messages,        setMessages]        = useState<Message[]>([]);
  const [text,            setText]            = useState('');
  const [sending,         setSending]         = useState(false);
  const [search,          setSearch]          = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [uploadingFile,   setUploadingFile]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const activeSession = sessions.find(s => s.quote_id === activeQuoteId);

  // ── Load all quote sessions that have messages ──
  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    // Get quotes that have at least one message
    const { data: msgs } = await supabase
      .from('quote_messages')
      .select('quote_id, sender_name, sender_role, content, created_at, read_by')
      .order('created_at', { ascending: false });

    if (!msgs) { setLoadingSessions(false); return; }

    // Group by quote_id — latest message per quote
    const quoteMap = new Map<string, typeof msgs[0]>();
    for (const m of msgs) {
      if (!quoteMap.has(m.quote_id)) quoteMap.set(m.quote_id, m);
    }

    const quoteIds = [...quoteMap.keys()];
    if (quoteIds.length === 0) { setSessions([]); setLoadingSessions(false); return; }

    // Get quote info
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id, quote_number, status, customer_name, company_name')
      .in('id', quoteIds);

    // Count unread (messages not in read_by array for current admin)
    const unreadMap = new Map<string, number>();
    for (const m of msgs) {
      const readBy: string[] = Array.isArray(m.read_by) ? m.read_by : [];
      const isAdminSelf = m.sender_role !== 'customer';
      if (!isAdminSelf && !readBy.includes(profile?.id ?? '')) {
        unreadMap.set(m.quote_id, (unreadMap.get(m.quote_id) ?? 0) + 1);
      }
    }

    const sessions: ChatSession[] = (quotes ?? []).map(q => {
      const last = quoteMap.get(q.id);
      return {
        quote_id:         q.id,
        quote_number:     q.quote_number ?? q.id.slice(0, 8),
        customer_name:    q.customer_name ?? 'ไม่ระบุ',
        customer_company: q.company_name ?? null,
        last_message:     last?.content ?? '',
        last_message_at:  last?.created_at ?? '',
        unread_count:     unreadMap.get(q.id) ?? 0,
        status:           q.status ?? 'unknown',
      };
    }).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());

    setSessions(sessions);
    setLoadingSessions(false);
  }, [profile?.id]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  // ── Filter sessions ──
  useEffect(() => {
    if (!search.trim()) { setFilteredSessions(sessions); return; }
    const q = search.toLowerCase();
    setFilteredSessions(sessions.filter(s =>
      s.customer_name.toLowerCase().includes(q) ||
      (s.customer_company ?? '').toLowerCase().includes(q) ||
      s.quote_number.toLowerCase().includes(q)
    ));
  }, [search, sessions]);

  // ── Load messages for active quote ──
  const loadMessages = useCallback(async (quoteId: string) => {
    const { data } = await supabase
      .from('quote_messages')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) ?? []);

    // Mark as read
    if (profile?.id && data) {
      for (const m of data as Message[]) {
        const readBy: string[] = Array.isArray(m.read_by) ? m.read_by : [];
        if (m.sender_role === 'customer' && !readBy.includes(profile.id)) {
          await supabase.from('quote_messages')
            .update({ read_by: [...readBy, profile.id] } as any)
            .eq('id', m.id);
        }
      }
      // Refresh unread counts
      setSessions(prev => prev.map(s =>
        s.quote_id === quoteId ? { ...s, unread_count: 0 } : s
      ));
    }
  }, [profile?.id]);

  // ── Realtime subscription for active quote ──
  useEffect(() => {
    if (!activeQuoteId) return;
    loadMessages(activeQuoteId);

    // Unsubscribe previous
    channelRef.current?.unsubscribe();
    channelRef.current = supabase
      .channel(`admin-chat-${activeQuoteId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'quote_messages',
        filter: `quote_id=eq.${activeQuoteId}`,
      }, payload => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new as Message];
        });
        // Update session last message
        setSessions(prev => prev.map(s =>
          s.quote_id === activeQuoteId
            ? { ...s, last_message: (payload.new as Message).content, last_message_at: (payload.new as Message).created_at }
            : s
        ).sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()));
      })
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [activeQuoteId, loadMessages]);

  // ── Auto-scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ──
  const sendMessage = async (content: string, attachmentUrl?: string, attachmentName?: string) => {
    if (!activeQuoteId || !profile) return;
    setSending(true);
    try {
      await supabase.from('quote_messages').insert({
        quote_id:        activeQuoteId,
        sender_id:       profile.id,
        sender_name:     profile.full_name ?? profile.email ?? 'Admin',
        sender_role:     profile.role === 'super_admin' ? 'admin' : (profile.role ?? 'admin'),
        content,
        message_type:    attachmentUrl ? 'file' : 'text',
        attachment_url:  attachmentUrl ?? null,
        attachment_name: attachmentName ?? null,
      } as any);
      setText('');
    } catch (e: any) { toast.error(e.message); }
    finally { setSending(false); }
  };

  const handleSend = () => {
    if (!text.trim() || sending) return;
    sendMessage(text.trim());
  };

  // ── File upload ──
  const handleFileUpload = async (file: File) => {
    if (!activeQuoteId) return;
    setUploadingFile(true);
    try {
      const path = `chat/${activeQuoteId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('supplier-documents').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('supplier-documents').getPublicUrl(path);
      await sendMessage(`📎 ${file.name}`, urlData.publicUrl, file.name);
    } catch (e: any) { toast.error('อัปโหลดล้มเหลว: ' + e.message); }
    finally { setUploadingFile(false); }
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">

        {/* ══ LEFT: Session list ══ */}
        <div className="w-72 shrink-0 flex flex-col border-r bg-card">
          {/* Header */}
          <div className="p-3 border-b space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" /> Live Chat
              </h2>
              <Button size="icon" variant="ghost" className="w-7 h-7" onClick={loadSessions}>
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหาลูกค้า, เลข Quote..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Session list */}
          <div className="flex-1 overflow-y-auto">
            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-xs px-4">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                {search ? 'ไม่พบผลลัพธ์' : 'ยังไม่มีการสนทนา'}
              </div>
            ) : filteredSessions.map(session => (
              <button
                key={session.quote_id}
                onClick={() => setActiveQuoteId(session.quote_id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 border-b hover:bg-muted/50 transition-colors',
                  activeQuoteId === session.quote_id && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <div className="flex items-start justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{session.customer_name}</p>
                      {session.customer_company && (
                        <p className="text-[10px] text-muted-foreground truncate">{session.customer_company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {session.unread_count > 0 && (
                      <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center">
                        {session.unread_count}
                      </Badge>
                    )}
                    <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                      {session.last_message_at ? relativeTime(session.last_message_at) : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-muted-foreground truncate flex-1">
                    {session.last_message || 'ยังไม่มีข้อความ'}
                  </p>
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                    #{session.quote_number}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ══ RIGHT: Chat window ══ */}
        {activeQuoteId && activeSession ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-4 py-3 border-b bg-card flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{activeSession.customer_name}</p>
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeSession.customer_company && `${activeSession.customer_company} · `}
                    Quote #{activeSession.quote_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => window.open(`/admin/quotes/${activeQuoteId}`, '_blank')}
                >
                  ดู Quote <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
                <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => setActiveQuoteId(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  ยังไม่มีข้อความในการสนทนานี้
                </div>
              )}
              {messages.map((msg, idx) => {
                const isMe = msg.sender_role !== 'customer';
                const isSystem = msg.sender_role === 'system';
                const showSender = idx === 0 || messages[idx - 1].sender_role !== msg.sender_role;

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={cn('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-auto mb-1">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    )}
                    <div className={cn('max-w-[65%] space-y-0.5', isMe ? 'items-end' : 'items-start', 'flex flex-col')}>
                      {showSender && (
                        <div className={cn('flex items-center gap-1.5 px-0.5', isMe ? 'flex-row-reverse' : 'flex-row')}>
                          <Badge className={cn('text-[10px] px-1.5 py-0', roleTagCls[msg.sender_role] ?? 'bg-muted')}>
                            {roleLabel[msg.sender_role] ?? msg.sender_role}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{msg.sender_name}</span>
                        </div>
                      )}
                      <div className={cn(
                        'rounded-2xl px-3 py-2 text-sm break-words',
                        isMe
                          ? `${roleBubbleCls[msg.sender_role] ?? 'bg-primary text-primary-foreground'} rounded-tr-sm`
                          : 'bg-card border rounded-tl-sm'
                      )}>
                        {msg.attachment_url ? (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 underline text-xs">
                            <Paperclip className="w-3.5 h-3.5 shrink-0" />
                            {msg.attachment_name || 'ไฟล์แนบ'}
                          </a>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                      <div className={cn('flex items-center gap-1 px-0.5', isMe ? 'flex-row-reverse' : 'flex-row')}>
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

            {/* Input */}
            <div className="border-t bg-card p-3">
              <div className="flex gap-2">
                <input ref={fileRef} type="file" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ''; }} />
                <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0"
                  onClick={() => fileRef.current?.click()} disabled={uploadingFile || sending}>
                  <Paperclip className={cn('w-4 h-4', uploadingFile && 'animate-pulse')} />
                </Button>
                <input
                  className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="พิมพ์ข้อความ... (Enter ส่ง)"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={sending}
                />
                <Button className="h-9 px-3 shrink-0" onClick={handleSend}
                  disabled={!text.trim() || sending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
            <MessageCircle className="w-16 h-16 opacity-10" />
            <div>
              <p className="font-medium">เลือกการสนทนาเพื่อเริ่มต้น</p>
              <p className="text-sm mt-1">ข้อความจากลูกค้าจะปรากฏในรายการทางซ้าย</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
