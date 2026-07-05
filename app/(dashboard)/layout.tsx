"use client";

import { App as AntdApp, ConfigProvider } from "antd";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import QueryProvider from "@/components/QueryProvider";
import { fiiloTheme } from "@/lib/theme";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <ConfigProvider theme={fiiloTheme}>
        <AntdApp>
        <div
          style={{ display: "flex", minHeight: "100vh", background: "#faf9f8" }}
        >
          <Sidebar />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <TopBar />
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
