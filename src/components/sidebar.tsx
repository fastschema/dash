import Link from 'next/link';
import { cn } from '@/lib/utils';
import { slugToTitle } from '@/lib/helper';
import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Album, BookUser, LibraryBig, Upload, UserPlus } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '@/lib/context';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
}

export const Sidebar = ({ className }: SidebarProps) => {
  const { appConfig } = useContext(AppContext);

  return (
    <div className={cn('pb-12', className)}>
      <div className='space-y-4 py-4'>
        {appConfig.schemas?.length ? <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Schemas
          </h2>
          <ScrollArea className='h-72'>
            <div className='space-y-1'>
              {appConfig.schemas.map(schema => !schema.is_system_schema && <Link key={schema.name} href={`/content/?schema=${schema.name}`}>
                <Button variant='ghost' className='w-full justify-start'>
                  <LibraryBig size={16} style={{ marginRight: 8 }} />
                  {slugToTitle(schema.name)}
                </Button>
              </Link>)}
            </div>
          </ScrollArea>
        </div> : null}
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Media
          </h2>
          <div className='space-y-1'>
            <Link href='/media'>
              <Button variant='ghost' className='w-full justify-start'>
                <Album size={16} style={{ marginRight: 8 }} />
                All media
              </Button>
            </Link>
            <Link href='/media/upload'>
              <Button variant='ghost' className='w-full justify-start'>
                <Upload size={16} style={{ marginRight: 8 }} />
                Upload
              </Button>
            </Link>
          </div>
        </div>
        <div className='px-3 py-2'>
          <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
            Users
          </h2>
          <div className='space-y-1'>
            <Link href='/content/?schema=user'>
              <Button variant='ghost' className='w-full justify-start'>
                <BookUser size={16} style={{ marginRight: 8 }} />
                All users
              </Button>
            </Link>
            <Link href='/content/edit?schema=user'>
              <Button variant='ghost' className='w-full justify-start'>
                <UserPlus size={16} style={{ marginRight: 8 }} />
                New user
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
