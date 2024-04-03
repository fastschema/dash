'use client';

import { useQuery } from '@tanstack/react-query';
import { setPageInfo } from '@/components/pageinfo';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/common/loading';
import { SystemError } from '@/components/common/error';
import { RoleEditForm } from '@/components/role/edit';
import { getRole } from '@/lib/role';

export default function RoleEditPage() {
  const query = useSearchParams();
  const roleId = query.get('id');
  const { data: editingRole, isLoading, error } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => getRole(roleId),
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setPageInfo({
      title: !editingRole?.name
        ? 'Create new role'
        : `Edit role: ${editingRole.name}`,
      description: !editingRole?.name
        ? 'Create a new role for your users.'
        : `Edit role ${editingRole.name} to change the permissions of your users.`,
      breadcrumbs: [
        { name: 'Roles', path: '/settings/roles' },
        {
          name: !roleId ? 'New role' : 'Edit role',
          path: '/settings/roles/edit?id=' + (roleId ?? ''),
        },
      ],
    });
    return setPageInfo;
  }, [roleId, editingRole]);


  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  return <RoleEditForm editingRole={editingRole} />;
}
