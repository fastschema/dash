'use client';

import Link from 'next/link';
import { Button } from '@/components/common/button';
import { UploadCloud } from 'lucide-react';
import { useEffect } from 'react';
import { setPageInfo } from '@/components/pageinfo';
import { MediaList } from '@/components/media/list';

export default function MediaIndex() {
  useEffect(() => {
    setPageInfo({
      title: 'Media',
      description: 'List of all media.',
      breadcrumbs: [{ name: 'Media', path: '/media' }],
      actions: [<Link key='upload' href={'/media/upload'}>
        <Button size='sm' icon={<UploadCloud className='mr-2 h-4 w-4' />}>
          Upload Media
        </Button>
      </Link>],
    });
    return setPageInfo;
  }, []);

  return <MediaList multiple />;
}
