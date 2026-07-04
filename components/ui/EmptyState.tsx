"use client";

import { Empty, Button, Flex } from "antd";

interface EmptyStateProps {
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  description = "No data available",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Flex align="center" justify="center" style={{ padding: "60px 0" }}>
      <Empty description={description}>
        {actionText && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Empty>
    </Flex>
  );
}
