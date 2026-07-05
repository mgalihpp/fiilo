"use client";

import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Dropdown, Input, Spin, Typography } from "antd";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { orpc } from "@/lib/orpc/client";
import type { UIMessage } from "@ai-sdk/react";

// Sparkles glyph (inline SVG — antd has no sparkles icon).
function SparklesIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2z" />
      <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14z" />
      <path d="M5 14l.7 1.8L7.5 16.5 5.7 17 5 19l-.7-2L2.5 16.5 4.3 15.8 5 14z" />
    </svg>
  );
}

// ─── Palette ───────────────────────────────────────────────────────────
// Buttons stay black; accents use the app's orange logo tint (transparent).
const COLORS = {
  sidebarBg: "#fafafa",
  border: "#eeeeee",
  hairline: "#eeeeee",
  ink: "#18181b",
  mute: "#71717a",
  black: "#18181b",
  accent: "#ff5d30",
  accentSoft: "rgba(255, 93, 48, 0.12)",
  userBubble: "#f4f4f5",
  aiBubble: "rgba(255, 93, 48, 0.08)",
};

const blackBtn = {
  background: COLORS.black,
  borderColor: COLORS.black,
  color: "#fff",
};

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(d: Date): string {
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diff < 172800000) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

// ─── Empty state (main panel) ──────────────────────────────────────────
function EmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: COLORS.accentSoft,
            display: "grid",
            placeItems: "center",
            margin: "0 auto 20px",
          }}
        >
          <MessageOutlined style={{ fontSize: 34, color: COLORS.accent }} />
        </div>
        <Typography.Title level={3} style={{ margin: 0, color: COLORS.ink }}>
          Start a conversation
        </Typography.Title>
        <Typography.Paragraph
          type="secondary"
          style={{ marginTop: 8, fontSize: 15, maxWidth: 340 }}
        >
          Ask about your leads, deals, invoices or next best actions.
        </Typography.Paragraph>
      </div>
    </div>
  );
}

// ─── Chat Area ────────────────────────────────────────────────────────
function ChatInner({ sessionId }: { sessionId: string }) {
  const isNew = sessionId === "new";

  const { data: sessionData, isLoading } = useQuery({
    ...orpc.chat.getSession.queryOptions({ input: { id: sessionId } }),
    enabled: !isNew,
  });

  const initialMessages: UIMessage[] | undefined = useMemo(() => {
    if (!sessionData) return undefined;
    return sessionData.messages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      parts: [{ type: "text" as const, text: m.content }],
    }));
  }, [sessionData]);

  if (!isNew && isLoading) {
    return (
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <Spin />
      </div>
    );
  }

  return (
    <_Chat key={sessionId} sessionId={sessionId} initialMessages={initialMessages} />
  );
}

function _Chat({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages?: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { sessionId: sessionId === "new" ? undefined : sessionId },
    }),
    id: sessionId,
    messages: initialMessages,
    onFinish: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.chat.listSessions.queryKey(),
      });
    },
  });

  const busy = status === "submitted" || status === "streaming";

  const submit = () => {
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "24px 32px",
        }}
      >
        {messages.length === 0 && <EmptyState />}
        {messages.map((m) => {
          const text = m.parts
            .filter((p) => p.type === "text")
            .map((p: any) => p.text)
            .join("");
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                gap: 12,
                flexDirection: isUser ? "row-reverse" : "row",
                alignItems: "flex-start",
              }}
            >
              <Avatar
                size={32}
                src={isUser ? user?.imageUrl : undefined}
                icon={isUser ? <UserOutlined /> : <SparklesIcon size={16} />}
                style={{
                  background: isUser ? COLORS.black : COLORS.accentSoft,
                  color: isUser ? "#fff" : COLORS.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  maxWidth: "70%",
                  background: isUser ? COLORS.userBubble : COLORS.aiBubble,
                  padding: "10px 16px",
                  borderRadius: 16,
                  borderBottomLeftRadius: isUser ? 16 : 4,
                  borderBottomRightRadius: isUser ? 4 : 16,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  fontSize: 14,
                  color: COLORS.ink,
                }}
              >
                {text || "…"}
              </div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.hairline}`,
          padding: "16px 32px 24px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-end",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <Input.TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 5 }}
            style={{ borderRadius: 14, padding: "12px 16px", fontSize: 15 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={busy}
            onClick={submit}
            style={{
              ...blackBtn,
              width: 52,
              height: 52,
              borderRadius: 14,
              flexShrink: 0,
              fontSize: 18,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AiChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(
    null,
  );
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery(orpc.chat.listSessions.queryOptions());

  const invalidateSessions = () =>
    queryClient.invalidateQueries({ queryKey: orpc.chat.listSessions.queryKey() });

  const renameMutation = useMutation({
    ...orpc.chat.renameSession.mutationOptions(),
    onSuccess: () => {
      invalidateSessions();
      setRenameTarget(null);
    },
  });

  const deleteMutation = useMutation({
    ...orpc.chat.deleteSession.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.chat.listSessions.queryKey(),
      });
    },
  });

  const createMutation = useMutation({
    ...orpc.chat.createSession.mutationOptions(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: orpc.chat.listSessions.queryKey(),
      });
      setActiveSessionId(data.id);
    },
  });

  const handleNew = () => createMutation.mutate({} as never);
  const handleSelect = (id: string) => setActiveSessionId(id);

  const commitRename = () => {
    const title = renameTarget?.title.trim();
    if (renameTarget && title)
      renameMutation.mutate({ id: renameTarget.id, title });
    else setRenameTarget(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100% + 48px)",
        margin: -24,
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 300,
          flexShrink: 0,
          background: COLORS.sidebarBg,
          borderRight: `1px solid ${COLORS.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "18px 18px 14px" }}>
          <Typography.Title
            level={5}
            style={{ margin: 0, fontSize: 16, color: COLORS.ink }}
          >
            Chat History
          </Typography.Title>
        </div>

        <div style={{ padding: "0 16px 14px" }}>
          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNew}
            loading={createMutation.isPending}
            style={{ ...blackBtn, borderRadius: 12, height: 44, fontWeight: 500 }}
          >
            New Chat
          </Button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 10px 12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {sessions.map((s) => {
            const active = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className="chat-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: active ? COLORS.accentSoft : "transparent",
                  transition: "background 0.15s",
                  position: "relative",
                  marginBottom: 2,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "#f2f2f2";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {renameTarget?.id === s.id ? (
                    <Input
                      size="small"
                      autoFocus
                      value={renameTarget.title}
                      maxLength={100}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setRenameTarget((t) =>
                          t ? { ...t, title: e.target.value } : t,
                        )
                      }
                      onPressEnter={commitRename}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setRenameTarget(null);
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: active ? 600 : 400,
                          color: COLORS.ink,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {s.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: COLORS.mute,
                          marginTop: 2,
                          display: "flex",
                          gap: 8,
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                          }}
                        >
                          {s.lastMessage ?? "No messages"}
                        </span>
                        <span style={{ flexShrink: 0 }}>
                          {formatDate(new Date(s.createdAt))}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: "rename",
                        icon: <EditOutlined />,
                        label: "Rename",
                        onClick: ({ domEvent }) => {
                          domEvent.stopPropagation();
                          setRenameTarget({ id: s.id, title: s.title });
                        },
                      },
                      {
                        key: "delete",
                        icon: <DeleteOutlined />,
                        label: "Delete",
                        danger: true,
                        onClick: ({ domEvent }) => {
                          domEvent.stopPropagation();
                          deleteMutation.mutate({ id: s.id });
                          if (active) setActiveSessionId(null);
                        },
                      },
                    ],
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="chat-more"
                    style={{
                      color: COLORS.mute,
                      cursor: "pointer",
                      padding: 4,
                      borderRadius: 6,
                      flexShrink: 0,
                    }}
                  >
                    <MoreOutlined style={{ fontSize: 16 }} />
                  </div>
                </Dropdown>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "grid",
                placeItems: "center",
                color: COLORS.mute,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <MessageOutlined
                  style={{ fontSize: 30, color: "#d4d4d8", marginBottom: 10 }}
                />
                <div style={{ fontSize: 13 }}>No conversations yet</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Chat (input always visible) ── */}
      <ChatInner sessionId={activeSessionId ?? "new"} />
    </div>
  );
}
