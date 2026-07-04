"use client";

import { Table } from "antd";
import type { TableProps } from "antd";

export default function DataTable<T extends object>(props: TableProps<T>) {
  return (
    <Table<T>
      size="middle"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        ...props.pagination,
      }}
      {...props}
    />
  );
}
