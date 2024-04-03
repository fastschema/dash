import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { Tooltip } from '@/components/common/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { schemaSchema } from './data';
import { UseFormReturn } from 'react-hook-form';
import { Schema } from '@/lib/types';
import { SystemError } from '@/components/common/error';

export interface SchemaBasicProps {
  form: UseFormReturn<z.infer<typeof schemaSchema>>;
  fields: z.infer<typeof schemaSchema>['fields'];
  editingSchema?: Schema | null;
};

export const SchemaBasic = (props: SchemaBasicProps) => {
  const { form, fields, editingSchema } = props;
  return <>
    {form.formState.errors.fields && <SystemError
      description={form.formState.errors.fields.message ?? (form.formState.errors.fields as any)?.root?.message}
    />}
    <FormField
      control={form.control}
      name='name'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='flex'>
            <Tooltip tip='This is the name of your schema.' icon={true}>
              <span className='mr-1'>Name</span>
            </Tooltip>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete='auto'
              placeholder='Schema name'
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='namespace'
      render={({ field }) => (
        <FormItem>
          <FormLabel className='flex'>
            <Tooltip icon={true} tip='This is the namespace of your schema. It will be used to generate the database table name and API endpoints.'>
              <span className='mr-1'>Namespace</span>
            </Tooltip>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder='Schema namespace'
              className={editingSchema?.name ? 'read-only:bg-gray-100' : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='label_field'
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <Tooltip
              icon={true}
              tip='This is the namespace of your schema. It will be used to generate the database table name and API endpoints'>
              <span className='mr-1'>Label Field</span>
            </Tooltip>
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value} name='label_field'>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a label field' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ScrollArea className='h-72'>
                {fields.map((field, index) => (
                  <SelectItem
                    key={field.name}
                    value={field.name}
                  >
                    {field.name} - {field.label}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='disable_timestamp'
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                name='disable_timestamp'
                id='disable_timestamp'
                aria-readonly
              />
              <Label htmlFor='disable_timestamp'>Disable timestamps</Label>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  </>
}
