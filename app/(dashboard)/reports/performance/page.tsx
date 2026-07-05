"use client";

import { Card, Row, Col, Button, Statistic, Table } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";
import type { ColumnsType } from "antd/es/table";

interface Activity {
  id: string;
  type: string;
  description: string;
  leadName?: string;
  dealName?: string;
  createdAt: Date | string;
}

export default function PerformanceReportsPage() {
  const { data: stats } = useQuery(
    orpc.reports.getDashboardStats.queryOptions({ input: {} }),
  );

  const { data: winRateData } = useQuery(
    orpc.reports.getWinRate.queryOptions({ input: {} }),
  );

  const { data: activities } = useQuery(
    orpc.reports.getActivityFeed.queryOptions({ input: { limit: 10 } }),
  );

  const activityColumns: ColumnsType<Activity> = [
    {
      title: "Activity",
      dataIndex: "description",
      key: "description",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
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
            Performance
          </h1>
        </div>
        <Button type="primary" icon={<DownloadOutlined />}>
          Export PDF
        </Button>
      </div>

      {/* KPI Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Total Contacts"
              value={stats?.totalContacts ?? 0}
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Total Deals"
              value={stats?.totalDeals ?? 0}
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Pipeline Value"
              value={stats?.pipelineValue ?? 0}
              prefix="$"
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Recent Activities"
              value={stats?.recentActivities ?? 0}
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Win/Loss Analysis */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Deal Outcomes"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            {winRateData && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#71717a", marginBottom: 8 }}>Deals Won</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>
                      {winRateData.won}
                    </span>
                    <span style={{ fontSize: 13, color: "#71717a" }}>
                      {((winRateData.won / winRateData.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div style={{ height: 1, background: "#e4e4e7" }} />

                <div>
                  <div style={{ fontSize: 13, color: "#71717a", marginBottom: 8 }}>Deals Lost</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>
                      {winRateData.lost}
                    </span>
                    <span style={{ fontSize: 13, color: "#71717a" }}>
                      {((winRateData.lost / winRateData.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div style={{ height: 1, background: "#e4e4e7" }} />

                <div
                  style={{
                    padding: "12px",
                    background: "#f4f4f5",
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#71717a", marginBottom: 8 }}>Win Rate</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#ff5d30" }}>
                    {winRateData.winRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={16}>
          <Card
            title="Recent Activities"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            <Table<Activity>
              columns={activityColumns}
              dataSource={activities ?? []}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
