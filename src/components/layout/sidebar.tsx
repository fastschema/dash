import Link from 'next/link';
import {
  CloudUpload,
  Home,
  Image,
  Info,
  Library,
  LibraryBig,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  SwatchBook,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReactNode, useContext } from 'react';
import { UserMenu } from './user';
import { AppContext } from '@/lib/context';
import { slugToTitle } from '@/lib/helper';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { SidebarMenu, SidebarMenuItemProps } from './menu';
import { Tooltip } from '@/components/common/tooltip';

export interface SidebarProps {
  logo?: ReactNode;
  sheet?: boolean;
}

const excludeSchemasFromMenu = ['user', 'role', 'permission', 'file'];

export const Sidebar = (props: SidebarProps) => {
  const { appConfig } = useContext(AppContext);
  const { logo, sheet } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const iconClassName = !sheet ? 'h-4 w-4' : 'h-5 w-5';
  const schemas = appConfig.schemas.filter(schema => !excludeSchemasFromMenu.includes(schema.name));
  const navClassName = !sheet
    ? 'grid items-start px-2 text-sm font-medium lg:px-4'
    : 'grid gap-2 text-lg font-medium';

  const sidebarMenus: SidebarMenuItemProps[] = [
    {
      href: '/',
      icon: <Home className={iconClassName} />,
      label: 'Dashboard',
    },
    {
      href: '/content',
      icon: <Library className={iconClassName} />,
      label: 'Content',
      extra: <Badge className='flex items-center justify-center w-5 h-5 rounded-full px-2'>
        {schemas.length}
      </Badge>,
      items: schemas.map(schema => {
        return {
          href: `/content/?schema=${schema.name}`,
          label: slugToTitle(schema.name),
          icon: <LibraryBig className='w4 h-4' />,
          checkActiveFn: () => {
            return pathname === `/content` && searchParams.get('schema') === schema.name;
          },
        }
      }),
    },
    {
      href: '/schemas',
      icon: <Package className={iconClassName} />,
      label: 'Schemas',
      items: [
        {
          href: '/schemas',
          label: 'All Schemas',
          icon: <Package className='w4 h-4' />,
        },
        {
          href: '/schemas/edit',
          label: 'New Schema',
          icon: <Plus className='w4 h-4' />,
        }
      ],
    },
    {
      href: '/media',
      icon: <Image className={iconClassName} />,
      label: 'Media',
      items: [
        {
          href: '/media',
          label: 'All Media',
          icon: <LibraryBig className='w4 h-4' />,
        },
        {
          href: '/media/upload',
          label: 'Upload Media',
          icon: <CloudUpload className='w4 h-4' />,
        }
      ],
    },
    {
      href: '/settings',
      icon: <Settings className={iconClassName} />,
      label: 'Settings',
      checkActiveFn: (href: string, pathName?: string, searchParams?: ReadonlyURLSearchParams): boolean => {
        const isUserPage = (pathName ?? '/').startsWith('/content/') &&
          searchParams?.get('schema') === 'user';
        return isUserPage || (pathname ?? '/').split('?')[0] === href;
      },
      items: [
        {
          href: '/content/?schema=user',
          label: 'Users',
          icon: <Users className={iconClassName} />,
          checkActiveFn: () => {
            return pathname === '/content' && searchParams.get('schema') === 'user';
          },
        },
        {
          href: '/content/edit?schema=user',
          label: 'New User',
          icon: <UserRoundPlus className={iconClassName} />,
          checkActiveFn: () => {
            return pathname === '/content/edit' && searchParams.get('schema') === 'user';
          }
        },
        {
          href: '/settings/roles',
          icon: <ShieldCheck className={iconClassName} />,
          label: 'Roles & Permissions',
        },
      ],
    },
  ];

  return <aside className='flex h-full flex-col'>
    <nav className={navClassName}>
      {logo && <Link
        href='#'
        className='flex items-center gap-2 text-lg font-semibold'
      >
        <SwatchBook className='h-6 w-6' />
        <span>Fastschema</span>
      </Link>}

      <SidebarMenu items={sidebarMenus} pathname={pathname} searchParams={searchParams} />
    </nav>
    <nav className='mt-auto mb-3 flex flex-row items-center px-6 lg:px-7 gap-3'>
      <div className='flex-1'>
        <UserMenu />
      </div>
      <Tooltip tip='Help'>
        <Info className='h-4 w-4' />
      </Tooltip>
    </nav>
  </aside>;
}
