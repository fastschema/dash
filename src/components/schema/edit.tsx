/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/common/button';
import { Form } from '@/components/ui/form';
import { AppContext } from '@/lib/context';
import { notify } from '@/lib/notify';
import { saveSchema } from '@/lib/schema';
import { Field, RenameItem, Schema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import pluralize from 'pluralize';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { SchemaFormValues, defaultSchemaFormValues, schemaSchema } from './data';
import { EditField } from './field';
import { SchemaBasic } from './schema_basic';
import { SchemaFields } from './schema_fields';

export interface EditSchemaFormProps {
  editingSchema?: Schema | null;
}

export interface RenameFields {
  [newName: string]: string;
}

export const EditSchemaForm = (props: Readonly<EditSchemaFormProps>) => {
  const router = useRouter();
  const { reloadAppConfig } = useContext(AppContext);
  const { editingSchema } = props;
  const [editingField, setEditingField] = useState<Field>();
  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schemaSchema),
    defaultValues: editingSchema ?? defaultSchemaFormValues,
    mode: 'onChange',
  });
  const watchSchemaName = form.watch('name');
  const watchLabelField = form.watch('label_field');
  const watchFields = form.watch('fields');
  const {
    fields,
    append,
    update,
    remove: removeField,
  } = useFieldArray({
    name: 'fields',
    control: form.control,
  });

  useEffect(() => {
    form.reset(editingSchema ?? defaultSchemaFormValues);
  }, [editingSchema?.name]);

  useEffect(() => {
    !editingSchema?.name && watchSchemaName && form.setValue('namespace', pluralize(watchSchemaName.trim()));
  }, [watchSchemaName]);

  // If there is no label field, set the first string field as label field
  useEffect(() => {
    if (watchFields && watchFields.length > 0) {
      const hasLabelField = watchFields.some((field) => field.name === watchLabelField);
      if (!hasLabelField) {
        const firstTextField = watchFields.find((field) => field.type === 'string');
        if (firstTextField) {
          form.setValue('label_field', firstTextField.name);
        }
      }
    }
  }, [watchFields, watchLabelField]);

  const onSubmit = async (schemaData: SchemaFormValues) => {
    const renameFields: RenameItem[] = [];
    let isValidLabelField = false;

    for (const field of schemaData.fields) {
      if (field.server_name && field.name !== field.server_name) {
        renameFields.push({
          from: field.server_name,
          to: field.name,
        });
      }

      if (field.name === schemaData.label_field) {
        isValidLabelField = true;
      }
    }

    if (!isValidLabelField) {
      notify.error('Label field is invalid.');
      form.setValue('label_field', '');
      form.setError('label_field', {
        type: 'manual',
        message: 'Label field is invalid.',
      });
      return;
    }

    try {
      const savedSchema = await saveSchema(schemaData, editingSchema?.name ?? '', renameFields);
      notify.success(`Schema ${savedSchema.name} saved successfully.`);
      router.push(`/schemas/edit?schema=${savedSchema.name}`);
      form.reset(savedSchema);
      reloadAppConfig();
    } catch (e: any) {}
  };

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative flex-col items-start gap-8 md:flex">
            <fieldset className="sticky top-5 grid w-full gap-5 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">Schema</legend>
              <SchemaBasic form={form} fields={fields} editingSchema={editingSchema} />
              <Button type="submit">Save</Button>
            </fieldset>
          </div>
          <div className="flex-col relative flex rounded-xl lg:col-span-2">
            <fieldset className="grid w-full gap-5 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">Fields</legend>
              <SchemaFields form={form} fields={fields} setEditingField={setEditingField} removeField={removeField} />
            </fieldset>
          </div>
        </form>
      </Form>
      {editingField ? (
        <EditField
          open={!!editingField}
          editingField={editingField}
          existingFields={fields}
          onClose={() => setEditingField(undefined)}
          onSave={(field) => {
            if (editingField?.name) {
              const index = fields.findIndex((f) => f.name === editingField.name);

              if (index >= 0) {
                update(index, field);
              }
            } else {
              append(field);
            }

            setEditingField(undefined);
          }}
        />
      ) : null}
    </div>
  );
};
