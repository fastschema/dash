import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

export interface SidebarMenuProps {
  items: SidebarMenuItemProps[];
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  className?: string;
}

export interface SidebarMenuItemProps {
  label: ReactNode;
  href: string;
  pathname?: string;
  searchParams?: ReadonlyURLSearchParams;
  checkActiveFn?: (href: string, pathname?: string, searchParams?: ReadonlyURLSearchParams) => boolean | undefined;
  sheet?: boolean;
  icon?: ReactNode;
  extra?: ReactNode;
  items?: SidebarMenuItemProps[];
}

export const SidebarMenu = (props: SidebarMenuProps) => {
  const { items, pathname, searchParams, className } = props;

  // Create default value array so that the accordion can be opened when the child is active.
  // For example, if the pathName is /schemas/edit/item
  // Then the default value should be ['/schemas', '/schemas/edit', '/schemas/edit/item']
  const defaultOpenItems: string[] = [];
  const pathParts = pathname.split('/').filter(Boolean);
  let path = '';
  pathParts.forEach(part => {
    path += '/' + part;
    defaultOpenItems.push(path);
  });

  items.forEach(item => {
    const isActive = item.checkActiveFn
      ? item.checkActiveFn(item.href, pathname, searchParams)
      : (pathname ?? '/').split('?')[0] === item.href;

    if (isActive && !defaultOpenItems.includes(item.href)) {
      defaultOpenItems.push(item.href);
    }
  });

  return <Accordion
    type='multiple'
    className={cn('w-full', className)}
    defaultValue={defaultOpenItems}
  >
    {items.map((item, i) => {
      return <SidebarMenuItem key={item.href + i} {...item} pathname={pathname} searchParams={searchParams} />;
    })}
  </Accordion>
}

export const SidebarMenuItem = (props: SidebarMenuItemProps) => {
  const { label, href, pathname, searchParams, checkActiveFn, sheet, icon, extra, items } = props;
  const isActive = checkActiveFn
    ? checkActiveFn(props.href, pathname, searchParams)
    : (pathname ?? '/').split('?')[0] === props.href;

  const itemClassName = cn(
    'flex items-center text-muted-foreground px-3 py-2',
    isActive ? 'text-primary' : '',
    !sheet
      ? 'gap-2 rounded-lg transition-all hover:text-primary'
      : 'gap-3 rounded-xl mx-[-0.65rem] hover:text-foreground');

  if (!items?.length) {
    return <Link href={href} className={itemClassName}>
      {icon}
      {label}
    </Link>
  }

  return <AccordionItem value={href} className='border-0'>
    <AccordionTrigger className={cn('hover:no-underline', itemClassName, isActive ? 'bg-muted' : '')}>
      <span className='rotate-0'>
        {icon}
      </span>
      {label}
      <span className='ml-auto flex shrink-0'>
        {extra}
      </span>
    </AccordionTrigger>
    <AccordionContent>
      <SidebarMenu
        items={items}
        pathname={(pathname ?? '/')}
        searchParams={searchParams ?? new ReadonlyURLSearchParams(new URLSearchParams())}
        className='pl-5 mt-1'
      />
    </AccordionContent>
  </AccordionItem>;
}
