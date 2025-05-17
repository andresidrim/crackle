"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/className";

type Message = {
  text: string;
  sender?: "you" | "opponent" | "system";
  timestamp?: number;
};

export default function GameLog({
  messages,
  className,
}: {
  messages: Message[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  function formatTime(timestamp?: number) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-md h-64 bg-[#1F1F2E] text-white rounded-lg p-4 overflow-y-auto border border-[#2F2F3E] space-y-1 text-sm",
        className,
      )}
    >
      {messages.length === 0 ? (
        <p className="text-[#9CA3AF] italic">Game logs will appear here.</p>
      ) : (
        messages.map((msg, idx) => (
          <p key={idx} className="text-[#E5E5E5]">
            <span className="text-[#7C3AED] font-medium mr-1">
              [{formatTime(msg.timestamp)}]
            </span>
            {msg.sender === "you" && (
              <span className="text-[#4ADE80] font-semibold">You: </span>
            )}
            {msg.sender === "opponent" && (
              <span className="text-[#F472B6] font-semibold">Opponent: </span>
            )}
            {msg.sender === "system" && (
              <span className="text-[#93C5FD] font-semibold">System: </span>
            )}
            {msg.text}
          </p>
        ))
      )}
    </div>
  );
}
