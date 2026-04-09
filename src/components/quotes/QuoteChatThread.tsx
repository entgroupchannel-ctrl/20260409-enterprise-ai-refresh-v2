import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/quote-utils";

interface Message {
  id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  message_type: string;
  attachment_url?: string;
  attachment_name?: string;
  created_at: string;
}

interface QuoteChatThreadProps {
  quoteId: string;
  currentUserId?: string;
  currentUserName: string;
  currentUserRole: "customer" | "sales" | "admin";
}

const QuoteChatThread = ({ quoteId, currentUserId, currentUserName, currentUserRole }: QuoteChatThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel(`quote-chat-${quoteId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "quote_messages",
        filter: `quote_id=eq.${quoteId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [quoteId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await (supabase.from as any)("quote_messages")
      .select("*")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await (supabase.from as any)("quote_messages").insert({
        quote_id: quoteId,
        sender_id: currentUserId,
        sender_name: currentUserName,
        sender_role: currentUserRole,
        content: newMessage.trim(),
        message_type: "text",
      });
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const roleColor: Record<string, string> = {
    customer: "bg-blue-100 text-blue-800",
    sales: "bg-green-100 text-green-800",
    admin: "bg-purple-100 text-purple-800",
    system: "bg-secondary text-muted-foreground",
  };

  return (
    <div className="flex flex-col h-[400px] border border-border rounded-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/20">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">ยังไม่มีข้อความ</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_role === currentUserRole;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] rounded-xl p-3 space-y-1", isMe ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                <div className="flex items-center gap-2 text-xs opacity-75">
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", roleColor[msg.sender_role] || "bg-secondary")}>
                    {msg.sender_role === "customer" ? "ลูกค้า" : msg.sender_role === "admin" ? "แอดมิน" : msg.sender_role}
                  </span>
                  <span>{msg.sender_name}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.attachment_url && (
                  <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
                    <Paperclip className="w-3 h-3" /> {msg.attachment_name || "ไฟล์แนบ"}
                  </a>
                )}
                <p className="text-[10px] opacity-50">{formatRelativeTime(msg.created_at)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-card flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button size="sm" onClick={handleSend} disabled={!newMessage.trim() || sending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuoteChatThread;
