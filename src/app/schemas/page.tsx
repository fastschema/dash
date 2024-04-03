'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Table } from '@/components/common/table';
import { useSchemaTableColumns } from '@/components/schema/table';
import { Button } from '@/components/common/button';
import { useContext, useEffect } from 'react';
import { setPageInfo } from '@/components/pageinfo';
import { AppContext } from '@/lib/context';
import { Schema } from '@/lib/types';

export default function SchemasList() {
  const { appConfig } = useContext(AppContext);
  const schemaTableColumns = useSchemaTableColumns();

  useEffect(() => {
    setPageInfo({
      title: 'Schemas list',
      description: 'List of all schemas.',
      breadcrumbs: [{ name: 'Schema', path: '/schemas' }],
      actions: [<Link key='create' href='/schemas/edit'>
        <Button size='sm' icon={<PlusCircle className='mr-2 h-4 w-4' />}>
          New Schema
        </Button>
      </Link>],
    });
    return setPageInfo;
  }, []);

  return <Table<Schema>
    data={appConfig.schemas}
    columns={schemaTableColumns}
    getRowId={row => row.name}
    filterTitle='Filter schemas'
  />;
}
