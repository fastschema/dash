import { FieldRendererFn } from '@/lib/types';
// import { Input } from '@/components/ui/input';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { BaseFieldRenderer } from '../base';
import { FieldPropsType, RelationSelect } from './select';

export class FieldRendererRelation extends BaseFieldRenderer {
  class = 'relation';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>,
  ) => {
    return <RelationSelect
      field={this.field}
      fieldProps={fieldProps as FieldPropsType}
      content={this.content}
    />
  }
}
