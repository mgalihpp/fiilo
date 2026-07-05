"use client";

import { Card, Row, Col, Table, Button, Space, Tag } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";
import type { ColumnsType } from "antd/es/table";

interface SalesRep {
  rep: string;
  deals: number;
  revenue: number;
}

export default function SalesReportsPage() {
  const { data: salesByRep } = useQuery(
    orpc.reports.getSalesByRep.queryOptions({ input: {} }),
  );

  const { data: pipelineData } = useQuery(
    orpc.reports.getDealPipelineData.queryOptions({ input: {} }),
  );

  const columns: ColumnsType<SalesRep> = [
    {
      title: "Sales Rep",
      dataIndex: "rep",
      key: "rep",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Deals Closed",
      dataIndex: "deals",
      key: "deals",
      render: (num) => <span>{num}</span>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (num) => <span>${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>,
    },
  ];

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/reports">
            <Button type="text" icon={<ArrowLeftOutlined />}>
              Back
            </Button>
          </Link>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#18181b",
              margin: 0,
            }}
          >
            Sales Reports
          </h1>
        </div>
        <Button type="primary" icon={<DownloadOutlined />}>
          Export CSV
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        {/* Sales by Rep */}
        <Col xs={24} lg={16}>
          <Card
            title="Sales by Representative"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            <Table<SalesRep>
              columns={columns}
              dataSource={salesByRep ?? []}
              pagination={false}
              rowKey="rep"
            />
          </Card>
        </Col>

        {/* Pipeline Summary */}
        <Col xs={24} lg={8}>
          <Card
            title="Pipeline Breakdown"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            {pipelineData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pipelineData.map((stage) => (
                  <div
                    key={stage.stage}
                    style={{
                      padding: "12px",
                      background: "#f4f4f5",
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, color: "#18181b" }}>{stage.stage}</span>
                      <Tag color="blue">{stage.count}</Tag>
                    </div>
                    <div style={{ fontSize: 13, color: "#71717a" }}>
                      ${(stage.value / 1000).toFixed(1)}K value
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#a1a1aa" }}>No data available</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
