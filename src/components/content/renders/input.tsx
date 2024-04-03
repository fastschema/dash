import { FieldRendererFn } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from './base';

export class FieldRendererInput extends BaseFieldRenderer {
  class = 'input';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    return <Input
      {...fieldProps}
      autoComplete='auto'
      placeholder={this.field.label}
    />;
  }
}
