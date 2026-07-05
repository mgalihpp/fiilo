"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { useEffect, useRef, useState } from "react";
import { orpc } from "@/lib/orpc/client";
import type { BoardTask } from "./TaskCard";
import TaskColumn from "./TaskColumn";

type Column = { status: string; tasks: BoardTask[] };

export default function TaskBoard() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<Column[]>([]);
  const dragged = useRef<string | null>(null);

  const { data, isLoading } = useQuery(orpc.tasks.board.queryOptions());

  useEffect(() => {
    if (data) {
      setColumns(data.columns as Column[]);
    }
  }, [data]);

  const moveMutation = useMutation(
    orpc.tasks.move.mutationOptions({
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.tasks.board.queryOptions().queryKey,
        });
        message.error("Failed to move task");
      },
    }),
  );

  const handleDrop = async (targetStatus: string) => {
    const id = dragged.current;
    dragged.current = null;
    if (!id) return;

    const source = columns.find((c) => c.tasks.some((t) => t.id === id));
    if (!source || source.status === targetStatus) return;
    const task = source.tasks.find((t) => t.id === id);
    if (!task) return;

    const previous = columns;
    setColumns((cols) =>
      cols.map((c) => {
        if (c.status === source.status) {
          return { ...c, tasks: c.tasks.filter((t) => t.id !== id) };
        }
        if (c.status === targetStatus) {
          return { ...c, tasks: [task, ...c.tasks] };
        }
        return c;
      }),
    );

    moveMutation.mutate(
      { id, status: targetStatus as never },
      {
        onError: () => setColumns(previous),
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: orpc.tasks.key() }),
      },
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        paddingBottom: 12,
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {columns.map((col) => (
        <TaskColumn
          key={col.status}
          status={col.status}
          tasks={col.tasks}
          onDragStart={(id) => {
            dragged.current = id;
          }}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
