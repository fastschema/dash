import { Role } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { RoleFormValues, defaultRoleFormValues, roleSchema } from './data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip } from '@/components/common/tooltip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/common/button';
import { notify } from '@/lib/notify';
import { saveRole } from '@/lib/role';
import { RolePermissionsUsersSetting } from './permissions';

export interface RoleEditFormProps {
  editingRole?: Role | null;
}

export const RoleEditForm = (props: Readonly<RoleEditFormProps>) => {
  const { editingRole } = props;
  const router = useRouter();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: editingRole ?? defaultRoleFormValues,
    mode: 'onChange',
  });

  const onSubmit = async (roleData: RoleFormValues) => {
    try {
      const savedRole = await saveRole(roleData, editingRole?.id);
      notify.success(`Role ${savedRole.name} saved successfully.`);
      (!editingRole && router.push(`/settings/roles/edit?id=${savedRole.id}`));
      form.reset(savedRole);
    } catch (e: any) { }
  }

  return <div>
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex'>
                <Tooltip tip='This is the name of your role.' icon={true}>
                  <span className='mr-1'>Name</span>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete='auto'
                  placeholder='Role name'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex'>
                <span className='mr-1'>Description</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  autoComplete='auto'
                  placeholder='Role Description'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='root'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    name='root'
                    id='root'
                    aria-readonly
                  />
                  <Label htmlFor='root' className='flex align-middle gap-1'>
                    <Tooltip tip='Root roles have full access to all resources.' icon={true}>
                      Is root?
                    </Tooltip>
                  </Label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <RolePermissionsUsersSetting
          editingRole={editingRole}
          onResourcesUpdated={permissions => {
            form.setValue('permissions', permissions);
          }}
          onUsersUpdated={update => {
            if (update?.$add) {
              form.setValue('$add.users', update.$add);
            }

            if (update?.$clear) {
              form.setValue('$clear.users', update.$clear);
            }
          }}
        />
        <Button type='submit'>Save</Button>
      </form>
    </Form>
  </div>;
}
