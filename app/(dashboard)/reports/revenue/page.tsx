"use client";

import { Card, Row, Col, Button, Statistic } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc/client";

export default function RevenueReportsPage() {
  const { data: stats } = useQuery(
    orpc.reports.getDashboardStats.queryOptions({ input: {} }),
  );

  const { data: revenueData } = useQuery(
    orpc.reports.getRevenueData.queryOptions({ input: { groupBy: "day" } }),
  );

  const { data: winRateData } = useQuery(
    orpc.reports.getWinRate.queryOptions({ input: {} }),
  );

  const totalRevenue = stats?.totalRevenue ?? 0;
  const avgRevenue = revenueData
    ? revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length
    : 0;

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
            Revenue Reports
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
              title="Total Revenue"
              value={totalRevenue}
              prefix="$"
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Avg Daily Revenue"
              value={avgRevenue}
              prefix="$"
              precision={2}
              styles={{ content: { color: "#18181b", fontSize: 24 } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Growth Rate"
              value={stats?.revenueGrowth ?? 0}
              suffix="%"
              precision={1}
              styles={{
                content: {
                  color: (stats?.revenueGrowth ?? 0) >= 0 ? "#16a34a" : "#ef4444",
                  fontSize: 24,
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12, border: "1px solid #e4e4e7" }}>
            <Statistic
              title="Win Rate"
              value={winRateData?.winRate ?? 0}
              suffix="%"
              precision={1}
              styles={{ content: { color: "#ff5d30", fontSize: 24 } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Trend Chart */}
      <Card
        title="Revenue Trend (Last 30 Days)"
        style={{
          borderRadius: 12,
          border: "1px solid #e4e4e7",
        }}
      >
        {revenueData && revenueData.length > 0 ? (
          <div
            style={{
              height: 300,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              gap: 4,
              padding: "20px",
            }}
          >
            {revenueData.map((item, i) => {
              const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
              const height = (item.revenue / maxRevenue) * 250;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    minWidth: 0,
                  }}
                  title={`${item.date}: $${item.revenue.toLocaleString()}`}
                >
                  <div
                    style={{
                      height,
                      background: "#ff5d30",
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      color: "#71717a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              height: 300,
              display: "grid",
              placeItems: "center",
              color: "#a1a1aa",
            }}
          >
            No revenue data available
          </div>
        )}
      </Card>
    </div>
  );
}
