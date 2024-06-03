import { useRouter } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { FieldValues } from 'react-hook-form';
import { Button } from '@/components/common/button';
import { ContentEditFormProps } from './types';
import { useContentForm } from './utils';
import { FormField } from './form';
import { saveContent } from '@/lib/content';
import { notify } from '@/lib/notify';

export const ContentEditForm = (props: Readonly<ContentEditFormProps>) => {
  const router = useRouter();
  const { schema, content } = props;
  const { form, fieldInstances } = useContentForm(schema, content);

  const onSubmit = async (recordData: FieldValues) => {
    try {
      const result = await saveContent(schema, recordData, content?.id);
      if (result.id) {
        router.push(`/content/edit?schema=${schema.name}&id=${result.id}`);
      }
      notify.success('Content saved');
    } catch (e: any) {
      console.error(e);
      notify.error('Error saving content: ' + e.message);
    }
  };

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className='space-y-4 py-4'>
        {fieldInstances.map(fi => {
          if (fi.isLocked()) return null;
          const f = fi.F();
          return <FormField
            key={f.name}
            form={form}
            field={f}
            render={fi.render}
            required={!f.optional}
          />
        })}
        <Button type='submit'>Save</Button>
      </div>
    </form>
  </Form>;
}
