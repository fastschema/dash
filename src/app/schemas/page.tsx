'use client';

import Link from 'next/link';
import { PlusCircle, DownloadCloudIcon, ImportIcon } from 'lucide-react';
import { Table } from '@/components/common/table';
import { useSchemaTableColumns } from '@/components/schema/table';
import { Button } from '@/components/common/button';
import { useContext, useEffect, useState } from 'react';
import { setPageInfo } from '@/components/pageinfo';
import { AppContext } from '@/lib/context';
import { Schema } from '@/lib/types';
import { exportSchemas } from '@/lib/schema';
import { notify } from '@/lib/notify';

const excludeSchemas = ['permission', 'role'];
export default function SchemasList() {
  const { appConfig } = useContext(AppContext);
  const schemaTableColumns = useSchemaTableColumns();
  const [rowSelected, setRowSelected] = useState<Array<string | number>>([]);
  useEffect(() => {
    setPageInfo({
      title: 'Schemas list',
      description: 'List of all schemas.',
      breadcrumbs: [{ name: 'Schema', path: '/schemas' }],
      actions: [
        <Link key='create' href='/schemas/edit'>
          <Button size='sm' icon={<PlusCircle className='mr-2 h-4 w-4' />}>
            New Schema
          </Button>
        </Link>,
        <Button
          key={'export'}
          size='sm'
          icon={<DownloadCloudIcon className='mr-2 h-4 w-4' />}
          disabled={rowSelected.length === 0}
          onClick={async () => {
            try {
              const response = await exportSchemas({
                schemas: rowSelected.filter(
                  (item) => !excludeSchemas.includes(item as string)
                ) as string[],
              });

              response.blob().then((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const timeStamp = Date.now();
                link.download = `schemas-${timeStamp}.zip`;
                link.click();
                URL.revokeObjectURL(url);
              });
            } catch (e: any) {
              notify.error(e.message);
            }
          }}
        >
          Export
        </Button>,
        <Link key='import' href='/schemas/import'>
          <Button
            key={'import'}
            size='sm'
            icon={<ImportIcon className='mr-2 h-4 w-4' />}
          >
            Import
          </Button>
        </Link>,
      ],
    });
    return setPageInfo;
  }, [rowSelected]);

  return (
    <Table<Schema>
      data={appConfig.schemas.filter((s) => {
        return !excludeSchemas.includes(s.name) && !s.is_junction_schema;
      })}
      columns={schemaTableColumns}
      getRowId={(row) => row.name}
      filterTitle='Filter schemas'
      enableRowSelection={true}
      pagination={{
        per_page: 1000,
        total: appConfig.schemas.length,
        current_page: 1,
        last_page: 1,
      }}
      onRowSelectionChange={(ids) => {
        setRowSelected(ids);
      }}
    />
  );
}
