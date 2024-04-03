import * as z from 'zod';
import Link from 'next/link';
import { useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Content, Field, Schema } from '@/lib/types';
import { FieldInstance } from './types';
import {
  BooleanField,
  EnumField,
  FloatField,
  IntField,
  JsonField,
  RelationField,
  StringField,
  TextField,
  TimeField,
  UintField
} from './fields';
import { TableColumn, defaultColumnFilter } from '@/components/common/table/column';
import { TableColumnHeader } from '@/components/common/table/header';
import { deleteContent } from '@/lib/content';
import { notify } from '@/lib/notify';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const fieldTypesToZodTypes: {
  [k: string]: (field: Field, content?: Content) => FieldInstance;
} = {
  'bool': (field: Field, content?: Content) => new BooleanField(field, content),
  'time': (field: Field, content?: Content) => new TimeField(field, content),
  'json': (field: Field, content?: Content) => new JsonField(field, content),
  'enum': (field: Field, content?: Content) => new EnumField(field, content),
  'uuid': (field: Field, content?: Content) => new StringField(field, content),
  'bytes': (field: Field, content?: Content) => new StringField(field, content),
  'string': (field: Field, content?: Content) => new StringField(field, content),
  'text': (field: Field, content?: Content) => new TextField(field, content),
  'int': (field: Field, content?: Content) => new IntField(field, content),
  'int8': (field: Field, content?: Content) => new IntField(field, content),
  'int16': (field: Field, content?: Content) => new IntField(field, content),
  'int32': (field: Field, content?: Content) => new IntField(field, content),
  'int64': (field: Field, content?: Content) => new IntField(field, content),
  'uint': (field: Field, content?: Content) => new UintField(field, content),
  'uint8': (field: Field, content?: Content) => new UintField(field, content),
  'uint16': (field: Field, content?: Content) => new UintField(field, content),
  'uint32': (field: Field, content?: Content) => new UintField(field, content),
  'uint64': (field: Field, content?: Content) => new UintField(field, content),
  'float32': (field: Field, content?: Content) => new FloatField(field, content),
  'float64': (field: Field, content?: Content) => new FloatField(field, content),
  'relation': (field: Field, content?: Content) => new RelationField(field, content),
  'media': (field: Field, content?: Content) => new RelationField(field, content),
};

export const useContentForm = (schema: Schema, content?: Content) => {
  const { zodObject, defaultValues, fieldInstances } = useMemo(
    () => createContentSchema(schema, content), [schema, content],
  );

  const form = useForm({
    resolver: zodResolver(zodObject),
    // defaultValues,
    values: defaultValues,
    mode: 'onChange',
  });

  return { form, fieldInstances, defaultValues };
}

export const createContentSchema = <T extends FieldValues = FieldValues>(
  schema: Schema,
  content?: Content,
): {
  zodObject: z.ZodObject<z.ZodRawShape>,
  defaultValues: T,
  fieldInstances: Array<FieldInstance<T>>;
} => {
  const { fields } = schema;

  return createFieldsInstances(fields, content, schema.name)
}

export const createFieldsInstances = <T extends FieldValues = FieldValues>(
  fields: Array<Field>,
  content?: Content,
  schemaName?: string,
): {
  defaultValues: T;
  fieldInstances: Array<FieldInstance<T>>;
  zodObject: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam, z.ZodTypeAny>;
} => {
  const fieldInstances: Array<FieldInstance<T>> = [];
  const zodObjectMap: { [k: string]: z.ZodTypeAny } = {};
  const defaultValues: FieldValues = {};

  for (const field of fields) {
    // if (field.is_system_field) continue;
    if (['id', 'created_at', 'updated_at', 'deleted_at'].includes(field.name)) continue;

    const createFieldInstanceFn = fieldTypesToZodTypes[field.type] ?? fieldTypesToZodTypes['string'];
    const fieldInstance = createFieldInstanceFn(field, content);
    if (schemaName !== 'user' && fieldInstance.isSystemField()) continue;
    const zodField = fieldInstance.zod();
    defaultValues[field.name] = content?.[field.name] ?? fieldInstance.default();
    zodObjectMap[field.name] = zodField;
    fieldInstance.render = fieldInstance.render.bind(fieldInstance);
    fieldInstances.push(fieldInstance as FieldInstance<T>);
  }

  return {
    defaultValues: defaultValues as T,
    fieldInstances,
    zodObject: z.object(zodObjectMap),
  };
}

export const createContentColumns = <T extends Content,>(
  schema: Schema,
  refetch: () => void,
): TableColumn<T>[] => {
  const columns: TableColumn<T>[] = [];

  for (const field of schema.fields) {
    if (['text', 'relation', 'json'].includes(field.type)) {
      continue;
    }

    if (['updated_at', 'deleted_at'].includes(field.name)) {
      continue;
    }

    if (schema.name === 'user' && !['id', 'email', 'username', 'created_at', 'active', 'provider'].includes(field.name)) {
      continue;
    }

    columns.push({
      accessorKey: field.name,
      enableSorting: !!field.sortable,
      enableHiding: true,
      filterFn: defaultColumnFilter,
      header: ({ column }) => <TableColumnHeader column={column} title={field.label} />,
      cell: ({ row }) => {
        if (field.type === 'bool') {
          const value = row.getValue(field.name);
          return <Badge variant={value ? 'default' : 'secondary'}>{String(value)}</Badge>;
        }

        return <div className='flex space-x-1 max-w-[200px]'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue(field.name)}
          </span>
        </div>;
      },
    });
  }

  const onDelete = (id?: number) => {
    if (confirm('Are you sure you want to delete this record?')) {
      id && (async () => {
        try {
          await deleteContent(schema.name, id);
          notify.success('Content deleted');
          refetch();
        } catch (e) {
          console.error(e);
        }
      })()
    }
  }

  columns.push({
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      return <div className='flex h-5 items-center space-x-4 text-sm min-w-[80px]'>
        <Link className='cursor-pointer hover:underline' href={`/content/edit?schema=${schema.name}&id=${record.id}`}>
          Edit
        </Link>
        <Separator orientation='vertical' />
        <button className='cursor-pointer hover:underline text-red-800' onClick={() => onDelete(record.id)}>
          Delete
        </button>
      </div>;
    },
  });

  return columns;
}
