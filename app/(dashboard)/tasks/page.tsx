"use client";

import {
  AppstoreOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
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
import dayjs from "dayjs";
import { useState } from "react";
import TaskBoard from "@/components/tasks/TaskBoard";
import { PRIORITY_COLORS } from "@/components/tasks/TaskCard";
import DataTable from "@/components/ui/DataTable";
import StatsCard from "@/components/ui/StatsCard";
import { orpc } from "@/lib/orpc/client";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/schemas/task";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | Date | null;
  leadId: string | null;
  dealId: string | null;
  lead: { contact: { name: string } } | null;
  deal: { title: string } | null;
};

const STATUS_OPTIONS = TASK_STATUSES.map((s) => ({
  label: s.replace("_", " "),
  value: s,
}));
const PRIORITY_OPTIONS = TASK_PRIORITIES.map((p) => ({ label: p, value: p }));

const STATUS_COLORS: Record<string, string> = {
  TODO: "default",
  IN_PROGRESS: "processing",
  DONE: "success",
};

const fmtDate = (d: string | Date | null) =>
  d ? dayjs(d).format("MMM D, YYYY") : "—";

export default function TasksPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();
  const [view, setView] = useState<"list" | "board">("list");
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [fetchLinks, setFetchLinks] = useState(false);
  const [form] = Form.useForm();

  const { data: listData, isLoading: listLoading } = useQuery(
    orpc.tasks.list.queryOptions({
      input: { page, pageSize: 10, status: status as never },
    }),
  );

  const { data: stats } = useQuery(orpc.tasks.stats.queryOptions());

  const { data: leads } = useQuery(
    orpc.leads.list.queryOptions({
      input: { page: 1, pageSize: 100 },
      enabled: fetchLinks,
    }),
  );

  const { data: deals } = useQuery(
    orpc.deals.list.queryOptions({
      input: { page: 1, pageSize: 100 },
      enabled: fetchLinks,
    }),
  );

  const leadOptions = (leads?.items ?? []).map(
    (l: { contact: { name: string } | null; id: string }) => ({
      label: l.contact?.name ?? "Lead",
      value: l.id,
    }),
  );

  const dealOptions = (deals?.items ?? []).map(
    (d: { title: string; id: string }) => ({ label: d.title, value: d.id }),
  );

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.tasks.key() });

  const createMutation = useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: () => {
        message.success("Task created");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const updateMutation = useMutation(
    orpc.tasks.update.mutationOptions({
      onSuccess: () => {
        message.success("Task updated");
        setOpen(false);
        invalidate();
      },
      onError: () => message.error("Save failed"),
    }),
  );

  const deleteMutation = useMutation(
    orpc.tasks.remove.mutationOptions({
      onSuccess: () => {
        message.success("Task deleted");
        invalidate();
      },
      onError: () => message.error("Delete failed"),
    }),
  );

  const toggleMutation = useMutation(
    orpc.tasks.toggle.mutationOptions({
      onSuccess: () => invalidate(),
      onError: () => message.error("Update failed"),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setFetchLinks(true);
    setOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setFetchLinks(true);
    setOpen(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    // DatePicker yields a dayjs object; serialise to ISO for the API.
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const remove = (id: string) => deleteMutation.mutate({ id });

  const columns: ColumnsType<Task> = [
    {
      title: "",
      key: "done",
      width: 40,
      render: (_, r) => (
        <Checkbox
          checked={r.status === "DONE"}
          onChange={(e) =>
            toggleMutation.mutate({ id: r.id, done: e.target.checked })
          }
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (t: string, r) => (
        <span
          style={{
            fontWeight: 500,
            textDecoration: r.status === "DONE" ? "line-through" : "none",
            color: r.status === "DONE" ? "#a1a1aa" : "inherit",
          }}
        >
          {t}
        </span>
      ),
    },
    {
      title: "Linked to",
      key: "link",
      render: (_, r) => r.lead?.contact?.name ?? r.deal?.title ?? "—",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (p: string) => <Tag color={PRIORITY_COLORS[p]}>{p}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={STATUS_COLORS[s]}>{s.replace("_", " ")}</Tag>
      ),
    },
    {
      title: "Due",
      dataIndex: "dueDate",
      render: (d: string | Date | null) => fmtDate(d),
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
            title="Delete this task?"
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
          Tasks
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
            New Task
          </Button>
        </Space>
      </div>

      {view === "list" ? (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <StatsCard title="Total Tasks" value={stats?.totalTasks ?? 0} />
            </Col>
            <Col span={6}>
              <StatsCard title="Open" value={stats?.openTasks ?? 0} />
            </Col>
            <Col span={6}>
              <StatsCard title="Completed" value={stats?.doneTasks ?? 0} />
            </Col>
            <Col span={6}>
              <StatsCard
                title="Overdue"
                value={stats?.overdueTasks ?? 0}
                styles={{
                  content: {
                    color: (stats?.overdueTasks ?? 0) > 0 ? "#dc2626" : undefined,
                  },
                }}
              />
            </Col>
          </Row>

          <DataTable<Task>
            rowKey="id"
            columns={columns}
            dataSource={listData?.items ?? []}
            loading={listLoading}
            pagination={{
              current: page,
              total: listData?.total ?? 0,
              pageSize: 10,
              onChange: setPage,
            }}
          />
        </>
      ) : (
        <TaskBoard />
      )}

      <Modal
        title={editing ? "Edit Task" : "New Task"}
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
            editing
              ? {
                  ...editing,
                  dueDate: editing.dueDate ? dayjs(editing.dueDate) : undefined,
                }
              : { status: "TODO", priority: "MEDIUM" }
          }
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="e.g. Follow up with Acme" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional details" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority">
                <Select options={PRIORITY_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="leadId" label="Linked Lead (optional)">
                <Select
                  showSearch
                  allowClear
                  options={leadOptions}
                  placeholder="Select a lead"
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dealId" label="Linked Deal (optional)">
                <Select
                  showSearch
                  allowClear
                  options={dealOptions}
                  placeholder="Select a deal"
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
