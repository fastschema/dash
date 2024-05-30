import * as notify from '@/lib/notify';
import Link from 'next/link';
import { Schema } from '@/lib/types';
import { TableColumnHeader } from '@/components/common/table/header';
import { schemaSchema } from './data';
import { TableColumn, defaultColumnFilter } from '@/components/common/table/column';
import { Badge } from '@/components/ui/badge';
import { Field } from 'react-hook-form';
import { deleteSchema } from '@/lib/schema';
import { useContext } from 'react';
import { AppContext } from '@/lib/context';
import { Separator } from '@/components/ui/separator';

export const useSchemaTableColumns = (): TableColumn<Schema>[] => {
  const { reloadAppConfig } = useContext(AppContext);

  return [
    {
      accessorKey: 'name',
      enableSorting: true,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => <TableColumnHeader column={column} title='Name' />,
      cell: ({ row }) => <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>
          {row.getValue('name')}
        </span>
      </div>,
    },
    {
      accessorKey: 'namespace',
      enableSorting: true,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => <TableColumnHeader column={column} title='Namespace' />,
      cell: ({ row }) => <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>
          {row.getValue('namespace')}
        </span>
      </div>,
    },
    {
      accessorKey: 'is_system_schema',
      header: ({ column }) => <TableColumnHeader column={column} title='System' />,
      cell: ({ row }) => <div className='w-[80px]'>{row.getValue('is_system_schema') ? <Badge>System</Badge> : null}</div>,
      filterFn: (row, id, value) => value === row.getValue(id),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'label_field',
      filterFn: defaultColumnFilter,
      header: ({ column }) => <TableColumnHeader column={column} title='Label field' />,
      cell: ({ row }) => <div className='w-[80px]'>{row.getValue('label_field')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'disable_timestamp',
      filterFn: defaultColumnFilter,
      filterOptions: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
      header: ({ column }) => <TableColumnHeader column={column} title='Timestamp' />,
      cell: ({ row }) => {
        const disableTimestamp = row.getValue('disable_timestamp');
        return <div className='w-[80px]'>
          <Badge variant={disableTimestamp ? 'default' : 'secondary'}>{String(disableTimestamp)}</Badge>
        </div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fields',
      header: ({ column }) => <TableColumnHeader column={column} title='Fields' />,
      cell: ({ row }) => {
        return <div className='w-[80px]'>{row.getValue<Field[]>('fields')?.length}</div>;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const schema = schemaSchema.parse(row.original);

        return <div className='flex h-5 items-center space-x-4 text-sm min-w-[80px]'>
          <Link className='cursor-pointer hover:underline' href={`/schemas/edit?schema=${schema.name}`}>
            Edit
          </Link>
          {!schema.is_system_schema && <>
            <Separator orientation='vertical' />
            <button className='cursor-pointer hover:underline text-red-800' onClick={async () => {
              if (confirm(`Are you sure you want to delete this schema: ${schema.name}?`)) {
                try {
                  await deleteSchema(schema.name);
                  notify.success(`Schema ${schema.name} deleted`);
                  reloadAppConfig();
                } catch (e: any) {
                  notify.error(e.message);
                }
              }
            }}>
              Delete
            </button>
          </>}
        </div>;
      },
    },
  ];
}
