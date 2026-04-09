import { useState, useEffect, useRef } from "react";
import {
  Headphones, Send, User, Clock, CheckCircle, XCircle,
  RefreshCw, MessageSquare, Loader2, Search, ArrowLeft,
} from "lucide-react";
import { useLiveChat, type Conversation, type Message } from "@/hooks/useLiveChat";

// ═══════════════════════════════════════════════════════════════════════════
// AdminLiveChat Component (New Architecture)
// ═══════════════════════════════════════════════════════════════════════════
// 
// This is a complete rewrite that fixes the infinite loop issues:
// 1. Uses selectedConvId (string) instead of selectedConv (object) for state
// 2. All realtime subscriptions use stable dependencies
// 3. Visibility change handler doesn't recreate on every render
// 4. Messages are loaded exactly once per conversation selection
//
// UI is identical to the original - only the internal logic changed.
// ═══════════════════════════════════════════════════════════════════════════

const AdminLiveChat = () => {
  const {
    conversations,
    selectedConv,
    selectedConvId,
    messages,
    conversationsLoading,
    messagesLoading,
    selectConversation,
    sendMessage,
    closeConversation,
    refetchConversations,
  } = useLiveChat();

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // ─── Scroll to bottom when messages change ───
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── Send message handler ───
  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");

    const success = await sendMessage(text);
    if (!success) {
      setInput(text); // Restore input on failure
    }

    setSending(false);
  };

  // ─── Close conversation handler ───
  const handleClose = async (convId: string) => {
    await closeConversation(convId);
  };

  // ─── Format time helper ───
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "เมื่อสักครู่";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} นาที`;
    if (diff < 86400000) return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
  };

  // ─── Filter conversations ───
  const filteredConvs = conversations.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.guest_name?.toLowerCase().includes(s) ||
      c.guest_email?.toLowerCase().includes(s)
    );
  });

  const activeConvs = filteredConvs.filter((c) => c.status === "active");
  const closedConvs = filteredConvs.filter((c) => c.status === "closed");

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] flex border border-border rounded-xl overflow-hidden bg-background">
      {/* ─── Conversation List ─── */}
      <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedConv ? "hidden md:flex" : "flex"}`}>
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Headphones size={16} className="text-primary" /> Live Chat
              {activeConvs.length > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {activeConvs.length}
                </span>
              )}
            </h3>
            <button
              onClick={() => refetchConversations()}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <RefreshCw size={14} className={conversationsLoading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ/อีเมล..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeConvs.length === 0 && closedConvs.length === 0 && !conversationsLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">ยังไม่มีการสนทนา</p>
            </div>
          )}

          {activeConvs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground px-3 pt-2 pb-1 uppercase">กำลังสนทนา</p>
              {activeConvs.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isSelected={selectedConvId === c.id}
                  onSelect={() => selectConversation(c.id)}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}

          {closedConvs.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground px-3 pt-3 pb-1 uppercase">ปิดแล้ว</p>
              {closedConvs.slice(0, 10).map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isSelected={selectedConvId === c.id}
                  onSelect={() => selectConversation(c.id)}
                  formatTime={formatTime}
                  isClosed
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Chat Area ─── */}
      <div className={`flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : "flex"}`}>
        {!selectedConv ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Headphones size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">เลือกการสนทนาเพื่อเริ่มตอบ</p>
            </div>
          </div>
        ) : (
          <>
            {/* ─── Chat Header ─── */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectConversation(null)}
                  className="md:hidden p-1 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedConv.guest_name || "ผู้เยี่ยมชม"}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedConv.guest_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedConv.status === "active" && (
                  <button
                    onClick={() => handleClose(selectedConv.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1"
                  >
                    <XCircle size={12} /> ปิดสนทนา
                  </button>
                )}
                {selectedConv.status === "closed" && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle size={12} /> ปิดแล้ว
                  </span>
                )}
              </div>
            </div>

            {/* ─── Messages ─── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messagesLoading && messages.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-muted-foreground" />
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* ─── Input ─── */}
            {selectedConv.status === "active" && (
              <div className="border-t border-border px-3 py-2.5 bg-card">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="พิมพ์ข้อความตอบกลับ..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-24"
                    style={{ minHeight: "38px" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0"
                  >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// Sub-components (Pure UI - no side effects)
// ═══════════════════════════════════════════════════════════════════════════

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  formatTime: (dateStr: string) => string;
  isClosed?: boolean;
}

const ConversationItem = ({
  conversation: c,
  isSelected,
  onSelect,
  formatTime,
  isClosed = false,
}: ConversationItemProps) => (
  <button
    onClick={onSelect}
    className={`w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/50 ${
      isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
    } ${isClosed ? "opacity-60" : ""}`}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground truncate">
        {c.guest_name || "ผู้เยี่ยมชม"}
      </span>
      {!isClosed && (c.unread_count || 0) > 0 && (
        <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          {c.unread_count}
        </span>
      )}
    </div>
    <div className="flex items-center justify-between mt-0.5">
      <span className="text-[11px] text-muted-foreground truncate">{c.guest_email}</span>
      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
        <Clock size={10} /> {formatTime(c.last_message_at)}
      </span>
    </div>
  </button>
);

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message: msg }: MessageBubbleProps) => {
  if (msg.sender_type === "system") {
    return (
      <div className="text-center">
        <span className="inline-block text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {msg.content}
        </span>
      </div>
    );
  }

  const isAdmin = msg.sender_type === "admin";

  return (
    <div className={`flex gap-2 ${isAdmin ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isAdmin ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        {isAdmin ? <Headphones size={14} /> : <User size={14} />}
      </div>
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isAdmin
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-secondary text-foreground rounded-bl-md"
          }`}
        >
          {msg.content}
        </div>
        <span className={`text-[10px] text-muted-foreground mt-0.5 block ${isAdmin ? "text-right" : ""}`}>
          {new Date(msg.created_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};

export default AdminLiveChat;
