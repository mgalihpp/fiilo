"use client";

import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { orpc } from "@/lib/orpc/client";
import { PAYMENT_METHODS } from "@/lib/schemas/payment";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "default",
  SENT: "processing",
  PAID: "success",
  CANCELLED: "error",
};

// Allowed forward transitions per current status.
const NEXT_STATUS: Record<string, string[]> = {
  DRAFT: ["SENT", "CANCELLED"],
  SENT: ["PAID", "CANCELLED"],
  PAID: [],
  CANCELLED: ["DRAFT"],
};

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({
  label: m.replace("_", " "),
  value: m,
}));

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const fmtDate = (d: string | Date | null) =>
  d ? dayjs(d).format("MMM D, YYYY") : "—";

export default function InvoiceDetailPage() {
  const { message } = App.useApp();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id;
  const [payOpen, setPayOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: invoice, isLoading } = useQuery(
    orpc.invoices.get.queryOptions({ input: { id } }),
  );

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: orpc.invoices.get.queryOptions({ input: { id } }).queryKey,
    });
    queryClient.invalidateQueries({ queryKey: orpc.invoices.key() });
  };

  const statusMutation = useMutation(
    orpc.invoices.updateStatus.mutationOptions({
      onSuccess: () => {
        message.success("Status updated");
        invalidate();
      },
      onError: () => message.error("Update failed"),
    }),
  );

  const payMutation = useMutation(
    orpc.payments.create.mutationOptions({
      onSuccess: () => {
        message.success("Payment recorded");
        setPayOpen(false);
        invalidate();
      },
      onError: () => message.error("Failed to record payment"),
    }),
  );

  const removeMutation = useMutation(
    orpc.invoices.remove.mutationOptions({
      onSuccess: () => {
        message.success("Invoice deleted");
        router.push("/invoices");
      },
      onError: () => message.error("Delete failed"),
    }),
  );

  if (isLoading || !invoice) {
    return <Typography.Text>Loading…</Typography.Text>;
  }

  const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = invoice.total - paidAmount;

  const submitPayment = async () => {
    const values = await form.validateFields();
    payMutation.mutate({ invoiceId: id, ...values });
  };

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Print-only rule: hide everything except the invoice card. */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .invoice-print, .invoice-print * { visibility: visible; }
          .invoice-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Space>
          <Link href="/invoices">
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Invoice #{id.slice(-6).toUpperCase()}
          </Typography.Title>
          <Tag color={STATUS_COLORS[invoice.status]}>{invoice.status}</Tag>
        </Space>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print / PDF
          </Button>
          {NEXT_STATUS[invoice.status]?.map((s) => (
            <Button
              key={s}
              type={s === "PAID" ? "primary" : "default"}
              loading={statusMutation.isPending}
              onClick={() => statusMutation.mutate({ id, status: s as never })}
            >
              Mark {s}
            </Button>
          ))}
          {balance > 0 && invoice.status !== "CANCELLED" && (
            <Button type="primary" onClick={() => setPayOpen(true)}>
              Record Payment
            </Button>
          )}
        </Space>
      </div>

      <Card className="invoice-print">
        <Row justify="space-between">
          <Col>
            <Typography.Title level={4} style={{ margin: 0 }}>
              INVOICE
            </Typography.Title>
            <Typography.Text type="secondary">
              #{id.slice(-6).toUpperCase()}
            </Typography.Text>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Issued">
                {fmtDate(invoice.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Due">
                {fmtDate(invoice.dueDate)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        <Row gutter={32}>
          <Col span={12}>
            <Typography.Text type="secondary">Billed To</Typography.Text>
            <div style={{ fontWeight: 500, marginTop: 4 }}>
              {invoice.contact?.name}
            </div>
            {invoice.contact?.company && <div>{invoice.contact.company}</div>}
            {invoice.contact?.email && (
              <div style={{ color: "#71717a" }}>{invoice.contact.email}</div>
            )}
          </Col>
          {invoice.deal && (
            <Col span={12} style={{ textAlign: "right" }}>
              <Typography.Text type="secondary">Deal</Typography.Text>
              <div style={{ fontWeight: 500, marginTop: 4 }}>
                {invoice.deal.title}
              </div>
            </Col>
          )}
        </Row>

        <Table
          style={{ marginTop: 24 }}
          size="small"
          pagination={false}
          rowKey="id"
          dataSource={invoice.items}
          columns={[
            { title: "Description", dataIndex: "description" },
            {
              title: "Qty",
              dataIndex: "quantity",
              align: "right",
              width: 80,
            },
            {
              title: "Unit Price",
              dataIndex: "unitPrice",
              align: "right",
              width: 120,
              render: (v: number) => fmtMoney(v),
            },
            {
              title: "Amount",
              dataIndex: "amount",
              align: "right",
              width: 120,
              render: (v: number) => fmtMoney(v),
            },
          ]}
        />

        <Row justify="end" style={{ marginTop: 16 }}>
          <Col style={{ width: 260 }}>
            <div style={rowStyle}>
              <span>Subtotal</span>
              <span>{fmtMoney(invoice.subtotal)}</span>
            </div>
            <div style={rowStyle}>
              <span>Tax</span>
              <span>{fmtMoney(invoice.tax)}</span>
            </div>
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ ...rowStyle, fontWeight: 600, fontSize: 16 }}>
              <span>Total</span>
              <span>{fmtMoney(invoice.total)}</span>
            </div>
            <div style={{ ...rowStyle, color: "#16a34a" }}>
              <span>Paid</span>
              <span>{fmtMoney(paidAmount)}</span>
            </div>
            <div style={{ ...rowStyle, fontWeight: 600 }}>
              <span>Balance Due</span>
              <span>{fmtMoney(balance)}</span>
            </div>
          </Col>
        </Row>
      </Card>

      {invoice.payments.length > 0 && (
        <Card className="no-print" title="Payments" style={{ marginTop: 16 }}>
          <Table
            size="small"
            pagination={false}
            rowKey="id"
            dataSource={invoice.payments}
            columns={[
              {
                title: "Date",
                dataIndex: "paidAt",
                render: (d: string | Date) => fmtDate(d),
              },
              {
                title: "Method",
                dataIndex: "method",
                render: (m: string) => m.replace("_", " "),
              },
              {
                title: "Reference",
                dataIndex: "reference",
                render: (r: string | null) => r ?? "—",
              },
              {
                title: "Amount",
                dataIndex: "amount",
                align: "right",
                render: (v: number) => fmtMoney(v),
              },
            ]}
          />
        </Card>
      )}

      <div className="no-print" style={{ marginTop: 16 }}>
        <Button danger onClick={() => removeMutation.mutate({ id })}>
          Delete Invoice
        </Button>
      </div>

      <Modal
        title="Record Payment"
        open={payOpen}
        onOk={submitPayment}
        onCancel={() => setPayOpen(false)}
        okText="Record"
        destroyOnHidden
        confirmLoading={payMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ amount: balance, method: "BANK_TRANSFER" }}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Amount is required" }]}
          >
            <InputNumber min={0.01} prefix="$" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="method" label="Method">
            <Select options={METHOD_OPTIONS} />
          </Form.Item>
          <Form.Item name="reference" label="Reference (optional)">
            <Input placeholder="e.g. transfer id, cheque no." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "2px 0",
};
