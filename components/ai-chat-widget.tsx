"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const AiChatDialog = dynamic(() => import("@/components/ai-chat-dialog"), {
  ssr: false,
});

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setIsOpen(true);
            setHasOpened(true);
          }}
          size="lg"
          className="size-10 shadow-lg hover:shadow-xl transition-all duration-300 "
          aria-label="Open AI Chat"
        >
          <Bot />
        </Button>
      </div>

      {/* Chat Dialog — loaded on first open, kept mounted to preserve conversation */}
      {hasOpened && <AiChatDialog open={isOpen} onOpenChange={setIsOpen} />}
    </>
  );
}
