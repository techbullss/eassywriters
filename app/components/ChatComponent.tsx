"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import React, { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiUsers,
  FiFile
} from "react-icons/fi";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAlt,
  FaFile
} from "react-icons/fa";
import MessageList from "./MessageList";

interface Message {
  senderEmail: string;
  recipientEmail: string;
  content: string;
  timestamp: string;
  status?: "SENT" | "DELIVERED" | "READ" | "FAILED";
  fileUrl?: string;
  fileName?: string;
  isread?: boolean;
  delivered?: boolean;
  messageId?: number;
}

interface User {
  email: string;
  name?: string;
  avatar?: string;
  online?: boolean;
  unreadCount?: number;
}

export default function ChatComponent({ currentUser }: { currentUser: string }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [inbox, setInbox] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const selectedUserRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const clientRef = useRef<Client | null>(null);

  const getFileIcon = (fileName: string) => {
    if (fileName?.match(/\.(jpg|jpeg|png|gif)$/i)) return <FaFileImage />;
    if (fileName?.match(/\.pdf$/i)) return <FaFilePdf />;
    if (fileName?.match(/\.(doc|docx)$/i)) return <FaFileWord />;
    if (fileName?.match(/\.(txt)$/i)) return <FaFileAlt />;
    return <FaFile />;
  };

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    connectWebSocket();
    fetchAllUsers();
    fetchInbox();
    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser);
  }, [selectedUser]);

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?email=${currentUser}`),
      reconnectDelay: 5000,
      debug: (str) => console.log("🔧 STOMP DEBUG:", str),
      onConnect: () => {
        console.log("🟢 WebSocket connected");

        client.subscribe("/user/queue/messages", async (msg) => {
          try {
            const incoming: Message = JSON.parse(msg.body);
            const sel = selectedUserRef.current;
            if (
              incoming.senderEmail === sel ||
              incoming.recipientEmail === sel
            ) {
              setMessages((prev) => {
                const exists = prev.some((m) => m.timestamp === incoming.timestamp);
                return exists ? prev : [...prev, incoming];
              });
            }
            await markAsRead(incoming);
            await fetch("http://localhost:8080/api/messages/mark-delivered", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messageId: incoming.messageId })
  });
            fetchInbox();
          } catch (err) {
            console.error("❌ Failed to parse message:", err);
          }
        });

        client.subscribe("/user/queue/typing", (msg) => {
          const { from } = JSON.parse(msg.body);
          if (from === selectedUserRef.current) {
            setIsTyping(true);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
          }
        });
      },
    });

    client.activate();
    clientRef.current = client;
  };

  const fetchAllUsers = async () => {
    const res = await fetch("http://localhost:8080/api/users");
    const data = await res.json();
    setAllUsers(data.filter((u: User) => u.email !== currentUser));
  };

  const fetchInbox = async () => {
    const res = await fetch(`http://localhost:8080/api/messages/inbox?email=${currentUser}`);
    const data = await res.json();
    setInbox(data);
  };

  const fetchMessages = async (targetEmail: string) => {
    const params = new URLSearchParams({
      senderEmail: currentUser,
      recipientEmail: targetEmail,
    });
    const res = await fetch(`http://localhost:8080/api/messages/msg?${params.toString()}`);
    const data = await res.json();
    setMessages(data);
    await markAsRead({ senderEmail: targetEmail, recipientEmail: currentUser });
  };

  const markAsRead = async (msg: Partial<Message>) => {
    await fetch(`http://localhost:8080/api/messages/isread`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderEmail: msg.senderEmail,
        recipientEmail: msg.recipientEmail,
      }),
    });
  };

  const handleTyping = () => {
    if (clientRef.current?.connected && selectedUser) {
      clientRef.current.publish({
        destination: "/app/typing",
        body: JSON.stringify({
          from: currentUser,
          to: selectedUser,
        }),
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || (!newMessage.trim() && !file)) return;

    const msg: Message = {
      senderEmail: currentUser,
      recipientEmail: selectedUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "SENT",
    };

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("senderEmail", msg.senderEmail);
      formData.append("recipientEmail", msg.recipientEmail);
      formData.append("content", msg.content);

      const res = await fetch("http://localhost:8080/api/messages/sendfile", {
        method: "POST",
        body: formData,
      });

      const saved = await res.json();
      setMessages((prev) => [...prev, saved]);
      setFile(null);
    } else {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: "/app/send",
          body: JSON.stringify(msg),
        });
      }
      setMessages((prev) => [...prev, msg]);
    }

    setNewMessage("");
  };

  const getUserInitials = (email: string) => email.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 border-r border-gray-200 bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto p-2 space-y-1">
          {inbox.map((user) => (
            <div
              key={user.email}
              onClick={() => setSelectedUser(user.email)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUser === user.email ? "bg-blue-100" : "hover:bg-gray-50"}`}
            >
              <div className="relative h-10 w-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                {getUserInitials(user.email)}
                {user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm">{user.email}</p>
                {user.unreadCount ? (
                  <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    {user.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  {getUserInitials(selectedUser)}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg">{selectedUser}</h3>
                  {isTyping && <p className="text-xs text-gray-400">Typing…</p>}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <MessageList messages={messages} currentUser={currentUser} />
            </div>

            {file && (
              <div className="mb-2 p-2 bg-gray-100 border rounded flex items-center space-x-2 mx-4">
                <div className="text-blue-500 text-xl">
                  {getFileIcon(file.name)}
                </div>
                <p className="text-sm text-gray-800 truncate max-w-xs">
                  {file.name}
                </p>
                <button onClick={() => setFile(null)} className="text-red-500 text-xs">
                  Remove
                </button>
              </div>
            )}

            <div className="p-4 border-t bg-white flex items-center space-x-2">
              <label className="cursor-pointer px-3">
                <FiFile className="text-gray-500" />
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="flex-1 resize-none border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none max-h-40 overflow-y-auto"
                rows={1}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a user to start chatting.</p>
          </div>
        )}
      </div>

      <div className="w-1/4 border-l border-gray-200 bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <FiUsers className="mr-2" /> All Users
          </h2>
        </div>
        <div className="overflow-y-auto p-2 space-y-1">
          {allUsers.map((user) => (
            <div
              key={user.email}
              onClick={() => setSelectedUser(user.email)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUser === user.email ? "bg-blue-100" : "hover:bg-gray-50"}`}
            >
              <div className="relative h-10 w-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full">
                {getUserInitials(user.email)}
                {user.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
