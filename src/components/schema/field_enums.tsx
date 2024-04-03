import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { fieldSchema } from './data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/common/button';
import { Plus } from 'lucide-react';

export interface FormFieldEnumProps {
  form: UseFormReturn<z.infer<typeof fieldSchema>>;
}

export const FormFieldEnums = (props: FormFieldEnumProps) => {
  const { form } = props;
  const { fields: enums, append, remove } = useFieldArray({
    name: 'enums',
    control: form.control,
  });

  return <div className='space-y-4'>
    <h3 className='text-md font-medium'>Enums</h3>
    <FormField
      control={form.control}
      name='type'
      render={({ field }) => {
        return <FormItem className='flex-shrink flex-grow flex-1 relative'>
          <FormMessage />
        </FormItem>;
      }}
    />

    {enums.map((f, index) => {
      return <div key={f.value || index} className='flex flex-wrap items-stretch w-full relative gap-3'>
        <FormField
          control={form.control}
          name={`enums.${index}.value`}
          render={({ field }) => {
            return <FormItem className='flex-shrink flex-grow flex-1 relative'>
              <FormControl>
                <Input placeholder='Enum value' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>;
          }}
        />
        <FormField
          control={form.control}
          name={`enums.${index}.label`}
          render={({ field }) => {
            return <FormItem className='flex-shrink flex-grow flex-1 relative'>
              <FormControl>
                <Input placeholder='Enum label' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>;
          }}
        />
        <div className='flex'>
          <Button variant='destructive' onClick={() => {
            if (window.confirm('Are you sure you want to delete this enum?')) {
              remove(index);
            }
          }}>Delete</Button>
        </div>
      </div>
    })}
    <Button
      type='button'
      variant='outline'
      size='sm'
      className='mt-2'
      onClick={() => append({ value: '', label: '' })}
    >
      <Plus size={16} className='mr-2' />
      Add Enum value
    </Button>
  </div>
}
