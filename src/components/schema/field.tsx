import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import * as z from 'zod';
import { Button } from '@/components/common/button';
import { Field } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { defaultFieldValues, fieldSchema } from './data';
import { Form } from '@/components/ui/form';
import { FormFieldCommon } from './field_common';
import { FormFieldAdvance } from './field_advance';
import { FormFieldDb } from './field_db';
import { slugToTitle } from '@/lib/helper';
import { X } from 'lucide-react';

export interface EditFieldProps {
  open: boolean
  editingField?: Field;
  existingFields?: Field[];
  onClose?: () => void;
  onSave?: (field: Field) => void;
}

export function EditField(props: Readonly<EditFieldProps>) {
  const { open, editingField, existingFields, onSave, onClose } = props;
  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    values: {
      ...(editingField ?? defaultFieldValues),
    },
    defaultValues: {
      ...(editingField ?? defaultFieldValues),
    },
  });


  const watchFieldName = form.watch('name');

  useEffect(() => {
    !editingField?.name &&
      watchFieldName &&
      form.setValue('label', slugToTitle(watchFieldName));
  }, [watchFieldName]);

  const onSubmit = (values: z.infer<typeof fieldSchema>) => {
    if (!editingField?.name) {
      if (existingFields?.find(f => f.name === values.name)) {
        form.setError('name', {
          type: 'manual',
          message: 'Field name already exists.',
        });
        return;
      }
    }

    if (values.type !== 'relation') {
      delete values.relation;
    }

    if (values.type !== 'enum') {
      delete values.enums;
    }

    if (!values.db || Object.keys(values.db).length === 0) {
      delete values.db;
    }

    if (values.default === '') {
      delete values.default;
    }

    if (!values.optional) {
      delete values.optional;
    }

    onSave?.(values);
  }

  return <Sheet
    open={open}
    onOpenChange={open => {
      if (!open) {
        onClose?.();
      }
    }}>
    <SheetContent
      className={'lg:max-w-screen-lg overflow-y-auto max-h-screen py-0 w-full max-w-full field-edit-sheet sm:w-full sm:max-w-full md:w-3/4 md:max-w-3/4'}
      onInteractOutside={e => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <SheetHeader className='sticky top-0 z-10 bg-white py-5 text-left'>
        <SheetTitle>{editingField?.name ? `Edit field: ${editingField.name}` : 'Create new field'}</SheetTitle>
        <SheetDescription>
          {editingField?.name ? 'Edit the field details below.' : 'Enter the field details below.'}
        </SheetDescription>
        <button type='button' onClick={onClose} className='absolute top-2 right-2'>
          <X size={20} />
        </button>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <Tabs defaultValue='common' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='common'>Common</TabsTrigger>
                <TabsTrigger value='database'>Database</TabsTrigger>
                <TabsTrigger value='advance'>Advance</TabsTrigger>
              </TabsList>
              <TabsContent value='common'>
                <div className='grid gap-4 py-4'>
                  <FormFieldCommon form={form} editingField={editingField} />
                </div>
              </TabsContent>
              <TabsContent value='database'>
                <div className='grid gap-4 py-4'>
                  <FormFieldDb form={form} />
                </div>
              </TabsContent>
              <TabsContent value='advance'>
                <div className='grid gap-4 py-4'>
                  <FormFieldAdvance form={form} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </form>
      </Form>
      <SheetFooter className='sticky bottom-0 z-10 bg-white py-5'>
        <Button type='submit' onClick={() => {
          form.handleSubmit(onSubmit)();
        }}>Save field</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>;
}
