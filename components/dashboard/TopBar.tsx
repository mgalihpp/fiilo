"use client";

import {
  BellOutlined,
  DownloadOutlined,
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { UserButton } from "@clerk/nextjs";
import { Input } from "antd";

export default function TopBar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <header
      style={{
        height: 56,
        minHeight: 56,
        background: "#ffffff",
        borderBottom: "1px solid #e4e4e7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: "1px solid #e4e4e7",
            background: "#faf9f8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#52525b",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined style={{ color: "#a1a1aa" }} />}
          style={{
            maxWidth: 360,
            borderRadius: 8,
            border: "1px solid #e4e4e7",
            background: "#faf9f8",
          }}
          variant="borderless"
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#52525b",
            fontSize: 16,
          }}
        >
          <DownloadOutlined />
        </button>
        <button
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#52525b",
            fontSize: 16,
          }}
        >
          <BellOutlined />
        </button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: 36,
                height: 36,
              },
            },
          }}
        />
      </div>
    </header>
  );
}
