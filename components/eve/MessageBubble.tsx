import React, { forwardRef } from "react";

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

// 👇 usamos forwardRef porque lo necesitas para el scroll
const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ message, isUser }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow 
          ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          {message.content}
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;

export interface Message {
  role: "user" | "assistant";
  content: string;
}
