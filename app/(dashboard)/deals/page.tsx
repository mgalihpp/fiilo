"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DataTable from "@/components/ui/DataTable";
import StatsCard from "@/components/ui/StatsCard";
import { orpc } from "@/lib/orpc/client";
import { DEAL_STAGES } from "@/lib/schemas/deal";

type Deal = {
  id: string;
  title: string;
  stage: string;
  value: number;
  currency: string;
  probability: number;
  leadId: string | null;
  lead: { contact: { name: string } } | null;
};

const STAGE_OPTIONS = DEAL_STAGES.map((s) => ({ label: s, value: s }));

const STAGE_COLORS: Record<string, string> = {
  DISCOVERY: "blue",
  PROPOSAL: "gold",
  NEGOTIATION: "orange",
  WON: "green",
  LOST: "red",
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function DealsPage() {
  const [data, setData] = useState<Deal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState<string | undefined>();
  const [stats, setStats] = useState({
    totalDeals: 0,
    openValue: 0,
    wonValue: 0,
    winRate: 0,
  });
  const [leads, setLeads] = useState<{ label: string; value: string }[]>([]);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([
        orpc.deals.list({ page, pageSize: 10, stage: stage as never }),
        orpc.deals.stats(),
      ]);
      setData(res.items as Deal[]);
      setTotal(res.total);
      setStats(s);
    } catch {
      message.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, [page, stage]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = async () => {
    setEditing(null);
    // Load leads for the optional link dropdown.
    const res = await orpc.leads.list({ page: 1, pageSize: 100 });
    setLeads(
      res.items.map((l) => ({
        label: l.contact?.name ?? "Lead",
        value: l.id,
      })),
    );
    setOpen(true);
  };

  const openEdit = (d: Deal) => {
    setEditing(d);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await orpc.deals.update({ id: editing.id, ...values });
        message.success("Deal updated");
      } else {
        await orpc.deals.create(values);
        message.success("Deal created");
      }
      setOpen(false);
      load();
    } catch {
      message.error("Save failed");
    }
  };

  const remove = async (id: string) => {
    try {
      await orpc.deals.remove({ id });
      message.success("Deal deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  };

  const columns: ColumnsType<Deal> = [
    {
      title: "Title",
      dataIndex: "title",
      render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, r) => r.lead?.contact?.name ?? "—",
    },
    {
      title: "Stage",
      dataIndex: "stage",
      render: (s: string) => <Tag color={STAGE_COLORS[s]}>{s}</Tag>,
    },
    {
      title: "Value",
      dataIndex: "value",
      align: "right",
      render: (v: number) => fmtMoney(v),
    },
    {
      title: "Probability",
      dataIndex: "probability",
      align: "right",
      render: (p: number) => `${p}%`,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this deal?"
            onConfirm={() => remove(record.id)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        <Typography.Title level={3} style={{ margin: 0 }}>
          Deals
        </Typography.Title>
        <Space>
          <Link href="/pipeline">
            <Button>Pipeline board</Button>
          </Link>
          <Select
            placeholder="All stages"
            allowClear
            options={STAGE_OPTIONS}
            style={{ width: 160 }}
            onChange={(v) => {
              setPage(1);
              setStage(v);
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Deal
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatsCard title="Total Deals" value={stats.totalDeals} />
        </Col>
        <Col span={6}>
          <StatsCard title="Open Value" value={fmtMoney(stats.openValue)} />
        </Col>
        <Col span={6}>
          <StatsCard title="Won Value" value={fmtMoney(stats.wonValue)} />
        </Col>
        <Col span={6}>
          <StatsCard title="Win Rate" value={`${stats.winRate}%`} />
        </Col>
      </Row>

      <DataTable<Deal>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ current: page, total, pageSize: 10, onChange: setPage }}
      />

      <Modal
        title={editing ? "Edit Deal" : "New Deal"}
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okText="Save"
        destroyOnHidden
      >
        <Form
          key={editing?.id ?? "new"}
          form={form}
          layout="vertical"
          initialValues={
            editing ?? {
              stage: "DISCOVERY",
              value: 0,
              probability: 0,
              currency: "USD",
            }
          }
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="e.g. Acme annual contract" />
          </Form.Item>
          {!editing && (
            <Form.Item name="leadId" label="Linked Lead (optional)">
              <Select
                showSearch
                allowClear
                options={leads}
                placeholder="Select a lead"
                optionFilterProp="label"
              />
            </Form.Item>
          )}
          <Form.Item name="stage" label="Stage">
            <Select options={STAGE_OPTIONS} />
          </Form.Item>
          <Form.Item name="value" label="Value (USD)">
            <InputNumber<number>
              min={0}
              style={{ width: "100%" }}
              formatter={(v) => `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number((v ?? "").replace(/\$\s?|(,*)/g, ""))}
            />
          </Form.Item>
          <Form.Item name="probability" label="Probability (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
