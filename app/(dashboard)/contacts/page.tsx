"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileTextOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import AiActionButton from "@/components/ai/AiActionButton";
import AiResultModal, {
  type AiCard,
} from "@/components/ai/AiResultModal";
import DataTable from "@/components/ui/DataTable";
import { orpc } from "@/lib/orpc/client";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
};

export default function ContactsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Contact | null>(null);
  const [open, setOpen] = useState(false);
  const [aiCards, setAiCards] = useState<AiCard[] | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useQuery(
    orpc.contacts.list.queryOptions({ input: { page, pageSize: 10, search } }),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.contacts.key() });

  const createMutation = useMutation(
    orpc.contacts.create.mutationOptions({
      onSuccess: () => {
        message.success("Contact created");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const updateMutation = useMutation(
    orpc.contacts.update.mutationOptions({
      onSuccess: () => {
        message.success("Contact updated");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const deleteMutation = useMutation(
    orpc.contacts.remove.mutationOptions({
      onSuccess: () => {
        message.success("Contact deleted");
        invalidate();
      },
      onError: () => message.error("Delete failed"),
    }),
  );

  const enrichMutation = useMutation(
    orpc.ai.enrichContact.mutationOptions({
      onSuccess: (r) => {
        setAiCards([
          {
            type: "enrichment",
            title: "Contact Enrichment",
            fields: [
              { icon: <FileTextOutlined />, label: "Industry", value: r.industry },
              { icon: <TeamOutlined />, label: "Company size", value: r.companySize },
              { icon: <FileTextOutlined />, label: "Summary", value: r.summary },
              { icon: <MailOutlined />, label: "Next action", value: r.suggestedNextAction },
            ],
          },
        ]);
        invalidate();
      },
      onError: () => message.error("Enrichment failed"),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (c: Contact) => {
    setEditing(c);
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

  const columns: ColumnsType<Contact> = [
    {
      title: "Name",
      dataIndex: "name",
      render: (t) => <span style={{ fontWeight: 500 }}>{t}</span>,
    },
    { title: "Email", dataIndex: "email" },
    { title: "Company", dataIndex: "company" },
    { title: "Position", dataIndex: "position" },
    {
      title: "Actions",
      key: "actions",
      width: 230,
      render: (_, record) => (
        <Space>
          <AiActionButton
            label="Enrich"
            loading={
              enrichMutation.isPending &&
              enrichMutation.variables?.id === record.id
            }
            disabled={enrichMutation.isPending}
            onClick={() => enrichMutation.mutate({ id: record.id })}
          />
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this contact?"
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
          Contacts
        </Typography.Title>
        <Space>
          <Input.Search
            placeholder="Search contacts"
            allowClear
            onSearch={(v) => {
              setPage(1);
              setSearch(v);
            }}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Contact
          </Button>
        </Space>
      </div>

      <DataTable<Contact>
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
        title={editing ? "Edit Contact" : "New Contact"}
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
          initialValues={editing ?? {}}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Invalid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Position">
            <Input />
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
