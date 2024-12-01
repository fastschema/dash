import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppContext } from '@/lib/context';
import { ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useContext } from 'react';
import { SidebarHeaderContent } from './sidebar-header';
import { SidebarFooterContent } from './sidebar-footer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { createSidebarMenuItems, SidebarMenuItemProps } from './sidebar-data';
import { Separator } from '../ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/breadcrumb';
import { PageInfo } from '../pageinfo';

export interface SidebarProps {
  logo?: ReactNode;
  sheet?: boolean;
  children?: ReactNode;
}

const excludeSchemasFromMenu = ['user', 'role', 'permission', 'file'];

export function Layout(props: SidebarProps) {
  const { appConfig } = useContext(AppContext);
  const { logo, sheet } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const schemas = appConfig.schemas.filter(
    (schema) => !excludeSchemasFromMenu.includes(schema.name)
  );

  const sidebarMenusItems = createSidebarMenuItems({
    schemas,
    pathname,
    searchParams,
  });

  const hasActiveChild = (items: SidebarMenuItemProps[]) => {
    return items.some((item): boolean => {
      if (item.type === 'group') {
        return hasActiveChild(item.items);
      }

      return !!(
        pathname.startsWith(item.href) ||
        (item?.isActive?.() ?? false) ||
        hasActiveChild(item?.items ?? [])
      );
    });
  };

  const RenderSidebarItemsList = ({
    items,
    sub,
  }: {
    items: SidebarMenuItemProps[];
    sub?: boolean;
  }) => {
    const MenuWrapper = !sub ? SidebarMenu : SidebarMenuSub;
    return (
      <MenuWrapper>
        {items.map((item) => {
          return <RenderSidebarItem key={item.label} item={item} sub={sub} />;
        })}
      </MenuWrapper>
    );
  };

  const RenderSidebarItem = ({
    item,
    sub,
  }: {
    item: SidebarMenuItemProps;
    sub?: boolean;
  }) => {
    // Render group of items
    if (item.type === 'group') {
      return (
        <SidebarGroup>
          <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <RenderSidebarItemsList items={item.items} sub={sub} />
          </SidebarGroupContent>
        </SidebarGroup>
      );
    }

    // Render single item
    if (!item?.items?.length) {
      const MenuItem = sub ? SidebarMenuSubItem : SidebarMenuItem;
      const MenuButton = sub ? SidebarMenuSubButton : SidebarMenuButton;
      const isActive =
        item?.isActive?.() ?? pathname.includes(item.href);
      return (
        <MenuItem key={item.label}>
          <MenuButton asChild isActive={isActive}>
            <Link href={item.href} title={item.label}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </MenuButton>
        </MenuItem>
      );
    }

    // Render item with sub items (collapsible)
    const shouldOpen = hasActiveChild(item.items);
    return (
      <Collapsible
        key={item.label}
        asChild
        defaultOpen={shouldOpen}
        className='group/collapsible'
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.label}>
              {item.icon && <item.icon />}
              <span>{item.label}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <RenderSidebarItemsList items={item.items} sub={true} />
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <>
      <Sidebar>
        <SidebarHeaderContent />
        <SidebarContent>
          <RenderSidebarItemsList items={sidebarMenusItems} />
        </SidebarContent>
        <SidebarFooterContent />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <PageInfo />
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='gap-4'>{props.children}</div>
          {/* <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' /> */}
        </div>
      </SidebarInset>
    </>
  );
}
