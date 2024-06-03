import * as z from 'zod';
import { Content, Field, Schema } from '@/lib/types';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';

export interface ContentEditFormProps {
  schema: Schema;
  content?: Content;
}

export type FieldRenderer<T extends FieldValues = FieldValues> = (
  form: UseFormReturn<T>,
  fieldProps: ControllerRenderProps<T, never>,
) => JSX.Element;

export interface FieldInstance<T extends FieldValues = FieldValues> {
  type: z.ZodTypeAny,
  render: FieldRenderer<T>,
  F(): Field,
  isSystemField(): boolean,
  isLocked(): boolean,
  zod(): z.ZodTypeAny,
  default(): any,
  extend?(): void,
};
