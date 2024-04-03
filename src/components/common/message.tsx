'use client';
import eventBus from '@/lib/event-bus';
import { SystemError } from '@/lib/types';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export const SystemMessage = () => {
  const [systemError, setSystemError] = useState<SystemError>();

  useEffect(() => {
    eventBus.on('system-error', setSystemError);
  }, []);

  return <>
    <NetworkError />
    {systemError ? <div style={{ width: '100%', marginBottom: 30 }}>
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>{systemError.error}</AlertTitle>
        <AlertDescription>
          {systemError.message}
        </AlertDescription>
      </Alert>
    </div> : null}
  </>

}

const NetworkError = () => {
  const { toast } = useToast();
  eventBus.on<string>('network-error', message => {
    toast({
      variant: 'destructive',
      title: 'Network Error',
      description: message,
      action: <ToastAction altText='Close'>Close</ToastAction>,
    });
  });
  return <></>
}


