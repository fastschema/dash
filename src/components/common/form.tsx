import * as z from 'zod';
import * as notify from '@/lib/notify';
import { Form } from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReactNode, useState } from 'react';
import { DefaultValues, useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common/button';

export type DefaultValuesType<T extends z.ZodRawShape> = DefaultValues<z.infer<z.ZodObject<T>>> |
  ((payload?: unknown) => Promise<z.infer<z.ZodObject<T>>>);

export interface FormDataProps<ZodShape extends z.ZodRawShape = z.ZodRawShape> {
  schema: z.ZodObject<ZodShape>;
  onSubmit: (values: z.infer<z.ZodObject<ZodShape>>) => Promise<void>;
  defaultValues?: DefaultValuesType<ZodShape>;
  title?: ReactNode;
  description?: ReactNode;
  submitter?: ReactNode;
}

export const useForm = <ZodShape extends z.ZodRawShape = z.ZodRawShape>(props: FormDataProps<ZodShape>) => {
  const { schema, defaultValues, title, description, submitter, onSubmit } = props;
  const [loading, setLoading] = useState(false);
  const form = useHookForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (e: any) {
      notify.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    Form: ({ children }: { children: ReactNode }) => {
      return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          <Card className='w-full max-w-sm'>
            {(!!title || !!description) && <CardHeader>
              {!!title && <CardTitle className='text-2xl'>{title}</CardTitle>}
              {!!description && <CardDescription>
                {description}
              </CardDescription>}
            </CardHeader>}
            <CardContent className='grid gap-4'>
              {children}
            </CardContent>
            <CardFooter>
              <Button className='w-full' loading={loading}>
                {submitter ?? 'Submit'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>;
    }
  }
}
