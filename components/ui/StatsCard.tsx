"use client";

import { Card, Statistic } from "antd";
import type { StatisticProps } from "antd";

interface StatsCardProps extends StatisticProps {
  title: string;
  value: number | string;
}

export default function StatsCard({ title, value, valueStyle, ...rest }: StatsCardProps) {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        styles={valueStyle ? { content: valueStyle } : undefined}
        {...rest}
      />
    </Card>
  );
}
