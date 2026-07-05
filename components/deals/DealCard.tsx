"use client";

import { Card, Tag, Typography } from "antd";

export type BoardDeal = {
  id: string;
  title: string;
  value: number;
  probability: number;
  lead: { contact: { name: string } } | null;
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function DealCard({
  deal,
  onDragStart,
}: {
  deal: BoardDeal;
  onDragStart: (id: string) => void;
}) {
  return (
    <Card
      size="small"
      draggable
      onDragStart={() => onDragStart(deal.id)}
      style={{ marginBottom: 8, cursor: "grab" }}
      styles={{ body: { padding: 12 } }}
    >
      <Typography.Text strong style={{ display: "block", marginBottom: 4 }}>
        {deal.title}
      </Typography.Text>
      {deal.lead?.contact?.name && (
        <Typography.Text
          type="secondary"
          style={{ display: "block", fontSize: 12, marginBottom: 8 }}
        >
          {deal.lead.contact.name}
        </Typography.Text>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography.Text strong>{fmtMoney(deal.value)}</Typography.Text>
        <Tag style={{ margin: 0 }}>{deal.probability}%</Tag>
      </div>
    </Card>
  );
}
