import { useRef, useEffect } from "react";
import { Message } from "stompjs";
import FilePreview from "./FilePreview";

export default function MessageList({
  messages,
  currentUser,
  showStatus = false,  // new optional prop
}: {
  messages: Message[] | any;
  currentUser: string;
  showStatus?: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      const container = el.parentElement;
      if (container) {
        const shouldScroll = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
        if (shouldScroll) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  if (!Array.isArray(messages)) {
    console.warn("Invalid message format", messages);
    return <div className="text-red-500 p-4">Failed to load messages.</div>;
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.senderEmail === currentUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] break-words px-4 py-2 rounded-lg ${
              msg.senderEmail === currentUser
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-white border border-gray-200 rounded-bl-none"
            }`}
          >
            {/* File Preview */}
            {msg.fileUrl ? (
              <FilePreview fileName={msg.fileName} fileUrl={msg.fileUrl} />
            ) : null}

            {/* Text Content */}
            {msg.content && (
              <p className="whitespace-pre-line break-words">{msg.content}</p>
            )}

            {/* Timestamp */}
            <p
              className={`text-xs mt-1 ${
                msg.senderEmail === currentUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatTime(msg.timestamp)}
            </p>

            {/* Delivery/Read Status */}
            {showStatus && msg.senderEmail === currentUser && (
              <p className="text-xs mt-1 text-right italic">
                {msg.isread
                  ? "✓✓ Read"
                  : msg.delivered
                  ? "✓ Delivered"
                  : "⏳ Sent"}
              </p>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
