"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
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
  const [data, setData] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Contact | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orpc.contacts.list({ page, pageSize: 10, search });
      setData(res.items as Contact[]);
      setTotal(res.total);
    } catch {
      message.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

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
    try {
      if (editing) {
        await orpc.contacts.update({ id: editing.id, ...values });
        message.success("Contact updated");
      } else {
        await orpc.contacts.create(values);
        message.success("Contact created");
      }
      setOpen(false);
      load();
    } catch {
      message.error("Save failed");
    }
  };

  const remove = async (id: string) => {
    try {
      await orpc.contacts.remove({ id });
      message.success("Contact deleted");
      load();
    } catch {
      message.error("Delete failed");
    }
  };

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
      width: 140,
      render: (_, record) => (
        <Space>
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
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          total,
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
    </div>
  );
}
