"use client";

import { App as AntdApp, ConfigProvider } from "antd";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import QueryProvider from "@/components/QueryProvider";
import { fiiloTheme } from "@/lib/theme";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <QueryProvider>
      <ConfigProvider theme={fiiloTheme}>
        <AntdApp>
        <div
          style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#faf9f8" }}
        >
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <TopBar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
              {children}
            </main>
          </div>
        </div>
      </AntdApp>
    </ConfigProvider>
    </QueryProvider>
  );
}
