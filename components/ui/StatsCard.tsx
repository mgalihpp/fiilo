"use client";

import { Card, Statistic } from "antd";
import type { StatisticProps } from "antd";

interface StatsCardProps extends StatisticProps {
  title: string;
  value: number | string;
}

export default function StatsCard({ title, value, ...rest }: StatsCardProps) {
  return (
    <Card>
      <Statistic title={title} value={value} {...rest} />
    </Card>
  );
}
