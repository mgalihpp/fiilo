"use client";

import { Card, Table, Button, Modal, Form, Input, Select, Space, App, Avatar, Spin } from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orpc } from "@/lib/orpc/client";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "USER";
  avatar?: string;
  joinedAt: Date | string;
}

export default function TeamPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: teamData, isLoading } = useQuery(orpc.team.listTeam.queryOptions({ input: {} }));

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: orpc.team.listTeam.queryKey() });

  const inviteMutation = useMutation({
    ...orpc.team.inviteMember.mutationOptions({
      onSuccess: () => {
        message.success("Member invited successfully");
        setInviteOpen(false);
        form.resetFields();
        invalidate();
      },
      onError: (err: any) => {
        message.error(err?.message || "Failed to invite member");
      },
    }),
  });

  const removeMutation = useMutation({
    ...orpc.team.removeMember.mutationOptions({
      onSuccess: () => {
        message.success("Member removed");
        invalidate();
      },
      onError: () => message.error("Failed to remove member"),
    }),
  });

  const updateRoleMutation = useMutation({
    ...orpc.team.updateRole.mutationOptions({
      onSuccess: () => {
        message.success("Role updated");
        invalidate();
      },
      onError: () => message.error("Failed to update role"),
    }),
  });

  const handleInvite = async () => {
    const values = await form.validateFields();
    inviteMutation.mutate(values);
  };

  const columns: ColumnsType<TeamMember> = [
    {
      title: "Member",
      key: "member",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar
            src={record.avatar}
            style={{
              background: "#ff5d30",
              color: "#fff",
            }}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, color: "#18181b" }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#71717a" }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: "ADMIN" | "MANAGER" | "USER", record) => (
        <Select
          value={role}
          style={{ width: 120 }}
          options={[
            { label: "Admin", value: "ADMIN" },
            { label: "Manager", value: "MANAGER" },
            { label: "User", value: "USER" },
          ]}
          onChange={(newRole) =>
            updateRoleMutation.mutate({
              id: record.id,
              role: newRole as "ADMIN" | "MANAGER" | "USER",
            })
          }
          disabled={role === "ADMIN"} // Can't change admin role
        />
      ),
    },
    {
      title: "Joined",
      dataIndex: "joinedAt",
      key: "joinedAt",
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.role === "ADMIN" ? null : (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Remove Member",
                content: `Are you sure you want to remove ${record.name} from the team?`,
                okText: "Remove",
                okType: "danger",
                onOk: () => removeMutation.mutate({ id: record.id }),
              });
            }}
            loading={removeMutation.isPending}
          >
            Remove
          </Button>
        ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#18181b",
            margin: 0,
          }}
        >
          Team Management
        </h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setInviteOpen(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Members Table */}
      <Card
        title={`Team Members (${teamData?.members.length || 0})`}
        style={{
          borderRadius: 12,
          border: "1px solid #e4e4e7",
        }}
      >
        <Table<TeamMember>
          columns={columns}
          dataSource={(teamData?.members ?? []) as TeamMember[]}
          pagination={false}
          rowKey="id"
        />
      </Card>

      {/* Invite Modal */}
      <Modal
        title="Invite Team Member"
        open={inviteOpen}
        onCancel={() => {
          setInviteOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setInviteOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleInvite}
            loading={inviteMutation.isPending}
          >
            Send Invite
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="colleague@company.com" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            initialValue="USER"
          >
            <Select
              options={[
                { label: "Admin", value: "ADMIN" },
                { label: "Manager", value: "MANAGER" },
                { label: "User", value: "USER" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
