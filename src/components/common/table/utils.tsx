import { Checkbox } from '@/components/ui/checkbox';
import { TableColumn } from './column';
import {
  PaginationState,
  TableOptions,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Pagination } from '@/lib/types/content';
import { GetTableOptionsProps, SendRequestProps } from './types';
import { notify } from '@/lib/notify';

export const getColumns = <T,>(columns: TableColumn<T>[], enableRowSelection?: boolean): TableColumn<T>[] => {
  const checkColumns: TableColumn<T>[] = (enableRowSelection ? [{
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }] : []);

  return [...checkColumns, ...(columns ?? [])];
}

export const getTableOptions = <T,>(props: GetTableOptionsProps<T>): TableOptions<T> => {
  const {
    pageCount,
    columns,
    ssr: serverSide,
    enableRowSelection,
    getRowId,
    onRowSelectionChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onPaginationChange,
  } = props;
  return {
    data: [],
    columns: getColumns(columns, enableRowSelection),
    globalFilterFn: (row, columnId, filterValue) => {
      const safeValue = (() => {
        const value = row.getValue(columnId);
        return typeof value !== 'string' ? String(value) : value;
      })();

      return safeValue.toLowerCase().includes(filterValue.toLowerCase());
    },
    manualFiltering: serverSide,
    manualSorting: serverSide,
    manualPagination: serverSide,
    enableRowSelection: true,
    autoResetPageIndex: !serverSide,
    pageCount,
    getRowId,
    onPaginationChange,
    onRowSelectionChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  }
}

export const sendRequestFn = <T,>({
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
}: SendRequestProps<T>) => {
  if (!initialized.current || !ssr || !request) {
    setTimeout(() => {
      initialized.current = true;
    }, 0);
    return;
  }

  (async () => {
    setLoading?.(true);
    try {
      const result = await request({
        pagination,
        sorting,
        columnFilters,
      });

      if (!result) {
        return;
      }

      setData?.(result?.items ?? []);
      setPaginationData({
        current_page: result?.current_page ?? 1,
        last_page: result?.last_page ?? 1,
        per_page: result?.per_page ?? 10,
        total: result?.total ?? 0,
      });
      if (resetPage) {
        setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
      }
    } catch (error: any) {
      console.error(error);
      notify.error(error.message ?? 'Something went wrong');
    }

    setLoading?.(false);
  })();
};

export const usePagination = (paginationData?: Pagination) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: (paginationData?.current_page ?? 1) - 1,
    pageSize: paginationData?.per_page ?? 10,
  });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  return {
    pagination,
    setPagination,
  }
}
