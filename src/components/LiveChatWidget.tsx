import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, User, Headphones, Loader2, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

type Message = {
  id: string;
  sender_type: "user" | "admin" | "system";
  content: string;
  created_at: string;
};

type GuestInfo = { name: string; email: string };

const LiveChatWidget = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [guestForm, setGuestForm] = useState({ name: "", email: "" });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open, showGuestForm]);

  // Check if user is logged in → skip guest form
  useEffect(() => {
    if (user) {
      setGuestInfo({ name: user.user_metadata?.full_name || "สมาชิก", email: user.email || "" });
    }
  }, [user]);

  // Load existing conversation on mount
  useEffect(() => {
    const loadConversation = async () => {
      if (!user || isAdminRoute) return;
      const { data } = await supabase
        .from("live_chat_conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setConversationId(data.id);
        loadMessages(data.id);
      }
    };
    loadConversation();
  }, [user, isAdminRoute]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId || isAdminRoute) return;

    const channel = supabase
      .channel(`live-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, {
              id: newMsg.id,
              sender_type: newMsg.sender_type,
              content: newMsg.content,
              created_at: newMsg.created_at,
            }];
          });
          // Mark unread if chat is minimized
          if (!open) setHasUnread(true);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, isAdminRoute]);

  // Don't render LiveChatWidget on admin pages
  // (admins use AdminLiveChat instead, and the persistent realtime
  // websocket here causes connection issues after 5-10 min idle)
  if (isAdminRoute) return null;

  const loadMessages = async (convId: string) => {
    const { data } = await supabase
      .from("live_chat_messages")
      .select("id, sender_type, content, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  };

  const createConversation = async (info: GuestInfo): Promise<string | null> => {
    const insertData: any = {
      guest_name: info.name,
      guest_email: info.email,
      status: "active",
    };
    if (user) insertData.user_id = user.id;

    const { data, error } = await supabase
      .from("live_chat_conversations")
      .insert(insertData)
      .select("id")
      .single();

    if (error || !data) {
      console.error("Failed to create conversation:", error);
      return null;
    }

    // Insert welcome system message
    await supabase.from("live_chat_messages").insert({
      conversation_id: data.id,
      sender_type: "system",
      content: "สวัสดีครับ/ค่ะ! ยินดีต้อนรับสู่ ENT Group Live Chat 🎧\nทีมงานจะตอบกลับโดยเร็วที่สุดครับ",
    });

    return data.id;
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name.trim() || !guestForm.email.trim()) return;
    const info = { name: guestForm.name.trim(), email: guestForm.email.trim() };
    setGuestInfo(info);
    setShowGuestForm(false);

    const convId = await createConversation(info);
    if (convId) {
      setConversationId(convId);
      loadMessages(convId);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    setHasUnread(false);
    if (!guestInfo && !user) {
      setShowGuestForm(true);
      return;
    }
    if (!conversationId && guestInfo) {
      const convId = await createConversation(guestInfo);
      if (convId) {
        setConversationId(convId);
        loadMessages(convId);
      }
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending || !conversationId) return;

    setSending(true);
    setInput("");

    const { data, error } = await supabase.from("live_chat_messages").insert({
      conversation_id: conversationId,
      sender_type: "user",
      sender_id: user?.id || null,
      content: text,
    }).select("id, sender_type, content, created_at").single();

    if (error) {
      console.error("Send failed:", error);
    } else if (data) {
      // Add message only if realtime hasn't already added it
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data as Message];
      });
    }

    // Update last_message_at
    await supabase
      .from("live_chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  // Minimized state button - always visible
  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Live Chat"
      >
        <Headphones size={24} />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
            !
          </span>
        )}
        {!hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
        )}
        <span className="absolute right-16 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          แชทกับทีมงาน ENT Group
        </span>
      </button>
    );
  }

  // Guest form
  if (showGuestForm) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-border bg-background overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Headphones size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">ENT Group Live Chat</h3>
            <p className="text-[10px] opacity-80">สนทนากับทีมงานจริง</p>
          </div>
          <button onClick={() => { setOpen(false); setShowGuestForm(false); }} className="p-1.5 rounded-lg hover:bg-primary-foreground/20">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleGuestSubmit} className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">กรุณากรอกข้อมูลเพื่อเริ่มสนทนาครับ</p>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">ชื่อ <span className="text-destructive">*</span></label>
            <input
              type="text"
              required
              value={guestForm.name}
              onChange={(e) => setGuestForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="ชื่อของคุณ"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">อีเมล <span className="text-destructive">*</span></label>
            <input
              type="email"
              required
              value={guestForm.email}
              onChange={(e) => setGuestForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="email@company.com"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} /> เริ่มสนทนา
          </button>
        </form>
      </div>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl shadow-2xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
        <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Headphones size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">ENT Group Live Chat</h3>
          <p className="text-[10px] opacity-80">สนทนากับทีมงานจริง</p>
        </div>
        <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors" title="ย่อหน้าต่าง">
          <Minus size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Headphones size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">กำลังเชื่อมต่อกับทีมงาน...</p>
          </div>
        )}
        {messages.map((msg) => {
          if (msg.sender_type === "system") {
            return (
              <div key={msg.id} className="text-center">
                <span className="inline-block text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isUser = msg.sender_type === "user";
          return (
            <div key={msg.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                isUser ? "bg-primary text-primary-foreground" : "bg-accent/20 text-accent"
              }`}>
                {isUser ? <User size={14} /> : <Headphones size={14} />}
              </div>
              <div className="max-w-[80%]">
                <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[10px] text-muted-foreground mt-0.5 block ${isUser ? "text-right" : ""}`}>
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t border-border px-3 py-2.5 bg-card">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความ..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-24"
            style={{ minHeight: "38px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending || !conversationId}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground text-center mt-1.5">
          ENT Group Live Support • เวลาทำการ จ.-ศ. 9:00–18:00
        </p>
      </div>
    </div>
  );
};

export default LiveChatWidget;
