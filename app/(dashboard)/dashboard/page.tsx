"use client";

import { Row, Col, Card, Table, Tag, Button, Spin, Statistic } from "antd";
import {
  CalendarOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  TeamOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

interface Contact {
  key: string;
  name: string;
  company: string;
  status: "Active" | "Inactive";
  value: string;
}

const contactData: Contact[] = [
  { key: "1", name: "Jacob Jones", company: "AcmecropTech", status: "Active", value: "Traffic" },
  { key: "2", name: "Guy Hawkins", company: "Nexivo", status: "Inactive", value: "Traffic" },
];

const contactColumns: ColumnsType<Contact> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  { title: "Company", dataIndex: "company", key: "company" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
    ),
  },
  { title: "Value", dataIndex: "value", key: "value" },
];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    orpc.reports.getDashboardStats.queryOptions({ input: {} }),
  );

  const { data: revenueData } = useQuery(
    orpc.reports.getRevenueData.queryOptions({
      input: { groupBy: "day" },
    }),
  );

  const { data: pipelineData } = useQuery(
    orpc.reports.getDealPipelineData.queryOptions({ input: {} }),
  );

  const { data: activities } = useQuery(
    orpc.reports.getActivityFeed.queryOptions({ input: { limit: 5 } }),
  );

  const { data: winRateData } = useQuery(
    orpc.reports.getWinRate.queryOptions({ input: {} }),
  );
  if (statsLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  const growthColor = (stats?.revenueGrowth ?? 0) >= 0 ? "#16a34a" : "#ef4444";

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
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#18181b",
            margin: 0,
          }}
        >
          Analytics
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            icon={<CalendarOutlined />}
            style={{
              borderRadius: 8,
              border: "1px solid #e4e4e7",
              color: "#52525b",
            }}
          >
            Last 30 days
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Total Revenue"
              value={stats?.totalRevenue ?? 0}
              prefix="$"
              styles={{ content: { color: "#18181b" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Contacts"
              value={stats?.totalContacts ?? 0}
              styles={{ content: { color: "#18181b" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Active Deals"
              value={stats?.totalDeals ?? 0}
              styles={{ content: { color: "#18181b" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Pipeline Value"
              value={stats?.pipelineValue ?? 0}
              prefix="$"
              styles={{ content: { color: "#18181b" } }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        {/* Left column - Revenue + Pipeline + Contact Table */}
        <Col xs={24} lg={16}>
          {/* Total Revenue Card */}
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              marginBottom: 20,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: "#71717a", marginBottom: 8 }}>
                Total revenue
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 600, color: "#18181b" }}>
                  ${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
                <span style={{ fontSize: 14, color: "#a1a1aa" }}>
                  vs last month ${(stats?.prevRevenue ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: growthColor === "#16a34a" ? "#f0fdf4" : "#fee2e2",
                  color: growthColor,
                  fontSize: 13,
                  fontWeight: 500,
                  marginTop: 8,
                }}
              >
                <ArrowUpOutlined /> {Math.round(stats?.revenueGrowth ?? 0)}%
              </div>
            </div>
          </Card>

          {/* Revenue Trend */}
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: "#18181b" }}>
                Revenue Trend
              </span>
            </div>

            {/* Simple bar chart */}
            {revenueData && revenueData.length > 0 ? (
              <div
                style={{
                  height: 240,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-around",
                  gap: 8,
                  padding: "20px",
                  borderRadius: 8,
                }}
              >
                {revenueData.slice(-7).map((item, i) => {
                  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
                  const height = (item.revenue / maxRevenue) * 200;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div
                        style={{
                          height,
                          background: "#ff5d30",
                          borderRadius: 4,
                          marginBottom: 8,
                        }}
                      />
                      <div style={{ fontSize: 11, color: "#71717a" }}>
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  height: 240,
                  background: "#faf9f8",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a1a1aa",
                }}
              >
                No revenue data
              </div>
            )}
          </Card>

          {/* Contact Table Card */}
          <Card
            title="Manage your contact"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            <Table<Contact>
              columns={contactColumns}
              dataSource={contactData}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Right column - Deal Pipeline + Win Rate */}
        <Col xs={24} lg={8}>
          {/* Deal Pipeline Card */}
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: "#18181b", marginBottom: 16 }}>
              Pipeline Stages
            </div>

            {pipelineData && pipelineData.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pipelineData.map((stage) => (
                  <div key={stage.stage}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#18181b", fontWeight: 500 }}>
                        {stage.stage}
                      </span>
                      <span style={{ fontSize: 13, color: "#71717a" }}>
                        ${(stage.value / 1000).toFixed(1)}K ({stage.count})
                      </span>
                    </div>
                    <div style={{ height: 6, background: "#f4f4f5", borderRadius: 3, overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${((stage.value / (pipelineData.reduce((sum, s) => sum + s.value, 0) || 1)) * 100).toFixed(0)}%`,
                          height: "100%",
                          background: "#ff5d30",
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#a1a1aa", padding: "20px" }}>
                No deals in pipeline
              </div>
            )}
          </Card>

          {/* Win Rate Card */}
          {winRateData && (
            <Card
              style={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, color: "#18181b", marginBottom: 16 }}>
                Win Rate Analysis
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>
                    {winRateData.won}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>Deals Won</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>
                    {winRateData.lost}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>Deals Lost</div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "12px",
                  background: "#f4f4f5",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: "#ff5d30" }}>
                  {winRateData.winRate.toFixed(1)}%
                </div>
                <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>Win Rate</div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
