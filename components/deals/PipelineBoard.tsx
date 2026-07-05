"use client";

import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { orpc } from "@/lib/orpc/client";
import type { BoardDeal } from "./DealCard";
import PipelineColumn from "./PipelineColumn";

type Column = { stage: string; deals: BoardDeal[] };

export default function PipelineBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const dragged = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orpc.deals.board();
      setColumns(res.columns as Column[]);
    } catch {
      message.error("Failed to load board");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDrop = async (targetStage: string) => {
    const id = dragged.current;
    dragged.current = null;
    if (!id) return;

    const source = columns.find((c) => c.deals.some((d) => d.id === id));
    if (!source || source.stage === targetStage) return;
    const deal = source.deals.find((d) => d.id === id);
    if (!deal) return;

    // Optimistic move; revert on failure.
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

    try {
      await orpc.deals.move({ id, stage: targetStage as never });
    } catch {
      setColumns(previous);
      message.error("Failed to move deal");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        paddingBottom: 12,
        opacity: loading ? 0.6 : 1,
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
