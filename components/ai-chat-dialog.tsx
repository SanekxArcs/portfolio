"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  name?: string;
  companyName?: string;
}

export default function AiChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [showContactForm, setShowContactForm] = useState(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [greetingMessage] = useState(
    "Hi! I'm an AI assistant here to tell you about my services. How can I help you today?"
  );
  const [messagesRemaining, setMessagesRemaining] = useState(15);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get or create sessionId from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('ai-chat-session-id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      setSessionId(newSessionId);
      localStorage.setItem('ai-chat-session-id', newSessionId);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: greetingMessage,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [open, greetingMessage, messages.length]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactInfo.email && !contactInfo.phone && !contactInfo.name) {
      alert("Please provide at least your email, phone, or name to start chatting.");
      return;
    }

    setShowContactForm(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactInfo.email) {
      alert("Please provide your email to continue chatting.");
      return;
    }

    setShowEmailPrompt(false);

    // Add a message confirming email received
    const confirmMessage: Message = {
      role: "assistant",
      content: "Thank you for providing your email! You can now continue chatting. You have 5 more messages available.",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId,
          userEmail: contactInfo.email,
          userPhone: contactInfo.phone,
          userName: contactInfo.name,
          companyName: contactInfo.companyName,
          chatHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if email is needed
        if (response.status === 429 && data.needsEmail) {
          setShowEmailPrompt(true);
          const errorMessage: Message = {
            role: "assistant",
            content: data.error || "You've reached the message limit. Please provide your email to continue chatting.",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.messagesRemaining !== undefined) {
        setMessagesRemaining(data.messagesRemaining);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "😴 Looks like the AI agent is taking a nap right now! Please reach out to Oleksandr directly — you can find his contact details on this page.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="size-5 text-emerald-500" />
            Aks AI about Oleksandr
          </DialogTitle>
        </DialogHeader>

        {showContactForm ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Before we start, please share at least one way for me to contact you, it`s can be even only name:
              </p>
              <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2 border">
                📧 <strong>Phone number and email are optional</strong>, but at least one of them (or your name) must be provided.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={contactInfo.name || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactInfo.email || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={contactInfo.phone || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="Your company"
                    value={contactInfo.companyName || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, companyName: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send /> Start Chat
                </Button>
              </form>
            </div>
          </div>
        ) : showEmailPrompt ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached your message limit. Please provide your email to get 5 more messages:
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-extra">Email *</Label>
                  <Input
                    id="email-extra"
                    type="email"
                    placeholder="your@email.com"
                    value={contactInfo.email || ""}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue Chatting
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                        message.role === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              code: ({ children }) => <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs">{children}</code>,
                              pre: ({ children }) => <pre className="bg-black/10 dark:bg-white/10 p-2 rounded text-xs overflow-x-auto">{children}</pre>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t px-6 py-4 shrink-0">
              {messagesRemaining <= 5 && messagesRemaining > 0 && (
                <div className="text-xs text-muted-foreground mb-2">
                  {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} remaining
                  {!contactInfo.email && messagesRemaining <= 3 && " - Provide email for 5 more messages"}
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-15 max-h-30 resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                  className="size-15 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
