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
  Send, Search, RefreshCw, MessageCircle,
  User, Clock, Circle, X, ChevronRight, Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatSession {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  source: string;
  status: string;
  assigned_to: string | null;
  last_message_at: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: string;
  sender_id: string | null;
  sender_name: string;
  content: string;
  message_type: string;
  attachment_url: string | null;
  attachment_name: string | null;
  read_at: string | null;
  created_at: string;
}

const relativeTime = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true, locale: th });

const senderLabel: Record<string, string> = {
  guest: 'ผู้เยี่ยมชม', customer: 'สมาชิก', staff: 'ทีมงาน', system: 'ระบบ',
};
const senderBubbleCls: Record<string, string> = {
  guest: 'bg-blue-600 text-white',
  customer: 'bg-blue-600 text-white',
  staff: 'bg-emerald-600 text-white',
  system: 'bg-muted text-muted-foreground text-xs italic',
};
const senderTagCls: Record<string, string> = {
  guest: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  staff: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  system: 'bg-muted text-muted-foreground',
};

export default function AdminGeneralChat() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (data) setSessions(data as any as ChatSession[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  // Listen for new sessions
  useEffect(() => {
    const ch = supabase
      .channel('admin-general-sessions')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'chat_sessions',
      }, () => loadSessions())
      .subscribe();
    return () => { ch.unsubscribe(); };
  }, [loadSessions]);

  useEffect(() => {
    if (!search.trim()) { setFilteredSessions(sessions); return; }
    const q = search.toLowerCase();
    setFilteredSessions(sessions.filter(s =>
      (s.guest_name ?? '').toLowerCase().includes(q) ||
      (s.guest_email ?? '').toLowerCase().includes(q)
    ));
  }, [search, sessions]);

  const loadMessages = useCallback(async (sid: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    setMessages((data as any as ChatMessage[]) ?? []);
  }, []);

  useEffect(() => {
    if (!activeSessionId) return;
    loadMessages(activeSessionId);

    channelRef.current?.unsubscribe();
    channelRef.current = supabase
      .channel(`admin-gchat-${activeSessionId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `session_id=eq.${activeSessionId}`,
      }, payload => {
        setMessages(prev => {
          if (prev.find(m => m.id === (payload.new as any).id)) return prev;
          return [...prev, payload.new as ChatMessage];
        });
      })
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [activeSessionId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending || !activeSessionId || !profile) return;
    setSending(true);
    try {
      await supabase.from('chat_messages').insert({
        session_id: activeSessionId,
        sender_type: 'staff',
        sender_id: profile.id,
        sender_name: profile.full_name ?? profile.email ?? 'Admin',
        content: text.trim(),
        message_type: 'text',
      });
      setText('');
    } catch (e: any) { toast.error(e.message); }
    finally { setSending(false); }
  };

  const closeSession = async (sid: string) => {
    await supabase.from('chat_sessions').update({ status: 'closed' } as any).eq('id', sid);
    loadSessions();
    if (activeSessionId === sid) setActiveSessionId(null);
    toast.success('ปิดเซสชันแล้ว');
  };

  return (
    <AdminLayout>
      <div className="admin-content-area">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">💬 General Chat</h1>
            <p className="text-sm text-muted-foreground">สนทนากับผู้เยี่ยมชมและสมาชิกแบบ Real-time</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadSessions}>
            <RefreshCw className={cn('w-4 h-4 mr-1', loading && 'animate-spin')} /> รีเฟรช
          </Button>
        </div>

        <div className="flex border rounded-lg bg-card overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          {/* LEFT: Session list */}
          <div className="w-80 border-r flex flex-col shrink-0">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อ, อีเมล..."
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
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
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 border-b hover:bg-muted/50 transition-colors',
                    activeSessionId === session.id && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                >
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                        session.user_id
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-orange-100 dark:bg-orange-900/30'
                      )}>
                        <User className={cn('w-3.5 h-3.5', session.user_id ? 'text-blue-600' : 'text-orange-600')} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {session.guest_name || 'ไม่ระบุชื่อ'}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {session.guest_email || (session.user_id ? 'สมาชิก' : 'Guest')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge className={cn('text-[9px] h-4 px-1',
                        session.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {session.status === 'active' ? 'เปิด' : 'ปิด'}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                        {session.last_message_at ? relativeTime(session.last_message_at) : ''}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Chat window */}
          {activeSessionId && activeSession ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-4 py-3 border-b bg-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                    activeSession.user_id
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  )}>
                    <User className={cn('w-4 h-4', activeSession.user_id ? 'text-blue-600' : 'text-orange-600')} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{activeSession.guest_name || 'Guest'}</p>
                      <Badge className={cn('text-[10px]',
                        activeSession.user_id ? senderTagCls.customer : senderTagCls.guest
                      )}>
                        {activeSession.user_id ? 'สมาชิก' : 'ผู้เยี่ยมชม'}
                      </Badge>
                      {activeSession.status === 'active' && (
                        <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeSession.guest_email || 'ไม่ระบุอีเมล'}
                      {' · '}เริ่ม {format(new Date(activeSession.created_at), 'dd/MM/yyyy HH:mm', { locale: th })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeSession.status === 'active' && (
                    <Button size="sm" variant="outline" className="text-xs h-7"
                      onClick={() => closeSession(activeSession.id)}>
                      <Archive className="w-3 h-3 mr-1" /> ปิดเซสชัน
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="w-7 h-7"
                    onClick={() => setActiveSessionId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    ยังไม่มีข้อความในเซสชันนี้
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.sender_type === 'staff';
                  const isSystem = msg.sender_type === 'system';
                  const showSender = idx === 0 || messages[idx - 1].sender_type !== msg.sender_type;

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
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-auto mb-1',
                          msg.sender_type === 'customer'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-orange-100 dark:bg-orange-900/30'
                        )}>
                          <User className={cn('w-3.5 h-3.5',
                            msg.sender_type === 'customer' ? 'text-blue-600' : 'text-orange-600'
                          )} />
                        </div>
                      )}
                      <div className={cn('max-w-[65%] space-y-0.5 flex flex-col', isMe ? 'items-end' : 'items-start')}>
                        {showSender && (
                          <div className={cn('flex items-center gap-1.5 px-0.5', isMe ? 'flex-row-reverse' : 'flex-row')}>
                            <Badge className={cn('text-[10px] px-1.5 py-0', senderTagCls[msg.sender_type] ?? 'bg-muted')}>
                              {senderLabel[msg.sender_type] ?? msg.sender_type}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{msg.sender_name}</span>
                          </div>
                        )}
                        <div className={cn(
                          'rounded-2xl px-3 py-2 text-sm break-words',
                          isMe
                            ? `${senderBubbleCls.staff} rounded-tr-sm`
                            : 'bg-card border rounded-tl-sm'
                        )}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground px-0.5">
                          {format(new Date(msg.created_at), 'HH:mm', { locale: th })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {activeSession.status === 'active' ? (
                <div className="border-t bg-card p-3 flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="พิมพ์ข้อความ..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    disabled={sending}
                  />
                  <Button size="icon" className="h-9 w-9 rounded-xl"
                    onClick={handleSend} disabled={!text.trim() || sending}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-t bg-muted/30 p-3 text-center text-xs text-muted-foreground">
                  เซสชันนี้ถูกปิดแล้ว
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">เลือกเซสชันเพื่อเริ่มตอบแชท</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
