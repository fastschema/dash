import { FieldRendererFn } from '@/lib/types';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from './base';
import { Editor } from '@/components/common/editor';

export class FieldRendererEditor extends BaseFieldRenderer {
  class = 'editor';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: string; }, never>,
  ) => {
    return <Editor
      onChange={fieldProps.onChange}
      value={fieldProps.value}
    />
  }
}
