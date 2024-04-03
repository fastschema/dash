import * as z from 'zod';

export const fieldSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Field name is required' }),
  // .refine((value) => /^[a-zA-Z0-9]+[-'s]?[a-zA-Z0-9 ]+$/.test(value), 'Name should contain only alphabets'),
  server_name: z.string().optional(),
  label: z.string().min(1, { message: 'Field label is required' }),
  type: z.enum(['bool', 'time', 'json', 'uuid', 'bytes', 'enum', 'string', 'text', 'int', 'int8', 'int16', 'int32', 'int64', 'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'float32', 'float64', 'relation', 'media']),
  multiple: z.boolean().optional(),
  size: z.coerce.number().optional(),
  unique: z.boolean().optional(),
  optional: z.boolean().optional(),
  default: z.any().nullable(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  renderer: z.object({
    class: z.string().optional(),
    settings: z.record(z.string(), z.any()).optional(),
  }).optional(),
  // enums is required when type is enum
  enums: z.array(z.object({
    value: z.string().min(1, { message: 'Enum value is required' }),
    label: z.string().min(1, { message: 'Enum label is required' }),
  })).optional(),
  relation: z.object({
    schema: z.string(),
    field: z.string(),
    type: z.enum(['o2o', 'o2m', 'm2m']),
    owner: z.boolean().optional(),
    fk_columns: z.record(z.string(), z.string()).optional().nullable(),
    junction_table: z.string().optional(),
    optional: z.boolean().optional(),
  }).optional(),
  db: z.object({
    attr: z.string().optional(),
    collation: z.string().optional(),
    increment: z.boolean().optional(),
    key: z.string().optional(),
  }).nullable().optional(),
  is_system_field: z.boolean().optional(),
}).superRefine((input, ctx) => {
  if (input.type === 'enum' && !input?.enums?.length) {
    return ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Enums are required for enum type',
      path: ['type'],
    });
  }

  return true;
}).superRefine((input, ctx) => {
  if (input.type === 'relation') {
    if (!input?.relation?.type || !input?.relation?.schema || !input?.relation?.field) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Relation type, schema, field is required for relation type',
        path: ['type'],
      });
    }

    if (!input?.relation?.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Relation type, schema, field is required for relation type',
        path: ['relation.type'],
      });
    }
    if (!input?.relation?.schema) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Relation schema is required for relation type',
        path: ['relation.schema'],
      });
    }
    if (!input?.relation?.field) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Relation field is required for relation type',
        path: ['relation.field'],
      });
    }
  }

  return true;
});

export type FieldFormValues = z.infer<typeof fieldSchema>;

export const schemaSchema = z.object({
  name: z.string().trim().min(1, { message: 'Schema name is required' }),
  namespace: z.string().trim().min(1, { message: 'Schema namespace is required' }),
  label_field: z.string().trim().min(1, { message: 'Schema label field is required' }),
  disable_timestamp: z.boolean(),
  is_system_schema: z.boolean().optional(),
  fields: z.array(fieldSchema).min(1, { message: 'At least one field is required' }),
}).refine((value) => {
  const names = value?.fields?.map((field) => field.name);
  const uniqueNames = [...new Set(names)];
  return names.length === uniqueNames.length;
}, { message: 'Field names should be unique', path: ['fields'] })
  .refine((value) => {
    const labels = value?.fields?.map((field) => field.label);
    const uniqueLabels = [...new Set(labels)];
    return labels.length === uniqueLabels.length;
  }, { message: 'Field labels should be unique', path: ['fields'] })
  .refine((value) => {
    return value?.fields?.length > 0;
  }, { message: 'At least one field is required', path: ['fields'] });

export type SchemaFormValues = z.infer<typeof schemaSchema>;

export const defaultFieldValues: SchemaFormValues['fields'][0] = {
  name: '',
  server_name: '',
  label: '',
  type: 'string',
  enums: [],
  default: '',
  size: 0,
  multiple: false,
  db: {
    attr: '',
    collation: '',
    increment: false,
    key: '',
  },
  renderer: {
    class: '',
    settings: {},
  },
  relation: {
    schema: '',
    field: '',
    type: 'o2o',
    owner: false,
    fk_columns: {},
    junction_table: '',
    optional: false,

  },
  unique: false,
  optional: true,
  sortable: true,
  filterable: false,
  is_system_field: false,
};

export const defaultSchemaFormValues: SchemaFormValues = {
  name: '',
  namespace: '',
  label_field: '',
  disable_timestamp: false,
  fields: [],
};


export const fieldTypesOptions = [
  { value: 'string', label: 'String (short text)' },
  { value: 'text', label: 'Text (long text)' },
  { value: 'bool', label: 'Boolean' },
  { value: 'time', label: 'Time' },
  { value: 'int', label: 'Int' },
  { value: 'float32', label: 'Float' },
  { value: 'bytes', label: 'Bytes' },
  { value: 'json', label: 'Json' },
  { value: 'uuid', label: 'UUID' },
  { value: 'enum', label: 'Enum' },
  { value: 'int8', label: 'Int8' },
  { value: 'int16', label: 'Int16' },
  { value: 'int32', label: 'Int32' },
  { value: 'int64', label: 'Int64' },
  { value: 'uint', label: 'Uint' },
  { value: 'uint8', label: 'Uint8' },
  { value: 'uint16', label: 'Uint16' },
  { value: 'uint32', label: 'Uint32' },
  { value: 'uint64', label: 'Uint64' },
  { value: 'float64', label: 'Float64' },
  { value: 'relation', label: 'Relation' },
];
