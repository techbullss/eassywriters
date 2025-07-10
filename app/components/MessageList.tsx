"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaFile, FaFileAlt } from "react-icons/fa";
import { FaFileImage, FaFilePdf, FaFileWord } from "react-icons/fa6";

type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

interface MessageListProps {
  messages: Array<{
    id?: number;
    tempId?: string;
    senderEmail: string;
    content: string;
    timestamp: string;
    fileUrl?: string;
    fileName?: string;
    status?: MessageStatus;
    read?: boolean;
  }>;
  currentUser: string;
  onMessageVisible?: (messageId: number) => void;
}

export default function MessageList({ messages, currentUser, onMessageVisible }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const prevMessageCount = useRef(messages.length);

  // Handle scroll behavior
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Scroll to bottom when new messages arrive and auto-scroll is enabled
    if (messages.length !== prevMessageCount.current && isAutoScrollEnabled) {
      // Small timeout ensures DOM is updated before scrolling
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
      prevMessageCount.current = messages.length;
    }
  }, [messages, isAutoScrollEnabled]);

  // Track scroll position to determine if we should auto-scroll
  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const threshold = 100; // pixels from bottom
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    
    // Enable auto-scroll if within threshold of bottom
    setIsAutoScrollEnabled(distanceFromBottom <= threshold);
  };

  // Reset auto-scroll when changing chats
  useEffect(() => {
    setIsAutoScrollEnabled(true);
    // Scroll instantly to bottom when chat changes
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'auto'
      });
    }, 100);
  }, [currentUser]);

  // Set up read receipt observer
  useEffect(() => {
    if (!onMessageVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageIdStr = entry.target.getAttribute("data-message-id");
            const isRead = entry.target.getAttribute("data-read") === "true";
            const sender = entry.target.getAttribute("data-sender");

            if (messageIdStr && sender !== currentUser && !isRead) {
              const messageId = parseInt(messageIdStr);
              onMessageVisible(messageId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(messageRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [messages, onMessageVisible, currentUser]);

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getStatusIcon = (status?: MessageStatus) => {
    switch (status) {
      case "SENDING":
        return <span className="text-gray-400">🕒</span>;
      case "SENT":
        return <span className="text-gray-400">✓</span>;
      case "DELIVERED":
        return <span className="text-gray-400">✓✓</span>;
      case "READ":
        return <span className="flex items-center space-x-1 text-green-500">
          <span>✓✓</span>
          <span>👁️</span>
        </span>;
      case "FAILED":
        return <span className="text-red-500">✕</span>;
      default:
        return null;
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FaFile />;
    if (/\.(jpg|jpeg|png|gif)$/i.test(fileName)) return <FaFileImage />;
    if (/\.pdf$/i.test(fileName)) return <FaFilePdf />;
    if (/\.(doc|docx)$/i.test(fileName)) return <FaFileWord />;
    if (/\.(txt)$/i.test(fileName)) return <FaFileAlt />;
    return <FaFile />;
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-3"
      style={{ 
        maxHeight: 'calc(100vh - 200px)',
        scrollBehavior: 'smooth',
        overscrollBehavior: 'contain'
      }}
    >
      {messages.map((message) => {
        const key = message.id || message.tempId!;
        return (
          <div
            key={key}
            ref={(el) => { messageRefs.current[key] = el; }}
            data-message-id={message.id}
            data-sender={message.senderEmail}
            data-read={message.read}
            className={`flex ${message.senderEmail === currentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderEmail === currentUser
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.fileUrl ? (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <span className="text-lg">
                    {getFileIcon(message.fileName)}
                  </span>
                  <span className="underline truncate">{message.fileName}</span>
                </a>
              ) : (
                <p>{message.content}</p>
              )}
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                {message.senderEmail === currentUser && (
                  <span className="ml-2 text-xs">{getStatusIcon(message.status)}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div 
        ref={messagesEndRef} 
        style={{ 
          height: '1px',
          marginTop: '-1px' // Ensures we scroll all the way to the very bottom
        }} 
      />
    </div>
  );
}