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
  RobotOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/app/components/Logo";

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "Overview",
    items: [{ key: "/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" }],
  },
  {
    label: "CRM",
    items: [
      { key: "/contacts", icon: <ContactsOutlined />, label: "Contacts" },
      { key: "/leads", icon: <FunnelPlotOutlined />, label: "Leads" },
      { key: "/deals", icon: <DollarOutlined />, label: "Deals" },
      { key: "/pipeline", icon: <ApartmentOutlined />, label: "Pipeline" },
    ],
  },
  {
    label: "Work",
    items: [
      { key: "/tasks", icon: <CheckSquareOutlined />, label: "My Task" },
      { key: "/projects", icon: <FolderOutlined />, label: "Projects" },
      { key: "/activity", icon: <LineChartOutlined />, label: "Activity" },
      { key: "/calendar", icon: <CalendarOutlined />, label: "Calendar" },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "/invoices", icon: <FileTextOutlined />, label: "Invoices" },
      { key: "/payments", icon: <CreditCardOutlined />, label: "Payments" },
    ],
  },
  {
    label: "Team",
    items: [
      { key: "/team", icon: <TeamOutlined />, label: "Teams" },
      { key: "/messages", icon: <MessageOutlined />, label: "Messages" },
    ],
  },
  {
    label: "Intelligence",
    items: [{ key: "/ai-chat", icon: <RobotOutlined />, label: "AI Assistant" }],
  },
];

const bottomMenuItems: MenuItem[] = [
  { key: "/help", icon: <QuestionCircleOutlined />, label: "Help Center" },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
];

const SIDEBAR_W = 220;
const SIDEBAR_W_COLLAPSED = 60;

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const width = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;
  const isActive = (key: string) => pathname.startsWith(key);

  const renderButton = (item: MenuItem) => (
    <button
      key={item.key}
      type="button"
      title={collapsed ? item.label : undefined}
      onClick={() => router.push(item.key)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        width: "100%",
        padding: collapsed ? "8px 0" : "8px 10px",
        borderRadius: 6,
        border: "none",
        background: isActive(item.key) ? "#f4f4f5" : "transparent",
        color: isActive(item.key) ? "#18181b" : "#71717a",
        fontSize: 13,
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
      <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </button>
  );

  return (
    <aside
      className="sidebar-thin-scroll"
      style={{
        width,
        minWidth: width,
        height: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        background: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "16px 8px" : "16px 12px",
        fontFamily: "var(--font-inter), sans-serif",
        overflowY: "auto",
        transition: "width 0.2s ease, min-width 0.2s ease, padding 0.2s ease",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "4px 0" : "4px 10px",
          marginBottom: 20,
        }}
      >
        {!collapsed && <Logo href="/dashboard" size={28} />}
        {collapsed && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: "#FF5D30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#fff",
              fontSize: 14,
            }}
          >
            F
          </div>
        )}
      </div>

      {/* Grouped menu */}
      <nav style={{ flex: 1 }}>
        {menuGroups.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: gi < menuGroups.length - 1 ? 16 : 0 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "0 10px",
                  marginBottom: 4,
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map(renderButton)}
          </div>
        ))}
      </nav>

      {/* Bottom menu */}
      <div style={{ borderTop: "1px solid #e4e4e7", paddingTop: 12 }}>
        {bottomMenuItems.map(renderButton)}
      </div>
    </aside>
  );
}
