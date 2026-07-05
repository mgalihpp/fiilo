"use client";

import { Card, Row, Col, Button, Tabs, Space } from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export default function ReportsPage() {
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
          Reports
        </h1>
        <Space>
          <Button type="primary" icon={<DownloadOutlined />}>
            Export All
          </Button>
        </Space>
      </div>

      {/* Reports Grid */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={8}>
          <Link href="/reports/sales" style={{ textDecoration: "none" }}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                <BarChartOutlined style={{ fontSize: 40, color: "#ff5d30", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#18181b", margin: 0 }}>
                  Sales Reports
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", marginTop: 8 }}>
                  Sales by period, rep, and pipeline stage
                </p>
              </div>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link href="/reports/revenue" style={{ textDecoration: "none" }}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                <LineChartOutlined style={{ fontSize: 40, color: "#3b82f6", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#18181b", margin: 0 }}>
                  Revenue Reports
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", marginTop: 8 }}>
                  Revenue trends and forecasts
                </p>
              </div>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Link href="/reports/performance" style={{ textDecoration: "none" }}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                border: "1px solid #e4e4e7",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                <TeamOutlined style={{ fontSize: 40, color: "#10b981", marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#18181b", margin: 0 }}>
                  Performance
                </h3>
                <p style={{ fontSize: 13, color: "#71717a", marginTop: 8 }}>
                  Team metrics and KPIs
                </p>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
