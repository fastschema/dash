import Link from 'next/link';
import { Bell, Menu, SwatchBook } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/common/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { UserMenu } from './user';
import { PageInfo } from '@/components/pageinfo';
// import { Breadcrumb } from '@/components/pageinfo';

export interface LayoutProps {
  children: ReactNode;
}

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <div className='hidden border-r bg-muted/40 md:block'>
        <div className='flex h-full max-h-screen flex-col gap-2'>
          <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
            <Link href='/' className='flex items-center gap-2 font-semibold'>
              <SwatchBook className='h-6 w-6' />
              <span>Fastschema</span>
            </Link>
            <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
              <Bell className='h-4 w-4' />
              <span className='sr-only'>Toggle notifications</span>
            </Button>
          </div>
          <div className='flex-1'>
            <Sidebar />
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <header className='flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 shrink-0  md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='shrink-0 md:hidden'
              >
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='flex flex-col'>
              <Sidebar logo sheet />
            </SheetContent>
          </Sheet>
          <UserMenu />
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
          <PageInfo />
          <div className='w-full h-full'>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
