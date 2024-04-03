import Link from 'next/link';
import uniqBy from 'lodash.uniqby';
import eventBus from '@/lib/event-bus';
import {
  Breadcrumb as BreadcrumbBase,
  BreadcrumbItem as BreadcrumbItemBase,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useEffect, useState } from 'react';
import { PageInfoData } from '@/lib/types';

export const defaultPageInfo: PageInfoData = {
  title: '',
  description: '',
  breadcrumbs: [],
  actions: [],
};

export const setPageInfo = (pageInfo?: PageInfoData) => {
  eventBus.dispatch('pageInfo', pageInfo ?? []);
}

export const PageInfo = () => {
  const [pageInfo, setPageInfo] = useState<PageInfoData>(defaultPageInfo);

  useEffect(() => {
    eventBus.on<PageInfoData>('pageInfo', pageInfo => {
      setPageInfo(pageInfo ?? defaultPageInfo);
    });
  }, []);

  const allBreadcrumbItems =
    pageInfo?.breadcrumbs?.length
      ? [{ name: 'Dash', path: '/' }, ...(pageInfo.breadcrumbs ?? [])]
      : [];
  const totalItems = allBreadcrumbItems.length;

  return <>
    <title>{pageInfo.title}</title>
    <BreadcrumbBase>
      <BreadcrumbList>
        {uniqBy(allBreadcrumbItems, item => item.path).map((b, i) => {
          const isLast = i === totalItems - 1;
          return <Fragment key={b.path}>
            <BreadcrumbItemBase>
              {!isLast
                ? <BreadcrumbLink asChild>
                  <Link href={b.path}>
                    {b.name}
                  </Link>
                </BreadcrumbLink>
                : <BreadcrumbPage>{b.name}</BreadcrumbPage>}
            </BreadcrumbItemBase>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        })}
      </BreadcrumbList>
    </BreadcrumbBase>
    {(pageInfo.title || pageInfo.description) && <div className='flex items-center justify-between space-y-2 w-full'>
      <div>
        {pageInfo.title && <h1 className='text-lg font-semibold md:text-2xl'>{pageInfo.title}</h1>}
        {pageInfo.description && <p className='text-muted-foreground'>
          {pageInfo.description}
        </p>}
      </div>
      <div className='ml-auto mr-4 flex gap-2'>
        {pageInfo.actions}
      </div>
    </div>}
  </>
    ;
}
