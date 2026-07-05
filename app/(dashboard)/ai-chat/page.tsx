"use client";

import { useChat } from "@ai-sdk/react";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Typography } from "antd";
import { useState } from "react";

export default function AiChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const busy = status === "submitted" || status === "streaming";

  const submit = () => {
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
    >
      <Typography.Title level={3} style={{ marginBottom: 16 }}>
        AI Assistant
      </Typography.Title>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingRight: 8,
        }}
      >
        {messages.length === 0 && (
          <Typography.Text type="secondary">
            Ask about your leads, deals, invoices or next best actions.
          </Typography.Text>
        )}
        {messages.map((m) => {
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                gap: 12,
                flexDirection: isUser ? "row-reverse" : "row",
              }}
            >
              <Avatar style={{ background: isUser ? "#18181b" : "#6366f1" }}>
                {isUser ? "U" : "AI"}
              </Avatar>
              <div
                style={{
                  maxWidth: "70%",
                  background: isUser ? "#f4f4f5" : "#eef2ff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  whiteSpace: "pre-wrap",
                }}
              >
                {text || "…"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Type a message…"
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={busy}
          onClick={submit}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
