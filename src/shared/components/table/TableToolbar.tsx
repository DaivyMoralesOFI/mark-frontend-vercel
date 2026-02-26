
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { ColumnFilterConfig } from "@/shared/components/table/DynamicTable";
import { DynamicTableFacetedFilter } from "@/shared/components/table/TableFacetedFilter";
import { Button } from "@/shared/components/ui/Button";
import { DynamicTableViewOptions } from "@/shared/components/table/TableViewOptions";

interface DynamicTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns: ColumnFilterConfig[];
  showViewOptions?: boolean;
  title?: string;
}

export function DynamicTableToolbar<TData>({
  table,
  filterableColumns,
  showViewOptions = true,
  title = "Filters",
}: DynamicTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  console.log(filterableColumns);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 flex-wrap">
        {title && (
          <h3 className="font-title font-semibold text-3xl mr-4">{title}</h3>
        )}
        {filterableColumns.map((filterConfig) => {
          const column = table.getColumn(filterConfig.id);
          if (!column) return null;
          
          return (
            <DynamicTableFacetedFilter
              key={filterConfig.id}
              column={column}
              title={filterConfig.title}
              options={filterConfig.options}
            />
          );
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {showViewOptions && <DynamicTableViewOptions table={table} />}
    </div>
  );
}