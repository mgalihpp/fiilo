"use client";

import { App } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { orpc } from "@/lib/orpc/client";
import type { BoardDeal } from "./DealCard";
import PipelineColumn from "./PipelineColumn";

type Column = { stage: string; deals: BoardDeal[] };

export default function PipelineBoard() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<Column[]>([]);
  const dragged = useRef<string | null>(null);

  const { data, isLoading } = useQuery(orpc.deals.board.queryOptions());

  useEffect(() => {
    if (data) {
      setColumns(data.columns as Column[]);
    }
  }, [data]);

  const moveMutation = useMutation(
    orpc.deals.move.mutationOptions({
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.deals.board.queryOptions().queryKey,
        });
        message.error("Failed to move deal");
      },
    }),
  );

  const handleDrop = async (targetStage: string) => {
    const id = dragged.current;
    dragged.current = null;
    if (!id) return;

    const source = columns.find((c) => c.deals.some((d) => d.id === id));
    if (!source || source.stage === targetStage) return;
    const deal = source.deals.find((d) => d.id === id);
    if (!deal) return;

    const previous = columns;
    setColumns((cols) =>
      cols.map((c) => {
        if (c.stage === source.stage) {
          return { ...c, deals: c.deals.filter((d) => d.id !== id) };
        }
        if (c.stage === targetStage) {
          return { ...c, deals: [deal, ...c.deals] };
        }
        return c;
      }),
    );

    moveMutation.mutate(
      { id, stage: targetStage as never },
      { onError: () => setColumns(previous) },
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
        <PipelineColumn
          key={col.stage}
          stage={col.stage}
          deals={col.deals}
          onDragStart={(id) => {
            dragged.current = id;
          }}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
