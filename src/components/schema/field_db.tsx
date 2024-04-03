import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { fieldSchema } from './data';

export interface FormFieldDbProps {
  form: UseFormReturn<z.infer<typeof fieldSchema>>;
}

export const FormFieldDb = (props: FormFieldDbProps) => {
  const { form } = props;
  const { register } = form;

  return <>
    <FormField
      control={form.control}
      name='default'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Default</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...register('default', {
                setValueAs: v => v === '' ? null : v,
              })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='size'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Size</FormLabel>
          <FormControl>
            <Input type='number' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='db.attr'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attribute</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='db.collation'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Collation</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='db.key'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Key</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
}
