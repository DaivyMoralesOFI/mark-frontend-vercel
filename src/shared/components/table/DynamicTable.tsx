import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DynamicTableToolbar } from "@/shared/components/table/TableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { DynamicTablePagination } from "@/shared/components/table/TablePagination";


export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ColumnFilterConfig {
  id: string;
  title: string;
  options: FilterOption[];
}

interface DynamicTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  pageSizeOptions?: number[];
  filterableColumns?: ColumnFilterConfig[];
  defaultVisibility?: VisibilityState;
  defaultSorting?: SortingState;
  showFilters?: boolean;
  showPagination?: boolean;
  showViewOptions?: boolean;
  onSelectionChange?: (selection: any) => void;
  transformData?: (data: TData[]) => TData[];
}

export function DynamicTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  filterableColumns = [],
  defaultVisibility = {},
  defaultSorting = [],
  showFilters = true,
  showPagination = true,
  showViewOptions = true,
  onSelectionChange,
  transformData,
}: DynamicTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultVisibility);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  // Set initial pagination state with the provided initialPageSize
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  // Transform data if needed
  const tableData = React.useMemo(() => {
    if (transformData) {
      return transformData(data);
    }
    return data;
  }, [data, transformData]);

  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(rowSelection);
    }
  }, [rowSelection, onSelectionChange]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 h-full w-full">
      {showFilters && filterableColumns.length > 0 && (
        <DynamicTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          showViewOptions={showViewOptions}
        />
      )}
      <div className="border border-outline rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <DynamicTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}
