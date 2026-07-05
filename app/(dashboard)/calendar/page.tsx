"use client";

import { UnorderedListOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import type { BadgeProps } from "antd";
import { Badge, Button, Calendar, Space, Tag, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import { orpc } from "@/lib/orpc/client";

type CalTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | Date;
};

// Map a task's priority to a Badge status colour.
const PRIORITY_BADGE: Record<string, BadgeProps["status"]> = {
  LOW: "default",
  MEDIUM: "processing",
  HIGH: "warning",
  URGENT: "error",
};

export default function CalendarPage() {
  const { data } = useQuery(orpc.tasks.calendar.queryOptions());

  // Bucket tasks by YYYY-MM-DD for O(1) lookup per calendar cell.
  const byDay = useMemo(() => {
    const map = new Map<string, CalTask[]>();
    for (const t of (data ?? []) as CalTask[]) {
      const key = dayjs(t.dueDate).format("YYYY-MM-DD");
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    }
    return map;
  }, [data]);

  const dateCellRender = (value: Dayjs) => {
    const tasks = byDay.get(value.format("YYYY-MM-DD")) ?? [];
    if (tasks.length === 0) return null;

    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tasks.slice(0, 3).map((t) => (
          <li key={t.id} style={{ marginBottom: 2 }}>
            <Badge
              status={PRIORITY_BADGE[t.priority] ?? "default"}
              text={
                <span
                  style={{
                    fontSize: 12,
                    textDecoration:
                      t.status === "DONE" ? "line-through" : "none",
                    color: t.status === "DONE" ? "#a1a1aa" : "inherit",
                  }}
                >
                  {t.title}
                </span>
              }
            />
          </li>
        ))}
        {tasks.length > 3 && (
          <li>
            <Tag style={{ fontSize: 11 }}>+{tasks.length - 3} more</Tag>
          </li>
        )}
      </ul>
    );
  };

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Calendar
          </Typography.Title>
          <Typography.Text type="secondary">Tasks by due date</Typography.Text>
        </div>
        <Space>
          <Link href="/tasks">
            <Button icon={<UnorderedListOutlined />}>Task list</Button>
          </Link>
        </Space>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e4e4e7",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <Calendar cellRender={dateCellRender} />
      </div>
    </div>
  );
}
