"use client";

import { Row, Col, Card, Table, Tag, Button } from "antd";
import {
  CalendarOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

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
            Mar 25, 2025
          </Button>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            style={{
              borderRadius: 8,
              background: "#18181b",
              borderColor: "#18181b",
            }}
          >
            AI Support
          </Button>
        </div>
      </div>

      <Row gutter={[20, 20]}>
        {/* Left column - Revenue + Monthly Sales + Contact Table */}
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
                  $46,526.08
                </span>
                <span style={{ fontSize: 14, color: "#a1a1aa" }}>
                  Revenue last month $49,236.00
                </span>
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "#f0fdf4",
                  color: "#16a34a",
                  fontSize: 13,
                  fontWeight: 500,
                  marginTop: 8,
                }}
              >
                <ArrowUpOutlined /> +55.06%
              </div>
            </div>

            {/* Progress bars */}
            <div style={{ display: "flex", gap: 4, height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ flex: 3, background: "#a78bfa", borderRadius: 6 }} />
              <div style={{ flex: 4, background: "#fb923c", borderRadius: 6 }} />
              <div style={{ flex: 2, background: "#f472b6", borderRadius: 6 }} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#71717a",
              }}
            >
              <span>Next target to achieve</span>
              <span style={{ fontWeight: 500, color: "#18181b" }}>$55,236.29</span>
            </div>
          </Card>

          {/* Monthly Sales Card */}
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
                Monthly sales
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <Button size="small" style={{ borderRadius: 6, border: "1px solid #e4e4e7" }}>
                  Weekly
                </Button>
                <Button
                  size="small"
                  type="primary"
                  style={{ borderRadius: 6, background: "#18181b", borderColor: "#18181b" }}
                >
                  Monthly
                </Button>
              </div>
            </div>

            {/* Placeholder chart area */}
            <div
              style={{
                height: 240,
                background: "#faf9f8",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a1a1aa",
                fontSize: 14,
              }}
            >
              Chart placeholder
            </div>
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

        {/* Right column - Sales Overview + Returning Visits */}
        <Col xs={24} lg={8}>
          {/* Sales Overview Card */}
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: "#18181b", marginBottom: 8 }}>
              Sales overview
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: "#18181b" }}>$18,000</span>
              <span style={{ fontSize: 13, color: "#16a34a" }}>+28.09% ↗</span>
            </div>

            {/* Bar chart placeholder */}
            <div
              style={{
                height: 160,
                background: "#faf9f8",
                borderRadius: 8,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 16,
                padding: "16px 24px",
                marginBottom: 16,
              }}
            >
              {[40, 60, 80, 100, 70, 90].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: `${h}%`,
                    borderRadius: 4,
                    background: i % 2 === 0 ? "#a78bfa" : "#fb923c",
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Total proposal", value: "140K", color: "#a78bfa" },
                { label: "Total qualified", value: "150K", color: "#3b82f6" },
                { label: "Closed won", value: "120K", color: "#fb923c" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 13, color: "#52525b" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#18181b" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Returning Visits Card */}
          <Card
            title="Returning visits"
            style={{
              borderRadius: 12,
              border: "1px solid #e4e4e7",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { month: "July", pct: 45, color: "#fb923c" },
                { month: "October", pct: 36, color: "#a78bfa" },
              ].map((item) => (
                <div key={item.month}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: "#18181b" }}>{item.month}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#18181b" }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f4f4f5", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${item.pct}%`,
                        height: "100%",
                        background: item.color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              block
              style={{
                marginTop: 20,
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                color: "#52525b",
              }}
            >
              See All Visits
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
