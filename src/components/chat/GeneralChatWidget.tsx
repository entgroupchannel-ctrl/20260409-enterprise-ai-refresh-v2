import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Send, Paperclip, MessageCircle, X, User, Shield,
  CheckCheck, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

const SESSION_KEY = 'ent_chat_session_id';

const RoleAvatar = ({ senderType }: { senderType: string }) => {
  if (senderType === 'staff') {
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

export default function GeneralChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Guest info form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        const meta = session.user.user_metadata;
        setUserName(meta?.full_name || session.user.email || 'สมาชิก');
        setShowForm(false);
      }
    });
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
      setShowForm(false);
    }
  }, []);

  // Load messages when session exists
  const loadMessages = useCallback(async (sid: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    if (data) {
      setMessages(data as any as ChatMessage[]);
      const unread = data.filter((m: any) => m.sender_type === 'staff' && !m.read_at).length;
      setUnreadCount(unread);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    loadMessages(sessionId);

    channelRef.current?.unsubscribe();
    channelRef.current = supabase
      .channel(`general-chat-${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`,
      }, payload => {
        const newMsg = payload.new as ChatMessage;
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        if (newMsg.sender_type === 'staff' && !open) {
          setUnreadCount(c => c + 1);
        }
      })
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [sessionId, loadMessages]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open && sessionId) {
      setUnreadCount(0);
    }
  }, [open, sessionId]);

  const startSession = async () => {
    if (!userId && (!guestName.trim() || !guestEmail.trim())) {
      toast.error('กรุณากรอกชื่อและอีเมล');
      return;
    }

    const payload: any = {
      source: 'website',
      status: 'active',
    };

    if (userId) {
      payload.user_id = userId;
      payload.guest_name = userName;
    } else {
      payload.guest_name = guestName.trim();
      payload.guest_email = guestEmail.trim();
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      toast.error('ไม่สามารถเริ่มแชทได้');
      return;
    }

    const sid = data.id;
    setSessionId(sid);
    localStorage.setItem(SESSION_KEY, sid);
    setShowForm(false);

    // Send welcome system message
    await supabase.from('chat_messages').insert({
      session_id: sid,
      sender_type: 'system',
      sender_name: 'ระบบ',
      content: 'ยินดีต้อนรับ! ทีมงาน ENT Group พร้อมช่วยเหลือคุณ',
      message_type: 'system',
    });
  };

  const sendMessage = async () => {
    if (!text.trim() || sending || !sessionId) return;
    setSending(true);
    try {
      const senderType = userId ? 'customer' : 'guest';
      const senderName = userId ? (userName ?? 'สมาชิก') : (guestName || 'Guest');

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_type: senderType,
        sender_id: userId || null,
        sender_name: senderName,
        content: text.trim(),
        message_type: 'text',
      });
      setText('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  // Don't show for staff users
  // Check if current path is admin
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-[360px] max-h-[520px] rounded-2xl shadow-2xl border bg-background flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
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

          {/* Guest Info Form */}
          {showForm && !userId && !sessionId ? (
            <div className="p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">เริ่มต้นสนทนา</p>
              <p className="text-xs text-muted-foreground">กรอกข้อมูลเพื่อเริ่มแชทกับทีมงาน</p>
              <Input
                placeholder="ชื่อ-นามสกุล *"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="h-9 text-sm"
              />
              <Input
                type="email"
                placeholder="อีเมล *"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                className="h-9 text-sm"
              />
              <Button className="w-full" size="sm" onClick={startSession}>
                <MessageCircle className="w-4 h-4 mr-2" />
                เริ่มแชท
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                หรือ <a href="/login" className="text-blue-600 underline">เข้าสู่ระบบ</a> เพื่อดูประวัติแชท
              </p>
            </div>
          ) : !sessionId && userId ? (
            <div className="p-4 space-y-3">
              <p className="text-sm text-foreground">สวัสดี {userName}! 👋</p>
              <Button className="w-full" size="sm" onClick={startSession}>
                <MessageCircle className="w-4 h-4 mr-2" />
                เริ่มสนทนาใหม่
              </Button>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col flex-1 max-h-[430px]">
              <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/10">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    ยังไม่มีข้อความ — เริ่มส่งข้อความหาทีมงานได้เลย
                  </div>
                )}

                {messages.map((msg, idx) => {
                  const isMe = msg.sender_type === 'guest' || msg.sender_type === 'customer';
                  const isSystem = msg.sender_type === 'system';
                  const showSender = idx === 0 || messages[idx - 1].sender_type !== msg.sender_type;

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
                      {!isMe && <RoleAvatar senderType={msg.sender_type} />}
                      <div className={cn('max-w-[75%] space-y-0.5 flex flex-col', isMe ? 'items-end' : 'items-start')}>
                        {showSender && !isMe && (
                          <span className="text-[10px] text-muted-foreground px-1">
                            {msg.sender_name} (ทีมงาน)
                          </span>
                        )}
                        <div className={cn(
                          'rounded-2xl px-3 py-2 text-sm break-words',
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-card border rounded-tl-sm'
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

              {/* Input */}
              <div className="border-t bg-card p-2.5">
                <div className="flex gap-1.5 items-center">
                  <input
                    className="flex-1 px-3 py-1.5 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="พิมพ์ข้อความ..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    disabled={sending}
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0 rounded-xl"
                    onClick={sendMessage} disabled={!text.trim() || sending}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
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
