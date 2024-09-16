'use client';

import Link from 'next/link';
import { setPageInfo } from '@/components/pageinfo';
import { SystemError } from '@/components/common/error';
import { Loading } from '@/components/common/loading';
import { Table } from '@/components/common/table';
import { useRoleTableColumns } from '@/components/role/role';
import { Button } from '@/components/common/button';
import { listRoles } from '@/lib/role';
import { Role } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function RolesList() {
  const { data: roles, isLoading, error, refetch } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: listRoles,
  });

  const roleTableColumns = useRoleTableColumns(refetch);
  useEffect(() => {
    setPageInfo({
      title: 'Roles list',
      description: 'List of all roles.',
      breadcrumbs: [
        { name: 'Settings', path: '/settings' },
        { name: 'Roles', path: '/settings/roles' },
      ],
      actions: [<Link key='create' href='/settings/roles/edit'>
        <Button size='sm' icon={<PlusCircle className='mr-2 h-4 w-4' />}>
          New Role
        </Button>
      </Link>],
    });
    return setPageInfo;
  }, []);

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  return <Table<Role>
    data={roles}
    columns={roleTableColumns}
    getRowId={row => row.id.toString()}
    filterTitle='Filter roles'
    pagination={{
      total: roles?.length ?? 0,
      current_page: 1,
      per_page: 10,
      last_page: Math.ceil((roles?.length ?? 0) / 10),
    }}
  />;
}
