"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin" | "support";
  timestamp: Date;
  read: boolean;
}

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  unreadCount: number;
  isTyping: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Supabase client once per component instance
  const [supabase] = useState(() => createClient());

  const toggleChat = useCallback(() => setIsOpen((prev) => !prev), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    let currentUserId: string | null = null;

    const loadInitialMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id || null;

      let query = supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);

      // RLS FIX: usuarios normales solo ven SUS mensajes + mensajes de admins/support
      // No pueden ver mensajes de otros usuarios normales
      if (currentUserId) {
        // Filtro: mensajes donde sender_id = user actual O sender_role != 'user'
        // Esto previene que usuarios normales vean mensajes de otros usuarios
        query = query.or(`sender_id.eq.${currentUserId},sender_role.in.(admin,support,system)`);
      } else {
        // Sin auth: solo admins/support pueden ver todos
        query = query.in("sender_role", ["admin", "support", "system"]);
      }

      const { data } = await query;

      if (data) {
        const formatted = data.map((msg: Record<string, any>) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.sender_id,
          senderName: msg.sender_name || "Usuario",
          senderRole: msg.sender_role || "user",
          timestamp: new Date(msg.created_at),
          read: msg.read || false,
        }));
        setMessages(formatted);

        const unread = formatted.filter(
          (m) => !m.read && m.senderRole !== "user" && m.senderId !== currentUserId,
        ).length;
        setUnreadCount(unread);
      }
    };

    loadInitialMessages();

    let messageFilter = "sender_role.in.(admin,support,system)";
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) {
        messageFilter = `sender_id.eq.${user.id},sender_role.in.(admin,support,system)`;
      }
    });

    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: messageFilter },
        (payload) => {
          const newMsg = payload.new as Record<string, any>;
          const formatted: Message = {
            id: newMsg.id,
            content: newMsg.content,
            senderId: newMsg.sender_id,
            senderName: newMsg.sender_name || "Admin",
            senderRole: newMsg.sender_role || "admin",
            timestamp: new Date(newMsg.created_at),
            read: false,
          };

          setMessages((prev) => [...prev, formatted]);

          if (!isOpen && formatted.senderRole !== "user") {
            setUnreadCount((prev) => prev + 1);
          }

          if (isOpen && formatted.senderRole !== "user") {
            supabase
              .from("chat_messages")
              .update({ read: true })
              .eq("id", newMsg.id);
          }

          if (formatted.senderRole !== "user") {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, supabase]);

  const sendMessage = useCallback(async (content: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const messageData = {
      content,
      sender_id: user.id,
      sender_name: user.email?.split("@")[0] || "Usuario",
      sender_role: "user",
      read: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("chat_messages")
      .insert(messageData)
      .select()
      .single();

    if (!error && data) {
      const formatted: Message = {
        id: data.id,
        content: data.content,
        senderId: data.sender_id,
        senderName: data.sender_name,
        senderRole: "user",
        timestamp: new Date(data.created_at),
        read: true,
      };
      setMessages((prev) => [...prev, formatted]);
    }
  }, [supabase]);

  const markAsRead = useCallback(async () => {
    setUnreadCount(0);
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      // Solo marcar como leídos mensajes de admins/support que no son del usuario actual
      await supabase
        .from("chat_messages")
        .update({ read: true })
        .eq("read", false)
        .neq("sender_id", user.id)
        .in("sender_role", ["admin", "support", "system"]);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) {
      markAsRead();
    }
  }, [isOpen, markAsRead]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        unreadCount,
        isTyping,
        toggleChat,
        openChat,
        closeChat,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
