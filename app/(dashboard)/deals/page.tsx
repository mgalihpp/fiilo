"use client";

import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import PipelineBoard from "@/components/deals/PipelineBoard";
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
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [stage, setStage] = useState<string | undefined>();
  const [view, setView] = useState<"list" | "board">("list");
  const [editing, setEditing] = useState<Deal | null>(null);
  const [open, setOpen] = useState(false);
  const [fetchLeads, setFetchLeads] = useState(false);
  const [form] = Form.useForm();

  const { data: listData, isLoading: listLoading } = useQuery(
    orpc.deals.list.queryOptions({
      input: { page, pageSize: 10, stage: stage as never },
    }),
  );

  const { data: stats } = useQuery(orpc.deals.stats.queryOptions());

  const { data: leads } = useQuery(
    orpc.leads.list.queryOptions({
      input: { page: 1, pageSize: 100 },
      enabled: fetchLeads,
    }),
  );

  const leadOptions = (leads?.items ?? []).map((l: { contact: { name: string } | null; id: string }) => ({
    label: l.contact?.name ?? "Lead",
    value: l.id,
  }));

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.deals.key() });

  const createMutation = useMutation(
    orpc.deals.create.mutationOptions({
      onSuccess: () => {
        message.success("Deal created");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const updateMutation = useMutation(
    orpc.deals.update.mutationOptions({
      onSuccess: () => {
        message.success("Deal updated");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const deleteMutation = useMutation(
    orpc.deals.remove.mutationOptions({
      onSuccess: () => {
        message.success("Deal deleted");
        invalidate();
      },
      onError: () => message.error("Delete failed"),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setFetchLeads(true);
    setOpen(true);
  };

  const openEdit = (d: Deal) => {
    setEditing(d);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const remove = (id: string) => deleteMutation.mutate({ id });

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
          <Segmented
            value={view}
            onChange={(v) => setView(v as "list" | "board")}
            options={[
              { value: "list", icon: <UnorderedListOutlined /> },
              { value: "board", icon: <AppstoreOutlined /> },
            ]}
          />
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

      {view === "list" ? (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <StatsCard title="Total Deals" value={stats?.totalDeals ?? 0} />
            </Col>
            <Col span={6}>
              <StatsCard title="Open Value" value={fmtMoney(stats?.openValue ?? 0)} />
            </Col>
            <Col span={6}>
              <StatsCard title="Won Value" value={fmtMoney(stats?.wonValue ?? 0)} />
            </Col>
            <Col span={6}>
              <StatsCard title="Win Rate" value={`${stats?.winRate ?? 0}%`} />
            </Col>
          </Row>

          <DataTable<Deal>
            rowKey="id"
            columns={columns}
            dataSource={listData?.items ?? []}
            loading={listLoading}
            pagination={{ current: page, total: listData?.total ?? 0, pageSize: 10, onChange: setPage }}
          />
        </>
      ) : (
        <PipelineBoard />
      )}

      <Modal
        title={editing ? "Edit Deal" : "New Deal"}
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okText="Save"
        destroyOnHidden
        confirmLoading={createMutation.isPending || updateMutation.isPending}
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
                options={leadOptions}
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
