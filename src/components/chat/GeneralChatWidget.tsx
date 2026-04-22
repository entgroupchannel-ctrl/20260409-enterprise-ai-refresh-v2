import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Send, Paperclip, MessageCircle, X, User, Shield,
  CheckCheck, ChevronDown, Image, FileText, Smile, Headphones,
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
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
        <Headphones className="w-4 h-4 text-white" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
      <User className="w-4 h-4 text-white" />
    </div>
  );
};

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
      <MessageCircle className="w-8 h-8 text-primary" />
    </div>
    <div>
      <h4 className="font-semibold text-foreground text-sm">ยินดีต้อนรับสู่ ENT Group</h4>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        ทีมงานพร้อมช่วยเหลือคุณ<br />
        ตอบกลับภายใน 5 นาทีในเวลาทำการ
      </p>
    </div>
    <div className="flex gap-2">
      {['💬 สอบถามสินค้า', '📋 ขอใบเสนอราคา', '🔧 แจ้งปัญหา'].map((tag) => (
        <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const isImageFile = (name: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(name);

export default function GeneralChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Guest info form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // External trigger: open chat with prefilled text (e.g., "Chat now" button on product cards)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setOpen(true);
      if (detail?.message) {
        setText(prev => (prev ? prev : detail.message!));
      }
    };
    window.addEventListener('ent:open-chat', handler as EventListener);
    return () => window.removeEventListener('ent:open-chat', handler as EventListener);
  }, []);

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
      content: '🎉 ยินดีต้อนรับ! ทีมงาน ENT Group พร้อมช่วยเหลือคุณ — สอบถามสินค้า ขอใบเสนอราคา หรือแจ้งปัญหาได้เลยครับ',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์ต้องมีขนาดไม่เกิน 10 MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `chat-attachments/${sessionId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const senderType = userId ? 'customer' : 'guest';
      const senderName = userId ? (userName ?? 'สมาชิก') : (guestName || 'Guest');

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_type: senderType,
        sender_id: userId || null,
        sender_name: senderName,
        content: `📎 ${file.name}`,
        message_type: 'attachment',
        attachment_url: urlData.publicUrl,
        attachment_name: file.name,
      });

      toast.success('อัปโหลดไฟล์สำเร็จ');
    } catch (err: any) {
      toast.error('อัปโหลดไม่สำเร็จ: ' + (err.message || 'ลองใหม่อีกครั้ง'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Don't show on admin pages
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return null;
  }

  const renderAttachment = (msg: ChatMessage, isMe: boolean) => {
    const fileName = msg.attachment_name || 'ไฟล์แนบ';
    const isImage = isImageFile(fileName);

    if (isImage && msg.attachment_url) {
      return (
        <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={msg.attachment_url}
            alt={fileName}
            className="max-w-[200px] max-h-[160px] rounded-lg object-cover border border-border/50"
            loading="lazy"
           decoding="async"/>
          <span className="text-[10px] opacity-70 mt-1 block">{fileName}</span>
        </a>
      );
    }

    return (
      <a
        href={msg.attachment_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
          isMe ? 'bg-white/10 hover:bg-white/20' : 'bg-muted hover:bg-muted/80'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isMe ? 'bg-white/20' : 'bg-primary/10'
        )}>
          <FileText className={cn('w-4 h-4', isMe ? 'text-white' : 'text-primary')} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{fileName}</p>
          <p className="opacity-60 text-[10px]">คลิกเพื่อเปิด</p>
        </div>
      </a>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-h-[560px] rounded-2xl shadow-2xl border border-border/50 bg-background flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">ENT Group Support</p>
                <p className="text-[11px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  ออนไลน์ · ตอบกลับภายใน 5 นาที
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="w-8 h-8 text-primary-foreground hover:bg-white/20 rounded-full"
              onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Guest Info Form */}
          {showForm && !userId && !sessionId ? (
            <div className="p-5 space-y-4">
              <WelcomeScreen />
              <div className="space-y-3">
                <Input
                  placeholder="ชื่อของคุณ *"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
                <Input
                  type="email"
                  placeholder="อีเมล *"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="h-10 text-sm rounded-xl"
                />
                <Button className="w-full h-10 rounded-xl font-medium" onClick={startSession}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  เริ่มสนทนา
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center">
                หรือ <a href="/login" className="text-primary underline font-medium">เข้าสู่ระบบ</a> เพื่อดูประวัติแชท
              </p>
            </div>
          ) : !sessionId && userId ? (
            <div className="p-5 space-y-4">
              <WelcomeScreen />
              <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-[11px] text-muted-foreground">สมาชิก</p>
                </div>
              </div>
              <Button className="w-full h-10 rounded-xl font-medium" onClick={startSession}>
                <MessageCircle className="w-4 h-4 mr-2" />
                เริ่มสนทนาใหม่
              </Button>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col flex-1 max-h-[460px]">
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-muted/20 to-background">
                {messages.length === 0 && <WelcomeScreen />}

                {messages.map((msg, idx) => {
                  const isMe = msg.sender_type === 'guest' || msg.sender_type === 'customer';
                  const isSystem = msg.sender_type === 'system';
                  const showSender = idx === 0 || messages[idx - 1].sender_type !== msg.sender_type;
                  const showTime = idx === messages.length - 1 || messages[idx + 1]?.sender_type !== msg.sender_type;

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-3">
                        <span className="text-[11px] text-muted-foreground bg-muted/80 backdrop-blur-sm px-4 py-1.5 rounded-full leading-relaxed">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={cn('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
                      {!isMe && showSender && <RoleAvatar senderType={msg.sender_type} />}
                      {!isMe && !showSender && <div className="w-8 shrink-0" />}
                      <div className={cn('max-w-[78%] space-y-0.5 flex flex-col', isMe ? 'items-end' : 'items-start')}>
                        {showSender && !isMe && (
                          <span className="text-[10px] text-muted-foreground px-1 font-medium">
                            {msg.sender_name} · ทีมงาน
                          </span>
                        )}
                        <div className={cn(
                          'rounded-2xl px-3.5 py-2.5 text-sm break-words shadow-sm',
                          isMe
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-card border border-border/60 rounded-bl-md'
                        )}>
                          {msg.message_type === 'attachment' && msg.attachment_url ? (
                            renderAttachment(msg, isMe)
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          )}
                        </div>
                        {showTime && (
                          <div className={cn('flex items-center gap-1 px-1', isMe ? 'flex-row-reverse' : 'flex-row')}>
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(msg.created_at), 'HH:mm', { locale: th })}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3 text-muted-foreground" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border/60 bg-card p-3">
                <div className="flex gap-2 items-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="แนบไฟล์"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Paperclip className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex-1 relative">
                    <input
                      className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      placeholder="พิมพ์ข้อความ..."
                      value={text}
                      onChange={e => setText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      disabled={sending}
                    />
                  </div>
                  <Button
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl"
                    onClick={sendMessage}
                    disabled={!text.trim() || sending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[9px] text-muted-foreground text-center mt-1.5 opacity-60">
                  รองรับไฟล์ภาพ, PDF, Excel สูงสุด 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95",
          "bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground",
          open && "rotate-0"
        )}
      >
        {open
          ? <ChevronDown className="w-6 h-6" />
          : <MessageCircle className="w-6 h-6" />}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {!open && unreadCount === 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-background" />
        )}
      </button>
    </div>
  );
}
