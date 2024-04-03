import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/common/button';
import { Input } from '@/components/ui/input';
import { TableViewOptions } from './options';
import { TableFacetedFilter } from './filter';
import { TableColumn } from './column';
import { slugToTitle } from '@/lib/helper';
import { useState } from 'react';

interface TableToolbarProps<TData> {
  table: Table<TData>;
  filterTitle?: string;
  columns: TableColumn<TData>[];
}

export function TableToolbar<TData>({
  table,
  filterTitle,
  columns,
}: Readonly<TableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchText, setSearchText] = useState<string>('');

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder={filterTitle ?? 'Filter'}
          name='filter'
          className='h-8 w-[150px] lg:w-[250px]'
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <Button type='button' className='h-8 px-2 lg:px-3' onClick={() => table.getColumn('name')?.setFilterValue(searchText)}>
          Search
        </Button>
        {columns.map(c => {
          if ('accessorKey' in c && c.filterFn && c?.filterOptions?.length) {
            const accessorKey = c.accessorKey as string;
            return (
              <TableFacetedFilter
                key={accessorKey}
                column={table.getColumn(accessorKey)}
                title={slugToTitle(accessorKey)}
                options={c.filterOptions}
              />
            )
          }
        })}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              setSearchText('');
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <TableViewOptions table={table} />
    </div>
  )
}
