'use client';

import Link from 'next/link';
import { setPageInfo } from '@/components/pageinfo';
import { Button } from '@/components/common/button';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { slugToTitle } from '@/lib/helper';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSchema } from '@/lib/context';
import { getContentFilterQuery, getContentList } from '@/lib/content';
import { Table } from '@/components/common/table';
import { createContentColumns } from '@/components/content/utils';
import { Content, FilterParams, FilterObject } from '@/lib/types';

export default function ContentList() {
  const query = useSearchParams();
  const schemaName = query.get('schema') ?? '';
  const limit = query.get('limit');
  const page = query.get('page');
  const sort = query.get('sort');
  const filter = query.get('filter');
  const schema = useAppSchema(schemaName);
  const schemaLabel = slugToTitle(schemaName);

  useEffect(() => {
    setPageInfo({
      title: slugToTitle(schema?.namespace ?? ''),
      description: `List all records of ${schemaLabel}`,
      breadcrumbs: [{ name: schemaLabel, path: '/content?schema=' + schemaName }],
      actions: [
        <Link key='create' href={'/content/edit?schema=' + schemaName}>
          <Button size='sm' icon={<PlusCircle className='mr-2 h-4 w-4' />}>
            New record
          </Button>
        </Link>
      ],
    });
    return setPageInfo;
  }, [schemaName]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['schema', schemaName],
    queryFn: () => getContentList(schemaName, {
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      sort: sort ?? undefined,
      filter: filter ? JSON.parse(filter) : undefined,
    }),
    retry: 0,
  });

  if (!schema?.name) {
    return <div className='h-full flex items-center justify-center'>
      <p className='text-center text-2xl font-bold'>Please select a schema</p>
    </div>
  }

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  return <Table<Content>
    ssr={true}
    data={data?.data ?? []}
    pagination={data?.pagination}
    sort={sort}
    columns={createContentColumns(schema, () => { refetch() })}
    enableRowSelection={true}
    getRowId={row => String(row.id ?? '')}
    filterTitle={`Filter ${slugToTitle(schema.name)}`}
    request={async ({ pagination, sorting, columnFilters }) => {
      const params: FilterParams = {};
      pagination?.pageIndex && (params.page = pagination.pageIndex + 1);
      pagination?.pageSize && (params.limit = pagination.pageSize);
      sorting?.length && (params.sort = sorting.map(({ id, desc }) => `${desc ? '-' : ''}${id}`).join(','));

      if (columnFilters?.length) {
        params.filter = {};
        for (const { id, value } of columnFilters) {
          params.filter[id] = {
            $like: `%${value}%`,
          } as FilterObject;
        }
      }

      const qs = getContentFilterQuery(params);
      const newUrl = `/content?schema=${schemaName}&${qs}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
      return getContentList(schemaName, params);
    }}
  />;
}
