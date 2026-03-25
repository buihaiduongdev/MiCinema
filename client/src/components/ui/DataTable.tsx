/**
 * DataTable — Reusable UI Component
 *
 * Dùng: Mantine component + Tailwind CSS
 * Props: định nghĩa interface DataTableProps với TypeScript
 * Export: React.FC<DataTableProps>
 *
 * Dev phụ A (Tín) phụ trách
 */

import {
  Box,
  Center,
  Loader,
  Pagination,
  Paper,
  ScrollArea,
  Table,
  Text,
} from '@mantine/core';
import type React from 'react';

type RowData = Record<string, unknown>;

export interface DataTableColumn {
  key: string;
  header: React.ReactNode;
  render?: (row: RowData, rowIndex: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  className?: string;
  headerClassName?: string;
}

export interface DataTablePagination {
  page: number;
  total: number;
  onChange: (page: number) => void;
  siblings?: number;
  boundaries?: number;
  withEdges?: boolean;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: RowData[];
  rowKey?: string | ((row: RowData, index: number) => React.Key);
  loading?: boolean;
  emptyText?: React.ReactNode;
  minWidth?: number;
  className?: string;
  striped?: boolean;
  highlightOnHover?: boolean;
  pagination?: DataTablePagination;
}

const getCellValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Có' : 'Không';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = 'Không có dữ liệu',
  minWidth = 900,
  className,
  striped = true,
  highlightOnHover = true,
  pagination,
}) => {
  return (
    <Paper withBorder radius="lg" className={className}>
      <ScrollArea>
        <Box miw={minWidth}>
          <Table
            striped={striped}
            highlightOnHover={highlightOnHover}
            verticalSpacing="sm"
            horizontalSpacing="md"
            className="text-sm"
          >
            <Table.Thead className="bg-slate-50">
              <Table.Tr>
                {columns.map((column) => (
                  <Table.Th
                    key={column.key}
                    ta={column.align ?? 'left'}
                    w={column.width}
                    className={column.headerClassName}
                  >
                    {column.header}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td colSpan={Math.max(columns.length, 1)}>
                    <Center py="xl">
                      <Loader size="sm" />
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : data.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={Math.max(columns.length, 1)}>
                    <Center py="xl">
                      <Text c="dimmed" size="sm">
                        {emptyText}
                      </Text>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              ) : (
                data.map((row, rowIndex) => {
                  const key =
                    typeof rowKey === 'function'
                      ? rowKey(row, rowIndex)
                      : typeof rowKey === 'string'
                        ? ((row[rowKey] as React.Key) ?? rowIndex)
                        : rowIndex;

                  return (
                    <Table.Tr key={key}>
                      {columns.map((column) => (
                        <Table.Td
                          key={`${String(key)}-${column.key}`}
                          ta={column.align ?? 'left'}
                          className={column.className}
                        >
                          {column.render
                            ? column.render(row, rowIndex)
                            : getCellValue(row[column.key])}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </Box>
      </ScrollArea>

      {pagination && pagination.total > 1 && (
        <div className="flex justify-end px-4 py-3 border-t border-slate-200">
          <Pagination
            value={pagination.page}
            total={pagination.total}
            onChange={pagination.onChange}
            siblings={pagination.siblings ?? 1}
            boundaries={pagination.boundaries ?? 1}
            withEdges={pagination.withEdges ?? true}
          />
        </div>
      )}
    </Paper>
  );
};
