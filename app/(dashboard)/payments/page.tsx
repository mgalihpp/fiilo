"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Col,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import DataTable from "@/components/ui/DataTable";
import { orpc } from "@/lib/orpc/client";
import { PAYMENT_METHODS } from "@/lib/schemas/payment";

type Payment = {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  paidAt: string | Date;
  invoice: { id: string; contact: { name: string } | null } | null;
};

type Outstanding = {
  id: string;
  total: number;
  status: string;
  contact: { name: string } | null;
};

const METHOD_OPTIONS = PAYMENT_METHODS.map((m) => ({
  label: m.replace("_", " "),
  value: m,
}));

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const fmtDate = (d: string | Date) => dayjs(d).format("MMM D, YYYY");

export default function PaymentsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [method, setMethod] = useState("BANK_TRANSFER");

  const { data: listData, isLoading } = useQuery(
    orpc.payments.list.queryOptions({ input: { page, pageSize: 10 } }),
  );

  // Pull invoices to surface the outstanding ones for bulk payment.
  const { data: invoiceData } = useQuery(
    orpc.invoices.list.queryOptions({ input: { page: 1, pageSize: 100 } }),
  );

  const outstanding = ((invoiceData?.items ?? []) as Outstanding[]).filter(
    (i) => i.status === "DRAFT" || i.status === "SENT",
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: orpc.payments.key() });
    queryClient.invalidateQueries({ queryKey: orpc.invoices.key() });
  };

  const bulkMutation = useMutation(
    orpc.payments.bulkPay.mutationOptions({
      onSuccess: (res) => {
        message.success(`${res.paid} invoice(s) marked paid`);
        setSelected([]);
        invalidate();
      },
      onError: () => message.error("Bulk payment failed"),
    }),
  );

  const paymentColumns: ColumnsType<Payment> = [
    {
      title: "Date",
      dataIndex: "paidAt",
      render: (d: string | Date) => fmtDate(d),
    },
    {
      title: "Invoice",
      key: "invoice",
      render: (_, r) =>
        r.invoice ? (
          <Link href={`/invoices/${r.invoice.id}`}>
            #{r.invoice.id.slice(-6).toUpperCase()}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, r) => r.invoice?.contact?.name ?? "—",
    },
    {
      title: "Method",
      dataIndex: "method",
      render: (m: string) => <Tag>{m.replace("_", " ")}</Tag>,
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
  ];

  const outstandingColumns: ColumnsType<Outstanding> = [
    {
      title: "Invoice",
      key: "id",
      render: (_, r) => (
        <Link href={`/invoices/${r.id}`}>#{r.id.slice(-6).toUpperCase()}</Link>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, r) => r.contact?.name ?? "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => <Tag>{s}</Tag>,
    },
    {
      title: "Total",
      dataIndex: "total",
      align: "right",
      render: (v: number) => fmtMoney(v),
    },
  ];

  const selectedTotal = outstanding
    .filter((i) => selected.includes(i.id))
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        Payments
      </Typography.Title>

      <Card
        title="Outstanding Invoices"
        style={{ marginBottom: 24 }}
        extra={
          <Space>
            <Select
              value={method}
              onChange={setMethod}
              options={METHOD_OPTIONS}
              style={{ width: 150 }}
            />
            <Button
              type="primary"
              disabled={selected.length === 0}
              loading={bulkMutation.isPending}
              onClick={() =>
                bulkMutation.mutate({
                  invoiceIds: selected,
                  method: method as never,
                })
              }
            >
              Pay {selected.length > 0 ? `${selected.length} · ` : ""}
              {fmtMoney(selectedTotal)}
            </Button>
          </Space>
        }
      >
        <Table<Outstanding>
          size="middle"
          rowKey="id"
          pagination={false}
          columns={outstandingColumns}
          dataSource={outstanding}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys as string[]),
          }}
          locale={{ emptyText: "No outstanding invoices" }}
        />
      </Card>

      <Row>
        <Col span={24}>
          <Typography.Title level={5}>Payment History</Typography.Title>
          <DataTable<Payment>
            rowKey="id"
            columns={paymentColumns}
            dataSource={listData?.items ?? []}
            loading={isLoading}
            pagination={{
              current: page,
              total: listData?.total ?? 0,
              pageSize: 10,
              onChange: setPage,
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
