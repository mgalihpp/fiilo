"use client";

import { Card, Tag, Typography } from "antd";

export type BoardTask = {
  id: string;
  title: string;
  priority: string;
  dueDate: string | Date | null;
  lead: { contact: { name: string } } | null;
  deal: { title: string } | null;
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: "default",
  MEDIUM: "blue",
  HIGH: "orange",
  URGENT: "red",
};

const fmtDate = (d: string | Date | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

export default function TaskCard({
  task,
  onDragStart,
}: {
  task: BoardTask;
  onDragStart: (id: string) => void;
}) {
  const link = task.lead?.contact?.name ?? task.deal?.title ?? null;
  const due = fmtDate(task.dueDate);

  return (
    <Card
      size="small"
      draggable
      onDragStart={() => onDragStart(task.id)}
      style={{ marginBottom: 8, cursor: "grab" }}
      styles={{ body: { padding: 12 } }}
    >
      <Typography.Text strong style={{ display: "block", marginBottom: 4 }}>
        {task.title}
      </Typography.Text>
      {link && (
        <Typography.Text
          type="secondary"
          style={{ display: "block", fontSize: 12, marginBottom: 8 }}
        >
          {link}
        </Typography.Text>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tag color={PRIORITY_COLORS[task.priority]} style={{ margin: 0 }}>
          {task.priority}
        </Tag>
        {due && (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {due}
          </Typography.Text>
        )}
      </div>
    </Card>
  );
}
