import * as z from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { fieldSchema } from './data';
import { Field, Schema } from '@/lib/types';
import { listSchemas } from '@/lib/schema';
import { Loading } from '@/components/common/loading';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { SystemError } from '@/components/common/error';
import { Tooltip } from '@/components/common/tooltip';
import { Separator } from '@/components/ui/separator';

export interface FormFieldRelationProps {
  form: UseFormReturn<z.infer<typeof fieldSchema>>;
  editingField?: Field;
}

export const FormFieldRelation = (props: FormFieldRelationProps) => {
  const { form, editingField } = props;
  const { data: schemas, isLoading, error } = useQuery<Schema[]>({
    queryKey: ['schemas'],
    queryFn: listSchemas,
  });

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  return <div className='space-y-4'>
    <Separator className='my-4' />

    <FormField
      control={form.control}
      name='type'
      render={({ field }) => {
        return <FormItem className='flex-shrink flex-grow flex-1 relative'>
          <FormMessage />
        </FormItem>;
      }}
    />

    <FormField
      control={form.control}
      name='relation.type'
      render={({ field }) => editingField?.name
        ? <Input {...field} readOnly={true} />
        : <FormItem>
          <FormLabel>Relation type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            name='relation.type'
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a relation type' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value='o2o'>O2O</SelectItem>
              <SelectItem value='o2m'>O2M</SelectItem>
              <SelectItem value='m2m'>M2M</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      }
    />

    <FormField
      control={form.control}
      name='relation.schema'
      render={({ field }) => editingField?.name
        ? <Input {...field} readOnly={true} />
        : <FormItem>
          <FormLabel>Relation schema</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            name='relation.schema'
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a relation schema' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {schemas?.map(schema => (
                <SelectItem key={schema.name} value={schema.name}>{schema.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      }
    />

    <FormField
      control={form.control}
      name='relation.field'
      render={({ field }) => {
        return <FormItem>
          <FormLabel>
            <Tooltip icon={true} tip={<> <p>
              The relation field is the field name of the relation schema that points back to the current editing field.
            </p>
              <p>For example:</p>
              <ul className='list-decimal list-inside'>
                <li>
                  The current editing field is <code>post.post_meta</code>, and the relation schema is <code>post_meta</code> (o2o), then the relation field is <code>post_meta.post</code> (enter <code>post</code> here)
                </li>
                <li>
                  The current editing field is <code>post.comments</code>, and the relation schema is <code>comment</code> (o2m), then the relation field is <code>comment.post</code> (enter <code>post</code> here)
                </li>
                <li>
                  The current editing field is <code>post.categories</code>, and the relation schema is <code>category</code> (m2m), then the relation field is <code>category.posts</code> (enter <code>posts</code> here)
                </li>
              </ul></>}>
              <span className='mr-1'>Relation Field</span>
            </Tooltip>
          </FormLabel>
          <FormControl>
            <Input autoComplete='auto' {...field} readOnly={!!editingField?.name} />
          </FormControl>
          <FormMessage />
        </FormItem>;
      }}
    />

    <FormField
      control={form.control}
      name='relation.owner'
      render={({ field }) => (
        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
          <div className='space-y-0.5'>
            <FormLabel>Owner</FormLabel>
            <FormDescription>Is the relation field the owner of the relation?</FormDescription>
          </div>
          <FormControl>
            <Switch
              name='relation.owner'
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={!!editingField?.name}
              aria-readonly={!!editingField?.name}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </div>;
}
