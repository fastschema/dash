import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import * as z from 'zod';
import { fieldSchema } from './data';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export interface FormFieldAdvanceProps {
  form: UseFormReturn<z.infer<typeof fieldSchema>>;
}

export const FormFieldAdvance = (props: FormFieldAdvanceProps) => {
  const { form } = props;
  return (
    <>
      <FormField
        control={form.control}
        name='setter'
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>
                Setter
                <a
                  href='https://fastschema.com/docs/schema/field.html#setter'
                  target='_blank'
                  className='ml-1 text-blue-500'
                >
                  <span className='text-xs'>(?)</span>
                </a>
              </FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder='$context.Value("user").ID' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name='getter'
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>
                Getter
                <a
                  href='https://fastschema.com/docs/schema/field.html#getter'
                  target='_blank'
                  className='ml-1 text-blue-500'
                >
                  <span className='text-xs'>(?)</span>
                </a>
              </FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder='$context.Value("user").ID' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name='unique'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>Unique</FormLabel>
              <FormDescription>Prevent duplicate values</FormDescription>
            </div>
            <FormControl>
              <Switch
                name='unique'
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='optional'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>Optional</FormLabel>
              <FormDescription>Allow null values</FormDescription>
            </div>
            <FormControl>
              <Switch
                name='optional'
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='sortable'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>Sortable</FormLabel>
              <FormDescription>Allow sorting</FormDescription>
            </div>
            <FormControl>
              <Switch
                name='sortable'
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='filterable'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>Filterable</FormLabel>
              <FormDescription>Allow filtering</FormDescription>
            </div>
            <FormControl>
              <Switch
                name='filterable'
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='db.increment'
        render={({ field }) => (
          <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
            <div className='space-y-0.5'>
              <FormLabel>Increment</FormLabel>
              <FormDescription>Auto increment the value</FormDescription>
            </div>
            <FormControl>
              <Switch
                name='db.increment'
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
