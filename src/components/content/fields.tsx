import * as z from 'zod';
import { Content, Field, relationArrayZodObject, relationSingleZodObject } from '@/lib/types';
import { slugToTitle } from '@/lib/helper';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { FieldInstance } from './types';
import { getFieldRenderer } from './renders';
import { ForwardedRef } from 'react';

export class BaseField implements FieldInstance {
  field: Field;
  type: z.ZodTypeAny = z.any();
  content?: Content;

  constructor(field: Field, content?: Content) {
    this.field = field;
    this.content = content;
  }

  F(): Field {
    return this.field;
  }

  isSystemField() {
    return !!this.field.is_system_field;
  }

  zod(): z.ZodTypeAny {
    this.extend();

    if (this.field.optional) {
      this.type = this.type.nullable().optional();
    }

    return this.type;
  }

  default() {
    return this.field?.default ?? '';
  }

  extend() {/** Empty */ }

  render(
    form: UseFormReturn<FieldValues>,
    fieldProps: ControllerRenderProps<FieldValues, never>,
    ref?: ForwardedRef<any>,
  ) {
    const renderer = getFieldRenderer(this.field.type, this.field, this.content);

    return renderer.render(form, fieldProps, ref);
  }
}

export class StringField extends BaseField {
  type = z.string();

  extend() {
    !this.field.optional && (this.type = this.type.trim().min(1, {
      message: `${slugToTitle(this.field.name)} is required`,
    }));
  }
}

export class TextField extends BaseField {
  slateElement = z.object({
    type: z.string(),
    children: z.array(z.any()),
  });

  type = z.string();
}

export class IntField extends BaseField {
  type: z.ZodNumber = z.coerce.number({
    required_error: `${slugToTitle(this.field.name)} is required`,
    invalid_type_error: `${slugToTitle(this.field.name)} must be an integer`,
  }).int({
    message: `${slugToTitle(this.field.name)} must be an integer`,
  });

  default() {
    return this.field?.default ? parseInt(this.field?.default) : '';
  }
}

export class UintField extends BaseField {
  type = z.number({
    required_error: `${slugToTitle(this.field.name)} is required`,
    invalid_type_error: `${slugToTitle(this.field.name)} must be an integer`,
  }).nonnegative({
    message: `${slugToTitle(this.field.name)} must be a positive integer`,
  });

  default() {
    return this.field?.default ? parseInt(this.field?.default) : '';
  }
}

export class FloatField extends BaseField {
  type = z.coerce.number({
    required_error: `${slugToTitle(this.field.name)} is required`,
    invalid_type_error: `${slugToTitle(this.field.name)} must be a number`,
  });

  default() {
    return this.field?.default ? parseFloat(this.field?.default) : '';
  }
}

export class BooleanField extends BaseField {
  type = z.boolean();

  default() {
    return (this.field?.default?.toString() ?? 'false') === 'true';
  }
}

export class TimeField extends BaseField {
  type = z.string();

  default() {
    return this.field?.default ? new Date(this.field?.default) : undefined;
  }
}

export class JsonField extends BaseField {
  type = z.any();

  default() {
    return this.field?.default ? JSON.parse(this.field?.default) : '';
  }
}

export class EnumField extends BaseField {
  firstValue: string;
  constructor(field: Field, content?: Content) {
    super(field, content);
    const enumValues = field.enums?.map(({ value }) => value) ?? [];
    this.firstValue = enumValues[0];
    const restValues = enumValues.slice(1);
    this.type = z.enum([this.firstValue, ...restValues]);
  }

  default() {
    return this.field?.default ?? this.firstValue;
  }
}

export class RelationField extends BaseField {
  constructor(field: Field, content?: Content) {
    super(field, content);

    if (this.isArrayRelation()) {
      this.type = relationArrayZodObject.optional().nullable();
    } else {
      this.type = relationSingleZodObject;
    }
  }

  isArrayRelation() {
    return this.field.multiple ||
      this.field.relation?.type === 'm2m' ||
      (this.field.relation?.type === 'o2m' && this.field.relation?.owner);
  }

  default() {
    const defaultSingle = this.field.optional ? null : undefined;
    const defaultMultiple = !this.content?.id ? [] : { '$nochange': true, '$add': [], '$clear': [] };
    return this.isArrayRelation()
      ? defaultMultiple
      : defaultSingle;
  }
}
