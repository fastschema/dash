import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Head from 'next/head';

export interface ErrorProps {
  title?: string;
  description?: string;
  error?: Error;
}
export const SystemError = (props: ErrorProps) => {
  const { title, description, error } = props;
  return <>
    <Head>
      <title>{title ?? 'Error'}</title>
    </Head>
    <Alert variant='destructive'>
      <AlertCircle size={16} className='mr-2' />
      <AlertTitle>{title ?? 'Error'}</AlertTitle>
      {error?.message || description && <AlertDescription>{error?.message ?? description}</AlertDescription>}
    </Alert>
  </>;
}
