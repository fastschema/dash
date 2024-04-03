'use client';

import { MediaUploader } from '@/components/media/uploader';
import { useEffect } from 'react';
import { setPageInfo } from '@/components/pageinfo';

export default function MediaUpload() {
  const title = 'Upload Media';
  useEffect(() => {
    setPageInfo({
      title: title,
      description: 'Upload a new media file.',
      breadcrumbs: [{ name: 'Media', path: '/media' }, { name: 'Upload', path: '/media/upload' }],
    });
    return setPageInfo;
  }, []);

  return  <MediaUploader />;
}
