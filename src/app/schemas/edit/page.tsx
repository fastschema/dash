'use client';

import { useQuery } from '@tanstack/react-query';
import { setPageInfo } from '@/components/pageinfo';
import { EditSchemaForm } from '@/components/schema/edit';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSchema } from '@/lib/schema';
import { Loading } from '@/components/common/loading';
import { SystemError } from '@/components/common/error';

export default function SchemaEditPage() {
  const query = useSearchParams();
  const schemaName = query.get('schema');
  const { data: editingSchema, isLoading, error } = useQuery({
    queryKey: ['schema', schemaName],
    queryFn: () => getSchema(schemaName ?? ''),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const title = !editingSchema?.name
      ? 'Create new schema'
      : `Edit schema: ${editingSchema.name}`;
    const desc = !editingSchema?.name
      ? 'Create a new schema for your data.'
      : `Edit schema ${editingSchema.name} to change the structure of your data.`;
    setPageInfo({
      title: title,
      description: desc,
      breadcrumbs: [
        { name: 'Schema', path: '/schemas' },
        { name: !schemaName ? 'New schema' : `Edit schema ${schemaName}`, path: '/schemas/edit?schema=' + schemaName },
      ],
    });
    return setPageInfo;
  }, [schemaName, editingSchema]);

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  return <EditSchemaForm editingSchema={editingSchema} />;
}
