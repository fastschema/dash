import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldRendererFn } from '@/lib/types';
import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { ForwardedRef, forwardRef } from 'react';
import { BaseFieldRenderer } from './base';

export class FieldRendererEnum extends BaseFieldRenderer {
  class = 'enum';
  render: FieldRendererFn = (
    form: UseFormReturn,
    fieldProps: ControllerRenderProps<{ [k: string]: any; }, never> & { id?: string },
    ref?: ForwardedRef<any>,
  ) => {
    return <FieldRendererEnumRef fieldProps={fieldProps} field={this.field} />;
  }
}

export interface FieldRendererEnumRefProps {
  field: Field;
  fieldProps: ControllerRenderProps<{ [k: string]: any; }, never>;
  id?: string;
}

export const FieldRendererEnumRef = forwardRef(
  function FieldRendererEnumRef(props: FieldRendererEnumRefProps, ref) {
    const { fieldProps, field } = props;

    return <>
      <input id={props?.id as string} className='hidden' />
      <Select name={field.name} onValueChange={fieldProps.onChange} defaultValue={fieldProps.value}>
        <SelectTrigger className="w-[100%]">
          <SelectValue placeholder={`Select ${field.label}`} />
        </SelectTrigger>
        <SelectContent id={field.name} {...fieldProps}>
          {field.enums?.map(e => {
            return <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </>;
  }
);
