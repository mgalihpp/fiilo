import type { ThemeConfig } from "antd";

export const fiiloTheme: ThemeConfig = {
  token: {
    fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
    colorPrimary: "#18181b",
    colorBgLayout: "#faf9f8",
    colorBgContainer: "#ffffff",
    colorBorder: "#e4e4e7",
    colorBorderSecondary: "#f0f0f0",
    colorText: "#18181b",
    colorTextSecondary: "#71717a",
    colorTextTertiary: "#a1a1aa",
    borderRadius: 8,
    fontSize: 14,
    colorLink: "#18181b",
    colorLinkHover: "#27272a",
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#faf9f8",
      bodyBg: "#faf9f8",
    },
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: "#e4e4e7",
      itemSelectedColor: "#18181b",
      itemColor: "#52525b",
      itemHoverBg: "#f4f4f5",
      itemHoverColor: "#18181b",
      iconSize: 18,
      itemBorderRadius: 6,
      itemMarginInline: 8,
    },
    Button: {
      colorPrimary: "#18181b",
      colorPrimaryHover: "#27272a",
      colorPrimaryActive: "#09090b",
      defaultBorderColor: "#e4e4e7",
      borderRadius: 6,
    },
    Card: {
      borderRadiusLG: 10,
      boxShadowTertiary: "0 1px 3px 0 rgb(0 0 0 / 0.04)",
    },
    Table: {
      borderColor: "#f0f0f0",
      headerBg: "#faf9f8",
      headerColor: "#71717a",
      rowHoverBg: "#faf9f8",
    },
    Select: {
      // All option backgrounds derive from colorPrimary (#18181b) by default,
      // hiding the dark text. Override every state to the same light grey so
      // hover and selected read consistently.
      optionSelectedBg: "#f4f4f5",
      optionSelectedColor: "#18181b",
      optionActiveBg: "#f4f4f5",
      // Hovering the already-selected option; keep it in the same family.
      controlItemBgActiveHover: "#f4f4f5",
    },
  },
};
