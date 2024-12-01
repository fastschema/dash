import { Book, ChevronsUpDown, Github, Plus } from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useState } from 'react';
import logo from '@/assets/logo.svg';
import discord from '@/assets/discord.svg';
import Image from 'next/image';
import { useAppConfig } from '@/lib/context';

const links = [
  {
    name: 'Documentation',
    logo: Book,
    link: 'https://fastschema.com/',
  },
  {
    name: 'Source Code',
    logo: Github,
    link: 'https://github.com/fastschema/fastschema',
  },
  {
    name: 'Support',
    logo: () => <Image src={discord} alt='Discord' className='w-4' />,
    link: 'https://discord.gg/Auy2Zr3Ycf',
  },
];

export const SidebarHeaderContent = () => {
  const appConfig = useAppConfig();
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <div className='flex aspect-square w-9 items-center justify-center rounded-lg text-sidebar-primary-foreground'>
                  <Image src={logo} alt='FastSchema' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>FastSchema</span>
                  <span className='truncate text-xs'>
                    {appConfig.version ?? 'unknown'}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              align='start'
              side='bottom'
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-xs text-muted-foreground'>
                Discover
              </DropdownMenuLabel>
              {links.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  className='gap-2 p-2 cursor-pointer'
                  onClick={() => window.open(team.link)}
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <team.logo className='size-4 shrink-0' />
                  </div>
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2 cursor-pointer'
                onClick={() =>
                  window.open(
                    'https://github.com/fastschema/fastschema/issues/new'
                  )
                }
              >
                <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                  <Plus className='size-4' />
                </div>
                Create issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
