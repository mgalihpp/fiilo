"use client";

import {
  ApartmentOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  DollarOutlined,
  FileTextOutlined,
  FolderOutlined,
  FunnelPlotOutlined,
  LineChartOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/app/components/Logo";

const mainMenuItems = [
  { key: "/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
  { key: "/contacts", icon: <ContactsOutlined />, label: "Contacts" },
  { key: "/leads", icon: <FunnelPlotOutlined />, label: "Leads" },
  { key: "/projects", icon: <FolderOutlined />, label: "Project" },
  { key: "/activity", icon: <LineChartOutlined />, label: "Activity" },
  { key: "/tasks", icon: <CheckSquareOutlined />, label: "My task" },
  { key: "/team", icon: <TeamOutlined />, label: "Teams" },
  { key: "/messages", icon: <MessageOutlined />, label: "Message" },
  { key: "/deals", icon: <DollarOutlined />, label: "Deals" },
  { key: "/pipeline", icon: <ApartmentOutlined />, label: "Pipeline" },
  { key: "/invoices", icon: <FileTextOutlined />, label: "Invoices" },
  { key: "/payments", icon: <CreditCardOutlined />, label: "Payments" },
  { key: "/calendar", icon: <CalendarOutlined />, label: "Calendar" },
];

const bottomMenuItems = [
  { key: "/help", icon: <QuestionCircleOutlined />, label: "Help Center" },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (key: string) => pathname.startsWith(key);

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        height: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        background: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "8px 12px", marginBottom: 24 }}>
        <Logo href="/dashboard" size={32} />
      </div>

      {/* Main menu */}
      <nav style={{ flex: 1 }}>
        {mainMenuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => router.push(item.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: isActive(item.key) ? "#f4f4f5" : "transparent",
              color: isActive(item.key) ? "#18181b" : "#71717a",
              fontSize: 14,
              fontWeight: isActive(item.key) ? 500 : 400,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.key)) {
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.color = "#18181b";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.key)) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#71717a";
              }
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom menu */}
      <div style={{ borderTop: "1px solid #e4e4e7", paddingTop: 12 }}>
        {bottomMenuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => router.push(item.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: isActive(item.key) ? "#f4f4f5" : "transparent",
              color: isActive(item.key) ? "#18181b" : "#71717a",
              fontSize: 14,
              fontWeight: 400,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.key)) {
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.color = "#18181b";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.key)) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#71717a";
              }
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
