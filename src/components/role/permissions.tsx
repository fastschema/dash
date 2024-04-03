import { Content, FieldRelation, RelationContentArrayUpdate, Resource, Role } from '@/lib/types';
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
} from '@/components/ui/accordion'
import { useQuery } from '@tanstack/react-query';
import { getResources } from '@/lib/role';
import { Loading } from '@/components/common/loading';
import { SystemError } from '@/components/common/error';
import { useState } from 'react';
import { titleCase } from '@/lib/helper';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { FieldPropsType, RelationSelect } from '../content/renders/relation/select';

export interface RolePermissionsUsersSettingProps {
  editingRole?: Role | null;
  onResourcesUpdated?: (resources: string[]) => void;
  onUsersUpdated?: (users?: RelationContentArrayUpdate | null) => void;
}

export const RolePermissionsUsersSetting = (props: RolePermissionsUsersSettingProps) => {
  const { editingRole, onResourcesUpdated, onUsersUpdated } = props;
  const [open, setOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>(editingRole?.permissions ?? []);
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: getResources,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateSelectedResources = (resources: string[]) => {
    setSelectedResources(resources);
    onResourcesUpdated?.(resources);
  };

  if (isLoading) return <Loading />;
  if (error) return <SystemError error={error} />;

  const SelectResourcesList = ({ resources }: { resources: Resource[] }) => {
    const availableResources = resources.filter(resource => {
      return !selectedResources.includes(resource.id);
    });
    const disableSeparator = !availableResources.length || resources.every(resource => resource.group);
    return <>
      {availableResources.map(resource => {
        return <SelectResourceItem key={resource.id} resource={resource} />;
      })}
      {!disableSeparator && <CommandSeparator className='my-2' />}
    </>
  }

  const SelectResourceItem = ({ resource }: { resource: Resource }) => {
    if (resource?.resources?.length) {
      return <SelectResourcesList resources={resource.resources} />;
    }

    return <CommandItem
      key={resource.id}
      value={resource.id}
      onSelect={() => {
        updateSelectedResources([...selectedResources, resource.id]);
      }}
    >
      {titleCase(resource.id)}
    </CommandItem>;
  }

  return <Accordion type='multiple' className='bg-slate-50 rounded-lg border' defaultValue={['permissions']}>
    <AccordionItem value='permissions' className='border-0'>
      <AccordionTrigger className='hover:no-underline px-4'>Permissions</AccordionTrigger>
      <AccordionContent className='pb-2'>
        {editingRole ?
          <div className='px-4 pb-4 bg-background border-t'>
            <div className='flex flex-wrap gap-2 pt-4'>
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
                        <SelectResourcesList resources={resources ?? []} />
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-wrap gap-2 mt-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {selectedResources.toSorted((a, b) => {
                return a.localeCompare(b);
              }).map(resource => {
                return <div key={resource}>
                  <Badge
                    variant='secondary'
                    className='text-md font-medium px-3 py-2 select-none'
                  >
                    {titleCase(resource)}
                    <button
                      onClick={() => {
                        updateSelectedResources(selectedResources.filter(p => p !== resource));
                      }}
                      className='flex items-center justify-center w-5 h-5 ml-2 rounded-full bg-slate-50 hover:bg-slate-200'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </Badge>
                </div>;
              })}
            </div>
          </div>
          : <p className='px-4 py-4'>Please save the role before updating permissions.</p>}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value='users' className='border-t border-b-0'>
      <AccordionTrigger className='hover:no-underline px-4'>Users</AccordionTrigger>
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
              fieldProps={{
                value: editingRole?.users ?? [],
                onChange: onUsersUpdated,
              } as unknown as FieldPropsType}
              content={(editingRole ?? {}) as Content}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>;
}
