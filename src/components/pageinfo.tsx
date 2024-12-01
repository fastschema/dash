import Link from 'next/link';
import uniqBy from 'lodash.uniqby';
import eventBus from '@/lib/event-bus';
import {
  Breadcrumb as BreadcrumbBase,
  BreadcrumbItem,
  BreadcrumbItem as BreadcrumbItemBase,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment, useEffect, useState } from 'react';
import { PageInfoData } from '@/lib/types';
import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';

export const defaultPageInfo: PageInfoData = {
  title: '',
  description: '',
  breadcrumbs: [],
  actions: [],
};

export const setPageInfo = (pageInfo?: PageInfoData) => {
  eventBus.dispatch('pageInfo', pageInfo ?? []);
};

export const PageInfo = () => {
  const [pageInfo, setPageInfo] = useState<PageInfoData>(defaultPageInfo);

  useEffect(() => {
    eventBus.on<PageInfoData>('pageInfo', (pageInfo) => {
      setPageInfo(pageInfo ?? defaultPageInfo);
    });
  }, []);

  const allBreadcrumbItems = pageInfo?.breadcrumbs?.length
    ? [{ name: 'Dash', path: '/' }, ...(pageInfo.breadcrumbs ?? [])]
    : [];
  const totalItems = allBreadcrumbItems.length;

  return (
    <>
      <title>{pageInfo.title}</title>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <BreadcrumbBase>
            <BreadcrumbList>
              {uniqBy(allBreadcrumbItems, (item) => item.path).map((b, i) => {
                const isLast = i === totalItems - 1;
                return (
                  <Fragment key={b.path}>
                    <BreadcrumbItem>
                      {!isLast ? (
                        <BreadcrumbLink asChild>
                          <Link href={b.path}>{b.name}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{b.name}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className='hidden md:block' />
                    )}
                  </Fragment>
                );
              })}

              {/* <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='#'>
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem> */}
            </BreadcrumbList>
          </BreadcrumbBase>
        </div>
      </header>

      {(pageInfo.title || pageInfo.description) && (
        <div className='flex items-center justify-between px-4 mb-5 space-y-2 w-full'>
          <div>
            {pageInfo.title && (
              <h1 className='text-lg font-semibold md:text-xl'>
                {pageInfo.title}
              </h1>
            )}
            {pageInfo.description && (
              <p className='text-muted-foreground text-sm'>{pageInfo.description}</p>
            )}
          </div>
          <div className='ml-auto mr-4 flex gap-2'>{pageInfo.actions}</div>
        </div>
      )}
    </>
  );
};
