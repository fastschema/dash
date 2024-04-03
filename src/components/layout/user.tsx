import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';
import { logout } from '@/lib/user';
import { useUser } from '@/lib/context';
import { slugToTitle } from '@/lib/helper';

export const UserMenu = () => {
  const user = useUser();
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className='inline-flex items-center justify-center text-sm font-medium gap-2 outline-none text-muted-foreground hover:text-primary'>
        <CircleUser className='h-5 w-5' />
        <span>{slugToTitle(user?.username ?? '')}</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='start'>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className='cursor-pointer'>Settings</DropdownMenuItem>
      <DropdownMenuItem className='cursor-pointer'>Support</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className='cursor-pointer' onClick={() => logout()}>
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}
