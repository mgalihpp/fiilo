"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import AiActionButton from "@/components/ai/AiActionButton";
import AiResultModal, {
  type AiCard,
} from "@/components/ai/AiResultModal";
import LeadScoreBadge from "@/components/leads/LeadScoreBadge";
import DataTable from "@/components/ui/DataTable";
import { orpc } from "@/lib/orpc/client";
import { LEAD_STATUSES } from "@/lib/schemas/lead";

type Lead = {
  id: string;
  status: string;
  score: number;
  source: string | null;
  notes: string | null;
  contactId: string;
  contact: { name: string; company: string | null };
};

const STATUS_OPTIONS = LEAD_STATUSES.map((s) => ({ label: s, value: s }));

export default function LeadsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [editing, setEditing] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);
  const [fetchContacts, setFetchContacts] = useState(false);
  const [aiCards, setAiCards] = useState<AiCard[] | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(
    orpc.leads.list.queryOptions({
      input: { page, pageSize: 10, status: status as never },
    }),
  );

  const { data: contacts } = useQuery(
    orpc.contacts.list.queryOptions({
      input: { page: 1, pageSize: 100 },
      enabled: fetchContacts,
    }),
  );

  const contactOptions = (contacts?.items ?? []).map(
    (c: { name: string; company: string | null; id: string }) => ({
      label: c.company ? `${c.name} (${c.company})` : c.name,
      value: c.id,
    }),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.leads.key() });

  const createMutation = useMutation(
    orpc.leads.create.mutationOptions({
      onSuccess: () => {
        message.success("Lead created");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const updateMutation = useMutation(
    orpc.leads.update.mutationOptions({
      onSuccess: () => {
        message.success("Lead updated");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const deleteMutation = useMutation(
    orpc.leads.remove.mutationOptions({
      onSuccess: () => {
        message.success("Lead deleted");
        invalidate();
      },
      onError: () => message.error("Delete failed"),
    }),
  );

  const scoreMutation = useMutation(
    orpc.ai.scoreLead.mutationOptions({
      onSuccess: (r) => {
        const scoreLabel = r.score >= 70 ? "High" : r.score >= 40 ? "Medium" : "Low";
        const scoreColor = r.score >= 70 ? "green" : r.score >= 40 ? "gold" : "red";
        setAiCards([
          {
            type: "score",
            title: "Lead Score",
            score: r.score,
            maxScore: 100,
            label: scoreLabel,
            labelColor: scoreColor,
            description: r.reasoning.slice(0, 60),
            reasoning: r.reasoning,
          },
        ]);
        invalidate();
      },
      onError: () => message.error("Scoring failed"),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setFetchContacts(true);
    setOpen(true);
  };

  const openEdit = (l: Lead) => {
    setEditing(l);
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

  const columns: ColumnsType<Lead> = [
    {
      title: "Contact",
      key: "contact",
      render: (_, r) => (
        <span style={{ fontWeight: 500 }}>{r.contact?.name}</span>
      ),
    },
    { title: "Company", key: "company", render: (_, r) => r.contact?.company },
    { title: "Status", dataIndex: "status" },
    {
      title: "Score",
      dataIndex: "score",
      render: (s: number) => <LeadScoreBadge score={s} />,
    },
    { title: "Source", dataIndex: "source" },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <AiActionButton
            label="Score"
            loading={
              scoreMutation.isPending &&
              scoreMutation.variables?.id === record.id
            }
            disabled={scoreMutation.isPending}
            onClick={() => scoreMutation.mutate({ id: record.id })}
          />
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this lead?"
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
          Leads
        </Typography.Title>
        <Space>
          <Select
            placeholder="All statuses"
            allowClear
            options={STATUS_OPTIONS}
            style={{ width: 160 }}
            onChange={(v) => {
              setPage(1);
              setStatus(v);
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Lead
          </Button>
        </Space>
      </div>

      <DataTable<Lead>
        rowKey="id"
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        pagination={{
          current: page,
          total: data?.total ?? 0,
          pageSize: 10,
          onChange: setPage,
        }}
      />

      <Modal
        title={editing ? "Edit Lead" : "New Lead"}
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
          initialValues={editing ?? { status: "NEW", score: 0 }}
        >
          {!editing && (
            <Form.Item
              name="contactId"
              label="Contact"
              rules={[{ required: true, message: "Contact is required" }]}
            >
              <Select
                showSearch
                options={contactOptions}
                placeholder="Select a contact"
              />
            </Form.Item>
          )}
          <Form.Item name="status" label="Status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
          <Form.Item name="score" label="Score">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="source" label="Source">
            <Input />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <AiResultModal
        open={aiCards !== null}
        cards={aiCards ?? []}
        onClose={() => setAiCards(null)}
      />
    </div>
  );
}
