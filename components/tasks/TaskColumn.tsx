"use client";

import { Typography } from "antd";
import { useState } from "react";
import TaskCard, { type BoardTask } from "./TaskCard";

// Human-readable labels for the status keys.
const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskColumn({
  status,
  tasks,
  onDragStart,
  onDrop,
}: {
  status: string;
  tasks: BoardTask[];
  onDragStart: (id: string) => void;
  onDrop: (status: string) => void;
}) {
  const [over, setOver] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: HTML5 drag-drop zone; no semantic role fits a column drop target.
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={() => {
        setOver(false);
        onDrop(status);
      }}
      style={{
        flex: "0 0 300px",
        width: 300,
        background: over ? "#f0f0f0" : "#faf9f8",
        border: `1px solid ${over ? "#18181b" : "#e4e4e7"}`,
        borderRadius: 10,
        padding: 12,
        transition: "all 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Typography.Text strong style={{ fontSize: 13 }}>
          {STATUS_LABELS[status] ?? status}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {tasks.length}
        </Typography.Text>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
      ))}

      {tasks.length === 0 && (
        <div
          style={{
            padding: "24px 0",
            textAlign: "center",
            color: "#a1a1aa",
            fontSize: 12,
          }}
        >
          Drop tasks here
        </div>
      )}
    </div>
  );
}
