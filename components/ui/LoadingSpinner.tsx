"use client";

import { Spin, Flex } from "antd";

interface LoadingSpinnerProps {
  tip?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ tip = "Loading...", fullPage = false }: LoadingSpinnerProps) {
  return (
    <Flex
      align="center"
      justify="center"
      style={fullPage ? { minHeight: "100vh" } : { padding: "60px 0" }}
    >
      <Spin tip={tip} size="large">
        <div style={{ padding: 50 }} />
      </Spin>
    </Flex>
  );
}
