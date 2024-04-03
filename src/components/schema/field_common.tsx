import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { FormFieldEnums } from './field_enums';
import { FormFieldRelation } from './field_relation';
import { defaultFieldValues, fieldSchema } from './data';
import { Field } from '@/lib/types';
import { getFieldRenders } from '../content/renders';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

export interface FormFieldCommonProps {
  form: UseFormReturn<z.infer<typeof fieldSchema>>;
  editingField?: Field;
}

export const FormFieldCommon = (props: FormFieldCommonProps) => {
  const { form, editingField } = props;
  const fieldType = form.watch('type');
  const rendererClassName = form.watch('renderer.class');
  const renderers = getFieldRenders(fieldType, editingField ?? defaultFieldValues);
  const renderer = renderers.find(a => a.class === rendererClassName) ?? renderers[0];

  return <>
    <FormField
      control={form.control}
      name='server_name'
      render={({ field }) => {
        return <FormItem>
          <FormControl>
            <Input {...field} type='hidden' />
          </FormControl>
          <FormMessage />
        </FormItem>;
      }}
    />
    <FormField
      control={form.control}
      name='type'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} name='type'>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a type' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ScrollArea className='h-72'>
                <SelectGroup>
                  <SelectLabel>Common</SelectLabel>
                  <SelectItem value='string'>Short text</SelectItem>
                  <SelectItem value='text'>Long text</SelectItem>
                  <SelectItem value='bool'>Boolean</SelectItem>
                  <SelectItem value='int64'>Int</SelectItem>
                  <SelectItem value='float64'>Float</SelectItem>
                  <SelectItem value='media'>Media</SelectItem>
                  <SelectItem value='relation'>Relation</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Complex</SelectLabel>
                  <SelectItem value='bytes'>Bytes</SelectItem>
                  <SelectItem value='json'>Json</SelectItem>
                  <SelectItem value='uuid'>UUID</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Advanced</SelectLabel>
                  <SelectItem value='enum'>Enum</SelectItem>
                  <SelectItem value='time'>Time</SelectItem>
                  {/* <SelectItem value='int'>Int</SelectItem>
                            <SelectItem value='float32'>Float</SelectItem>
                            <SelectItem value='int8'>Int8</SelectItem>
                            <SelectItem value='int16'>Int16</SelectItem>
                            <SelectItem value='int32'>Int32</SelectItem>
                            <SelectItem value='int64'>Int64</SelectItem>
                            <SelectItem value='uint'>Uint</SelectItem>
                            <SelectItem value='uint8'>Uint8</SelectItem>
                            <SelectItem value='uint16'>Uint16</SelectItem>
                            <SelectItem value='uint32'>Uint32</SelectItem>
                            <SelectItem value='uint64'>Uint64</SelectItem> */}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name='name'
      render={({ field }) => {
        return <FormItem>
          <FormLabel>Field name</FormLabel>
          <FormControl>
            <Input autoComplete='auto' placeholder='age, address...' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>;
      }}
    />
    <FormField
      control={form.control}
      name='label'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field label</FormLabel>
          <FormControl>
            <Input placeholder='Age, Address...' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {fieldType === 'media' && <FormField
      control={form.control}
      name='multiple'
      render={({ field }) => (
        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
          <div className='space-y-0.5'>
            <FormLabel>Multiple</FormLabel>
            <FormDescription>Allow multiple values</FormDescription>
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
    />}

    {fieldType === 'enum' && <FormFieldEnums form={form} />}
    {fieldType === 'relation' && <FormFieldRelation form={form} editingField={editingField} />}

    <Separator className='my-4' />
    <FormField
      control={form.control}
      name='renderer.class'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Renderer</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} name='renderer.class'>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a renderer' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderers.map(a => {
                return <SelectItem key={a.class} value={a.class}>{a.class}</SelectItem>
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
    {renderer ? renderer.renderSettings(form) : null}
  </>
}
