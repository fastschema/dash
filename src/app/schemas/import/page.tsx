'use client';

import { useEffect } from 'react';
import { setPageInfo } from '@/components/pageinfo';
import { SchemaUploader } from '@/components/schema/uploader';

export default function SchemaImport() {
  const title = 'Import Schemas';
  useEffect(() => {
    setPageInfo({
      title: title,
      description: 'Import schemas.',
      breadcrumbs: [{ name: 'Schema', path: '/schemas' }, { name: 'Import', path: '/schemas/import' }],
    });
    return setPageInfo;
  }, []);

  return  <SchemaUploader />;
}
