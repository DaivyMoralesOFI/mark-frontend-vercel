import { ColumnDef } from "@tanstack/react-table";
import { DynamicRowActions, RowAction } from "@/shared/components/table/TableRowActions";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { DynamicTableColumnHeader } from "@/shared/components/table/TableColumnHeader";


export interface ColumnConfig<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (info: { row: any; getValue: () => any }) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableFiltering?: boolean;
}

interface CreateColumnsOptions<T> {
  columns: ColumnConfig<T>[];
  enableSelection?: boolean;
  rowActions?: RowAction[];
}

export function createColumns<T>({
  columns,
  enableSelection = true,
  rowActions = [],
}: CreateColumnsOptions<T>): ColumnDef<T>[] {
  const tableColumns: ColumnDef<T>[] = [];

  // Add selection column if enabled
  if (enableSelection) {
    tableColumns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  // Add defined columns
  columns.forEach((column) => {
    const columnDef: ColumnDef<T> = {
      id: column.id,
      accessorKey: column.accessorKey,
      accessorFn: column.accessorFn,
      header: ({ column }) => (       
        <div className="text-left">
          <DynamicTableColumnHeader column={column} title={column.id} />
        </div>
      ),
      cell: column.cell
        ? ({ row }) => column.cell?.({ row, getValue: () => row.getValue(column.id) })
        : ({ row }) => (
            <div className="flex space-x-2">
              <span className="truncate">{row.getValue(column.id)}</span>
            </div>
          ),
      enableSorting: column.enableSorting ?? true,
      enableHiding: column.enableHiding ?? true,
      enableColumnFilter: column.enableFiltering ?? true,
    };

    tableColumns.push(columnDef);
  });

  // Add actions column if provided
  if (rowActions.length > 0) {
    tableColumns.push({
      id: "actions",
      cell: ({ row }) => <DynamicRowActions row={row} actions={rowActions} />,
      enableSorting: false,
      enableHiding: false,
    });
  }

  return tableColumns;
}