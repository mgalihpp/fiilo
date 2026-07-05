"use client";

import {
  DeleteOutlined,
  PlusOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import StatsCard from "@/components/ui/StatsCard";
import { orpc } from "@/lib/orpc/client";
import { INVOICE_STATUSES } from "@/lib/schemas/invoice";

type Invoice = {
  id: string;
  status: string;
  total: number;
  dueDate: string | Date | null;
  createdAt: string | Date;
  contact: { name: string; company: string | null } | null;
  _count: { items: number };
};

const STATUS_OPTIONS = INVOICE_STATUSES.map((s) => ({ label: s, value: s }));

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "default",
  SENT: "processing",
  PAID: "success",
  CANCELLED: "error",
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string | Date | null) =>
  d ? dayjs(d).format("MMM D, YYYY") : "—";

export default function InvoicesPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [fromDealOpen, setFromDealOpen] = useState(false);
  const [fetchLinks, setFetchLinks] = useState(false);
  const [form] = Form.useForm();
  const [dealForm] = Form.useForm();

  const { data: listData, isLoading } = useQuery(
    orpc.invoices.list.queryOptions({
      input: { page, pageSize: 10, status: status as never },
    }),
  );

  const { data: stats } = useQuery(orpc.invoices.stats.queryOptions());

  const { data: contacts } = useQuery(
    orpc.contacts.list.queryOptions({
      input: { page: 1, pageSize: 100 },
      enabled: fetchLinks,
    }),
  );

  const { data: deals } = useQuery(
    orpc.deals.list.queryOptions({
      input: { page: 1, pageSize: 100, stage: "WON" as never },
      enabled: fetchLinks,
    }),
  );

  const contactOptions = (contacts?.items ?? []).map(
    (c: { name: string; id: string }) => ({ label: c.name, value: c.id }),
  );

  // Won deals eligible for auto-invoicing. The server rejects any that
  // already have an invoice (CONFLICT), so no client-side filter is needed.
  const dealOptions = (deals?.items ?? []).map(
    (d: { title: string; id: string }) => ({ label: d.title, value: d.id }),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.invoices.key() });

  const createMutation = useMutation(
    orpc.invoices.create.mutationOptions({
      onSuccess: () => {
        message.success("Invoice created");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const fromDealMutation = useMutation(
    orpc.invoices.createFromDeal.mutationOptions({
      onSuccess: () => {
        message.success("Invoice generated from deal");
        setFromDealOpen(false);
        invalidate();
      },
      onError: (e) => message.error(e.message ?? "Generation failed"),
    }),
  );

  const openCreate = () => {
    setFetchLinks(true);
    setOpen(true);
  };

  const openFromDeal = () => {
    setFetchLinks(true);
    setFromDealOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    createMutation.mutate({
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    });
  };

  const submitFromDeal = async () => {
    const values = await dealForm.validateFields();
    fromDealMutation.mutate({
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    });
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice",
      key: "id",
      render: (_, r) => (
        <Link href={`/invoices/${r.id}`} style={{ fontWeight: 500 }}>
          #{r.id.slice(-6).toUpperCase()}
        </Link>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, r) =>
        r.contact?.company
          ? `${r.contact.name} · ${r.contact.company}`
          : (r.contact?.name ?? "—"),
    },
    {
      title: "Items",
      key: "items",
      align: "right",
      render: (_, r) => r._count.items,
    },
    {
      title: "Total",
      dataIndex: "total",
      align: "right",
      render: (v: number) => fmtMoney(v),
    },
    {
      title: "Due",
      dataIndex: "dueDate",
      render: (d: string | Date | null) => fmtDate(d),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
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
          Invoices
        </Typography.Title>
        <Space>
          <Select
            placeholder="All statuses"
            allowClear
            options={STATUS_OPTIONS}
            style={{ width: 150 }}
            onChange={(v) => {
              setPage(1);
              setStatus(v);
            }}
          />
          <Button icon={<ThunderboltOutlined />} onClick={openFromDeal}>
            From Won Deal
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Invoice
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatsCard title="Total Invoices" value={stats?.totalInvoices ?? 0} />
        </Col>
        <Col span={6}>
          <StatsCard title="Paid" value={fmtMoney(stats?.paidValue ?? 0)} />
        </Col>
        <Col span={6}>
          <StatsCard
            title="Outstanding"
            value={fmtMoney(stats?.outstandingValue ?? 0)}
          />
        </Col>
        <Col span={6}>
          <StatsCard
            title="Overdue"
            value={stats?.overdueCount ?? 0}
            valueStyle={{
              color: (stats?.overdueCount ?? 0) > 0 ? "#dc2626" : undefined,
            }}
          />
        </Col>
      </Row>

      <DataTable<Invoice>
        rowKey="id"
        columns={columns}
        dataSource={listData?.items ?? []}
        loading={isLoading}
        pagination={{
          current: page,
          total: listData?.total ?? 0,
          pageSize: 10,
          onChange: setPage,
        }}
      />

      {/* Create invoice with line items */}
      <Modal
        title="New Invoice"
        open={open}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okText="Create"
        width={640}
        destroyOnHidden
        confirmLoading={createMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            taxRate: 0,
            items: [{ description: "", quantity: 1, unitPrice: 0 }],
          }}
        >
          <Row gutter={12}>
            <Col span={14}>
              <Form.Item
                name="contactId"
                label="Contact"
                rules={[{ required: true, message: "Contact is required" }]}
              >
                <Select
                  showSearch
                  options={contactOptions}
                  placeholder="Select a contact"
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "4px 0 16px" }}>Line Items</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row gutter={8} key={field.key} align="middle">
                    <Col span={11}>
                      <Form.Item
                        name={[field.name, "description"]}
                        rules={[{ required: true, message: "Required" }]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item name={[field.name, "quantity"]}>
                        <InputNumber
                          min={1}
                          placeholder="Qty"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item name={[field.name, "unitPrice"]}>
                        <InputNumber
                          min={0}
                          prefix="$"
                          placeholder="Price"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={fields.length === 1}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({ description: "", quantity: 1, unitPrice: 0 })
                  }
                >
                  Add item
                </Button>
              </>
            )}
          </Form.List>

          <Row style={{ marginTop: 16 }}>
            <Col span={8}>
              <Form.Item name="taxRate" label="Tax Rate (%)">
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Auto-invoice from a won deal */}
      <Modal
        title="Invoice from Won Deal"
        open={fromDealOpen}
        onOk={submitFromDeal}
        onCancel={() => setFromDealOpen(false)}
        okText="Generate"
        destroyOnHidden
        confirmLoading={fromDealMutation.isPending}
      >
        <Form form={dealForm} layout="vertical" initialValues={{ taxRate: 0 }}>
          <Form.Item
            name="dealId"
            label="Won Deal"
            rules={[{ required: true, message: "Select a deal" }]}
          >
            <Select
              showSearch
              options={dealOptions}
              placeholder="Select a won deal"
              optionFilterProp="label"
              notFoundContent="No eligible won deals"
            />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="taxRate" label="Tax Rate (%)">
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dueDate" label="Due Date">
                <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
