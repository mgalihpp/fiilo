"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Select,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
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
  const [data, setData] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [contacts, setContacts] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [editing, setEditing] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orpc.leads.list({
        page,
        pageSize: 10,
        status: status as never,
      });
      setData(res.items as Lead[]);
      setTotal(res.total);
    } catch {
      message.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = async () => {
    setEditing(null);
    // Load contacts for the dropdown lazily when opening the form.
    const res = await orpc.contacts.list({ page: 1, pageSize: 100 });
    setContacts(
      res.items.map((c) => ({
        label: c.company ? `${c.name} (${c.company})` : c.name,
        value: c.id,
      })),
    );
    setOpen(true);
  };

  const openEdit = (l: Lead) => {
    setEditing(l);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await orpc.leads.update({ id: editing.id, ...values });
        message.success("Lead updated");
      } else {
        await orpc.leads.create(values);
        message.success("Lead created");
      }
      setOpen(false);
      load();
    } catch {
      message.error("Save failed");
    }
  };

  const remove = async (id: string) => {
    try {
      await orpc.leads.remove({ id });
      message.success("Lead deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  };

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
      width: 140,
      render: (_, record) => (
        <Space>
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
        dataSource={data}
        loading={loading}
        pagination={{ current: page, total, pageSize: 10, onChange: setPage }}
      />

      <Modal
        title={editing ? "Edit Lead" : "New Lead"}
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
                options={contacts}
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
    </div>
  );
}
