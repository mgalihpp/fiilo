"use client";

import { Button, Space, Typography } from "antd";
import Link from "next/link";
import PipelineBoard from "@/components/deals/PipelineBoard";

export default function PipelinePage() {
  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Pipeline
          </Typography.Title>
          <Typography.Text type="secondary">
            Drag deals between stages to update them.
          </Typography.Text>
        </div>
        <Space>
          <Link href="/deals">
            <Button>List view</Button>
          </Link>
        </Space>
      </div>

      <PipelineBoard />
    </div>
  );
}
