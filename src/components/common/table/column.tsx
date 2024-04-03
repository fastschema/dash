import { ColumnDef, Row } from '@tanstack/react-table';

export const defaultColumnFilter = <T,>(row: Row<T>, id: string, value: any) => {
  const cellValue = String(row.getValue(id));
  return cellValue.toLocaleLowerCase().includes(String(value).toLocaleLowerCase());
}

export type TableColumn<T> = ColumnDef<T> & {
  filterOptions?: Array<{
    label: string;
    value: any;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}
