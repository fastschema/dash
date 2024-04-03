import { FieldRendererFn } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from './base';

export class FieldRendererTextarea extends BaseFieldRenderer {
  class = 'textarea';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    return <Textarea
      {...fieldProps}
      autoComplete='auto'
      placeholder={this.field.label}
    />;
  }
}
