import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { FieldType } from '.';
import { ForwardedRef } from 'react';
import { BaseFieldRenderer } from '@/components/content/renders/base';

export type FieldRendererFn = (
  form: UseFormReturn<FieldValues>,
  fieldProps: ControllerRenderProps<FieldValues, never>,
  ref?: ForwardedRef<any>,
) => JSX.Element;

export type FieldRenderersByTypes = {
  [fieldType in FieldType]: Array<typeof BaseFieldRenderer>;
}

export interface FastSchemaWindowObject {
  ui: {
    fieldRenders: FieldRenderersByTypes;
  }
}
