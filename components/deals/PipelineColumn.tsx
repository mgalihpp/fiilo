"use client";

import { Typography } from "antd";
import { useState } from "react";
import DealCard, { type BoardDeal } from "./DealCard";

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function PipelineColumn({
  stage,
  deals,
  onDragStart,
  onDrop,
}: {
  stage: string;
  deals: BoardDeal[];
  onDragStart: (id: string) => void;
  onDrop: (stage: string) => void;
}) {
  const [over, setOver] = useState(false);
  const columnTotal = deals.reduce((sum, d) => sum + d.value, 0);

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
        onDrop(stage);
      }}
      style={{
        flex: "0 0 280px",
        width: 280,
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
          {stage}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {deals.length} · {fmtMoney(columnTotal)}
        </Typography.Text>
      </div>

      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} onDragStart={onDragStart} />
      ))}

      {deals.length === 0 && (
        <div
          style={{
            padding: "24px 0",
            textAlign: "center",
            color: "#a1a1aa",
            fontSize: 12,
          }}
        >
          Drop deals here
        </div>
      )}
    </div>
  );
}
