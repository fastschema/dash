import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useUser } from '@/lib/context';
import { slugToTitle } from '@/lib/helper';
import { logout } from '@/lib/user';

export const SidebarFooterContent = () => {
  const user = useUser();
  const username = user?.username ?? 'NoName';
  const email = user?.email ?? 'NoEmail';
  const fallback = username.charAt(0).toUpperCase();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage alt={username} />
                  <AvatarFallback className='rounded-lg'>
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {slugToTitle(username)}
                  </span>
                  <span className='truncate text-xs'>{email}</span>
                </div>
                <ChevronsUpDown className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
              side='bottom'
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage alt={username} />
                    <AvatarFallback className='rounded-lg'>
                      {fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>{username}</span>
                    <span className='truncate text-xs'>{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem> */}
                <DropdownMenuItem className='cursor-pointer'>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => logout()}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
