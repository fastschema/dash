import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';
import { SystemError } from '@/components/common/error';
import { Button } from '@/components/common/button';
import { schemaSchema, defaultFieldValues } from './data';
import { Field } from '@/lib/types';
import { Badge } from '../ui/badge';

export interface SchemaFieldsProps {
  form: UseFormReturn<z.infer<typeof schemaSchema>>;
  fields: z.infer<typeof schemaSchema>['fields'];
  setEdittingField: Dispatch<SetStateAction<Field | undefined>>;
  removeField: UseFieldArrayRemove;
}

export const SchemaFields = (props: SchemaFieldsProps) => {
  const { form, fields, setEdittingField, removeField } = props;

  const AddFieldButton = <Button
    type='button'
    variant='default'
    size='sm'
    icon={<Plus size={16} />}
    onClick={() => setEdittingField(defaultFieldValues)}
  >New Field</Button>;

  return <div className='space-y-4'>
    {form.formState.errors.fields && <SystemError
      description={form.formState.errors.fields.message ?? (form.formState.errors.fields as any)?.root?.message}
    />}
    {AddFieldButton}

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Label</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>System</TableHead>
          <TableHead>Optional</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <TableRow key={field.name}>
            <TableCell className='font-medium truncate'>
              {field.label}
            </TableCell>
            <TableCell className='font-medium truncate'>
              {field.name}
            </TableCell>
            <TableCell className='truncate'>
              {field.type}
              {field.type === 'relation' && <Badge variant='secondary' className='ml-2'>{field?.relation?.type}</Badge>}
            </TableCell>
            <TableCell>
              {field.is_system_field ? <Badge variant='secondary'>System</Badge> : null}
            </TableCell>
            <TableCell>
              {!field.optional ? <Badge variant='destructive'>Required</Badge> : null}
            </TableCell>
            <TableCell className='text-right'>
              {!field.is_system_field && <>
                <button
                  type='button'
                  className='text-sm inline-flex flex-row items-center gap-1 hover:underline pr-3'
                  onClick={() => setEdittingField(field)}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  type='button'
                  className='text-sm inline-flex flex-row items-center gap-1 text-red-800 hover:underline'
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this field?')) {
                      removeField(index);
                    }
                  }}
                >
                  <Trash size={12} />
                  Delete
                </button>
              </>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {fields.length ? AddFieldButton : null}
  </div>;
}
