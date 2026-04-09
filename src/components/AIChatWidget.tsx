import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useEngagementTracker } from "@/hooks/useEngagementTracker";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ent-chat`;
const SAVE_LEAD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-chat-lead`;

const WELCOME_MSG: Msg = {
  role: "assistant",
  content: "สวัสดีครับ! 👋 ยินดีต้อนรับสู่ **ENT Group**\n\nผมเป็น AI ผู้ช่วยด้าน Industrial PC ครับ ไม่ว่าจะเป็น Mini PC, Panel PC, Rugged Tablet หรืออุปกรณ์เครือข่าย\n\nบอกผมได้เลยว่า **ต้องการใช้งานแบบไหน** แล้วผมจะช่วยแนะนำรุ่นที่เหมาะสมที่สุดครับ 😊",
};

function generateSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

interface AIChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

const AIChatWidget = ({ open, onClose }: AIChatWidgetProps) => {
  const [messages, setMessages] = useState<Msg[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const [leadSaved, setLeadSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { trackEvent } = useEngagementTracker();
  const chatTrackedRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const extractAndSaveLead = useCallback(
    async (text: string) => {
      const match = text.match(/\[LEAD_DATA\](.*?)\[\/LEAD_DATA\]/s);
      if (!match || leadSaved) return;

      try {
        const leadData = JSON.parse(match[1]);
        setLeadSaved(true);

        const summary = messages
          .slice(-6)
          .map((m) => `${m.role}: ${m.content.substring(0, 200)}`)
          .join("\n");

        const fullMessages = messages.map((m) => ({
          role: m.role,
          content: m.content.replace(/\[LEAD_DATA\].*?\[\/LEAD_DATA\]/s, "").trim(),
        }));

        await fetch(SAVE_LEAD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            session_id: sessionId,
            name: leadData.name || null,
            email: leadData.email || null,
            phone: leadData.phone || null,
            company: leadData.company || null,
            line_id: leadData.line_id || null,
            interest: leadData.interest || null,
            conversation_summary: summary,
            messages: fullMessages,
          }),
        });
      } catch (err) {
        console.error("Failed to save lead:", err);
      }
    },
    [leadSaved, messages, sessionId]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Track first chat message only
    if (!chatTrackedRef.current) {
      chatTrackedRef.current = true;
      trackEvent({ eventType: "chat_inquiry", metadata: { firstMessage: text.substring(0, 200) } });
    }
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      const cleanContent = assistantSoFar.replace(/\[LEAD_DATA\].*?\[\/LEAD_DATA\]/s, "").trim();
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: cleanContent } : m));
        }
        return [...prev, { role: "assistant", content: cleanContent }];
      });
    };

    try {
      const apiMessages = newMessages
        .filter((m) => m !== WELCOME_MSG)
        .map((m) => ({ role: m.role, content: m.content }));

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (assistantSoFar) {
        extractAndSaveLead(assistantSoFar);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ขออภัยครับ ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง หรือติดต่อเราทาง LINE @entgroup ครับ 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl shadow-2xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
        <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm">ENT AI Assistant</h3>
          <p className="text-[10px] opacity-80">ผู้เชี่ยวชาญ Industrial PC</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <Bot size={14} />
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
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
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground text-center mt-1.5">
          Powered by ENT AI • ข้อมูลอาจไม่สมบูรณ์ กรุณาตรวจสอบกับฝ่ายขาย
        </p>
      </div>
    </div>
  );
};

export default AIChatWidget;
