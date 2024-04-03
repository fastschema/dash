'use client';

import Link from 'next/link';
import { setPageInfo } from '@/components/pageinfo';
import { Loading } from '@/components/common/loading';
import { slugToTitle } from '@/lib/helper';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContentEditForm } from '@/components/content/edit';
import { Button } from '@/components/common/button';
import { PlusIcon } from 'lucide-react';
import { getContentDetail } from '@/lib/content';
import { useAppSchema, useAppSchemas, useRelationFields } from '@/lib/context';
import { Content } from '@/lib/types';

export default function ContentEditPage() {
  const query = useSearchParams();
  const schemaName = query.get('schema');
  const contentId = query.get('id');
  const [content, setContent] = useState<Content>();
  const [loading, setLoading] = useState(!!contentId);
  const schema = useAppSchema(schemaName);
  const schemas = useAppSchemas();
  const relationFields = useRelationFields(schema, schemas);
  
  useEffect(() => {
    const schemaLabel = slugToTitle(schemaName ?? '');
    setPageInfo({
      title: `${schemaLabel} - ${contentId ? 'Edit record' : 'New record'}`,
      description: `${contentId ? 'Edit' : 'Create'} a record of ${schemaLabel} schema.`,
      breadcrumbs: [
        { name: slugToTitle(schemaName ?? ''), path: '/content?schema=' + schemaName },
        { name: contentId ? 'Edit' : 'New', path: '/content/edit?schema=' + schemaName + (contentId ? '&id=' + contentId : '') }
      ],
      actions: [contentId ? <Link key='create' href={`/content/edit?schema=${schemaName}`}>
        <Button size='sm' icon={<PlusIcon className='w-4 h-4' />}>
          New
        </Button>
      </Link> : null].filter(Boolean),
    });
    return setPageInfo;
  }, [schemaName, contentId]);

  useEffect(() => {
    if (!schema) return;
    if (contentId) {
      (async () => {
        try {
          const content = await getContentDetail(schema, contentId, relationFields);
          setContent(content);
          setLoading(false);
        } catch (e: any) { }
      })();
    } else {
      setContent(undefined);
    }
  }, [contentId]);

  if (!schema?.name) {
    return <div className='h-full flex items-center justify-center'>
      <p className='text-center text-2xl font-bold'>Please select a schema</p>
    </div>
  }

  if (loading) return <Loading />;

  return <ContentEditForm schema={schema} content={content} />;
}
