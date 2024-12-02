import { slugToTitle } from '@/lib/helper';
import { Schema } from '@/lib/types';
import {
  Home,
  Library,
  LibraryBig,
  Package,
  Plus,
  CloudUpload,
  Settings,
  Users,
  UserRoundPlus,
  ShieldCheck,
  Image,
} from 'lucide-react';
import { ReadonlyURLSearchParams } from 'next/navigation';

export interface SidebarMenuItemLinkProps {
  type?: 'link';
  href: string;
  label: string;
  icon?: any;
  extra?: any;
  items?: SidebarMenuItemProps[];
  isActive?: () => boolean;
}

export interface SidebarMenuItemGroupProps {
  type: 'group';
  label: string;
  items: SidebarMenuItemProps[];
}

export type SidebarMenuItemProps =
  | SidebarMenuItemLinkProps
  | SidebarMenuItemGroupProps;

export const createSidebarMenuItems = ({
  schemas,
  pathname,
  searchParams,
}: {
  schemas: Schema[];
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}) => {
  const sidebarMenusItems: SidebarMenuItemProps[] = [
    {
      type: 'group',
      label: 'Management',
      items: [
        {
          href: '/',
          icon: Home,
          label: 'Dashboard',
        },
        {
          href: '/content',
          icon: Library,
          label: 'Content',
          items: schemas.map((schema) => {
            return {
              href: `/content/?schema=${schema.name}`,
              label: slugToTitle(schema.name),
              icon: LibraryBig,
              isActive: () => {
                return (
                  pathname.startsWith('/content/') &&
                  searchParams.get('schema') === schema.name
                );
              },
            };
          }),
        },
      ],
    },
    {
      type: 'group',
      label: 'System',
      items: [
        {
          href: '/schemas',
          icon: Package,
          label: 'Schemas',
          items: [
            {
              href: '/schemas/',
              label: 'All Schemas',
              icon: Package,
            },
            {
              href: '/schemas/edit/',
              label: 'New Schema',
              icon: Plus,
            },
          ],
        },
        {
          href: '/media/',
          icon: Image,
          label: 'Media',
          items: [
            {
              href: '/media/',
              label: 'All Media',
              icon: LibraryBig,
            },
            {
              href: '/media/upload/',
              label: 'Upload Media',
              icon: CloudUpload,
            },
          ],
        },
        {
          href: '/settings/',
          icon: Settings,
          label: 'Settings',
          isActive: (): boolean => {
            const isUserPage =
              pathname.startsWith('/content/') &&
              searchParams?.get('schema') === 'user';
            return isUserPage || pathname.split('?')[0] === '/settings/';
          },
          items: [
            {
              href: '/content/?schema=user',
              label: 'Users',
              icon: Users,
              isActive: () => {
                return (
                  pathname === '/content/' &&
                  searchParams.get('schema') === 'user'
                );
              },
            },
            {
              href: '/content/edit?schema=user',
              label: 'New User',
              icon: UserRoundPlus,
              isActive: () => {
                return (
                  pathname === '/content/edit/' &&
                  searchParams.get('schema') === 'user'
                );
              },
            },
            {
              href: '/settings/roles/',
              icon: ShieldCheck,
              label: 'Roles & Permissions',
            },
          ],
        },
      ],
    },
  ];

  return sidebarMenusItems;
};
