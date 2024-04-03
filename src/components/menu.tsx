import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { logout } from '@/lib/user';

export const TopMenu = () => {
  return (
    <Menubar className='rounded-none border-b border-none px-2 lg:px-4'>
      <MenubarMenu>
        <MenubarTrigger className='font-bold'>Fastschema</MenubarTrigger>
        <MenubarContent>
          <MenubarItem className='block'>
            <a href='https://fastschema.com' title='About' target='_blank' className='block'>About</a>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='block'>
            <a href='https://docs.fastschema.com' title='Document' target='_blank' className='block'>Document</a>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='block'>
            <a href='https://fastschema.com/news' title='About' target='_blank' className='block'>News</a>
          </MenubarItem>
          <MenubarItem className='block'>
            <a href='https://github.com/fastschema/fastschema' title='About' target='_blank' className='block'>Github</a>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href='/' className='block cursor-pointer'>Dash</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className='relative'>Schema</MenubarTrigger>
        <MenubarContent>
          <MenubarItem className='block'>
            <Link href='/schemas' className='block cursor-pointer'>All Schemas</Link>
          </MenubarItem>
          <MenubarItem className='block'>
            <Link href='/schemas/edit' className='block'>New Schema</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Setting</MenubarTrigger>
        <MenubarContent>
          <MenubarItem className='block'>
            <Link href='/roles' className='block cursor-pointer'>Roles & Permissions</Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='block cursor-pointer'>...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className='relative'>Account</MenubarTrigger>
        <MenubarContent>
          <MenubarItem className='block cursor-pointer'>Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => logout()} className='block cursor-pointer'>Logout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
