import {
  Table as TableBase,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { TableToolbar } from './toolbar';
import { Pagination } from './pagination';
import { TableColumn } from './column';
import { getTableOptions, sendRequestFn, usePagination } from './utils';
import { PaginationData } from '@/lib/types';
import { RequestFn } from './types';
import { Loading } from '../loading';
import { cn } from '@/lib/utils';

export interface TableProps<T> {
  className?: string;
  data?: T[];
  pagination?: PaginationData;
  sort?: string | null;
  columns: TableColumn<T>[];
  filterTitle?: string;
  enableRowSelection?: boolean;
  ssr?: boolean;
  hideToolbar?: boolean;
  getRowId?: ((originalRow: T, index: number, parent?: Row<T> | undefined) => string);
  request?: RequestFn<T>;
  onRowSelectionChange?: (ids: Array<string | number>) => void;
}

export const Table = <T,>(props: TableProps<T>) => {
  const {
    className,
    ssr,
    columns,
    filterTitle,
    enableRowSelection,
    hideToolbar,
    request,
    getRowId,
    onRowSelectionChange,
  } = props;
  const [data, setData] = useState<T[]>(props.data ?? []);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(
    (props.sort ?? '')
      .split(',').filter(s => !!s.trim())
      .map(sort => {
        let desc = false;
        if (sort.startsWith('-')) {
          desc = true;
          sort = sort.substring(1);
        }

        return { id: sort, desc };
      })
  );

  const [paginationData, setPaginationData] = useState<PaginationData | undefined>(props.pagination);
  const { pagination, setPagination } = usePagination(props.pagination);
  const initialized = useRef(false);
  const table = useReactTable({
    ...getTableOptions({
      pageCount: ssr ? paginationData?.last_page : undefined,
      columns,
      enableRowSelection,
      ssr,
      getRowId,
      onPaginationChange: setPagination,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
    }),
    data,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    setData(props.data ?? []);
  }, [props.data]);
  useEffect(() => {
    setPaginationData(props.pagination);
  }, [props.pagination]);

  const sendRequest = (resetPage?: boolean) => sendRequestFn({
    sorting,
    pagination,
    columnFilters,
    initialized,
    ssr,
    resetPage,
    request,
    setData,
    setPaginationData,
    setPagination,
    setLoading,
  });

  useEffect(sendRequest, [pagination, sorting]);
  useEffect(() => sendRequest(true), [columnFilters]);
  useEffect(() => onRowSelectionChange?.(Object.keys(rowSelection)), [rowSelection]);

  return <div className='space-y-4'>
    {!hideToolbar && <TableToolbar table={table} columns={columns} filterTitle={filterTitle} />}
    {loading && <Loading className='absolute' />}
    <div className={cn('relative rounded-md border overflow-auto', className)}>
      <TableBase className='table-fixed'>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => {
              return <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => {
                  return <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>;
                })}
              </TableRow>;
            })
          ) : <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              No results.
            </TableCell>
          </TableRow>}
        </TableBody>
      </TableBase>
    </div>
    {(props?.pagination?.last_page ?? 1) > 1 && <Pagination table={table} />}
  </div>;
}
