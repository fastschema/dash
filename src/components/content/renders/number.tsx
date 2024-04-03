import { FieldRendererFn } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from './base';

export class FieldRendererNumber extends BaseFieldRenderer {
  class = 'number';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    const { register } = form;
    const isFloat = ['float32', 'float64'].includes(this.field.type);
    const parseFn = isFloat ? parseFloat : parseInt;

    return <Input
      {...fieldProps}
      type='number'
      step={isFloat ? 'any' : 1}
      placeholder={this.field.label}
      {...register(this.field.name, {
        setValueAs: v => v === '' ? undefined : parseFn(v),
      })}
    />;
  }
}
