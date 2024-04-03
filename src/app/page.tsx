'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppConfig } from '@/lib/context';
import { getStats } from '@/lib/tool';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Image, Library, Package, Plus, ShieldCheck, Users } from 'lucide-react';
import { Loading } from '@/components/common/loading';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { slugToTitle } from '@/lib/helper';
import { Button } from '@/components/common/button';

export default function Index() {
  const { schemas } = useAppConfig();

  const { isLoading, data: stats, error } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div style={{ width: '100%', marginBottom: 30 }}>
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>{error.message}</AlertTitle>
      </Alert>
    </div>
  }

  return <>
    <title>Fastschema</title>
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Button className='inline-block w-[220px]' icon={<Plus size={14} />}>
          <Link href={`/settings/roles`}>
            Manage Roles and Permissions
          </Link>
        </Button>

        {schemas.map(schema => {
          return <Card key={schema.name}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {slugToTitle(schema.name)}
              </CardTitle>
              <Library className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <Button icon={<Plus size={14} />}>
                <Link href={`/content/edit?schema=${schema.name}`}>
                  Create {schema.name}
                </Link>
              </Button>
            </CardContent>
          </Card>;
        })}
      </div>
      <div className='space-y-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Schema
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalSchemas}</div>
            <p className='text-xs text-muted-foreground'>
              include {schemas.filter(s => s.is_system_schema).length} system schemas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Roles</CardTitle>
            <ShieldCheck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalRoles}</div>
            <p className='text-xs text-muted-foreground'>
              <Link href='/settings/roles'>Manage roles</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Users
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              <Link href='/content?schema=user'>Manage users</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Medias</CardTitle>
            <Image className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalMedias}</div>
            <p className='text-xs text-muted-foreground'>
              <Link href='/media'>Manage medias</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </>
}
