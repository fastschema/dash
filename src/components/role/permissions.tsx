import {
  Content,
  FieldRelation,
  Permission,
  RelationContentArrayUpdate,
  Resource,
  Role,
} from '@/lib/types';
import { Button } from '@/components/common/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { titleCase } from '@/lib/helper';
import { Badge } from '../ui/badge';
import { KeyRound, Settings, Trash2, X } from 'lucide-react';
import {
  FieldPropsType,
  RelationSelect,
} from '../content/renders/relation/select';
import { Separator } from '../ui/separator';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '../ui/form';
import { CodeEditor } from '../codeeditor';
import { useAppConfig } from '@/lib/context';

export interface RolePermissionsUsersSettingProps {
  editingRole?: Role | null;
  onPermissionsUpdated?: (permissions: Permission[]) => void;
  onUsersUpdated?: (users?: RelationContentArrayUpdate | null) => void;
}
const flattenResources = (resources: Resource[]): Resource[] => {
  return resources.reduce((acc, resource) => {
    if (resource.resources) {
      return [...acc, ...flattenResources(resource.resources)];
    }
    return [...acc, resource];
  }, [] as Resource[]);
};

export const RolePermissionsUsersSetting = (
  props: RolePermissionsUsersSettingProps
) => {
  const appConfig = useAppConfig();
  const { editingRole, onPermissionsUpdated, onUsersUpdated } = props;
  const [open, setOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    editingRole?.permissions ?? []
  );
  const resources = appConfig.resources;
  const updateSelectedPermissions = (permissions: Permission[]) => {
    setSelectedPermissions(permissions);
    onPermissionsUpdated?.(permissions);
  };

  return (
    <Accordion
      type='multiple'
      className='bg-slate-50 rounded-lg border'
      defaultValue={['permissions']}
    >
      <AccordionItem value='permissions' className='border-0'>
        <AccordionTrigger className='hover:no-underline px-4'>
          Permissions
        </AccordionTrigger>
        <AccordionContent className='pb-2'>
          {editingRole ? (
            <div className='px-4 pb-4 bg-background border-t'>
              <div className='flex flex-wrap gap-2 pt-4'>
                <AddPermissionButton
                  resources={resources}
                  open={open}
                  setOpen={setOpen}
                  selectedPermissions={selectedPermissions}
                  updateSelectedPermissions={updateSelectedPermissions}
                />
              </div>
              <div className='flex flex-col flex-wrap gap-2 mt-4'>
                {selectedPermissions
                  .toSorted((p1, p2) => {
                    return p1.resource.localeCompare(p2.resource);
                  })
                  .map((permission) => {
                    return (
                      <SelectedPermissionItem
                        key={permission.resource}
                        resources={flattenResources(resources ?? [])}
                        permission={permission}
                        selectedPermissions={selectedPermissions}
                        updateSelectedPermissions={updateSelectedPermissions}
                      />
                    );
                  })}
              </div>
            </div>
          ) : (
            <p className='px-4 py-4'>
              Please save the role before updating permissions.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='users' className='border-t border-b-0'>
        <AccordionTrigger className='hover:no-underline px-4'>
          Users
        </AccordionTrigger>
        <AccordionContent className='pb-2'>
          <div className='px-4 pb-4 bg-background border-t'>
            <div className='flex flex-wrap gap-2 pt-4'>
              <RelationSelect
                field={{
                  type: 'relation',
                  name: 'users',
                  label: 'Users',
                  relation: {
                    schema: 'user',
                    field: 'roles',
                    type: 'm2m',
                    owner: true,
                    optional: true,
                  } as FieldRelation,
                }}
                fieldProps={
                  {
                    value: editingRole?.users ?? [],
                    onChange: onUsersUpdated,
                  } as unknown as FieldPropsType
                }
                content={(editingRole ?? {}) as Content}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const AddPermissionButton = ({
  open,
  setOpen,
  resources,
  selectedPermissions,
  updateSelectedPermissions,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  resources?: Resource[];
  selectedPermissions: Permission[];
  updateSelectedPermissions: (permissions: Permission[]) => void;
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-[150px] justify-start'>
          + Add permission
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search for a permission' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <SelectPermissionsList
                resources={resources ?? []}
                selectedPermissions={selectedPermissions}
                updateSelectedPermissions={updateSelectedPermissions}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const SelectPermissionsList = ({
  resources,
  selectedPermissions,
  updateSelectedPermissions,
}: {
  resources: Resource[];
  selectedPermissions: Permission[];
  updateSelectedPermissions: (permissions: Permission[]) => void;
}) => {
  const availableResources = resources.filter((resource) => {
    return !selectedPermissions.map((r) => r.resource).includes(resource.id);
  });
  const disableSeparator =
    !availableResources.length || resources.every((resource) => resource.group);
  return (
    <>
      {availableResources.map((resource) => {
        return (
          <SelectPermissionItem
            key={resource.id}
            resource={resource}
            selectedPermissions={selectedPermissions}
            updateSelectedPermissions={updateSelectedPermissions}
          />
        );
      })}
      {!disableSeparator && <CommandSeparator className='my-2' />}
    </>
  );
};

const SelectPermissionItem = ({
  resource,
  selectedPermissions,
  updateSelectedPermissions,
}: {
  resource: Resource;
  selectedPermissions: Permission[];
  updateSelectedPermissions: (permissions: Permission[]) => void;
}) => {
  if (resource?.resources?.length) {
    return (
      <SelectPermissionsList
        resources={resource.resources}
        selectedPermissions={selectedPermissions}
        updateSelectedPermissions={updateSelectedPermissions}
      />
    );
  }

  return (
    <CommandItem
      key={resource.id}
      value={resource.id}
      onSelect={() => {
        updateSelectedPermissions([
          ...selectedPermissions,
          {
            resource: resource.id,
            value: 'allow',
          } as Permission,
        ]);
      }}
    >
      {titleCase(resource.id)}
    </CommandItem>
  );
};

const SelectedPermissionItem = ({
  permission,
  resources,
  selectedPermissions,
  updateSelectedPermissions,
}: {
  permission: Permission;
  resources: Resource[];
  selectedPermissions: Permission[];
  updateSelectedPermissions: (permissions: Permission[]) => void;
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const matchedResource = resources.find(
    (resource) => resource.id === permission.resource
  );
  console.log({
    resources,
    matchedResource,
    permission,
  });
  return (
    <div className='themes-wrapper group relative flex flex-col overflow-hidden rounded-xl border shadow transition-all duration-200 ease-in-out hover:z-30'>
      <div className='flex items-center gap-2 relative z-20 justify-end border-b bg-card px-3 py-2.5 text-card-foreground'>
        <div className='flex items-center gap-1.5 pl-1 text-[13px] font-medium text-muted-foreground [&>svg]:h-[0.9rem] [&>svg]:w-[0.9rem]'>
          <KeyRound /> {titleCase(permission.resource)}
        </div>
        <div className='ml-auto flex items-center gap-2 [&>form]:flex'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='outline'
                className='[&_svg]-h-3.5 [&_svg]-h-3 h-6 w-6 rounded-[6px] bg-transparent text-foreground shadow-none hover:bg-muted dark:text-foreground [&_svg]:w-3'
                onClick={() => {
                  if (confirm('Are you sure?')) {
                    updateSelectedPermissions(
                      selectedPermissions.filter(
                        (p) => p.resource !== permission.resource
                      )
                    );
                  }
                }}
              >
                <span className='sr-only'>Remove</span>
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove permission</p>
            </TooltipContent>
          </Tooltip>

          <Separator
            orientation='vertical'
            className='mx-0 hidden h-4 md:flex'
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='outline'
                className='h-6 rounded-[6px] border bg-transparent px-2 text-xs text-foreground shadow-none hover:bg-muted dark:text-foreground'
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                <span className='sr-only'>Settings</span>
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {settingsOpen && (
        <div className='relative z-10 [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none px-4 py-2.5 pb-4'>
          <FormItem>
            <FormLabel>Custom rule</FormLabel>
            <FormDescription>
              Define a custom rule for this permission. For more information,
              see{' '}
              <a
                target='_blank'
                title='Access Control'
                className='underline text-primary'
                href='https://fastschema.com/docs/reference/access-control'
              >
                Access Control
              </a>
              .
            </FormDescription>
            <FormControl>
              <CodeEditor
                placeholder={`// Gets the current authenticated user ID
let authUserId = $context.User().ID;

// Modify the request filter to include the author_id
let requestFilter = $context.Arg('filter', '{}');
let authorFilter = $sprintf('{"author_id": %d}', authUserId);
let combinedFilter = $sprintf('{"$and": [%s, %s]}', requestFilter, authorFilter);
// Update the filter argument
// Any function call must be assigned to a variable
let _ = $context.SetArg('filter', combinedFilter);

// The last line is the return value, it should be a boolean
// Check if the user has enough credit
let users = $db.Query($context, "SELECT * FROM users WHERE id = ?", authUserId);
users[0].Get("credit") > 10`}
                value={permission.value !== 'allow' ? permission.value : ''}
                onChange={(val) => {
                  permission.value = val;
                  updateSelectedPermissions(
                    selectedPermissions.map((p) =>
                      p.resource === permission.resource ? permission : p
                    )
                  );
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        </div>
      )}
    </div>
  );

  return (
    <div
      key={permission.resource}
      className='flex items-center justify-between space-x-2'
    >
      <Badge
        variant='secondary'
        className='text-md font-medium px-3 py-2 select-none'
      >
        {titleCase(permission.resource)}
        <button
          onClick={() => {
            updateSelectedPermissions(
              selectedPermissions.filter((p) => p !== permission)
            );
          }}
          className='flex items-center justify-center w-5 h-5 ml-2 rounded-full bg-slate-50 hover:bg-slate-200'
        >
          <X className='w-4 h-4' />
        </button>
      </Badge>
    </div>
  );
};
