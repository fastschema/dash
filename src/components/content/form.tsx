import {
  FormControl,
  FormField as BaseFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Field } from '@/lib/types';
import { ForwardedRef } from 'react';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';

// type FormReturn = UseFormReturn<{ [k: string]: any; }, any, undefined>;
// type FieldRenderProps = ControllerRenderProps<{ [k: string]: any }, never>;

export interface FormFieldProps<T extends FieldValues> {
  field: Field;
  form: UseFormReturn<T>;
  render: (
    form: UseFormReturn<T>,
    fieldProps: ControllerRenderProps<T, never>,
    ref?: ForwardedRef<unknown>,
  ) => React.ReactNode;
  required?: boolean;
}

export const FormField = <T extends FieldValues = FieldValues,>(props: FormFieldProps<T>) => {
  const { form, field, render, required } = props;

  return <BaseFormField
    control={form.control}
    name={field.name as never}
    render={props => {
      const fieldProps = props.field;

      return <FormItem className={required ? 'field-required' : undefined}>
        {!field?.renderer?.settings?.hide_form_label && <FormLabel className='flex items-center space-x-1'>
          {field.label}
        </FormLabel>}
        <FormControl>
          {render(form, fieldProps)}
        </FormControl>
        <FormMessage />
      </FormItem>;
    }}
  />;
}
