import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type Conversation = {
  id: string;
  guest_name: string | null;
  guest_email: string | null;
  user_id: string | null;
  status: string;
  assigned_admin: string | null;
  last_message_at: string;
  created_at: string;
  unread_count?: number;
};

export type Message = {
  id: string;
  sender_type: "user" | "admin" | "system";
  content: string;
  created_at: string;
  read: boolean;
};

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export function useLiveChat() {
  const { user } = useAuth();
  const qc = useQueryClient();

  // ─── Selection by ID only (prevents object reference issues) ───
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // ─── Refs for cleanup and preventing stale closures ───
  const messagesChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isMountedRef = useRef(true);
  const selectedConvIdRef = useRef<string | null>(null);
  
  // Keep ref in sync with state
  selectedConvIdRef.current = selectedConvId;

  // ═══════════════════════════════════════════════════════════════════════════
  // Conversations Query (React Query handles caching & refetch)
  // ═══════════════════════════════════════════════════════════════════════════

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["admin", "live-chat-conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_chat_conversations")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      if (!data) return [] as Conversation[];

      // Count unread messages per conversation
      const convIds = data.map((c) => c.id);
      const unreadMap: Record<string, number> = {};

      if (convIds.length > 0) {
        const { data: unreadData } = await supabase
          .from("live_chat_messages")
          .select("conversation_id")
          .in("conversation_id", convIds)
          .eq("sender_type", "user")
          .eq("read", false);

        unreadData?.forEach((m) => {
          unreadMap[m.conversation_id] = (unreadMap[m.conversation_id] || 0) + 1;
        });
      }

      return data.map((c) => ({
        ...c,
        unread_count: unreadMap[c.id] || 0,
      })) as Conversation[];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  // ─── Derive selected conversation from ID ───
  const selectedConv = selectedConvId
    ? conversations.find((c) => c.id === selectedConvId) ?? null
    : null;

  // ═══════════════════════════════════════════════════════════════════════════
  // Load Messages (only when selectedConvId changes)
  // ═══════════════════════════════════════════════════════════════════════════

  const loadMessages = useCallback(async (convId: string) => {
    if (!convId) return;
    
    // Guard: Only load if this is still the selected conversation
    if (convId !== selectedConvIdRef.current) {
      console.log("[useLiveChat] Skipping load for:", convId, "(not selected)");
      return;
    }

    setMessagesLoading(true);
    console.log("[useLiveChat] Loading messages for:", convId);

    try {
      const { data, error } = await supabase
        .from("live_chat_messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[useLiveChat] Error loading messages:", error);
        return;
      }

      if (!isMountedRef.current) return;
      
      // Guard again after async: selection might have changed
      if (convId !== selectedConvIdRef.current) {
        console.log("[useLiveChat] Selection changed during load, discarding results");
        return;
      }

      console.log("[useLiveChat] Loaded messages:", data?.length || 0);
      setMessages((data as Message[]) || []);

      // Mark as read (fire and forget - don't await)
      supabase
        .from("live_chat_messages")
        .update({ read: true })
        .eq("conversation_id", convId)
        .eq("sender_type", "user")
        .eq("read", false)
        .then(() => {
          // Refresh unread counts
          qc.invalidateQueries({ queryKey: ["admin", "live-chat-conversations"] });
        });
    } finally {
      if (isMountedRef.current) {
        setMessagesLoading(false);
      }
    }
  }, [qc]);

  // ─── Effect: Load messages when selection changes ───
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }
    loadMessages(selectedConvId);
  }, [selectedConvId, loadMessages]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Realtime: Conversations (single stable channel)
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const channel = supabase
      .channel("admin-live-chat-convs-v2")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_chat_conversations" },
        () => {
          console.log("[useLiveChat] Conversation changed, refetching...");
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchConversations]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Realtime: Messages (channel changes when selectedConvId changes)
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    // Cleanup previous channel
    if (messagesChannelRef.current) {
      supabase.removeChannel(messagesChannelRef.current);
      messagesChannelRef.current = null;
    }

    if (!selectedConvId) return;

    const channel = supabase
      .channel(`admin-chat-msg-v2-${selectedConvId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_chat_messages",
          filter: `conversation_id=eq.${selectedConvId}`,
        },
        (payload) => {
          const msg = payload.new as Message;
          console.log("[useLiveChat] New message received:", msg.id);

          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });

          // Auto-mark user messages as read
          if (msg.sender_type === "user") {
            supabase
              .from("live_chat_messages")
              .update({ read: true })
              .eq("id", msg.id);
          }
        }
      )
      .subscribe();

    messagesChannelRef.current = channel;

    return () => {
      if (messagesChannelRef.current) {
        supabase.removeChannel(messagesChannelRef.current);
        messagesChannelRef.current = null;
      }
    };
  }, [selectedConvId]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Visibility Change Handler (single listener, no dependency on selectedConv)
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    let lastHiddenTime: number | null = null;
    const STALE_THRESHOLD = 30_000;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lastHiddenTime = Date.now();
      } else {
        const hiddenDuration = lastHiddenTime ? Date.now() - lastHiddenTime : 0;

        if (hiddenDuration >= STALE_THRESHOLD) {
          console.log("[useLiveChat] Tab returned after", Math.round(hiddenDuration / 1000), "s");
          
          // Refetch conversations
          refetchConversations();

          // Reload messages for current selection (use ref to get current value)
          const currentId = selectedConvId;
          if (currentId) {
            loadMessages(currentId);
          }
        }

        lastHiddenTime = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetchConversations, loadMessages, selectedConvId]);

  // ═══════════════════════════════════════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════════════════════════════════════

  const selectConversation = useCallback((convId: string | null) => {
    // Only update if actually different
    setSelectedConvId((prev) => (prev === convId ? prev : convId));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !selectedConvId || !user) return false;

      try {
        await supabase.from("live_chat_messages").insert({
          conversation_id: selectedConvId,
          sender_type: "admin",
          sender_id: user.id,
          content: text.trim(),
        });

        await supabase
          .from("live_chat_conversations")
          .update({
            last_message_at: new Date().toISOString(),
            assigned_admin: user.id,
          })
          .eq("id", selectedConvId);

        return true;
      } catch (error) {
        console.error("[useLiveChat] Send message error:", error);
        return false;
      }
    },
    [selectedConvId, user]
  );

  const closeConversation = useCallback(
    async (convId: string) => {
      try {
        await supabase
          .from("live_chat_conversations")
          .update({ status: "closed" })
          .eq("id", convId);

        await supabase.from("live_chat_messages").insert({
          conversation_id: convId,
          sender_type: "system",
          content: "แอดมินปิดการสนทนาแล้ว ขอบคุณที่ติดต่อเราครับ/ค่ะ 🙏",
        });

        // Clear selection if closing current conversation
        if (selectedConvId === convId) {
          setSelectedConvId(null);
        }

        refetchConversations();
        return true;
      } catch (error) {
        console.error("[useLiveChat] Close conversation error:", error);
        return false;
      }
    },
    [selectedConvId, refetchConversations]
  );

  // ─── Cleanup on unmount ───
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    // Data
    conversations,
    selectedConv,
    selectedConvId,
    messages,

    // Loading states
    conversationsLoading,
    messagesLoading,

    // Actions
    selectConversation,
    sendMessage,
    closeConversation,
    refetchConversations,
  };
}
